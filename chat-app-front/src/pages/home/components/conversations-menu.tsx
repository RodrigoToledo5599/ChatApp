import { ConversationList } from "./conversation-list"
import { ConversationsMenuHeader } from "./conversations-menu-header"
import ConversationsMenuBottombar from "./conversations-menu-bottombar"
import type { ConversationReturn } from "../../../lib/types/conversations.types"
import type { User } from "../../../lib/types/auth.types"

type ConversationProps = {
  currentUser?: User
  data?: ConversationReturn[]
  loadingConversations: boolean
  selectedConversationId?: string
  selectConversation: (conversationId: string) => void
}

export function ConversationsMenu(props: ConversationProps) {

  return (
    <div className="flex h-full w-full flex-col border-r border-zinc-800/80 bg-zinc-950 md:w-96 md:shrink-0 relative">

      <ConversationsMenuHeader currentUser={props.currentUser}/>

      <div className="px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold text-zinc-200 tracking-tight flex items-center gap-1.5">
            Conversas
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold">
              {props.data?.length || 0}
            </span>
          </h2>
        </div>
      </div>
      
      <div className="px-4 py-1 h-1 bg-zinc-900"/>
        
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ConversationList 
          conversations={props.data}
          loadingConversations={props.loadingConversations}
          selectedConversationId={props.selectedConversationId}
          selectConversation={props.selectConversation}
        />
      </div>

      <ConversationsMenuBottombar/>
      
    </div>
  )
}