import { Users } from "@prisma/client"

// dados públicos de um usuário (sem telefone)
export class UserDto{

    id:string
    name:string
    email:string

    constructor(user: Users){
        this.id = user.id
        this.name = user.name
        this.email = user.email
    }
}
