import { Module } from '@nestjs/common';
import { AttachmentsController } from './http/attachments.controller';
import { AttachmentsRepository } from './repository/attachments.repository';
import { RequestUploadUrlUsecase } from './usecases/request-upload-url.usecase';
import { ConfirmAttachmentUsecase } from './usecases/confirm-attachment.usecase';
import { CleanupPendingAttachmentsJob } from './jobs/cleanup-pending-attachments.job';

@Module({
  controllers: [AttachmentsController],
  providers: [
    AttachmentsRepository,
    RequestUploadUrlUsecase,
    ConfirmAttachmentUsecase,
    CleanupPendingAttachmentsJob,
  ],
  // usado pelo envio de mensagens
  exports: [ConfirmAttachmentUsecase],
})
export class AttachmentsModule {}
