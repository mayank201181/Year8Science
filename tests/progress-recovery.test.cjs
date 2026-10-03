const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(relative) {
  const source = ts.transpileModule(readFileSync(path.join(__dirname, '..', relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(source, context);
  return context.exports;
}
const hint = () => load('lib/progressRenderHint.ts');
const normalized = fields => ({ srs: {}, guidesRead: {}, attempts: {}, ...fields });
const plain = result => JSON.parse(JSON.stringify(result));

test('recovery detects only the three reproduced nullish shapes', () => {
  const { knownRecoveryHints } = hint();
  assert.deepEqual(plain(knownRecoveryHints(normalized({ srs: null }))), ['ReviewMap']);
  assert.deepEqual(plain(knownRecoveryHints(normalized({ srs: { synthetic: null } }))), ['ReviewEntry']);
  assert.deepEqual(plain(knownRecoveryHints(normalized({ guidesRead: null }))), ['GuideMap']);
  for (const doc of [normalized({ attempts: null }), normalized({ last: { href: null } }), normalized({ analytics: { log: {} } })]) {
    assert.deepEqual(plain(knownRecoveryHints(doc)), []);
  }
});

test('all applicable known hints are returned in fixed order', () => {
  const { knownRecoveryHints } = hint();
  assert.deepEqual(plain(knownRecoveryHints(normalized({ srs: null, guidesRead: null }))), ['ReviewMap', 'GuideMap']);
  assert.deepEqual(plain(knownRecoveryHints(normalized({ srs: { synthetic: null }, guidesRead: null }))), ['ReviewEntry', 'GuideMap']);
});

test('valid normalized legacy fields remain outside recovery', () => {
  const { knownRecoveryHints, progressRenderHint } = hint();
  const doc = normalized({ stars: 19, srs: { synthetic: { due: '2026-10-03', reps: 0, interval: 1 } }, guidesRead: { synthetic: true } });
  assert.deepEqual(plain(knownRecoveryHints(doc)), []);
  assert.equal(progressRenderHint(doc), 'None');
});

test('shape inspection never modifies a document or retains its keys or values', () => {
  const module = hint();
  const doc = normalized({ stars: 73, srs: { 'private-synthetic-key': null }, guidesRead: null, privateMarker: 'must not leave the fixture' });
  const before = JSON.stringify(doc);
  Object.freeze(doc.srs); Object.freeze(doc);
  assert.deepEqual(plain(module.knownRecoveryHints(doc)), ['ReviewEntry', 'GuideMap']);
  module.captureProgressRenderHint(doc);
  assert.equal(module.currentProgressRenderHint(), 'ReviewEntry');
  assert.equal(JSON.stringify(doc), before);
  module.clearProgressRenderHint(); assert.equal(module.currentProgressRenderHint(), 'None');
});

test('property getters are never invoked by structural hints', () => {
  const module = hint(); let reads = 0;
  const doc = normalized({});
  Object.defineProperty(doc, 'srs', { get() { reads++; throw Error('private'); } });
  assert.equal(module.progressRenderHint(doc), 'UnreadableShape');
  assert.deepEqual(plain(module.knownRecoveryHints(doc)), []);
  const nested = normalized({ srs: {} });
  Object.defineProperty(nested.srs, 'private-synthetic-key', { enumerable: true, get() { reads++; throw Error('private'); } });
  assert.equal(module.progressRenderHint(nested), 'UnreadableShape');
  assert.deepEqual(plain(module.knownRecoveryHints(nested)), []);
  assert.equal(reads, 0);
});

test('observational hints discriminate other known render hazards without enabling recovery', () => {
  const { progressRenderHint } = hint();
  assert.equal(progressRenderHint(normalized({ attempts: null })), 'AttemptMap');
  assert.equal(progressRenderHint(normalized({ attempts: { 'quiz-mcq:synthetic': null } })), 'AttemptEntry');
  assert.equal(progressRenderHint(normalized({ last: { href: null } })), 'ResumeLink');
  assert.equal(progressRenderHint(null), 'UnreadableShape');
});
