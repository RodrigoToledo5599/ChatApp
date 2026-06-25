import { ApiProperty } from "@nestjs/swagger";
import { UserAuthReturnDto } from "./user-auth-return.dto";

export class RefreshTokenDto {
    @ApiProperty()
    user: UserAuthReturnDto;

    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;

    constructor(user: UserAuthReturnDto, access_token: string, refresh_token: string) {
        this.user = user;
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}