import type { FriendDto } from "../../lib/types/friendship.types";
import { http } from "../http";







const ENDPOINT = "/friends"

export const friendshipService = {

    listFriends: async (): Promise<FriendDto[]> =>{
        const {data} = await http.get<FriendDto[]>(ENDPOINT);
        return data
    },

    deleteFriendshipRequest: async (friendshipId: string) => {
        const { data } = await http.delete(`${ENDPOINT}/${friendshipId}`);
        return data;
    },

    useAcceptOrRefuseFriendshipRequest: async (friendshipId: string, accepted :boolean) => {
        return accepted === true ? 
            await http.patch(`${ENDPOINT}/accept/${friendshipId}`)
            :
            await http.delete(`${ENDPOINT}/refuse/${friendshipId}`)
    },

    blockFriendRequest: async (friendshipId: string) => {
        const { data } = await http.patch(`${ENDPOINT}/block/${friendshipId}`)
        return data
    }
}