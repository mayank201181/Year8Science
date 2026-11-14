import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

// Small hook-state harness: exercises the component's event/state transitions,
// not a substitute for browser rendering or React integration tests.
function paperHarness(store) {
  let slots = [], cursor = 0, dirty = false;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useRef(initial) { const [ref] = this.useState(() => ({ current: initial })); return ref; },
    useMemo(fn) { return fn(); },
    useCallback(fn) { return fn; },
  };
  react.useRef = react.useRef.bind(react);
  const jsx = (type, props, key) => ({ type, props, key });
  const source = ts.transpileModule(readFileSync(new URL('../components/PaperRunner.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require(name) {
    if (name === 'react') return react;
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (name === '@/lib/store') return { useStore: () => store };
    if (name === '@/lib/selfAssessment') return {
      claimAssessment(set, id, exists) { if (exists || set.has(id)) return false; set.add(id); return true; },
      scoreSelfAssessment(marks) { const coverage = marks.filter(Boolean).length / marks.length; return { coverage, verdict: coverage === 1 ? 'correct' : 'partial' }; },
    };
    if (name === '@/lib/optionOrder') return { optionOrder: q => q.options.map((_, i) => i) };
    return {};
  }});
  let previousKey;
  return props => {
    const outer = exports.PaperRunner(props);
    if (outer.key !== previousKey) { slots = []; previousKey = outer.key; }
    let tree, turns = 0;
    do {
      dirty = false; cursor = 0;
      tree = outer.type(outer.props);
      assert.ok(++turns < 10, 'state reconciliation settles');
    } while (dirty);
    return tree;
  };
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
const button = (tree, text) => nodes(tree).find(n => n.type === 'button' && n.props.children === text);
const body = (tree, name) => nodes(tree).find(n => n.type?.name === name);
function fixture() {
  const writes = [], results = [];
  const store = { attempts: {}, saveAttempt: (key, value) => writes.push({ key, value }), award() {}, recordResult: (...x) => results.push(x) };
  const questions = ['one', 'two'].map(id => ({ id, question: id, options: ['a','b'], answerIndex: 0, hint: 'hint', explanation: 'reason' }));
  return { store, writes, results, props: { storageKey: 'paper-a', title: 'Test', kind: 'mcq', questions } };
}
test('paper restores saved index/choice before first displayed frame', () => {
  const { store, props } = fixture();
  store.attempts['paper-a'] = { index: 1, answers: { two: 0 }, scores: {}, completed: false };
  const tree = paperHarness(store)(props);
  assert.equal(body(tree, 'McqBody').props.mcq.id, 'two');
  assert.equal(body(tree, 'McqBody').props.selected, 0);
  assert.equal(body(tree, 'McqBody').props.checked, true);
});
test('paper navigation drops uncommitted choices, restores committed answers and prevents duplicate records', () => {
  const { store, props, results } = fixture(); const render = paperHarness(store);
  let tree = render(props);
  body(tree, 'McqBody').props.onSelect(0); tree = render(props);
  button(tree, 'Check answer').props.onClick(); tree = render(props);
  button(tree, 'Answer checked').props.onClick();
  assert.equal(results.length, 1);
  button(tree, 'Next →').props.onClick(); tree = render(props);
  assert.equal(body(tree, 'McqBody').props.selected, null);
  body(tree, 'McqBody').props.onSelect(1); tree = render(props);
  button(tree, '← Previous').props.onClick(); tree = render(props);
  assert.equal(body(tree, 'McqBody').props.selected, 0);
  button(tree, 'Next →').props.onClick(); tree = render(props);
  assert.equal(body(tree, 'McqBody').props.selected, null);
});
test('changing paper key resets question state and restores that paper', () => {
  const { store, props } = fixture(); const render = paperHarness(store);
  let tree = render(props); body(tree, 'McqBody').props.onSelect(1); tree = render(props);
  tree = render({ ...props, storageKey: 'paper-b' });
  assert.equal(body(tree, 'McqBody').props.selected, null);
  assert.equal(body(tree, 'McqBody').props.checked, false);
});
test('written answer remains committed when marking and returning to question', () => {
  const { store, props } = fixture(); const render = paperHarness(store);
  const qa = { ...props, kind: 'qa', questions: props.questions.map(q => ({ ...q, marks: 2, markScheme: ['point'], modelAnswer: 'answer' })) };
  let tree = render(qa); body(tree, 'QaBody').props.onChange('my answer'); tree = render(qa);
  button(tree, 'Compare with model answer').props.onClick(); tree = render(qa);
  assert.equal(body(tree, 'QaBody').props.checked, true);
  body(tree, 'QaBody').props.onMarkChange(0, true); tree = render(qa);
  body(tree, 'QaBody').props.onSubmit(); tree = render(qa);
  assert.equal(body(tree, 'QaBody').props.savedCoverage, 1);
  button(tree, 'Next →').props.onClick(); tree = render(qa);
  assert.equal(body(tree, 'QaBody').props.draft, '');
  button(tree, '← Previous').props.onClick(); tree = render(qa);
  assert.equal(body(tree, 'QaBody').props.draft, 'my answer');
  assert.equal(body(tree, 'QaBody').props.savedCoverage, 1);
});
