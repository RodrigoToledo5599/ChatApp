import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AttachmentsRepository } from "../repository/attachments.repository";
import { StorageService } from "../../../infra/storage/storage.service";
import { PENDING_ATTACHMENT_TTL_MS } from "../attachments.constants";

const BATCH_SIZE = 200


// apaga uploads que nunca viraram mensagem (pediu a url e desistiu, ou o envio falhou)
@Injectable()
export class CleanupPendingAttachmentsJob {
    private readonly logger = new Logger(CleanupPendingAttachmentsJob.name)

    constructor(
        private attachmentsRepo: AttachmentsRepository,
        private storage: StorageService,
    ){}

    // com várias instâncias da API rodando o job roda em todas; não tem problema, apagar é idempotente
    @Cron(CronExpression.EVERY_HOUR)
    async run() {
        const limit = new Date(Date.now() - PENDING_ATTACHMENT_TTL_MS)
        const expired = await this.attachmentsRepo.findPendingCreatedBefore(limit, BATCH_SIZE)

        for (const attachment of expired) {
            try {
                await this.storage.delete(attachment.key)
                await this.attachmentsRepo.deleteById(attachment.id)
            } catch (e) {
                this.logger.error(`Falha ao apagar o anexo ${attachment.id}`, e as Error)
            }
        }

        if (expired.length > 0)
            this.logger.log(`${expired.length} anexo(s) abandonado(s) apagado(s)`)
    }
}
