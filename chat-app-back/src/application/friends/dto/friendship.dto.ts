import { ApiProperty } from "@nestjs/swagger"
import { Friendship, FriendshipStatus } from "@prisma/client"
import { IsId } from "../../../middleware/decorators/is-id.decorator"



export class AddFriendRequestDto{
    @ApiProperty()
    @IsId()
    receiverId!: string
}

export class FriendShipDto{

    id: string
    name: string
    email: string
    senderId: string
    receiverId: string
    status: FriendshipStatus
    blockedById: string | null
    createdAt: Date

    constructor(
        friendship : Friendship,
        name: string,
        email: string
    ){
        this.id = friendship.id
        this.senderId = friendship.senderId
        this.receiverId = friendship.receiverId
        this.status = friendship.status
        this.blockedById = friendship.blockedById
        this.createdAt = friendship.createdAt
        this.name = name
        this.email = email
    }
}
