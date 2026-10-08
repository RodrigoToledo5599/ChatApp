import { Global, Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { S3StorageService } from './s3-storage.service'

@Global()
@Module({
  providers: [{ provide: StorageService, useClass: S3StorageService }],
  exports: [StorageService],
})
export class StorageModule {}
