import { Users } from "@prisma/client-db-postgres";

export class AccountCreateResponseDto{
    id: string
    name: string
    email: string
    password : string
    phone?: string

    constructor(account: Users){
        this.id = account.id
        this.name = account.name;
        this.email = account.email;
        this.password = account.password;
        this.phone = account.phone;
    }

}