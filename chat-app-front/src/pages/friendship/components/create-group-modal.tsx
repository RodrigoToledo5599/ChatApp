import { Check, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { FriendDto } from "../../../lib/types/friendship.types";


type CreateGroupModalProps = {
    friends: FriendDto[];
    isGroupModalOpen: boolean;
    setIsGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCreateGroup: (title: string, memberIds: string[]) => void;
    isCreatingGroup: boolean;
}

export default function CreateGroupModal({
    friends,
    setIsGroupModalOpen,
    onCreateGroup,
    isCreatingGroup,
}: CreateGroupModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredFriends = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return friends;

        return friends.filter((friend) =>
            friend.name.toLowerCase().includes(query) || friend.email.toLowerCase().includes(query),
        );
    }, [friends, searchQuery]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsGroupModalOpen(false);
        }
    };

    const toggleFriend = (friendId: string) => {
        setSelectedIds((current) =>
            current.includes(friendId)
                ? current.filter((id) => id !== friendId)
                : [...current, friendId],
        );
    };

    const handleCreateGroup = () => {
        if (!groupName.trim() || selectedIds.length === 0) return;
        onCreateGroup(groupName.trim(), selectedIds);
    };

    return (
        <div 
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
        >
            <div 
                ref={modalRef}
                className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl transition-all scale-up"
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-100">Criar grupo</h3>
                        <p className="text-xs text-zinc-400">Escolha o nome e os amigos que entram no grupo.</p>
                    </div>
                    <button 
                        onClick={() => setIsGroupModalOpen(false)}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-200">Nome do grupo</label>
                        <input
                            type="text"
                            value={groupName}
                            placeholder="Ex: Grupo do truco"
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-200">Adicionar amigos</label>
                            <span className="text-xs text-zinc-400">{selectedIds.length} selecionado(s)</span>
                        </div>

                        <div className="relative mb-3">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Buscar amigo"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                            {filteredFriends.length > 0 ? (
                                filteredFriends.map((friend) => {
                                    const isSelected = selectedIds.includes(friend.id);

                                    return (
                                        <button
                                            key={friend.id}
                                            type="button"
                                            onClick={() => toggleFriend(friend.id)}
                                            className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all ${
                                                isSelected
                                                    ? "border-emerald-500/50 bg-emerald-500/10"
                                                    : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-800/40"
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-zinc-100">{friend.name}</p>
                                                <p className="truncate text-xs text-zinc-400">{friend.email}</p>
                                            </div>
                                            <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${isSelected ? "border-emerald-500 bg-emerald-500 text-zinc-950" : "border-zinc-700 bg-zinc-900 text-transparent"}`}>
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-zinc-400">Nenhum amigo encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button 
                        onClick={() => setIsGroupModalOpen(false)}
                        className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim() || selectedIds.length === 0 || isCreatingGroup}
                        className="px-4 py-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/40 disabled:text-zinc-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-md disabled:shadow-none"
                    >
                        {isCreatingGroup ? "Criando..." : "Criar Grupo"}
                    </button>
                </div>
            </div>
        </div>
    );
}