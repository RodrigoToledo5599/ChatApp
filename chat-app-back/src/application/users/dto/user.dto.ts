import { Users } from "@prisma/client"

export class UserDto{

    id:string
    name:string
    email:string
    phone:string

    constructor(user: Users){
        this.id= user.id,
        this.name = user.name,
        this.email = user.email,
        this.phone= user.phone
    }
}