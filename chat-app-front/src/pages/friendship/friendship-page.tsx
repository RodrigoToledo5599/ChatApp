"use client"

import { useGetUserFriends } from "../../hooks/useFriendship"
import { Search } from "lucide-react"
import { useState } from "react"
import FriendShipHeader from "./components/friendship-header"
import FriendsContainer from "./components/friends-container"
import FriendsBottomBar from "./components/friends-bottom-bar"

export default function FriendshipPage() {
  const { data: listedFriends , isLoading} = useGetUserFriends()
  const [searchTerm, setSearchTerm] = useState("")
 
  const filteredFriends = listedFriends?.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased font-sans">
      <div className="flex flex-col flex-1 h-full max-w-5xl mx-auto border-x border-zinc-800 bg-zinc-900/50 dashboard-box">
        
        <FriendShipHeader listedFriends={listedFriends}/>

        <div className="p-4 bg-zinc-900/30 border-b border-zinc-800/60">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar pelo nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <FriendsContainer
          filteredFriends={filteredFriends}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />

        <FriendsBottomBar/>
        
      </div>
    </main>
  )
}