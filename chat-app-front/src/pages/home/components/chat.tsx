import { Loader2 } from "lucide-react"
import { useGetUserConversationMessages } from "../../../hooks/useConversation"
import PageDescriptionWithNoConversationSelected from "./page-description-with-no-conversation-selected"
import ChatInputMessage from "./chat-input-message"
import ChatHeader from "./chat-header"
import UTCtoNormalVisualDate from "../../../lib/utils"
import { useMessagesUpdate, useSendImage, useSendMessage } from "../../../hooks/useMessagesUpdate"
import { useEffect, useRef, useState } from "react"
import type { DragEvent } from "react"
import MessageImage from "./message-image"
import ImageLightbox from "./image-lightbox"
import ImagePreviewModal from "./image-preview-modal"


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
  const { pendingImages, sendImage } = useSendImage()
  useMessagesUpdate(conversationId)

  // imagem escolhida, aguardando legenda/confirmação; guarda a conversa para não vazar ao trocar de chat
  const [draftImage, setDraftImage] = useState<{ file: File, previewUrl: string, conversationId: string } | null>(null)
  const [openedImage, setOpenedImage] = useState<{ src: string, caption?: string } | null>(null)
  const visibleDraft = draftImage?.conversationId === conversationId ? draftImage : null
  const conversationPendingImages = pendingImages.filter((p) => p.conversationId === conversationId)

  const pickImage = (file: File) => {
    if (draftImage) URL.revokeObjectURL(draftImage.previewUrl)
    setDraftImage({ file, previewUrl: URL.createObjectURL(file), conversationId })
  }

  const closeDraft = () => {
    if (draftImage) URL.revokeObjectURL(draftImage.previewUrl)
    setDraftImage(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    const image = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (!image) return
    e.preventDefault()
    pickImage(image)
  }
  
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

  // imagem começou a subir: rola até o balão de progresso
  const pendingCount = conversationPendingImages.length
  const prevPendingCountRef = useRef(pendingCount)
  useEffect(() => {
    if (pendingCount > prevPendingCountRef.current)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    prevPendingCountRef.current = pendingCount
  }, [pendingCount])


  if (!conversationId) return <PageDescriptionWithNoConversationSelected/>

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin w-16 h-16 text-emerald-500"/>
    </div>
  )

  return (
    <div
      className="relative flex flex-1 flex-col h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >

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

            const attachment = msg.attachment

            return (
              <div key={msg._id} 
                className={`text-sm p-2 flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div className={`flex flex-col gap-2 border border-zinc-400 max-w-[75%]
                  ${isMine ? "bg-green-900":"bg-cyan-950"}
                  ${attachment ? "p-1.5 rounded-3xl" : "px-5 pt-3 rounded-3xl"}
                  `}>
                  {isGroup && !isMine && (
                    <div className={`font-bold text-emerald-300 text-xs ${attachment ? "px-3 pt-1.5" : ""}`}>
                      {msg.userName}
                    </div>
                  )}
                  {attachment && (
                    <MessageImage
                      src={attachment.url}
                      width={attachment.width}
                      height={attachment.height}
                      onClick={() => setOpenedImage({ src: attachment.url, caption: msg.content })}
                    />
                  )}
                  {msg.content && (
                    <div className={`whitespace-pre-wrap break-words ${attachment ? "px-3" : ""}`}>
                      {msg.content}
                    </div>
                  )}
                  <div className={`w-full font-bold flex flex-row pb-2 text-xs text-zinc-300
                    ${isMine ? "justify-end":"justify-start"}
                    ${attachment ? "px-3" : ""}`
                    }>
                      {UTCtoNormalVisualDate(msg.createdAt).replace(",","")}
                  </div>
                </div>
              </div>
            )
          })}
          {conversationPendingImages.map((pending) => (
            <div key={pending.tempId} className="text-sm p-2 flex flex-col items-end">
              <div className="flex flex-col gap-2 border border-zinc-400 max-w-[75%] bg-green-900 p-1.5 rounded-3xl">
                <MessageImage src={pending.previewUrl} width={pending.width} height={pending.height}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
                    <Loader2 className="animate-spin w-8 h-8"/>
                    <span className="text-xs font-bold">{pending.progress}%</span>
                  </div>
                </MessageImage>
                {pending.caption && (
                  <div className="whitespace-pre-wrap break-words px-3 pb-2">{pending.caption}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <ChatInputMessage
        sendMessage={SendMessage}
        onPickImage={pickImage}
        conversationId={conversationId}
      />

      {visibleDraft && (
        <ImagePreviewModal
          fileName={visibleDraft.file.name}
          previewUrl={visibleDraft.previewUrl}
          onCancel={closeDraft}
          onSend={(caption) => {
            sendImage({ conversationId, file: visibleDraft.file, caption })
            closeDraft()
          }}
        />
      )}

      {openedImage && (
        <ImageLightbox
          src={openedImage.src}
          caption={openedImage.caption}
          onClose={() => setOpenedImage(null)}
        />
      )}

    </div>
  )
}
