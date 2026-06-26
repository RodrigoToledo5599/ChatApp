

export const FriendShipStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    BLOCKED: "BLOCKED",
} as const;

export type FriendShipStatusType = typeof FriendShipStatus[keyof typeof FriendShipStatus];
export interface FriendDto{
    id: string,
    name: string,
    email: string,
    senderId: string,
    receiverId: string,
    status: FriendShipStatusType
    createdAt: string
}