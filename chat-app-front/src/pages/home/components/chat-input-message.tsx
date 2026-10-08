import { ImagePlus, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";


// mesmo limite do back
const MAX_MESSAGE_LENGTH = 2000

interface ChatInputMessageProps {
    sendMessage: (params: { conversationId: string, content: string }) => void,
    // imagem escolhida pelo botão ou colada com Ctrl+V; abre o preview antes de enviar
    onPickImage: (file: File) => void,
    conversationId: string;
}

export default function ChatInputMessage({ sendMessage, onPickImage, conversationId }: ChatInputMessageProps){
    const [message, setMessage] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSend = () => {
        if (!message.trim()) return

        sendMessage({
            conversationId,
            content: message
        })
        setMessage("")
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        // limpa para permitir escolher o mesmo arquivo de novo
        e.target.value = ""
        if (file) onPickImage(file)
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const image = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"))
        if (!image) return
        e.preventDefault()
        onPickImage(image)
    }

    return (
        <footer className="flex items-center gap-2 bg-secondary px-4 py-3">
            <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                aria-label="Enviar imagem"
                className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
                <ImagePlus size={24} />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Digite uma mensagem"
                maxLength={MAX_MESSAGE_LENGTH}
                className="flex-1 rounded-lg bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border"
            />
            <button
                onClick={() => handleSend()}
                type="button"
                aria-label="Enviar"
                className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
                <SendHorizontal size={24} />
            </button>
        </footer>
    )
}
