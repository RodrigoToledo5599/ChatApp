import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import { IsId } from "../../../middleware/decorators/is-id.decorator"

export class CreateGroupConversationInputDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(2, { message: 'O nome do grupo deve ter pelo menos 2 caracteres.' })
    @MaxLength(50, { message: 'O nome do grupo pode ter no máximo 50 caracteres.' })
    title!: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @ArrayMinSize(1, { message: 'Selecione pelo menos um amigo para o grupo.' })
    @ArrayMaxSize(50)
    @IsId({ each: true })
    memberIds!: string[];
}
