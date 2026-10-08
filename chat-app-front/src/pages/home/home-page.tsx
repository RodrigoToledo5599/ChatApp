import { useNavigate, useParams } from "react-router-dom"
import { useMe } from "../../hooks/useAuth"
import { useGetUserConversations } from "../../hooks/useConversation"
import { Chat } from "./components/chat"
import { ConversationsMenu } from "./components/conversations-menu"
import { getConversationName } from "./conversation-name"

export default function HomePage() {
  const { data: currentUser } = useMe()
  const { data: conversations, isLoading: loadingConversations } = useGetUserConversations()
  
  const { conversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()

  const selectedConversation = conversations?.find((c) => c.conversation.id === conversationId)?.conversation

  const handleSelectConversation = (conversationId: string) => {
    navigate(`/home/${conversationId}`)
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased font-sans">
      <ConversationsMenu
        currentUser={currentUser}
        data={conversations}
        loadingConversations={loadingConversations}
        selectedConversationId={conversationId}
        selectConversation={handleSelectConversation}
      />
      <Chat
        conversationId={conversationId || ""}
        conversationName={selectedConversation ? getConversationName(selectedConversation) : ""}
        isGroup={selectedConversation?.isGroup ?? false}
      />
    </main>
  )
}
