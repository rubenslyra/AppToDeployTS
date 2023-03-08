import { PrismaClient } from '@prisma/client';
import fastfy from 'fastify';
import { z } from 'zod';

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
        email: z.string().email(),
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
    host: '0.0.0.0',
    // Se a variável de ambiente PORT estiver definida, use-a, caso contrário, use a porta 8000. Utilizar o Number() para converter a string em número
    port: process.env.PORT ? Number(process.env.PORT) : 8000
}).then(() => {
    console.log(`🚢 Servidor rodando em http://localhost:8000`);
});
