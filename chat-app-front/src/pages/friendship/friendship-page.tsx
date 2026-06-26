"use client"

import { useGetUserFriends } from "../../hooks/useFriendship"
import { Search } from "lucide-react"
import { useState } from "react"
import { FriendShipStatus } from "./../../lib/types/friendship.types"
import FriendShipHeader from "./components/friendship-header"
import FriendsContainer from "./components/friends-container"
import FriendsBottomBar from "./components/friends-bottom-bar"
import { useMe } from "../../hooks/useAuth"

export default function FriendshipPage() {
  const {data: listedFriends , isLoading} = useGetUserFriends()
  const {data: user} = useMe()
  const [searchTerm, setSearchTerm] = useState("")

  const listedFriendsAcceped = listedFriends?.filter(friend => {
    const matchesStatus = friend.status === FriendShipStatus.ACCEPTED;
    const matchesSearch = searchTerm.trim() === "" || 
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];
  const filteredPendingFriendshipSolicitationsFromMe = listedFriends?.filter(friend => 
    friend.status === FriendShipStatus.PENDING && friend.senderId === user?.id
  ) || []
  const filteredPendingFriendshipSolicitationsToMe = listedFriends?.filter(friend => 
    friend.status === FriendShipStatus.PENDING && friend.receiverId === user?.id
  ) || []

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased font-sans">
      <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto border-x border-zinc-800 bg-zinc-900/50 dashboard-box">
        
        <FriendShipHeader listedFriends={listedFriendsAcceped}/>

        <div className="p-4 bg-zinc-900/30 border-b border-zinc-800/60">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar pelo nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 transition-all
                focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 "
            />
          </div>
        </div>

        <FriendsContainer
          listedFriends={listedFriendsAcceped}
          filteredPendingFriendshipSolicitationsFromMe= {filteredPendingFriendshipSolicitationsFromMe}
          filteredPendingFriendshipSolicitationsToMe= {filteredPendingFriendshipSolicitationsToMe}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />

        <FriendsBottomBar/>
        
      </div>
    </main>
  )
}