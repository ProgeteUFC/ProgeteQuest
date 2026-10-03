import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './guards/roles.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS liberado para qualquer origem (atenção: uso seguro apenas para ambientes de teste)
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const rolesGuard = app.get(RolesGuard);

  app.useGlobalGuards(rolesGuard);
  app.useGlobalPipes(new ValidationPipe());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('ProgeteQuest API')
    .setDescription(`
API REST do **ProgeteQuest**, organizada por domínio para facilitar testes manuais.

### Como testar rotas protegidas
1. Crie um usuário em **Usuários → POST /user** (caso ainda não exista).
2. Faça login em **Autenticação → POST /auth/login**.
3. Copie somente o valor de \`token\` retornado.
4. Clique em **Authorize** e cole o token no campo JWT. O Swagger adicionará \`Bearer\` automaticamente.

Os endpoints indicam nos textos quais perfis podem usá-los: **student**, **teacher** ou **admin**. IDs são UUIDs e datas usam o padrão ISO 8601.`)
    .setVersion('1.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Cole aqui o token JWT retornado por POST /auth/login.',
      },
      'JWT',
    )
    .addTag('Autenticação', 'Login e obtenção do token JWT.')
    .addTag('Usuários', 'Cadastro, consulta, atualização e exclusão de contas.')
    .addTag('Turmas', 'Criação e gerenciamento das turmas do professor.')
    .addTag('Matrículas', 'Entrada, matrícula, membros e ranking das turmas.')
    .addTag('Atividades', 'Atividades vinculadas às turmas.')
    .addTag('Códigos de check-in', 'Códigos usados pelos alunos nos check-ins.')
    .addTag('Check-ins', 'Registro e consulta de entregas/check-ins.')
    .addTag('Avaliações', 'Avaliações vinculadas às turmas.')
    .addTag('Fórum', 'Fóruns, tópicos e respostas das turmas.')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'ProgeteQuest | Documentação da API',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
