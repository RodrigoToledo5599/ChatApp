import type { FriendDto, UserDto } from "../../lib/types/friendship.types";
import { http } from "../http";


const ENDPOINT = "/friends"
const ENDPOINT2 = "/users"

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
    },

    searchForAFriend: async (nameOrEmail: string): Promise<UserDto[] | null> => {
        if(nameOrEmail.includes("@")){
            const { data } = await http.get<UserDto[]>(`${ENDPOINT2}/email=${nameOrEmail}`);
            return !data ? null : data;
        }
        const { data } = await http.get<UserDto[]>(`${ENDPOINT2}/name=${nameOrEmail}`);
        return !data ? null : data;
    },

    sendFriendshipRequest: async (receiverId: string) => {
        const { data } = await http.post(`${ENDPOINT}`, { receiverId: receiverId });
        return data;
    }
}