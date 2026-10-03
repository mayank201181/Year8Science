const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relative, modules = new Map()) {
  const filename = path.join(__dirname, '..', relative);
  if (modules.has(filename)) return modules.get(filename);
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  modules.set(filename, exports);
  const context = { exports, setTimeout, clearTimeout, AbortController,
    require: name => {
      if (!name.startsWith('.')) throw Error('Unexpected test dependency');
      const target = path.relative(path.join(__dirname, '..'), path.resolve(path.dirname(filename), name + '.ts'));
      return load(target, modules);
    },
  };
  vm.runInNewContext(source, context, { filename });
  return context.exports;
}
function timers() {
  let id = 0;
  const callbacks = new Map();
  return {
    set: callback => { callbacks.set(++id, callback); return id; },
    clear: key => callbacks.delete(key),
    fire: () => { const all = [...callbacks.values()]; callbacks.clear(); all.forEach(callback => callback()); },
    get count() { return callbacks.size; },
  };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
function snapshot(profileId, revision = '1') {
  return { accountId: 'synthetic-family', profileId, body: JSON.stringify({ profileId, revision }), cacheKey: profileId, revision };
}
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('only fixed error names can reach the diagnostic screen', () => {
  const { classifyDiagnostic } = load('lib/clientDiagnostic.ts');
  for (const name of ['TypeError', 'RangeError', 'SecurityError', 'ChunkLoadError']) assert.equal(classifyDiagnostic({ name }), name);
  for (const value of [null, 'private text', { name: 'private text' }, new Error('private text')]) assert.equal(classifyDiagnostic(value), 'Unknown');
  assert.equal(classifyDiagnostic({ get name() { throw Error('private text'); } }), 'Unknown');
});

test('classification does not inspect message, stack or other personal fields', () => {
  const { classifyDiagnostic } = load('lib/clientDiagnostic.ts');
  const unsafe = { name: 'TypeError' };
  for (const key of ['message', 'stack', 'digest', 'account', 'progress']) Object.defineProperty(unsafe, key, { get() { assert.fail(`Read forbidden field ${key}`); } });
  assert.equal(classifyDiagnostic(unsafe), 'TypeError');
});

test('component labels are restricted to known app components', () => {
  const { classifyComponent } = load('lib/clientDiagnostic.ts');
  assert.equal(classifyComponent('\n at SiteHeader (private-source:10)\n at Home (private-source:20)'), 'SiteHeader');
  assert.equal(classifyComponent('\n in Home (private-source:10)'), 'Home');
  assert.equal(classifyComponent('\n at PrivatePerson (private-source:10)'), 'Unknown');
  assert.equal(classifyComponent('\n at HomePrivate (private-source:10)'), 'Unknown');
  assert.equal(classifyComponent(null), 'Unknown');
});

test('first diagnostic blocks the page and sends only fixed fields to subscribers', () => {
  const module = load('lib/clientDiagnostic.ts');
  const received = [];
  assert.equal(module.diagnosticBlocked(), false);
  const unsubscribe = module.subscribeDiagnosticBlock(value => received.push(value));
  module.reportDiagnostic('SCI-REACT', 'TypeError', 'Home');
  module.reportDiagnostic('SCI-PROMISE', 'Unknown', 'Unknown');
  assert.equal(module.diagnosticBlocked(), true);
  assert.equal(received.length, 1);
  assert.equal(JSON.stringify(received[0]), '{"code":"SCI-REACT","kind":"TypeError","component":"Home","shape":"None"}');
  unsubscribe();
  const late = [];
  module.subscribeDiagnosticBlock(value => late.push(value));
  assert.equal(late.length, 1);
});

test('queue snapshots are immutable and remain bound to the original learner', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  const clock = timers(), calls = [];
  const queue = createProgressSaveQueue(async value => calls.push(value), 10, clock);
  const value = snapshot('A'); queue.schedule(value); value.profileId = 'B'; value.body = 'changed';
  clock.fire(); await tick();
  assert.equal(calls[0].profileId, 'A'); assert.equal(JSON.parse(calls[0].body).profileId, 'A');
});

test('same-learner debounce and normal cross-learner flush remain ordered', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  const calls = [], clock = timers();
  const queue = createProgressSaveQueue(async value => calls.push(`${value.profileId}:${value.revision}`), 10, clock);
  queue.schedule(snapshot('A', '1')); queue.schedule(snapshot('A', '2')); queue.schedule(snapshot('B', '3'));
  await queue.flush();
  assert.deepEqual(calls, ['A:2', 'B:3']); assert.equal(clock.count, 0);
});

test('cancellation removes unsent timer work and leaves caller snapshot untouched', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  const calls = [], clock = timers(), value = snapshot('A');
  const before = JSON.stringify(value);
  const queue = createProgressSaveQueue(async item => calls.push(item), 10, clock);
  queue.schedule(value); queue.cancel(); clock.fire(); await queue.flush();
  assert.equal(clock.count, 0); assert.equal(calls.length, 0); assert.equal(JSON.stringify(value), before);
});

test('cancellation skips sends chained behind an in-flight request', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  const calls = [], clock = timers(), gate = deferred();
  const queue = createProgressSaveQueue(async value => { calls.push(value.revision); if (value.revision === '1') await gate.promise; }, 10, clock);
  queue.schedule(snapshot('A', '1')); const first = queue.flush(); await tick();
  queue.schedule(snapshot('A', '2')); const waiting = queue.flush();
  queue.cancel(); gate.resolve(); await first; await waiting;
  assert.deepEqual(calls, ['1']);
});

test('cancellation does not claim to abort an already-started request; later scheduling works', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  const calls = [], clock = timers(), gate = deferred();
  const queue = createProgressSaveQueue(async value => { calls.push(value.revision); if (value.revision === '1') await gate.promise; }, 10, clock);
  queue.schedule(snapshot('A', '1')); const first = queue.flush(); await tick(); queue.cancel();
  queue.schedule(snapshot('A', '3')); const latest = queue.flush(); gate.resolve(); await first; await latest;
  assert.deepEqual(calls, ['1', '3']);
});

test('a rejected send does not poison future saves', async () => {
  const { createProgressSaveQueue } = load('lib/progressSaveQueue.ts');
  let calls = 0;
  const queue = createProgressSaveQueue(async () => { if (++calls === 1) throw Error('offline'); }, 10, timers());
  queue.schedule(snapshot('A')); await assert.rejects(queue.flush(), /offline/);
  queue.schedule(snapshot('B')); await queue.flush(); assert.equal(calls, 2);
});
