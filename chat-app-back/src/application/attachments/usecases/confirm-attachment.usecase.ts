import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { AttachmentStatus, Attachments } from "@prisma/client";
import { AttachmentsRepository } from "../repository/attachments.repository";
import { StorageService } from "../../../infra/storage/storage.service";
import { matchesImageSignature, SIGNATURE_BYTES } from "../attachments.constants";


// chamado no envio da mensagem: confere que o upload realmente aconteceu e que o arquivo é o que foi declarado
@Injectable()
export class ConfirmAttachmentUsecase {

    constructor(
        private attachmentsRepo: AttachmentsRepository,
        private storage: StorageService,
    ){}

    async execute(userId: string, conversationId: string, attachmentId: string): Promise<Attachments> {
        const attachment = await this.attachmentsRepo.findById(attachmentId)

        // mesmo erro para "não existe" e "é de outra pessoa/conversa": não revela ids alheios
        if(!attachment || attachment.uploaderId !== userId || attachment.conversationId !== conversationId)
            throw new ForbiddenException('Invalid attachment')

        if(attachment.status !== AttachmentStatus.PENDING)
            throw new BadRequestException('Este anexo já foi enviado')

        const stored = await this.storage.getObjectInfo(attachment.key)
        if(!stored)
            throw new BadRequestException('O upload da imagem não foi concluído')

        const signature = await this.storage.readFirstBytes(attachment.key, SIGNATURE_BYTES)
        if(stored.size !== attachment.size || !matchesImageSignature(attachment.mimeType, signature)){
            await this.storage.delete(attachment.key)
            await this.attachmentsRepo.deleteById(attachment.id)
            throw new BadRequestException('Arquivo de imagem inválido')
        }

        if(!await this.attachmentsRepo.markAsReady(attachment.id))
            throw new BadRequestException('Este anexo já foi enviado')

        return { ...attachment, status: AttachmentStatus.READY }
    }

}
