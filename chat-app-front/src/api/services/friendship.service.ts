import type { FriendDto, UserDto } from "../../lib/types/friendship.types";
import { http } from "../http";


const ENDPOINT = "/friends"
const USERS_ENDPOINT = "/users"

export const friendshipService = {

    listFriends: async (): Promise<FriendDto[]> =>{
        const {data} = await http.get<FriendDto[]>(ENDPOINT);
        return data
    },

    // cancela um pedido enviado ou desfaz uma amizade aceita
    deleteFriendship: async (friendshipId: string) => {
        const { data } = await http.delete(`${ENDPOINT}/${friendshipId}`);
        return data;
    },

    acceptOrRefuseFriendshipRequest: async (friendshipId: string, accepted :boolean) => {
        return accepted === true ? 
            await http.patch(`${ENDPOINT}/accept/${friendshipId}`)
            :
            await http.delete(`${ENDPOINT}/refuse/${friendshipId}`)
    },

    blockFriendRequest: async (friendshipId: string) => {
        const { data } = await http.patch(`${ENDPOINT}/block/${friendshipId}`)
        return data
    },

    unblockFriend: async (friendshipId: string) => {
        const { data } = await http.patch(`${ENDPOINT}/unblock/${friendshipId}`)
        return data
    },

    // com '@' o back busca o e-mail exato; sem '@', parte do nome
    searchForAFriend: async (nameOrEmail: string): Promise<UserDto[]> => {
        const { data } = await http.get<UserDto[]>(`${USERS_ENDPOINT}/search`, { params: { q: nameOrEmail } });
        return data ?? [];
    },

    sendFriendshipRequest: async (receiverId: string) => {
        const { data } = await http.post(`${ENDPOINT}`, { receiverId: receiverId });
        return data;
    }
}
