const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const modules = new Map();
function load(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const source = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  modules.set(file, module);
  const require = name => {
    const base = name.startsWith('@/') ? path.join(ROOT, name.slice(2)) : path.resolve(path.dirname(file), name);
    for (const ext of ['.ts', '.tsx', '/index.ts']) if (existsSync(base + ext)) return load(base + ext);
    throw Error(`Unexpected test dependency ${name}`);
  };
  vm.runInNewContext(source, { exports: module.exports, module, require }, { filename: file });
  return module.exports;
}
const { optionOrder } = load(path.join(ROOT, 'lib/optionOrder.ts'));
const { ALL_TOPICS } = load(path.join(ROOT, 'lib/topics/index.ts'));
const { COMPREHENSIVE } = load(path.join(ROOT, 'lib/comprehensive.ts'));
const allMcqs = [
  ...ALL_TOPICS.flatMap(t => [...t.quiz.mcq, ...t.questionBank.mcqPapers.flatMap(p => p.questions)]),
  ...COMPREHENSIVE.mcqPapers.flatMap(p => p.questions),
];
const plain = value => JSON.parse(JSON.stringify(value));

test('order is a stable permutation of the authored options', () => {
  for (const q of allMcqs.slice(0, 200)) {
    const order = plain(optionOrder(q));
    assert.deepEqual([...order].sort(), plain(q.options.map((_, i) => i)));
    assert.deepEqual(plain(optionOrder({ id: q.id, options: [...q.options] })), order);
  }
});

test('numbers in one unit are shown smallest first; mixed units are shuffled', () => {
  assert.deepEqual(plain(optionOrder({ id: 'n', options: ['12 N', '3 N', '0.5 N', '6 N'] })), [2, 1, 3, 0]);
  assert.deepEqual(plain(optionOrder({ id: 'n', options: ['12', '3', '6', '1'] })), [3, 1, 2, 0]);
  const mixed = plain(optionOrder({ id: 'units', options: ['5 N', '5 kg', '5 m', '5 J'] }));
  assert.deepEqual([...mixed].sort(), [0, 1, 2, 3]);
});

test('correct answers are spread evenly across displayed positions', () => {
  const counts = [0, 0, 0, 0];
  for (const q of allMcqs) counts[optionOrder(q).indexOf(q.answerIndex)]++;
  for (const n of counts) {
    const share = n / allMcqs.length;
    assert.ok(share > 0.2 && share < 0.3, `position share ${share.toFixed(2)} in ${counts}`);
  }
});

test('explanations and hints do not refer to options by letter or position', () => {
  // Displayed order no longer matches authored order, so quote option text instead.
  const byPosition = /\b(?:[Oo]ptions?|[Aa]nswer|[Cc]hoice) [A-D]\b|\b(?:first|second|third|fourth|last|top|bottom) (?:option|choice)s?\b/i;
  const offenders = allMcqs.filter(q => byPosition.test(`${q.explanation} ${q.hint}`));
  assert.deepEqual(offenders.map(q => q.id), []);
});
