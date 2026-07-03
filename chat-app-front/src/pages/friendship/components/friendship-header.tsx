import { UserPlus, Users, X, Search } from "lucide-react";
import { useState, useEffect, useRef, type SetStateAction } from "react";
import type { FriendDto, UserDto } from "../../../lib/types/friendship.types";
import { friendshipService } from "../../../api/services/friendship.service";
import { useSendFriendshipRequest } from "../../../hooks/useFriendship";

type FriendProps = {
    listedFriends?: FriendDto[]
}

export default function FriendShipHeader({ listedFriends }: FriendProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<UserDto[] | null>(null)

    const { mutate: sendFriendshipRequest } = useSendFriendshipRequest();

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsModalOpen(false);
        }
    };

    const handleSearch = async () => {
        const data = await friendshipService.searchForAFriend(searchQuery.trim());
        if(!data)
            return 
        else
            setData(data)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        if (isModalOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen]);

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

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                >
                    <UserPlus className="w-4 h-4" />
                    Adicionar Amigo
                </button>
            </header>

            {isModalOpen && (
                <div 
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
                >
                    <div 
                        ref={modalRef}
                        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl transition-all scale-up"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-100">Adicionar novo amigo</h3>
                                <p className="text-xs text-zinc-400">Digite o nome ou e-mail do seu amigo.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Ex: joaosilva@email.com ou joao_pro"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                                    w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 bg-zinc-950 border border-zinc-800 
                                    focus:border-emerald-500  focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                autoFocus
                            />
                        </div>
                        
                        <div className="mb-6">
                            <div>
                                {data && data.length > 0 ? (
                                    <ul className="space-y-2">
                                        {data.map((friend) => (
                                            <li key={friend.id} className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors">
                                                <div>
                                                    <p className="font-medium text-zinc-200">{friend.name}</p>
                                                    <p className="text-xs text-zinc-400">{friend.email}</p>
                                                </div>
                                                <button 
                                                    onClick={() => sendFriendshipRequest(friend.id)}
                                                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                                >
                                                    Adicionar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-400">Nenhum usuário encontrado.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    console.log("Buscando por:", searchQuery);
                                    handleSearch();
                                }}
                                disabled={!searchQuery.trim()}
                                className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 disabled:text-zinc-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-md disabled:shadow-none"
                            >
                                Buscar Usuário
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}