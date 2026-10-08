import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginRequestDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsString()
    @IsNotEmpty({ message: 'Preencha todos os campos' })
    @MaxLength(254)
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Preencha todos os campos' })
    @MaxLength(128)
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}
