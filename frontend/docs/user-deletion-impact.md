# Consulta de dependências antes da exclusão

Na tela `/admin/users`, abra **Ações → Consultar impacto da exclusão**.
O componente `src/components/UserDeletionImpact` consulta o endpoint existente
`GET /admin/users/:id/deletion-impact`, com o token administrativo do serviço.

## Integração com confirmação definitiva

`PermanentDeleteUserModal` está integrado à tela administrativa e reutiliza
`UserDeletionImpact` para apresentar as dependências. O hook `useDeletionImpact`
centraliza a consulta, validação da resposta, cancelamento e autorização. O modal
passa essa mesma consulta pela prop `consultation`; o componente não dispara uma
segunda requisição. A consulta avulsa em AdminUsers continua funcionando.

O botão e o handler exigem consulta concluída para ID e perfil atuais,
`canDelete === true` e `blockedReasons` vazio. Carregamento, erro ou resposta
inválida impedem o envio. O handler também consulta `isAllowed()`, que verifica
se a requisição ainda é a atual e não foi abortada: clicar em **Consultar
novamente** bloqueia imediatamente até handlers anteriores ao próximo render.
`hasDependencies` informa os vínculos sem substituir a decisão do backend.

O modal mantém as verificações de usuário inativo, frase de confirmação, motivo
(até 500 caracteres) e senha. Os dados do usuário são consultados novamente a
cada revisão do impacto; carregamento, erro ou identidade inválida nesses dados
também bloqueiam o envio. Trocar de usuário limpa os campos de confirmação.
`PERMANENT_DELETE_ENABLED` permanece `false`, portanto a confirmação definitiva
continua desabilitada mesmo quando todas as demais condições são satisfeitas.

Para professores com turmas, o aviso mantém o link **Transferir turmas do
professor** para `/admin/teachers/:id/classes`. Essa navegação desmonta o modal
atual. Ao voltar à lista e reabrir o modal, o impacto é consultado novamente.
Para uma transferência integrada no mesmo modal, incremente `refreshKey` após o
sucesso: isso invalida dados e impacto e exige uma nova consulta completa.
**Consultar novamente** repete ambas as verificações. A transferência não
presume a resolução dos outros impedimentos.

`forumPosts` representa as mensagens (`Post`) contadas pelo backend, inclusive as
associadas aos tópicos ou turmas envolvidos. Para alunos, Turmas usa
`classesAsStudent`; para professores, `classesAsTeacher`.

## Validação local

1. No checkout da branch, configure o backend e o `VITE_API_URL` conforme o README
   do projeto; execute o backend e `npm ci && npm run dev` em `frontend`.
2. Faça login como administrador e acesse `/admin/users`. Confira tanto
   **Consultar impacto da exclusão** como **Excluir definitivamente** no menu de ações.
3. Consulte professor com turmas: confira oito categorias, aviso de transferência
   e motivos de bloqueio. Confira o link para transferência e, após usar o fluxo
   existente, volte à lista e reabra o modal para obter uma nova consulta.
4. Consulte aluno: confira somente Turmas, Check-ins, Tópicos e Mensagens.
   Para ambos os perfis, confira também usuários sem dependências.
5. No DevTools, bloqueie a chamada `deletion-impact`: confira o erro e use
   **Tentar novamente** após desbloquear. Simule rede lenta, feche o modal e abra
   outro usuário: a resposta antiga não deve aparecer.
6. Confira Escape, Tab/Shift+Tab, retorno do foco e layout em tela estreita.

Execute `npm test` e `npm run build` em `frontend`. Os testes montam o componente
e o modal reais com serviços simulados, incluindo os estilos e o roteamento do
modal. Verificam categorias, bloqueios, campos de confirmação, erro/nova tentativa,
invalidação após transferência, troca de usuário, fechamento e handlers invocados
com a ação impedida. A flag é liberada apenas no serviço virtual de alguns testes
para que a flag desligada não esconda falhas nas demais proteções; outro teste
verifica a flag desligada e confirma que o código do serviço mantém `false`.
Nenhuma chamada destrutiva de rede é feita nos testes.

A simulação de foco dos testes não verifica layout, navegação real por teclado
nem respostas de um backend autenticado. Esses itens dependem da conferência
manual no ambiente configurado, usando o roteiro acima.
