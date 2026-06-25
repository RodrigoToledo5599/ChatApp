import { CircleUser, MessageSquarePlus, MoreVertical } from "lucide-react"



type ConversationMenuHeaderProps = {
  currentUser: any,
}


export function ConversationsMenuHeader(data : ConversationMenuHeaderProps){

    const myInitial = data.currentUser?.name ? data.currentUser.name.charAt(0).toUpperCase() : ""
    return (
      <header className="flex items-center justify-between bg-zinc-900 px-4 py-4 border-b border-zinc-800/50 ">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm border border-emerald-500/30 shadow-md">
            {myInitial || <CircleUser className="w-5 h-5" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-medium">Olá, bem-vindo</span>
            <span className="text-sm font-bold text-zinc-100 tracking-tight">
              {data.currentUser?.name ?? "Carregando..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <button
            type="button"
            aria-label="Nova conversa"
            className="rounded-xl p-2 transition-all hover:bg-zinc-800 hover:text-emerald-400 active:scale-95"
          >
          <MessageSquarePlus className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Mais opções"
            className="rounded-xl p-2 transition-all hover:bg-zinc-800 hover:text-zinc-200"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>
    )
}