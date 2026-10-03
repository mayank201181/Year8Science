'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Model the native browser receiver check omitted by Node/jsdom timers.
// Deliberately use the queue's DEFAULT timers, not an injected TimerApi.
function loadQueue() {
  const jobs = new Map();
  let nextId = 0, badReceivers = 0;
  function nativeSet(callback, delay) {
    if (this !== undefined && this !== null) { badReceivers++; throw new TypeError('Illegal invocation'); }
    const id = ++nextId; jobs.set(id, { callback, delay }); return id;
  }
  function nativeClear(id) {
    if (this !== undefined && this !== null) { badReceivers++; throw new TypeError('Illegal invocation'); }
    jobs.delete(id);
  }
  const source = fs.readFileSync(path.join(__dirname, '../lib/progressSaveQueue.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {}, setTimeout: nativeSet, clearTimeout: nativeClear, AbortController };
  vm.runInNewContext(code, context);
  return { create: context.exports.createProgressSaveQueue, jobs, badReceivers: () => badReceivers };
}
const snapshot = (profileId, revision) => ({ accountId: 'synthetic-family', profileId, cacheKey: profileId, revision, body: JSON.stringify({ profileId, revision }) });
const tick = () => new Promise(resolve => setImmediate(resolve));

test('default browser timers schedule, replace and flush without illegal receivers', async () => {
  const browser = loadQueue(), sent = [];
  const queue = browser.create(async item => sent.push(item), 1800);
  queue.schedule(snapshot('A', '1'));
  assert.equal(browser.jobs.size, 1);
  queue.schedule(snapshot('A', '2'));
  assert.equal(browser.jobs.size, 1);
  await queue.flush();
  assert.equal(browser.jobs.size, 0);
  assert.deepEqual(sent.map(item => item.revision), ['2']);
  assert.equal(browser.badReceivers(), 0);
});

test('default browser timer expiry and learner switching preserve payload ownership', async () => {
  const browser = loadQueue(), sent = [];
  const queue = browser.create(async item => sent.push(item), 1800);
  queue.schedule(snapshot('A', '1'));
  const [id, job] = [...browser.jobs.entries()][0];
  assert.equal(job.delay, 1800);
  browser.jobs.delete(id); job.callback(); await tick();
  queue.schedule(snapshot('A', '2')); queue.schedule(snapshot('B', '3')); await queue.flush();
  assert.deepEqual(sent.map(item => [item.profileId, item.revision]), [['A', '1'], ['A', '2'], ['B', '3']]);
  assert.equal(browser.jobs.size, 0);
  assert.equal(browser.badReceivers(), 0);
});
