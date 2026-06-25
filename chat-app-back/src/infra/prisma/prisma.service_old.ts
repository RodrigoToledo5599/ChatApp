import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable, OnModuleInit, OnModuleDestroy, Global } from '@nestjs/common';
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient as PostgresClient } from '@prisma/client-db-postgres';

@Global()
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly pg: PostgresClient;


  constructor() {
    const poolpg = new Pool({ connectionString: process.env.POSTGRES_DATABASE_URL });
    const adapter = new PrismaPg(poolpg);
    this.pg = new PostgresClient({ adapter });
  }

async onModuleInit() {
    console.log('🔄 [PrismaService] Inicializando conexão...');
    
    try {
      await Promise.all([
        this.pg.$connect(),
      ]);
      
      console.log('✅ [PrismaService] Postgres conectado com sucesso!');
    } catch (error) {
      console.error('❌ [PrismaService] Erro crítico: Falha ao conectar!');
      console.error(error);
      
      throw new Error('Aplicação finalizada porque o banco está offline');
    }
  }

  async onModuleDestroy() {
    console.log('🚪 [PrismaService] Desconectando do banco...');
    await Promise.all([
      this.pg.$disconnect(),
    ]);
  }
}