import { UserPlus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import type { FriendDto, UserDto } from "../../../lib/types/friendship.types";
import { friendshipService } from "../../../api/services/friendship.service";
import { useSendFriendshipRequest } from "../../../hooks/useFriendship";
import AddFriendModal from "./add-friend-modal";
import CreateGroupModal from "./create-group-modal";
import { useCreateGroupConversation } from "../../../hooks/useConversation";
import { getApiErrorMessage } from "../../../lib/utils";
import { toast } from "sonner";

type FriendProps = {
    listedFriends?: FriendDto[]
}

export default function FriendShipHeader({ listedFriends }: FriendProps) {
    const [isFriedModalOpen, setIsFriedModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<UserDto[] | null>(null)

    const { mutate: sendFriendshipRequest } = useSendFriendshipRequest();
    const { mutate: createGroupConversation, isPending: isCreatingGroup } = useCreateGroupConversation();

    const handleSearch = async () => {
        try {
            setData(await friendshipService.searchForAFriend(searchQuery.trim()))
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Não foi possível buscar usuários"))
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsFriedModalOpen(false);
                setIsGroupModalOpen(false);
            }
        };
        if (isFriedModalOpen || isGroupModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFriedModalOpen, isGroupModalOpen]);

    return (
        <>
            <header className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Seus Amigos</h1>
                        <p className="text-xs text-zinc-400">
                            {listedFriends?.length || 0} {listedFriends?.length === 1 ? 'amigo conectado' : 'amigos conectados'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsFriedModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                        >
                        <UserPlus className="w-4 h-4" />
                        Adicionar Amigo
                    </button>

                    <button 
                        onClick={() => setIsGroupModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                        >
                        <Users className="w-4 h-4" />
                        Criar Grupo
                    </button>
                </div>
            </header>

            {isFriedModalOpen && (
                <AddFriendModal 
                    isFriedModalOpen={isFriedModalOpen} 
                    setIsFriedModalOpen={setIsFriedModalOpen} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    data={data} 
                    sendFriendshipRequest={sendFriendshipRequest} 
                    handleSearch={handleSearch} 
                />
            )}

            {isGroupModalOpen && (
                <CreateGroupModal 
                    isGroupModalOpen={isGroupModalOpen} 
                    setIsGroupModalOpen={setIsGroupModalOpen}
                    friends={listedFriends ?? []}
                    onCreateGroup={(title, memberIds) => {
                        // só fecha se der certo, para não perder o que foi preenchido
                        createGroupConversation({ title, memberIds }, {
                            onSuccess: () => setIsGroupModalOpen(false),
                        });
                    }}
                    isCreatingGroup={isCreatingGroup}
                />
            )}
        </>
    );
}