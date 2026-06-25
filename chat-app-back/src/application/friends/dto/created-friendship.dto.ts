import { Friendship, FriendshipStatus } from "@prisma/client"


export class CreatedFriendShipDto{
    
    id: string
    senderId: string
    receiverId: string
    status: FriendshipStatus
    createdAt: Date

    constructor(
        friendship : Friendship,
    ){
        this.id = friendship.id
        this.senderId = friendship.senderId
        this.receiverId = friendship.receiverId
        this.status = friendship.status
        this.createdAt = friendship.createdAt
    }
}