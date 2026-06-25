"use client"

import { useMe } from "../../hooks/useAuth"
import { useGetUserConversations } from "../../hooks/useConversation"
import { Chat } from "./components/chat"
import { ConversationsMenu } from "./components/conversations-menu"
import { useState } from "react";


export default function HomePage() {

  const { data: currentUser } = useMe()
  const { data: conversations, isLoading: loadingConversations } = useGetUserConversations()
  const [ selectedConversationId, setselectedConversationId ] = useState("")

  const handleSelectConversation = async (conversationId?: string) => {
    if (conversationId) 
      setselectedConversationId(conversationId)
  }


  return (
    <main className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 antialiased font-sans">
      <ConversationsMenu
        currentUser ={currentUser}
        data = {conversations}
        loadingConversations = {loadingConversations}
        selectConversation={handleSelectConversation}
      />
      <Chat 
        conversationId={selectedConversationId}
        // limit="10"
      />
    </main>
  )
}