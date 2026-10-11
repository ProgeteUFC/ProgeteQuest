import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "../../backend/node_modules/typescript/lib/typescript.js";

const calls = [];
const axios = Object.fromEntries(["get", "post", "patch", "put"].map((method) => [method, async (...args) => {
  calls.push({ method, args });
  return { data: method === "get" && args[0].endsWith("/admin/users") ? [{ userId: "user-1", name: "Maria" }] : { userId: "user-1" } };
}]));
axios.isAxiosError = () => false;
globalThis.__testAxios = axios;
globalThis.localStorage = { getItem: () => "admin-token" };

async function load(relativePath) {
  const source = (await readFile(new URL(relativePath, import.meta.url), "utf8"))
    .replace('import axios from "axios";', 'const axios = globalThis.__testAxios;')
    .replaceAll("import.meta.env.VITE_API_URL", '"http://localhost:3000"');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

test("integração dos serviços com a API", async (t) => {
  const { adminService } = await load("../src/services/adminService.ts");
  const { alunoService } = await load("../src/services/alunoService.ts");

  await t.test("cadastro envia os campos específicos de aluno e professor à API", async () => {
    for (const type of ["student", "teacher"]) {
      const data = { name: "Maria", email: "maria@exemplo.com", password: "Senha123!", type,
        ...(type === "student" ? { registrationStudent: "123456" } : { registrationTeacher: "654321" }) };
      await adminService.cadastrarUsuario(data);
      const call = calls.at(-1);
      assert.equal(call.method, "post");
      assert.equal(call.args[0], "http://localhost:3000/admin/users");
      assert.deepEqual(call.args[1], data);
      assert.equal(call.args[2].headers.Authorization, "Bearer admin-token");
    }
  });

  await t.test("listagem usa a resposta real e todas as ações chamam suas rotas", async () => {
    assert.deepEqual(await adminService.listarUsuarios(), [{ userId: "user-1", name: "Maria" }]);
    await adminService.buscarUsuario("user-1");
    assert.equal(calls.at(-1).args[0], "http://localhost:3000/admin/users/user-1");
    await adminService.editarUsuario("user-1", { name: "Maria Atualizada" });
    assert.equal(calls.at(-1).method, "patch");
    assert.deepEqual(calls.at(-1).args[1], { name: "Maria Atualizada" });
    await adminService.desativarUsuario("user-1", "Desligamento");
    assert.equal(calls.at(-1).args[0].endsWith("/deactivate"), true);
    assert.deepEqual(calls.at(-1).args[1], { reason: "Desligamento" });
    await adminService.reativarUsuario("user-1");
    assert.equal(calls.at(-1).args[0].endsWith("/activate"), true);
    await adminService.consultarImpacto("user-1");
    assert.equal(calls.at(-1).args[0].endsWith("/deletion-impact"), true);
  });

  await t.test("operações próprias não enviam ID controlado pelo navegador", async () => {
    await alunoService.listarTurmas("student-token");
    assert.equal(calls.at(-1).args[0], "http://localhost:3000/student-class/me");
    await alunoService.entrarEmTurma("ABCDEFGHIJ", "student-token");
    assert.deepEqual(calls.at(-1).args[1], { joinCode: "ABCDEFGHIJ" });
    await alunoService.meusDados("student-token");
    assert.equal(calls.at(-1).args[0], "http://localhost:3000/user/me");
    assert.equal(calls.at(-1).args[1].headers.Authorization, "Bearer student-token");
  });

  await t.test("sem token, operação administrativa falha antes da requisição", async () => {
    globalThis.localStorage = { getItem: () => null };
    const before = calls.length;
    await assert.rejects(adminService.listarUsuarios(), /não autenticado/);
    assert.equal(calls.length, before);
  });
});
