import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";


interface ChatInputMessageProps {
    sendMessage: any,
    conversationId: string; 
}

export default function ChatInputMessage({ sendMessage, conversationId }: ChatInputMessageProps){
    const [message, setMessage] = useState("")

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

    return (
        <footer className="flex items-center gap-2 bg-secondary px-4 py-3">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma mensagem"
                className="flex-1 rounded-lg bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border"
            />
            <button
                onClick={() => handleSend()}
                type="button"
                aria-label={message ? "Enviar" : "Gravar áudio"}
                className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
                <SendHorizontal size={24} />
            </button>
        </footer>
    )
}