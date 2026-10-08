import { Search, X } from "lucide-react";
import type { UserDto } from "../../../lib/types/friendship.types";
import { useRef } from "react";


type AddFriendModalProps = {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    data: UserDto[] | null;
    sendFriendshipRequest: (friendId: string) => void;
    handleSearch: () => void;
    isFriedModalOpen: boolean;
    setIsFriedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    
}


export default function AddFriendModal(props : AddFriendModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            props.setIsFriedModalOpen(false);
        }
    };

    return (
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
                        onClick={() => props.setIsFriedModalOpen(false)}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400
                        hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Ex: joaosilva@email.com ou joao_pro"
                            value={props.searchQuery}
                            onChange={(e) => props.setSearchQuery(e.target.value)}
                            className="
                                w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 bg-zinc-950 border border-zinc-800 
                                focus:border-emerald-500  focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            autoFocus
                        />
                </div>
                        
                <div className="mb-6">
                    <div>
                        {props.data && props.data.length > 0 ? (
                            <ul className="space-y-2">
                                {props.data.map((friend) => (
                                    <li key={friend.id} className="flex items-center justify-between p-3 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors">
                                        <div>
                                            <p className="font-medium text-zinc-200">{friend.name}</p>
                                            <p className="text-xs text-zinc-400">{friend.email}</p>
                                        </div>
                                        <button 
                                            onClick={() => props.sendFriendshipRequest(friend.id)}
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
                        onClick={() => props.setIsFriedModalOpen(false)}
                        className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            props.handleSearch();
                        }}
                        disabled={!props.searchQuery.trim()}
                        className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 disabled:text-zinc-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-md disabled:shadow-none"
                    >
                        Buscar Usuário
                    </button>
                </div>
            </div>
        </div>
    );
}