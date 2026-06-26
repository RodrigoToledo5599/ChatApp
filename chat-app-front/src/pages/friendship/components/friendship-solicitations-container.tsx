import { Check, Undo2, X } from "lucide-react"
import type { FriendDto } from "../../../lib/types/friendship.types"
import { useDeleteFriendshipRequest } from "../../../hooks/useFriendship"


type FriendsContainerProps = {
    filteredPendingFriendshipSolicitationsFromMe?: FriendDto[]
    filteredPendingFriendshipSolicitationsToMe?: FriendDto[]
    searchTerm: string
    isLoading: boolean
}

type FriendsContainerPropsFromMe = {
    filteredPendingFriendshipSolicitationsFromMe: FriendDto[]
    searchTerm: string
    isLoading: boolean
}


type FriendsContainerPropsToMe = {
    filteredPendingFriendshipSolicitationsToMe: FriendDto[]
    searchTerm: string
    isLoading: boolean
}

function PendingFriendshipSolicitationsFromMe(data : FriendsContainerPropsFromMe){
    const {mutate: deleteRequest, isPending} = useDeleteFriendshipRequest() 
    return (
        <div>
            <h2>Minhas solicitações</h2>
            {data.filteredPendingFriendshipSolicitationsFromMe.map((friend) => {
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
                                onClick={() => deleteRequest(friend.id)}
                                title="Desfazer pedido de amizade"
                                className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all
                                    hover:bg-zinc-800 hover:text-red-400"
                            >
                                <Undo2 className=" w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}


function PendingFriendshipSolicitationsToMe(data : FriendsContainerPropsToMe){
    return (
        <div>
            <h2>Solicitações enviadas para mim</h2>
            {data.filteredPendingFriendshipSolicitationsToMe.map((friend) => {
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
                                title="Aceitar pedido de amizade"
                                className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all
                                    hover:bg-emerald-600/10 hover:border-emerald-500/20 hover:text-emerald-400 "
                            >
                                <Check className="w-5 h-5" />
                            </button>
                            <button 
                                title="Recusar pedido de amizade"
                                className="p-2.5 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-xl transition-all 
                                    hover:bg-red-500/20 hover:text-red-400 hover:border-red-400 "
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}



export default function FriendshipSolicitationsContainer(data : FriendsContainerProps){
    return (
        <div>
            <div className="flex-1 overflow-y-auto py-2 space-y-2 custom-scrollbar">
                {data.isLoading ? (
                    <div></div>
                ) : !data.filteredPendingFriendshipSolicitationsFromMe || data.filteredPendingFriendshipSolicitationsFromMe.length === 0 ? (
                    <div></div>
                ) : (
                    <PendingFriendshipSolicitationsFromMe
                        filteredPendingFriendshipSolicitationsFromMe = {data.filteredPendingFriendshipSolicitationsFromMe}
                        searchTerm = {data.searchTerm}
                        isLoading = {data.isLoading}
                    />
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {data.isLoading ? (
                    <div></div>
                ) : !data.filteredPendingFriendshipSolicitationsToMe || data.filteredPendingFriendshipSolicitationsToMe.length === 0 ? (
                    <div></div>
                ) : (
                    <PendingFriendshipSolicitationsToMe
                        filteredPendingFriendshipSolicitationsToMe = {data.filteredPendingFriendshipSolicitationsToMe}
                        searchTerm = {data.searchTerm}
                        isLoading = {data.isLoading}
                    />
                    
                )}
            </div>
        </div>
    )
}