import { Friendship, FriendshipStatus } from "@prisma/client"



export interface FriendShipDeleteRequestDto{
    friendshipId: string
}

export class FriendShipRawDto{
    
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

export class FriendShipDto{
    
    id: string
    name: string
    email: string
    senderId: string
    receiverId: string
    status: FriendshipStatus
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
        this.createdAt = friendship.createdAt
        this.name = name
        this.email = email
    }
}