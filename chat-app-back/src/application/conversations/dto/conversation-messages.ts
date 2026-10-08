import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator"
import { IsId } from "../../../middleware/decorators/is-id.decorator"

export const MAX_MESSAGE_LENGTH = 2000
export const MAX_MESSAGES_PAGE_SIZE = 50

export class MessageDto {
  _id?: any
  conversationId: string
  userId:string
  userName:string
  content:string
  createdAt:Date
  updatedAt:Date

  constructor(
    conversationId: string,
    userId:string,
    userName:string,
    content:string,
    createdAt:Date,
    updatedAt:Date,
    _id?: any
  ){
    this.conversationId = conversationId
    this.userId = userId
    this.userName = userName
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this._id = _id
  }

}


export class MessageDtoRequest {
  @ApiProperty()
  @IsId()
  conversationId: string

  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode ser vazia' })
  @MaxLength(MAX_MESSAGE_LENGTH, { message: `A mensagem pode ter no máximo ${MAX_MESSAGE_LENGTH} caracteres` })
  content: string

  constructor(
    conversationId: string,
    content: string,
  ){
    this.conversationId = conversationId
    this.content = content
  }

}


export class ConversationMessagesRequestDto {
    @ApiProperty()
    @IsId()
    conversationId:string

    @ApiPropertyOptional({ default: 20, maximum: MAX_MESSAGES_PAGE_SIZE })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(MAX_MESSAGES_PAGE_SIZE)
    limit: number = 20

    // valor de nextCursor da página anterior
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    cursor?: string

    constructor(
        conversationId: string,
        limit: number = 20,
        cursor?: string,
    ){
        this.conversationId = conversationId;
        this.limit = limit;
        this.cursor = cursor;
    }
}



export class ConversationMessagesResponseDto {
    data: MessageDto[]
    userId: string
    conversationId:string
    limit: number
    // ausente quando não há mensagens mais antigas
    nextCursor?: string

    constructor(
        data: MessageDto[],
        userId: string,
        conversationId:string,
        limit: number,
        nextCursor?: string
    ){
        this.data = data
        this.userId = userId;
        this.conversationId = conversationId;
        this.limit = limit;
        this.nextCursor = nextCursor
    }
}
