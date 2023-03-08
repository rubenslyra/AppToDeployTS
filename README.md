# App Deploy Render

## Dependências

Projeto deve ser construído com as seguintes dependências e pacotes:

```
npm i -D typescript
- @types/node
- tsx -> compilador TSX e JSX
- tsup -> para fazer o build da aplicação
- prisma -> para utilizar bancos de dados na aplicação

npm i @prisma/client -> utilizada como dependência de desenvolvimento

npm i fastify -> para trabalhos com rota
```

## Banco de dados

Para trabalhar com bancos de dados, a aplicação utilizar o ORM prisma. Seguem as instruções de inicialização e configuração do schema, database, credentials e tables:

```
- npx prisma init -> para criar o diretório de prisma, que contém o arquivo modelo do banco de dados
- criar o model User no arquivo **schema.prisma**:
model User{
	id String @id @default(cuid())
	name String
	email String
	createdAt DateTime @default(now())
}

- para gerar a migration, utilizar o comando:
	- npx prisma migrate dev
	- o scaffold pedirá um texto curo como registro de identificação para migração a ser criada: 'create model user'

- editar a connectionString no arquivo .env:
	- ://{user}:{password}@localhost:{port}/{database}?

- para verificar o banco sem precisar abrir o PGAdmin:
	- npx prisma studio
```

## Rotas

O Fastify de ser utilizado para criar as rotas de manipulação de dados nesta aplicação:

- no arquivo server.ts:

```

import { PrismaClient } from '@prisma/client';
import fastfy from 'fastify';
import { z } from 'zod';

const url = "0.0.0.0";
const port = 8000;
const prisma = new PrismaClient();

const app = fastfy();

app.get('/', async (request, reply) => {
    return { hello: '🚀 Bem vindos ao projeto AppToDeploy@Render!' };
});

app.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    return { users };
});

app.post('/users', async (request, reply) => {
    // Schema para validar os dados do body da requisição
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string(),
    });

    // para pegar as informações do body da requisição
    const { name, email } = createUserSchema.parse(request.body);

    await prisma.user.create({
        data: {
            name,
            email,
        },
    });

    //return { message: 'Usuário criado com sucesso!' + reply.code(201) };
    return reply.status(201).send({ message: 'Usuário criado com sucesso!' });
});

app.listen({
    host: url,
    // Se a variável de ambiente PORT estiver definida, use-a, caso contrário, use a porta 8000. Utilizar o Number() para converter a string em número
    port: process.env.PORT ? Number(process.env.PORT) : port
}).then(() => {
    console.log(`🚢 Servidor rodando em ${url}:${port}`);
});


```

- para validar os dados no bodyRequest ou verificar se não a requisição não está vazia:
  - npm i zod

## Testando a aplicação

Para testar a aplicação, é necessário criar o seguinte script:

- "dev": "tsx src/server.ts" --> rodar a aplicação localmente
- "build" "tsup src/" --> gerar o diretório dist/ com os arquivos necessários

- o servidor será chamado pelo comando:

  - npm run dev

Para testar a resposta do servidor via CLI, utilizar o comando:

- http localhost:8000/users

- _observe os dados apresentados como array no body_
