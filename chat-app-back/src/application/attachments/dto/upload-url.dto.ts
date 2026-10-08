import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsInt, Max, Min } from "class-validator"
import { IsId } from "../../../middleware/decorators/is-id.decorator"
import { ALLOWED_IMAGE_TYPES, MAX_ATTACHMENT_SIZE, MAX_IMAGE_DIMENSION } from "../attachments.constants"

export class UploadUrlRequestDto {
  @ApiProperty()
  @IsId()
  conversationId: string

  @ApiProperty({ enum: ALLOWED_IMAGE_TYPES })
  @IsIn(ALLOWED_IMAGE_TYPES, { message: 'Tipo de imagem não suportado' })
  mimeType: string

  @ApiProperty({ description: 'tamanho em bytes', maximum: MAX_ATTACHMENT_SIZE })
  @IsInt()
  @Min(1)
  @Max(MAX_ATTACHMENT_SIZE, { message: `A imagem pode ter no máximo ${MAX_ATTACHMENT_SIZE / 1024 / 1024}MB` })
  size: number

  @ApiProperty({ maximum: MAX_IMAGE_DIMENSION })
  @IsInt()
  @Min(1)
  @Max(MAX_IMAGE_DIMENSION)
  width: number

  @ApiProperty({ maximum: MAX_IMAGE_DIMENSION })
  @IsInt()
  @Min(1)
  @Max(MAX_IMAGE_DIMENSION)
  height: number
}

export class UploadUrlResponseDto {
  @ApiProperty()
  attachmentId: string

  // PUT direto no bucket, com os headers Content-Type e Content-Length iguais aos declarados
  @ApiProperty()
  uploadUrl: string

  constructor(attachmentId: string, uploadUrl: string) {
    this.attachmentId = attachmentId
    this.uploadUrl = uploadUrl
  }
}
