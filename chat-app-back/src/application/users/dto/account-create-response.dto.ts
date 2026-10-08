import { Users } from "@prisma/client";

export class AccountCreateResponseDto{
    id: string
    name: string
    email: string
    phone: string | null

    constructor(account: Users){
        this.id = account.id
        this.name = account.name;
        this.email = account.email;
        this.phone = account.phone;
    }

}
