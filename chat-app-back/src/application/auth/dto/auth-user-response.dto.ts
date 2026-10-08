import { ApiProperty } from "@nestjs/swagger";
import { UserAuthReturnDto } from "./user-auth-return.dto";

// resposta pública de login/refresh: os tokens vão apenas nos cookies httpOnly
export class AuthUserResponseDto {
    @ApiProperty()
    user: UserAuthReturnDto;

    constructor(user: UserAuthReturnDto) {
        this.user = user;
    }
}
