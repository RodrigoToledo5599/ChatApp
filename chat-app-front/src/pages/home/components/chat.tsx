import { Loader2 } from "lucide-react"
import { useGetUserConversationMessages } from "../../../hooks/useConversation"
import PageDescriptionWithNoConversationSelected from "./page-description-with-no-conversation-selected"
import ChatInputMessage from "./chat-input-message"
import UTCtoNormalVisualDate from "../../../lib/utils"
import { useMessagesUpdate, useSendMessage } from "../../../hooks/useMessagesUpdate"
import { useEffect, useRef } from "react"


export function Chat({ conversationId }: { conversationId: string}) {

  const { 
    data, 
    isLoading, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetUserConversationMessages({ conversationId, limit: "10" })
  const { mutate: SendMessage } = useSendMessage()
  useMessagesUpdate(conversationId)
  
  const allMessages = data 
  ? [...data.pages].reverse().flatMap(page => page.data) 
  : []
  
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




  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin w-16 h-16 text-emerald-500"/>
    </div>
  )

  if (isLoading) return 
  <div className="w-full h-full flex items-center justify-center">
    <Loader2 className="animate-spin w-16 h-16 text-emerald-500"/>
  </div>

  if (isLoading == false && !conversationId) return <PageDescriptionWithNoConversationSelected/>

  return (
    <div className="flex flex-1 flex-col h-full">
      
      <div className="overflow-y-auto px-4 space-y-2 flex-1">
        <div className="flex justify-center p-4 f">
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
        <div className="">
          {allMessages.map((msg) => (
            <div key={msg._id} 
              className={`text-sm p-2
              ${msg.userId == data!.pages[0].userId ?
                "flex flex-col items-end"
                :
                "flex flex-col items-start"
              }
              `}
            >
              <div className={`flex flex-col gap-2 border border-zinc-400
                ${msg.userId == data!.pages[0].userId ? "bg-green-900":"bg-cyan-950"}
                  px-5 pt-3 rounded-3xl
                `}>
                <div className="">
                  {msg.content}
                </div>
                {/* { data!.pages[0].isGroup === true?
                  <div className="w-full font-bold  flex flex-wrap">
                    {msg.userName}
                  </div>
                  :
                  <div></div>
                } */}
                <div className={`w-full font-bold flex flex-row
                  ${
                    msg.userId == data!.pages[0].userId ? "justify-end":"justify-start"
                  }
                    pb-2  w-[45%] rounded-lg`
                  }>
                    {UTCtoNormalVisualDate(msg.createdAt.toString()).replace(",","")}
                </div>
              </div>
            </div>
          ))}
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