import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GoogleLoginRequestDto {
    // ID token (JWT) devolvido pelo botão do Google no front
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(4096)
    credential: string;
}
