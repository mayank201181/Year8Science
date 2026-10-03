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
const { normalizeProgress, emptyProgress } = load('lib/profileTypes.ts');
const plain = value => JSON.parse(JSON.stringify(value));

test('non-object input yields empty progress', () => {
  for (const raw of [null, undefined, 'text', 42, []]) {
    const doc = plain(normalizeProgress(raw));
    assert.equal(doc.stars, 0);
    assert.deepEqual(doc.srs, {});
    assert.deepEqual(doc.analytics.log, []);
  }
});

test('valid documents keep their data', () => {
  const raw = plain(emptyProgress());
  Object.assign(raw, {
    stars: 42, awarded: { 'guide:light': true }, guidesRead: { light: true }, missed: { q1: true },
    challengeBest: { light: 80 }, streak: { count: 3, last: '2026-10-02', best: 5 }, goalMinutes: 15,
    srs: { q1: { due: '2026-10-03', reps: 1, interval: 3 } },
    attempts: { 'quiz-mcq:light': { index: 2, answers: { q1: 1, q2: 'text' }, scores: { q2: 0.5 }, completed: true, updatedAt: 9 } },
    last: { href: '/topic/light?tab=quiz', label: 'Light', topicId: 'light', at: 5 },
  });
  raw.analytics.days = { '2026-10-03': { timeMs: 60000, answered: 2, correct: 1 } };
  raw.analytics.log = [{ at: 1, type: 'start' }];
  const doc = plain(normalizeProgress(raw));
  assert.equal(doc.stars, 42);
  assert.deepEqual(doc.srs, raw.srs);
  assert.deepEqual(doc.attempts, raw.attempts);
  assert.deepEqual(doc.last, raw.last);
  assert.deepEqual(doc.streak, raw.streak);
  assert.deepEqual(doc.analytics.days, raw.analytics.days);
  assert.equal(doc.goalMinutes, 15);
});

test('null maps and null entries that used to crash the home page are repaired', () => {
  const doc = plain(normalizeProgress({
    srs: { bad: null, good: { due: '2026-10-03', reps: 0, interval: 1 }, noDue: { reps: 1 } },
    guidesRead: null, attempts: { 'quiz-mcq:light': null, ok: { answers: null } }, awarded: null,
    analytics: { log: {}, days: { d: null }, topics: null }, streak: null, last: { href: null },
  }));
  assert.deepEqual(Object.keys(doc.srs), ['good']);
  assert.deepEqual(doc.guidesRead, {});
  assert.deepEqual(Object.keys(doc.attempts), ['ok']);
  assert.deepEqual(doc.attempts.ok.answers, {});
  assert.deepEqual(doc.analytics.log, []);
  assert.deepEqual(doc.analytics.days, {});
  assert.deepEqual(doc.streak, { count: 0, last: '', best: 0 });
  assert.equal(doc.last, undefined);
});

test('resume links must stay inside the app', () => {
  for (const href of ['https://example.com', '//example.com', 'javascript:alert(1)']) {
    assert.equal(normalizeProgress({ last: { href, label: 'x' } }).last, undefined);
  }
});

test('numbers are clamped to sensible ranges', () => {
  const doc = normalizeProgress({ stars: -5, goalMinutes: 999, attempts: { a: { index: -3, answers: {}, scores: { q: 'x' } } } });
  assert.equal(doc.stars, 0);
  assert.equal(doc.goalMinutes, 60);
  assert.equal(doc.attempts.a.index, 0);
  assert.deepEqual(plain(doc.attempts.a.scores), {});
});
