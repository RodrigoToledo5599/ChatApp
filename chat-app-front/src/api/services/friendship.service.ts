import type { FriendDto } from "../../lib/types/friendship.types";
import { http } from "../http";







const ENDPOINT = "/friends"

export const friendshipService = {

    listFriends: async (): Promise<FriendDto[]> =>{
        const {data} = await http.get<FriendDto[]>(ENDPOINT);
        return data
    }

}