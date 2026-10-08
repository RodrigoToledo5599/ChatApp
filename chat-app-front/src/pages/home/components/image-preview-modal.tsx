import { SendHorizontal, X } from "lucide-react"
import { useState } from "react"
import type { KeyboardEvent } from "react"

// mesmo limite do back
const MAX_MESSAGE_LENGTH = 2000

interface ImagePreviewModalProps {
    fileName: string
    previewUrl: string
    onCancel: () => void
    onSend: (caption: string) => void
}

// como no WhatsApp: a imagem escolhida aparece grande sobre o chat, com um campo de legenda antes de enviar
export default function ImagePreviewModal({ fileName, previewUrl, onCancel, onSend }: ImagePreviewModalProps) {
    const [caption, setCaption] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            onSend(caption.trim())
        }
        if (e.key === "Escape") onCancel()
    }

    return (
        <div className="absolute inset-0 z-40 flex flex-col bg-zinc-950">
            <header className="flex items-center gap-3 px-4 py-3">
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Cancelar"
                    className="rounded-full p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                    <X size={24} />
                </button>
                <span className="truncate text-sm text-zinc-300">{fileName}</span>
            </header>

            <div className="flex min-h-0 flex-1 items-center justify-center p-6">
                <img src={previewUrl} alt="Pré-visualização" className="max-h-full max-w-full rounded-lg object-contain" />
            </div>

            <footer className="flex items-center gap-2 bg-secondary px-4 py-3">
                <input
                    type="text"
                    autoFocus
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Adicione uma legenda"
                    maxLength={MAX_MESSAGE_LENGTH}
                    className="flex-1 rounded-lg bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none border"
                />
                <button
                    type="button"
                    onClick={() => onSend(caption.trim())}
                    aria-label="Enviar imagem"
                    className="rounded-full bg-emerald-600 p-3 text-white hover:bg-emerald-500"
                >
                    <SendHorizontal size={22} />
                </button>
            </footer>
        </div>
    )
}
