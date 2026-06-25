"use client"

import type { ConversationReturn } from "../../../lib/types/conversations.types"
import { Loader2 } from 'lucide-react'

interface ConversationListProps {
  conversations: ConversationReturn[] | undefined
  loadingConversations: boolean,
  selectConversation: (conversationId: string) => Promise<void>
}

export function ConversationList({ conversations, loadingConversations, selectConversation }: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex-1 h-full flex flex-col">
        {loadingConversations ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center p-8 gap-3 text-zinc-500">
            <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
            <span className="text-xs font-medium tracking-wide">Carregando chats...</span>
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="p-8 text-center text-xs font-medium text-zinc-500 bg-zinc-900/10 rounded-2xl mx-4 mt-2 border border-zinc-900">
            Nenhuma conversa encontrada
          </div>
        ) : (
          <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
            {conversations.map((conv) => {
              const chatName = conv.conversation.isGroup
                ? conv.conversation.title
                : conv.conversation.users[0]?.user?.name ?? "Usuário"

              const initial = chatName ? chatName.charAt(0).toUpperCase() : "?"

              return (
                <button
                  key={conv.conversation.id}
                  onClick={() => selectConversation(conv.conversation.id)}
                  type="button"
                  className="group flex w-full items-center gap-3.5 px-3.5 py-3 text-left rounded-xl transition-all duration-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800/50"
                >
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900 group-hover:bg-zinc-800 text-zinc-300 group-hover:text-emerald-400 font-semibold text-sm border border-zinc-800 transition-colors shadow-sm">
                    {conv.conversation.isGroup ? "👥" : initial}
                  </div>
      
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-200 group-hover:text-white text-sm truncate transition-colors">
                        {chatName}
                      </span>
    
                      <span className="text-[10px] text-zinc-500 font-medium group-hover:text-zinc-400 shrink-0">
                        18:55
                      </span>
                    </div>
                      
                    <p className="text-xs text-zinc-500 group-hover:text-zinc-400 truncate mt-0.5 font-medium">
                      {conv.conversation.isGroup ? "Clique para ver as mensagens do grupo" : "Clique para conversar"}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}