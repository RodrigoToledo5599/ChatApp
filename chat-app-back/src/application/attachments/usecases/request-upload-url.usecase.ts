import { ForbiddenException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AttachmentsRepository } from "../repository/attachments.repository";
import { StorageService } from "../../../infra/storage/storage.service";
import { UploadUrlRequestDto, UploadUrlResponseDto } from "../dto/upload-url.dto";


@Injectable()
export class RequestUploadUrlUsecase {

    constructor(
        private attachmentsRepo: AttachmentsRepository,
        private storage: StorageService,
    ){}

    async execute(userId: string, params: UploadUrlRequestDto): Promise<UploadUrlResponseDto> {
        const userOnConversation = await this.attachmentsRepo.checkIfUserIsAllowedOnConversation(userId, params.conversationId)
        if(!userOnConversation)
            throw new ForbiddenException('You are not allowed to send files on this conversation');

        // a key é gerada aqui, nunca a partir do nome do arquivo enviado pelo usuário
        const id = randomUUID()
        const key = `conversations/${params.conversationId}/${id}`

        await this.attachmentsRepo.create({
            id,
            key,
            uploaderId: userId,
            conversationId: params.conversationId,
            mimeType: params.mimeType,
            size: params.size,
            width: params.width,
            height: params.height,
        })

        const uploadUrl = await this.storage.createUploadUrl(key, params.mimeType, params.size)
        return new UploadUrlResponseDto(id, uploadUrl)
    }

}
