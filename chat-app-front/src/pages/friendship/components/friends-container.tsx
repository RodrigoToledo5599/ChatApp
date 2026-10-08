import { Ban, MessageSquare, ShieldOff, UserMinus } from "lucide-react"
import type { FriendDto } from "../../../lib/types/friendship.types"
import type { User } from "../../../lib/types/auth.types"
import FriendshipSolicitationsContainer from "./friendship-solicitations-container"
import { useBlockFriendRequest, useDeleteFriendship, useUnblockFriend } from "../../../hooks/useFriendship"
import { useNavigate } from "react-router-dom"
import { conversationService } from "../../../api/services/conversation.service"
import { getApiErrorMessage } from "../../../lib/utils"
import { toast } from "sonner"


export function FriendsContainerLoadingSkeleton(){
    return (
        <>
        <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} className="flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-zinc-800 rounded" />
                      <div className="h-3 w-48 bg-zinc-800 rounded" />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl" />
                </div>
              ))}
        </div>
        </>
    )
}

function BlockedFriends({ blockedFriends }: { blockedFriends: FriendDto[] }){
    const {mutate: unblockFriend} = useUnblockFriend()

    return (
        <div className="pt-4">
            <h2>Bloqueados</h2>
            {blockedFriends.map((friend) => (
                <div 
                    key={friend.id}
                    className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl"
                >
                    <div>
                        <h4 className="font-semibold text-zinc-400 text-sm">{friend.name}</h4>
                        <p className="text-xs text-zinc-500 font-medium">{friend.email}</p>
                    </div>
                    <button
                        onClick={() => unblockFriend(friend.id)}
                        title="Desbloquear (vocês deixam de ser amigos; um novo pedido será necessário)"
                        className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all hover:bg-zinc-800 hover:text-emerald-400"
                    >
                        <ShieldOff className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    )
}

type FriendsContainerProps = {
    listedFriends? : FriendDto[]
    filteredPendingFriendshipSolicitationsFromMe?: FriendDto[]
    filteredPendingFriendshipSolicitationsToMe?: FriendDto[]
    blockedFriends: FriendDto[]
    searchTerm: string
    isLoading: boolean
    user?: User
}

export default function FriendsContainer(data : FriendsContainerProps){
    const {mutate: blockFriend} = useBlockFriendRequest()
    const {mutate: deleteFriendship} = useDeleteFriendship()
    const navigate = useNavigate();

    const redirectToChat = async (friendId: string) =>{
      try {
        const conversation = await conversationService.getFriendConversation(friendId)
        navigate(`/home/${conversation.id}`)
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Não foi possível abrir a conversa"))
      }
    }

    const confirmAndRun = (message: string, action: () => void) => {
      if (window.confirm(message)) action()
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {data.isLoading ? (
            <FriendsContainerLoadingSkeleton/>
          ) : !data.listedFriends || data.listedFriends.length === 0 ? (
            <div></div>
          ) : (
            data.listedFriends.map((friend) => {
              const initialLetter = friend.name ? friend.name.charAt(0).toUpperCase() : "?"

              return (
                <div 
                  key={friend.id}
                  className="group flex items-center justify-between p-4 bg-zinc-900/20 hover:bg-zinc-900 border border-zinc-800/40 hover:border-zinc-800 rounded-2xl transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 text-zinc-200 font-semibold text-md border border-zinc-700 shadow-inner group-hover:from-emerald-600/20 group-hover:to-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all">
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
                      onClick={() => redirectToChat(
                        data.user?.id === friend.receiverId ? friend.senderId : friend.receiverId
                      )} 
                      title="Iniciar conversa"
                      className="p-2.5 bg-zinc-950 border border-zinc-850 hover:bg-emerald-600/10 hover:border-emerald-500/20 text-zinc-400 hover:text-emerald-400 rounded-xl transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmAndRun(
                        `Desfazer a amizade com ${friend.name}?`,
                        () => deleteFriendship({ friendshipId: friend.id, successMessage: "Amizade desfeita" })
                      )}
                      title="Desfazer amizade"
                      className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all
                      hover:bg-zinc-800 hover:text-amber-400"
                    >
                      <UserMinus className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => confirmAndRun(
                        `Bloquear ${friend.name}? Vocês não poderão mais trocar mensagens diretas.`,
                        () => blockFriend(friend.id)
                      )}
                      title="Bloquear usuário"
                      className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all
                      hover:bg-red-500/20 hover:text-red-400 hover:border-red-400
                      "
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
          <FriendshipSolicitationsContainer
            filteredPendingFriendshipSolicitationsFromMe= {data.filteredPendingFriendshipSolicitationsFromMe}
            filteredPendingFriendshipSolicitationsToMe= {data.filteredPendingFriendshipSolicitationsToMe}
            searchTerm={data.searchTerm}
            isLoading={data.isLoading}
          />
          {!data.isLoading && data.blockedFriends.length > 0 && (
            <BlockedFriends blockedFriends={data.blockedFriends} />
          )}
      </div>  
    )
}