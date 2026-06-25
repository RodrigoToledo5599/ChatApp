import { ApiProperty } from "@nestjs/swagger";

export class UserAuthReturnDto {

    @ApiProperty()
    id: String;

    @ApiProperty()
    name: String;

    @ApiProperty()
    email: String;


    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
    }
}