import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";



export default function ChatInputMessage(){
    const [draft, setDraft] = useState("")
    return (
        <footer className="flex items-center gap-2 bg-secondary px-4 py-3">
            <button type="button" aria-label="Emoji" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Smile className="size-6" />
            </button>
            <button type="button" aria-label="Anexar" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Paperclip className="size-6" />
            </button>
            <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Digite uma mensagem"
            className="flex-1 rounded-lg bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
            type="button"
            aria-label={draft ? "Enviar" : "Gravar áudio"}
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
            {draft ? <Send className="size-6" /> : <Mic className="size-6" />}
            </button>
        </footer>
    )
}