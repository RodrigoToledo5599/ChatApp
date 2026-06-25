import { MessageSquare, MoreVertical, ShieldAlert } from "lucide-react"
import FriendsContainerLoadingSkeleton from "./friends-container-loading-skeleton"
import type { FriendDto } from "../../../lib/types/friendship.types"



type FriendsContainerProps = {
    filteredFriends? : FriendDto[]
    searchTerm: string
    isLoading: boolean
}

export default function FriendsContainer(data : FriendsContainerProps){
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {data.isLoading ? (
            <FriendsContainerLoadingSkeleton/>
          ) : !data.filteredFriends || data.filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center py-20">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 mb-4 shadow-xl">
                <ShieldAlert className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-md font-semibold text-zinc-200">Nenhum amigo por aqui</h3>
              <p className="text-xs text-zinc-400 mt-1">
                {data.searchTerm ? "Nenhum resultado corresponde à sua pesquisa." : "Sua lista de amizades aceitas está vazia no momento."}
              </p>
            </div>
          ) : (
            data.filteredFriends.map((friend) => {
              const initialLetter = friend.name ? friend.name.charAt(0).toUpperCase() : "?"
              return (
                <div 
                  key={friend.id}
                  className="group flex items-center justify-between p-4 bg-zinc-900/20 hover:bg-zinc-900 border border-zinc-800/40 hover:border-zinc-800 rounded-2xl transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-200 font-semibold text-md border border-zinc-700 shadow-inner group-hover:from-emerald-600/20 group-hover:to-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
                      {initialLetter}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-zinc-200 group-hover:text-white text-sm transition-colors">
                        {friend.name}
                      </h4>
                      <p className="text-xs text-zinc-400 font-medium">
                        {friend.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button 
                      title="Iniciar conversa"
                      className="p-2.5 bg-zinc-950 border border-zinc-850 hover:bg-emerald-600/10 hover:border-emerald-500/20 text-zinc-400 hover:text-emerald-400 rounded-xl transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button 
                      title="Mais opções"
                      className="p-2.5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
    )
}