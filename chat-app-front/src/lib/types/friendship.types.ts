

export type FriendShipStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    BLOCKED: "BLOCKED",
}


export interface FriendDto{
    id: string,
    name: string,
    email: string,
    senderId: string,
    receiverId: string,
    status: FriendShipStatus
    createdAt: string
}