import { Loader2 } from "lucide-react"
import { useGetUserConversationMessages } from "../../../hooks/useConversation"
import PageDescriptionWithNoConversationSelected from "./page-description-with-no-conversation-selected"
import ChatInputMessage from "./chat-input-message"
import ChatHeader from "./chat-header"
import UTCtoNormalVisualDate from "../../../lib/utils"
import { useMessagesUpdate, useSendMessage } from "../../../hooks/useMessagesUpdate"
import { useEffect, useRef } from "react"


interface ChatProps {
  conversationId: string
  conversationName: string
  isGroup: boolean
}

export function Chat({ conversationId, conversationName, isGroup }: ChatProps) {

  const { 
    data, 
    isLoading, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetUserConversationMessages({ conversationId, limit: 10 })
  const { mutate: SendMessage } = useSendMessage()
  useMessagesUpdate(conversationId)
  
  const allMessages = data 
  ? [...data.pages].reverse().flatMap(page => page.data) 
  : []
  const currentUserId = data?.pages[0]?.userId
  
  const prevMessagesCountRef = useRef(allMessages.length)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  useEffect(() => {

    const currentCount = allMessages.length
    const prevCount = prevMessagesCountRef.current

    prevMessagesCountRef.current = currentCount
    
    const isNewSingleMessage = currentCount - prevCount === 1
    const isFirstLoad = prevCount === 0 && currentCount > 0

    if (isNewSingleMessage || isFirstLoad) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages.length])


  if (!conversationId) return <PageDescriptionWithNoConversationSelected/>

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin w-16 h-16 text-emerald-500"/>
    </div>
  )

  return (
    <div className="flex flex-1 flex-col h-full">

      <ChatHeader conversationName={conversationName} isGroup={isGroup} />
      
      <div className="overflow-y-auto px-4 space-y-2 flex-1">
        <div className="flex justify-center p-4">
          {hasNextPage ? (
            <button 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-[16px] text-emerald-500 hover:underline disabled:text-zinc-500"
            >
              {isFetchingNextPage ? "Carregando histórico..." : "Carregar mensagens anteriores"}
            </button>
          ) : (
            <span className="text-xs text-zinc-600">Início da conversa</span>
          )}
        </div>
        <div>
          {allMessages.map((msg) => {
            const isMine = msg.userId === currentUserId

            return (
              <div key={msg._id} 
                className={`text-sm p-2 flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div className={`flex flex-col gap-2 border border-zinc-400 max-w-[75%]
                  ${isMine ? "bg-green-900":"bg-cyan-950"}
                    px-5 pt-3 rounded-3xl
                  `}>
                  {isGroup && !isMine && (
                    <div className="font-bold text-emerald-300 text-xs">
                      {msg.userName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                  <div className={`w-full font-bold flex flex-row pb-2 text-xs text-zinc-300
                    ${isMine ? "justify-end":"justify-start"}`
                    }>
                      {UTCtoNormalVisualDate(msg.createdAt).replace(",","")}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <ChatInputMessage
        sendMessage={SendMessage}
        conversationId={conversationId}
      />

    </div>
  )
}
