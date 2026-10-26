import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { create, act } from 'react-test-renderer';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const folder = await mkdtemp(fileURLToPath(new URL('./.impact-', import.meta.url)));
const output = await build({
  entryPoints: [fileURLToPath(new URL('../src/components/UserDeletionImpact/index.tsx', import.meta.url))],
  bundle: true, write: false, format: 'esm', jsx: 'automatic', tsconfigRaw: { compilerOptions: { jsx: 'react-jsx' } }, external: ['react', 'react/jsx-runtime'],
  plugins: [{ name: 'mock-service', setup(builder) {
    builder.onResolve({ filter: /services\/adminService$/ }, () => ({ path: 'service', namespace: 'mock' }));
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: 'export const adminService = { consultarImpacto: (...args) => globalThis.impactRequest(...args) }; export const adminErrorMessage = error => error.message;' }));
  }}],
});
await writeFile(`${folder}/component.mjs`, output.outputFiles[0].text);
const { default: Impact } = await import(`${folder}/component.mjs`);
await rm(folder, { recursive: true });
const user = { userId: 'teacher-1', type: 'teacher' };
function response(who = user, overrides = {}) {
  return { ...who, impact: {}, classesAsStudent: 0, classesAsTeacher: 0, activities: 0, assessments: 0, enrollments: 0, checkins: 0, forums: 0, forumTopics: 0, forumPosts: 0, codes: 0, canDelete: true, hasDependencies: false, blockedReasons: [], ...overrides };
}
let pending;
function setup() {
  pending = [];
  globalThis.impactRequest = (userId, signal) => new Promise((resolve, reject) => pending.push({ userId, signal, resolve, reject }));
}
async function mount(props = {}) {
  let tree;
  await act(async () => { tree = create(React.createElement(Impact, { user, onContinue() {}, ...props })); });
  return tree;
}
const button = (tree, label) => tree.root.findAllByType('button').find(node => node.children.join('') === label);
const advance = tree => button(tree, 'Avançar para confirmação');
const text = tree => JSON.stringify(tree.toJSON());
async function resolve(index, data) { await act(async () => pending[index].resolve(data)); }
async function close(tree) { await act(async () => tree.unmount()); }

test('professor: categorias, bloqueios e transferência; atualizar não presume liberação', async () => {
  setup(); let calls = 0;
  const tree = await mount({ onContinue: () => calls++ });
  assert.equal(advance(tree).props.disabled, true);
  await act(async () => advance(tree).props.onClick());
  assert.equal(calls, 0);
  await resolve(0, response(user, { classesAsTeacher: 2, hasDependencies: true, canDelete: false, blockedReasons: ['Histórico acadêmico'] }));
  for (const label of ['Turmas', 'Avaliações', 'Atividades', 'Matrículas', 'Check-ins', 'Fóruns', 'Tópicos', 'Mensagens']) assert.ok(text(tree).includes(label));
  assert.ok(text(tree).includes('transferidas para outro professor'));
  assert.ok(text(tree).includes('Histórico acadêmico'));
  assert.equal(advance(tree).props.disabled, true);
  await act(async () => button(tree, 'Consultar novamente').props.onClick());
  assert.equal(pending[0].signal.aborted, true);
  assert.equal(advance(tree).props.disabled, true);
  await resolve(1, response(user, { canDelete: false, blockedReasons: ['Outro impedimento'] }));
  assert.equal(advance(tree).props.disabled, true);
  assert.ok(text(tree).includes('Outro impedimento'));
  await close(tree);
});

test('aluno com dependências respeita permissão do backend; professor sem dependências', async () => {
  for (const who of [user, { userId: 'student-1', type: 'student' }]) {
    setup(); let calls = 0;
    const tree = await mount({ user: who, onContinue: () => calls++ });
    await resolve(0, response(who, { hasDependencies: who.type === 'student', classesAsStudent: who.type === 'student' ? 3 : 0 }));
    if (who.type === 'student') {
      assert.deepEqual(tree.root.findAllByType('dt').map(node => node.children[0]), ['Turmas', 'Check-ins', 'Tópicos', 'Mensagens']);
    } else assert.ok(text(tree).includes('Nenhuma dependência encontrada'));
    assert.equal(advance(tree).props.disabled, false);
    await act(async () => advance(tree).props.onClick());
    assert.equal(calls, 1);
    await close(tree);
  }
});

test('erro, nova tentativa, resposta inválida e motivos mesmo com canDelete true bloqueiam', async () => {
  setup(); let calls = 0;
  const tree = await mount({ onContinue: () => calls++ });
  await act(async () => pending[0].reject(new Error('Falha de rede')));
  assert.ok(text(tree).includes('Falha de rede'));
  assert.equal(advance(tree).props.disabled, true);
  await act(async () => button(tree, 'Tentar novamente').props.onClick());
  await resolve(1, response(user, { canDelete: true, blockedReasons: ['Bloqueado pelo backend'] }));
  assert.equal(advance(tree).props.disabled, true);
  await act(async () => advance(tree).props.onClick());
  assert.equal(calls, 0);
  for (const invalid of [response({ userId: 'other', type: 'teacher' }), {}, response(user, { checkins: -1 })]) {
    await act(async () => (button(tree, 'Consultar novamente') ?? button(tree, 'Tentar novamente')).props.onClick());
    await resolve(pending.length - 1, invalid);
    assert.equal(advance(tree).props.disabled, true);
    assert.ok(text(tree).includes('Resposta de impacto inválida'));
  }
  await close(tree);
});

test('troca de usuário, repetição, transferência e fechamento ignoram respostas antigas', async () => {
  setup();
  const tree = await mount();
  const student = { userId: 'student-2', type: 'student' };
  await act(async () => tree.update(React.createElement(Impact, { user: student, onContinue() {} })));
  assert.equal(pending[0].signal.aborted, true);
  await resolve(0, response());
  assert.equal(advance(tree).props.disabled, true);
  await act(async () => button(tree, 'Consultar novamente').props.onClick());
  await resolve(1, response(student));
  assert.equal(advance(tree).props.disabled, true);
  await resolve(2, response(student));
  assert.equal(advance(tree).props.disabled, false);
  assert.ok(text(tree).includes('Nenhuma dependência encontrada'));
  await act(async () => tree.update(React.createElement(Impact, { user: student, refreshKey: 1, onContinue() {} })));
  assert.equal(advance(tree).props.disabled, true);
  await close(tree);
  assert.equal(pending[3].signal.aborted, true);
  await resolve(3, response(student));
});

test('voltar ao mesmo usuário exige consulta nova; StrictMode permite completar consulta', async () => {
  setup();
  let tree;
  await act(async () => { tree = create(React.createElement(React.StrictMode, null, React.createElement(Impact, { user, onContinue() {} }))); });
  assert.equal(pending[0].signal.aborted, true);
  await resolve(1, response());
  assert.equal(advance(tree).props.disabled, false);
  await close(tree);
  setup();
  tree = await mount();
  await resolve(0, response());
  const student = { userId: 'student-3', type: 'student' };
  await act(async () => tree.update(React.createElement(Impact, { user: student, onContinue() {} })));
  const studentRequest = pending.length - 1;
  await resolve(studentRequest, response(student, { hasDependencies: true, canDelete: false, blockedReasons: ['Histórico de aluno'], classesAsStudent: 1 }));
  assert.equal(advance(tree).props.disabled, true);
  assert.ok(text(tree).includes('Histórico de aluno'));
  await act(async () => tree.update(React.createElement(Impact, { user, onContinue() {} })));
  assert.equal(advance(tree).props.disabled, true);
  await resolve(pending.length - 1, response(user, { canDelete: false }));
  assert.equal(advance(tree).props.disabled, true);
  await close(tree);
});
