import dotenv from 'dotenv';
dotenv.config();

import { FriendshipStatus, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from "argon2";
import { MongoClient } from 'mongodb';
import { MongoCollections } from './mongo/mongo.collections';

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.POSTGRES_DATABASE_URL!,
    }),
});

async function main() {

    const id_users = {
        rodrigo: "afcc40d2-ed37-4f7e-8748-723b8adb9b54",
        jonatas: "d85cbef5-970d-4cef-bb46-19e26a49513d",
        mariana: "e4b3c912-7bf2-4d1a-8b81-a6c3d9b4f231",
        carlos:  "a12f5e34-c9d8-4b7a-ac39-123456789abc",
        beatriz: "7d6e5c4b-3a2b-1c0d-e9f8-a1b2c3d4e5f6",
        thiago:  "fa8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
        amanda:  "01234567-89ab-cdef-0123-456789abcdef"
    };

    const id_conversations = {
        rodrigo_jonatas: "c1111111-1111-1111-1111-111111111111",
        rodrigo_amanda:  "c2222222-2222-2222-2222-222222222222",
        grupo_truco:     "c3333333-3333-3333-3333-333333333333",
        mariana_bia:     "c4444444-4444-4444-4444-444444444444"
    };

    const users = [
        { id: id_users.rodrigo, name: 'Rodrigo Toledo', email: 'rod@gmail.com', phone: '21423339543', password: '123' },
        { id: id_users.jonatas, name: 'Jonatas', email: 'jonas@gmail.com', phone: '22922239523', password: '123' },
        { id: id_users.mariana, name: 'Mariana Silva', email: 'mari.silva@gmail.com', phone: '21988887766', password: '123' },
        { id: id_users.carlos, name: 'Carlos Henrique', email: 'carlos.h@gmail.com', phone: '11977776655', password: '123' },
        { id: id_users.beatriz, name: 'Beatriz Souza', email: 'bia.souza@gmail.com', phone: '31966665544', password: '123' },
        { id: id_users.thiago, name: 'Thiago Oliveira', email: 'thiago.oliveira@gmail.com', phone: '21955554433', password: '123' },
        { id: id_users.amanda, name: 'Amanda Costa', email: 'amanda.costa@gmail.com', phone: '11944443322', password: '123' },
    ];

    for (const user of users) {
        const hashedPassword = await argon2.hash(user.password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 2,
        });
        await prisma.users.upsert({
            where: { email: user.email },
            update: {},
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                password: hashedPassword,
            },
        });
    }
    console.log('✅ Seeded users!');

    const friendships = [
        { senderId: id_users.rodrigo, receiverId: id_users.jonatas, status: FriendshipStatus.ACCEPTED },
        { senderId: id_users.rodrigo, receiverId: id_users.mariana, status: FriendshipStatus.PENDING },
        { senderId: id_users.amanda, receiverId: id_users.rodrigo, status: FriendshipStatus.ACCEPTED },
        { senderId: id_users.rodrigo, receiverId: id_users.thiago, status: FriendshipStatus.ACCEPTED },
        { senderId: id_users.jonatas, receiverId: id_users.carlos, status: FriendshipStatus.ACCEPTED },
        { senderId: id_users.mariana, receiverId: id_users.beatriz, status: FriendshipStatus.ACCEPTED },
        { senderId: id_users.thiago, receiverId: id_users.amanda, status: FriendshipStatus.PENDING },
        { senderId: id_users.beatriz, receiverId: id_users.rodrigo, status: FriendshipStatus.PENDING },
        { senderId: id_users.carlos, receiverId: id_users.thiago, status: FriendshipStatus.BLOCKED },
    ];

    for (const friend of friendships) {
        await prisma.friendship.upsert({
            where: {
                senderId_receiverId: {
                    senderId: friend.senderId,
                    receiverId: friend.receiverId
                }
            },
            update: { status: friend.status },
            create: {
                senderId: friend.senderId,
                receiverId: friend.receiverId,
                status: friend.status
            }
        });
    }
    console.log('✅ Seeded friendships!');

    const conversationsToSeed = [
        { id: id_conversations.rodrigo_jonatas, title: null, userIds: [id_users.rodrigo, id_users.jonatas], isGroup: false },
        { id: id_conversations.rodrigo_amanda, title: null, userIds: [id_users.rodrigo, id_users.amanda], isGroup: false },
        { id: id_conversations.grupo_truco, title: "Grupo do Truco 🃏", userIds: [id_users.rodrigo, id_users.jonatas, id_users.carlos, id_users.thiago], isGroup: true },
        { id: id_conversations.mariana_bia, title: null, userIds: [id_users.mariana, id_users.beatriz], isGroup: false }
    ];

    for (const chat of conversationsToSeed) {
        await prisma.conversations.upsert({
            where: { id: chat.id },
            update: { title: chat.title },
            create: {
                id: chat.id,
                title: chat.title,
                isGroup: chat.isGroup
            }
        });

        for (const userId of chat.userIds) {
            await prisma.usersOnConversations.upsert({
                where: {
                    userId_conversationId: {
                        userId: userId,
                        conversationId: chat.id
                    }
                },
                update: {},
                create: {
                    userId: userId,
                    conversationId: chat.id
                }
            });
        }
    }
    console.log('✅ Seeded conversations and pivot table!');


    console.log('🔄 Conectando ao MongoDB para rodar o seed de mensagens...');
    
    if (!process.env.MONGO_DATABASE_URL) {
        console.error('❌ Erro: MONGO_DATABASE_URL não configurado no .env!');
        return;
    }

    const mongoClient = new MongoClient(process.env.MONGO_DATABASE_URL);
    
    try {
        await mongoClient.connect();
        const db = mongoClient.db('chat-app');
        const messagesCollection = db.collection(MongoCollections.Messages);

        const mockMessages = [
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "1- E aí Rodrigo, blz?",
                createdAt: new Date(Date.now() - 1000 * 60 * 52),
                updatedAt: new Date(Date.now() - 1000 * 60 * 52)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "2- Fala Jonatas",
                createdAt: new Date(Date.now() - 1000 * 60 * 51),
                updatedAt: new Date(Date.now() - 1000 * 60 * 51)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "3- Como tá o projeto? -3",
                createdAt: new Date(Date.now() - 1000 * 60 * 50),
                updatedAt: new Date(Date.now() - 1000 * 60 * 50)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "4- Andando bem, terminei a autenticação ontem. -4",
                createdAt: new Date(Date.now() - 1000 * 60 * 49),
                updatedAt: new Date(Date.now() - 1000 * 60 * 49)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "5- Boa, JWT?",
                createdAt: new Date(Date.now() - 1000 * 60 * 48),
                updatedAt: new Date(Date.now() - 1000 * 60 * 48)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "6- Isso, access e refresh token.",
                createdAt: new Date(Date.now() - 1000 * 60 * 47),
                updatedAt: new Date(Date.now() - 1000 * 60 * 47)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "7- Vai usar Redis?",
                createdAt: new Date(Date.now() - 1000 * 60 * 46),
                updatedAt: new Date(Date.now() - 1000 * 60 * 46)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "8- Pensei nisso, mas por enquanto vou deixar simples.",
                createdAt: new Date(Date.now() - 1000 * 60 * 45),
                updatedAt: new Date(Date.now() - 1000 * 60 * 45)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "9- Justo.",
                createdAt: new Date(Date.now() - 1000 * 60 * 44),
                updatedAt: new Date(Date.now() - 1000 * 60 * 44)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "10- Depois eu otimizo.",
                createdAt: new Date(Date.now() - 1000 * 60 * 43),
                updatedAt: new Date(Date.now() - 1000 * 60 * 43)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "11- E o banco?",
                createdAt: new Date(Date.now() - 1000 * 60 * 42),
                updatedAt: new Date(Date.now() - 1000 * 60 * 42)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "12 Postgres.",
                createdAt: new Date(Date.now() - 1000 * 60 * 41),
                updatedAt: new Date(Date.now() - 1000 * 60 * 41)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "13- Boa escolha.",
                createdAt: new Date(Date.now() - 1000 * 60 * 40),
                updatedAt: new Date(Date.now() - 1000 * 60 * 40)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "14- Tô usando Prisma também.",
                createdAt: new Date(Date.now() - 1000 * 60 * 39),
                updatedAt: new Date(Date.now() - 1000 * 60 * 39)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "15- Curto bastante o Prisma.",
                createdAt: new Date(Date.now() - 1000 * 60 * 38),
                updatedAt: new Date(Date.now() - 1000 * 60 * 38)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "16- Ajuda muito na produtividade.",
                createdAt: new Date(Date.now() - 1000 * 60 * 37),
                updatedAt: new Date(Date.now() - 1000 * 60 * 37)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "17- Já implementou testes?",
                createdAt: new Date(Date.now() - 1000 * 60 * 36),
                updatedAt: new Date(Date.now() - 1000 * 60 * 36)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "18- Tô escrevendo os unitários agora.",
                createdAt: new Date(Date.now() - 1000 * 60 * 35),
                updatedAt: new Date(Date.now() - 1000 * 60 * 35)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "19- Jest?",
                createdAt: new Date(Date.now() - 1000 * 60 * 34),
                updatedAt: new Date(Date.now() - 1000 * 60 * 34)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "20- Sim.",
                createdAt: new Date(Date.now() - 1000 * 60 * 33),
                updatedAt: new Date(Date.now() - 1000 * 60 * 33)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "21- Tá pensando em websocket pro chat?",
                createdAt: new Date(Date.now() - 1000 * 60 * 32),
                updatedAt: new Date(Date.now() - 1000 * 60 * 32)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "22- Sim, websocket é obrigatório nesse caso.",
                createdAt: new Date(Date.now() - 1000 * 60 * 31),
                updatedAt: new Date(Date.now() - 1000 * 60 * 31)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "23- Vai usar Socket.IO?",
                createdAt: new Date(Date.now() - 1000 * 60 * 30),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "24- Não, websocket puro.",
                createdAt: new Date(Date.now() - 1000 * 60 * 29),
                updatedAt: new Date(Date.now() - 1000 * 60 * 29)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "25- Corajoso kkk",
                createdAt: new Date(Date.now() - 1000 * 60 * 28),
                updatedAt: new Date(Date.now() - 1000 * 60 * 28)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "26- Quero entender o protocolo melhor.",
                createdAt: new Date(Date.now() - 1000 * 60 * 27),
                updatedAt: new Date(Date.now() - 1000 * 60 * 27)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "27- Faz sentido.",
                createdAt: new Date(Date.now() - 1000 * 60 * 26),
                updatedAt: new Date(Date.now() - 1000 * 60 * 26)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "28- Depois abstraio se precisar.",
                createdAt: new Date(Date.now() - 1000 * 60 * 25),
                updatedAt: new Date(Date.now() - 1000 * 60 * 25)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "29- Já pensou na paginação das mensagens?",
                createdAt: new Date(Date.now() - 1000 * 60 * 24),
                updatedAt: new Date(Date.now() - 1000 * 60 * 24)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "30- Cursor pagination.",
                createdAt: new Date(Date.now() - 1000 * 60 * 23),
                updatedAt: new Date(Date.now() - 1000 * 60 * 23)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "31- Melhor que offset.",
                createdAt: new Date(Date.now() - 1000 * 60 * 22),
                updatedAt: new Date(Date.now() - 1000 * 60 * 22)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "32- Principalmente com muito volume.",
                createdAt: new Date(Date.now() - 1000 * 60 * 21),
                updatedAt: new Date(Date.now() - 1000 * 60 * 21)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "33- Verdade.",
                createdAt: new Date(Date.now() - 1000 * 60 * 20),
                updatedAt: new Date(Date.now() - 1000 * 60 * 20)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "34- Ainda quero testar com milhares de mensagens.",
                createdAt: new Date(Date.now() - 1000 * 60 * 19),
                updatedAt: new Date(Date.now() - 1000 * 60 * 19)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "35- Vai dar bom.",
                createdAt: new Date(Date.now() - 1000 * 60 * 18),
                updatedAt: new Date(Date.now() - 1000 * 60 * 18)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "36- Espero kkk",
                createdAt: new Date(Date.now() - 1000 * 60 * 17),
                updatedAt: new Date(Date.now() - 1000 * 60 * 17)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "37- Depois me mostra o resultado.",
                createdAt: new Date(Date.now() - 1000 * 60 * 16),
                updatedAt: new Date(Date.now() - 1000 * 60 * 16)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "38- Pode deixar.",
                createdAt: new Date(Date.now() - 1000 * 60 * 15),
                updatedAt: new Date(Date.now() - 1000 * 60 * 15)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "39- Bora marcar um café qualquer dia.",
                createdAt: new Date(Date.now() - 1000 * 60 * 14),
                updatedAt: new Date(Date.now() - 1000 * 60 * 14)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "40- Fechado.",
                createdAt: new Date(Date.now() - 1000 * 60 * 13),
                updatedAt: new Date(Date.now() - 1000 * 60 * 13)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "41- Então vou voltar pro trabalho.",
                createdAt: new Date(Date.now() - 1000 * 60 * 12),
                updatedAt: new Date(Date.now() - 1000 * 60 * 12)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "42- Boa sorte aí.",
                createdAt: new Date(Date.now() - 1000 * 60 * 11),
                updatedAt: new Date(Date.now() - 1000 * 60 * 11)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "43- Valeu!",
                createdAt: new Date(Date.now() - 1000 * 60 * 10),
                updatedAt: new Date(Date.now() - 1000 * 60 * 10)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "44- Tamo junto.",
                createdAt: new Date(Date.now() - 1000 * 60 * 9),
                updatedAt: new Date(Date.now() - 1000 * 60 * 9)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "45- Até mais.",
                createdAt: new Date(Date.now() - 1000 * 60 * 8),
                updatedAt: new Date(Date.now() - 1000 * 60 * 8)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "46- Falou.",
                createdAt: new Date(Date.now() - 1000 * 60 * 7),
                updatedAt: new Date(Date.now() - 1000 * 60 * 7)
            },

            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "47- 👋",
                createdAt: new Date(Date.now() - 1000 * 60 * 6),
                updatedAt: new Date(Date.now() - 1000 * 60 * 6)
            },
            {
                conversationId: id_conversations.rodrigo_jonatas,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "48- 👋",
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                updatedAt: new Date(Date.now() - 1000 * 60 * 5)
            },

            {
                conversationId: id_conversations.rodrigo_amanda,
                userId: id_users.amanda,
                userName: users[6].name,
                content: "Oi Rodrigo, aceitou minha solicitação de amizade?",
                createdAt: new Date(Date.now() - 1000 * 60 * 15),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30) 
            },
            {
                conversationId: id_conversations.rodrigo_amanda,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "Opa Amanda, aceitei sim! Tudo certo por aqui.",
                createdAt: new Date(Date.now() - 1000 * 60 * 12),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            },

            // Chat em Grupo: Grupo do Truco
            {
                conversationId: id_conversations.grupo_truco,
                userId: id_users.carlos,
                userName: users[3].name,
                content: "E aí, quem vai perder pra mim hoje no truco?",
                createdAt: new Date(Date.now() - 1000 * 60 * 10),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            },
            {
                conversationId: id_conversations.grupo_truco,
                userId: id_users.jonatas,
                userName: users[1].name,
                content: "Chama que você só tem gogó, Carlos kkkkk",
                createdAt: new Date(Date.now() - 1000 * 60 * 8),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            },
            {
                conversationId: id_conversations.grupo_truco,
                userId: id_users.rodrigo,
                userName: users[0].name,
                content: "Estou entrando na mesa já. Só não me venham com lula na mão.",
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            },
            {
                conversationId: id_conversations.grupo_truco,
                userId: id_users.thiago,
                userName: users[5].name,
                content: "Seis, ladrão! 🃏🏃‍♂️",
                createdAt: new Date(),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30)
            }
        ];

        console.log(`📦 Inserindo ${mockMessages.length} mensagens no MongoDB...`);
        await messagesCollection.insertMany(mockMessages);

        await messagesCollection.createIndex({ conversationId: 1, createdAt: -1 });
        console.log('✅ Seed do MongoDB executado com sucesso e índices garantidos!');

    } catch (mongoError) {
        console.error('❌ Erro crítico ao popular o MongoDB:', mongoError);
    } finally {
        await mongoClient.close();
        console.log('🚪 Conexão com o MongoDB encerrada.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });