import 'dotenv/config'; // 🔥 Isso faz o parse do .env imediatamente no topo do arquivo
import { Injectable, OnModuleInit, OnModuleDestroy, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Global()
@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {

        if (!process.env.POSTGRES_DATABASE_URL) 
            throw new Error('A variável POSTGRES_DATABASE_URL não foi encontrada no process.env!');
                
        super({
            adapter: new PrismaPg({
                connectionString: process.env.POSTGRES_DATABASE_URL!,
            }),
        });
    }

    async onModuleInit() {
        console.log('conectando');
        await this.$connect();
        console.log('conectou');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
