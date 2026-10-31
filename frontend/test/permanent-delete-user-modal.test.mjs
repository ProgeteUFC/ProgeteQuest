import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// Apenas o suporte necessário aos efeitos de foco; não representa validação visual.
globalThis.document = { body: { style: { overflow: '' } }, activeElement: null, addEventListener() {}, removeEventListener() {} };
const folder = await mkdtemp(fileURLToPath(new URL('./.modal-', import.meta.url)));
const output = await build({
  stdin: {
    contents: `export { default as Modal } from './src/components/PermanentDeleteUserModal';
      export { defaultTheme } from './src/styles/themes/default';
      export { setEnabled } from './src/services/adminService';`,
    resolveDir: fileURLToPath(new URL('../', import.meta.url)),
  },
  bundle: true, write: false, format: 'esm', jsx: 'automatic',
  tsconfigRaw: { compilerOptions: { jsx: 'react-jsx' } },
  external: ['react', 'react/jsx-runtime', 'react-router-dom', 'styled-components'],
  plugins: [{ name: 'styled-esm-interop', setup(builder) {
    builder.onResolve({ filter: /^styled-components$/ }, args => args.namespace === 'style'
      ? { path: args.path, external: true } : { path: args.path, namespace: 'style' });
    builder.onLoad({ filter: /.*/, namespace: 'style' }, () => ({ contents: "export * from 'styled-components'; export { styled as default } from 'styled-components';" }));
  } }, { name: 'mock-service', setup(builder) {
    builder.onResolve({ filter: /services\/adminService$/ }, () => ({ path: 'service', namespace: 'mock' }));
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: `
      export let PERMANENT_DELETE_ENABLED = false;
      export const setEnabled = value => { PERMANENT_DELETE_ENABLED = value; };
      export const adminErrorMessage = error => error.message;
      export const adminService = {
        consultarImpacto: (...args) => globalThis.modalAPI.impact(...args),
        buscarUsuario: (...args) => globalThis.modalAPI.details(...args),
        excluirDefinitivamente: (...args) => globalThis.modalAPI.submit(...args)
      };` }));
  }}],
});
await writeFile(`${folder}/modal.mjs`, output.outputFiles[0].text);
let imported;
try { imported = await import(`${folder}/modal.mjs`); }
finally { await rm(folder, { recursive: true }); }
const { Modal, defaultTheme, setEnabled } = imported;
const teacher = { userId: 'teacher-1', type: 'teacher', name: 'Professor de teste', email: 'teacher@example.test', status: 'inactive', createdAt: '2026-01-01' };
const student = { ...teacher, userId: 'student-1', type: 'student' };
const impact = (user = teacher, overrides = {}) => ({ userId: user.userId, type: user.type, impact: {}, classesAsTeacher: 0, classesAsStudent: 0, assessments: 0, activities: 0, enrollments: 0, checkins: 0, forums: 0, forumTopics: 0, forumPosts: 0, codes: 0, hasDependencies: false, canDelete: true, blockedReasons: [], ...overrides });
let requests, details, submissions;
function setup() {
  requests = []; details = []; submissions = [];
  // Somente o serviço virtual de teste libera a flag, para exercitar cada proteção.
  setEnabled(true);
  globalThis.modalAPI = {
    impact: (id, signal) => new Promise((resolve, reject) => requests.push({ id, signal, resolve, reject })),
    details: id => new Promise((resolve, reject) => details.push({ id, resolve, reject })),
    submit: async (...args) => { submissions.push(args); },
  };
}
const element = props => React.createElement(MemoryRouter, null,
  React.createElement(ThemeProvider, { theme: defaultTheme }, React.createElement(Modal, { user: teacher, onClose() {}, onSuccess() {}, ...props })));
async function mount(props) { let tree; await act(async () => { tree = create(element(props)); }); return tree; }
const form = tree => tree.root.findByType('form');
const submitButton = tree => tree.root.findAllByType('button').find(node => node.props.type === 'submit');
const button = (tree, label) => tree.root.findAllByType('button').find(node => node.children.join('') === label);
const text = tree => JSON.stringify(tree.toJSON());
async function fill(tree, values = {}) {
  const fields = { 'permanent-delete-phrase': 'EXCLUIR DEFINITIVAMENTE', 'permanent-delete-reason': 'Motivo de teste', 'permanent-delete-password': 'senha-ficticia', ...values };
  await act(async () => { for (const [id, value] of Object.entries(fields)) tree.root.findByProps({ id }).props.onChange({ target: { value } }); });
}
async function ready(user = teacher, value = impact(user), index = requests.length - 1) {
  await act(async () => { requests[index].resolve(value); details[index].resolve(user); });
}
async function blocked(tree) {
  assert.equal(submitButton(tree).props.disabled, true);
  const before = submissions.length;
  await act(async () => form(tree).props.onSubmit({ preventDefault() {} }));
  assert.equal(submissions.length, before, 'handler impedido não deve chamar o serviço');
}
async function close(tree) { await act(async () => tree.unmount()); }

test('modal real reutiliza uma única consulta e apresenta perfis com e sem dependências', async () => {
  for (const user of [teacher, student]) for (const dependencies of [false, true]) {
    setup(); const tree = await mount({ user });
    assert.equal(requests.length, 1);
    await ready(user, impact(user, { hasDependencies: dependencies, canDelete: !dependencies, classesAsTeacher: dependencies && user.type === 'teacher' ? 2 : 0, classesAsStudent: dependencies && user.type === 'student' ? 1 : 0, blockedReasons: dependencies ? ['Histórico acadêmico'] : [] }));
    const section = tree.root.findByProps({ 'aria-label': 'Dependências do usuário' });
    assert.deepEqual(section.findAllByType('dt').map(node => node.children[0]), user.type === 'teacher'
      ? ['Turmas', 'Avaliações', 'Atividades', 'Matrículas', 'Check-ins', 'Fóruns', 'Tópicos', 'Mensagens'] : ['Turmas', 'Check-ins', 'Tópicos', 'Mensagens']);
    assert.equal(text(tree).includes('Nenhuma dependência encontrada.'), !dependencies);
    if (dependencies) assert.ok(text(tree).includes('Histórico acadêmico'));
    if (dependencies && user.type === 'teacher') {
      assert.ok(text(tree).includes('transferidas para outro professor'));
      assert.equal(tree.root.findByType('a').props.href, `/admin/teachers/${user.userId}/classes`);
    }
    await close(tree);
  }
});

test('carregamento de impacto/dados, inatividade, frase, motivo e senha protegem botão e handler', async () => {
  setup(); const tree = await mount(); await fill(tree); await blocked(tree);
  await act(async () => requests[0].resolve(impact()));
  await blocked(tree);
  await act(async () => details[0].resolve(teacher));
  assert.equal(submitButton(tree).props.disabled, false);
  for (const values of [{ 'permanent-delete-phrase': 'errada' }, { 'permanent-delete-reason': ' ' }, { 'permanent-delete-reason': 'x'.repeat(501) }, { 'permanent-delete-password': '' }]) {
    await fill(tree, values); await blocked(tree);
  }
  await fill(tree);
  await act(async () => button(tree, 'Consultar novamente').props.onClick());
  await ready({ ...teacher, status: 'active' });
  await blocked(tree);
  await close(tree);
});

test('canDelete falso, motivos mesmo com true, outro usuário/perfil e resposta inválida bloqueiam envio', async () => {
  for (const value of [impact(teacher, { canDelete: false }), impact(teacher, { blockedReasons: ['Bloqueio do backend'] }), impact(student), impact(teacher, { type: 'student' }), {}, impact(teacher, { canDelete: 'true' }), impact(teacher, { checkins: -1 })]) {
    setup(); const tree = await mount(); await fill(tree); await ready(teacher, value);
    await blocked(tree);
    if (value.blockedReasons?.length) assert.ok(text(tree).includes('Bloqueio do backend'));
    await close(tree);
  }
});

test('erro e nova tentativa; invalidar bloqueia inclusive handler anterior antes do render', async () => {
  setup(); const tree = await mount(); await fill(tree);
  await act(async () => { requests[0].reject(new Error('Falha de rede')); details[0].resolve(teacher); });
  assert.ok(text(tree).includes('Falha de rede')); await blocked(tree);
  await act(async () => button(tree, 'Tentar novamente').props.onClick());
  await ready(); assert.equal(submitButton(tree).props.disabled, false);
  const previousSubmit = form(tree).props.onSubmit;
  await act(async () => {
    button(tree, 'Consultar novamente').props.onClick();
    await previousSubmit({ preventDefault() {} });
  });
  assert.equal(submissions.length, 0); await blocked(tree);
  await act(async () => button(tree, 'Consultar novamente').props.onClick());
  await ready(teacher, impact(), 2); // resposta da tentativa cancelada
  await blocked(tree);
  await ready(teacher, impact(teacher, { canDelete: false, blockedReasons: ['Ainda há histórico'] }), 3);
  await blocked(tree); assert.ok(text(tree).includes('Ainda há histórico'));
  await close(tree);
});

test('transferência invalida dados e impacto; trocar usuário limpa confirmação; fechar ignora respostas antigas', async () => {
  setup(); const tree = await mount(); await fill(tree); await ready();
  await act(async () => tree.update(element({ refreshKey: 1 })));
  assert.equal(requests[0].signal.aborted, true); await blocked(tree);
  await act(async () => requests[1].resolve(impact()));
  await blocked(tree); // dados da consulta anterior não liberam o formulário
  await act(async () => tree.update(element({ user: student, refreshKey: 1 })));
  await ready(teacher, impact(), 1);
  await blocked(tree);
  assert.equal(tree.root.findByProps({ id: 'permanent-delete-password' }).props.value, '');
  assert.equal(tree.root.findByProps({ id: 'permanent-delete-phrase' }).props.value, '');
  await ready(student, impact(student), 2); await fill(tree);
  assert.equal(submitButton(tree).props.disabled, false);
  const staleSubmit = form(tree).props.onSubmit;
  await act(async () => button(tree, 'Consultar novamente').props.onClick());
  await close(tree);
  assert.equal(requests[3].signal.aborted, true);
  await ready(student, impact(student), 3);
  await staleSubmit({ preventDefault() {} });
  assert.equal(submissions.length, 0);
});

test('erro e resposta de dados de outro usuário são bloqueados e podem ser consultados novamente', async () => {
  for (const failure of [new Error('Falha nos dados'), student, { ...teacher, status: 'unknown' }]) {
    setup(); const tree = await mount(); await fill(tree);
    await act(async () => { requests[0].resolve(impact()); failure instanceof Error ? details[0].reject(failure) : details[0].resolve(failure); });
    await blocked(tree);
    await act(async () => button(tree, 'Consultar novamente').props.onClick());
    await ready(); assert.equal(submitButton(tree).props.disabled, false);
    await close(tree);
  }
});

test('decisão do backend é respeitada e flag real permanece false mesmo com todos os requisitos válidos', async () => {
  const service = await readFile(new URL('../src/services/adminService.ts', import.meta.url), 'utf8');
  assert.match(service, /export const PERMANENT_DELETE_ENABLED = false;/);
  setup(); const tree = await mount(); await fill(tree);
  await ready(teacher, impact(teacher, { hasDependencies: true, checkins: 1 }));
  assert.equal(submitButton(tree).props.disabled, false);
  await act(async () => form(tree).props.onSubmit({ preventDefault() {} }));
  assert.equal(submissions.length, 1); // serviço inteiramente simulado, sem rede
  await close(tree);
  setup(); setEnabled(false);
  const disabled = await mount(); await fill(disabled); await ready();
  await blocked(disabled);
  assert.ok(text(disabled).includes('ainda não foi liberada'));
  await close(disabled);
});
