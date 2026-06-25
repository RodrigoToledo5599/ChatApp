import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable, OnModuleInit, OnModuleDestroy, Global } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Global()
@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  public db!: Db;

  constructor() {
    this.client = new MongoClient(process.env.MONGO_DATABASE_URL!);
  }

  async onModuleInit() {
    console.log('🔄 [MongoService] Conectando ao container do MongoDB...');
    try {
      await this.client.connect();
      this.db = this.client.db('chat-app');
      console.log('✅ [MongoService] MongoDB do Docker conectado com sucesso!');
    } catch (error) {
      console.error('❌ [MongoService] Erro crítico: Não conseguiu falar com o Docker!');
      console.error(error);
      throw new Error('Aplicação finalizada porque o MongoDB do Docker está offline.');
    }
  }

  async onModuleDestroy() {
    console.log('🚪 [MongoService] Desconectando do MongoDB...');
    await this.client.close();
  }
}