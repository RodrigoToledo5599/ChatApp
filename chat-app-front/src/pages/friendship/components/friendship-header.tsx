import { UserPlus, Users } from "lucide-react";
import type { FriendDto } from "../../../lib/types/friendship.types";


type FriendProps = {
    listedFriends? : FriendDto[]
}


export default function FriendShipHeader({listedFriends}: FriendProps) {
    return (
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

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/10">
                <UserPlus className="w-4 h-4" />
                Adicionar Amigo
            </button>
        </header>
    )
}