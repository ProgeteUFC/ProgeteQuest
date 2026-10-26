# Consulta de dependências antes da exclusão

Na tela `/admin/users`, abra **Ações → Consultar impacto da exclusão**.
O componente `src/components/UserDeletionImpact` consulta o endpoint existente
`GET /admin/users/:id/deletion-impact`, com o token administrativo do serviço.

## Integração com confirmação definitiva

A develop ainda não integra `PermanentDeleteUserModal`. Esta entrega mantém a tela
como consulta e não adiciona uma operação de exclusão nem uma flag de liberação.
Para reutilizar no futuro modal, passe `user` e `onContinue(impact)` para abrir a
etapa de confirmação. O botão opcional e seu handler exigem resposta válida para
ID e perfil atuais, consulta concluída, `canDelete === true` e `blockedReasons`
vazio. `hasDependencies` informa a presença de vínculos; a decisão do backend
sobre a permissão é preservada.

Após concluir uma transferência, incremente `refreshKey` no componente para
invalidar imediatamente o resultado e consultar novamente. A tela de consulta
oferece **Consultar novamente** para o mesmo fim. A branch de transferência
inspecionada implementa o serviço no backend, sem integração nesta tela; não foi
incorporada. Nunca presuma que transferir turmas resolve outros impedimentos.

`forumPosts` representa as mensagens (`Post`) contadas pelo backend, inclusive as
associadas aos tópicos ou turmas envolvidos. Para alunos, Turmas usa
`classesAsStudent`; para professores, `classesAsTeacher`.

## Validação local

1. No checkout da branch, configure o backend e o `VITE_API_URL` conforme o README
   do projeto; execute o backend e `npm ci && npm run dev` em `frontend`.
2. Faça login como administrador e acesse `/admin/users`.
3. Consulte professor com turmas: confira oito categorias, aviso de transferência
   e motivos de bloqueio. Transfira usando o fluxo disponível e consulte novamente.
4. Consulte aluno: confira somente Turmas, Check-ins, Tópicos e Mensagens.
   Para ambos os perfis, confira também usuários sem dependências.
5. No DevTools, bloqueie a chamada `deletion-impact`: confira o erro e use
   **Tentar novamente** após desbloquear. Simule rede lenta, feche o modal e abra
   outro usuário: a resposta antiga não deve aparecer.
6. Confira Escape, Tab/Shift+Tab, retorno do foco e layout em tela estreita.

Execute `npm test` e `npm run build` em `frontend`. Os testes montam o componente
com respostas controladas, sem executar operações destrutivas. O callback de
avanço é testado mesmo quando o handler é invocado com o botão desabilitado.
A navegação real com backend autenticado e a avaliação visual manual devem ser
feitas no ambiente local configurado.
