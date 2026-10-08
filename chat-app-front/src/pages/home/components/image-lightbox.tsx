import { X } from "lucide-react"
import { useEffect } from "react"

interface ImageLightboxProps {
    src: string
    caption?: string
    onClose: () => void
}

// imagem em tela cheia ao clicar numa mensagem
export default function ImageLightbox({ src, caption, onClose }: ImageLightboxProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onClose])

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-6"
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-4 top-4 rounded-full p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
                <X size={28} />
            </button>
            <img
                src={src}
                alt="Imagem enviada"
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            {caption && (
                <p
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-2xl whitespace-pre-wrap break-words text-center text-sm text-zinc-200"
                >
                    {caption}
                </p>
            )}
        </div>
    )
}
