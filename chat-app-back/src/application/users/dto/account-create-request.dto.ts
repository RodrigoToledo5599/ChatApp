import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"

const trim = ({ value }) => typeof value === 'string' ? value.trim() : value

export class AccountCreateRequestDto{

    @ApiProperty()
    @Transform(trim)
    @IsString()
    @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    @MaxLength(50, { message: 'Nome longo demais' })
    @Matches(/^[^@]*$/, { message: 'O nome não pode conter @' })
    name: string

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsEmail({}, { message: 'Insira um e-mail válido' })
    @MaxLength(254)
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    @MaxLength(128)
    password : string

    @ApiPropertyOptional()
    @Transform(({ value }) => typeof value === 'string' && value.trim() === '' ? undefined : trim({ value }))
    @IsOptional()
    @IsString()
    @Matches(/^[0-9()+\-\s]{10,20}$/, { message: 'O telefone deve ter um formato válido' })
    phone?: string

    constructor(
    name: string,
    email: string,
    password : string,
    phone?: string
    ){
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

}
