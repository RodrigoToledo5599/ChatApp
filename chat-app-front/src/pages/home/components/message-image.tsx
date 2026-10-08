import type { ReactNode } from "react"

const MAX_WIDTH = 300
const MAX_HEIGHT = 360

interface MessageImageProps {
    src: string
    width: number
    height: number
    onClick?: () => void
    // conteúdo sobreposto à imagem (ex.: progresso do upload)
    children?: ReactNode
}

// o espaço da imagem é reservado pelas dimensões vindas do back: o chat não "pula" quando ela termina de carregar
export default function MessageImage({ src, width, height, onClick, children }: MessageImageProps) {
    const displayWidth = Math.min(MAX_WIDTH, width, MAX_HEIGHT * (width / height))

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={!onClick}
            className="relative block max-w-full overflow-hidden rounded-2xl bg-zinc-800 enabled:cursor-zoom-in"
            style={{ width: displayWidth, aspectRatio: `${width} / ${height}` }}
        >
            <img
                src={src}
                width={width}
                height={height}
                loading="lazy"
                alt="Imagem enviada"
                className="h-full w-full object-cover"
            />
            {children}
        </button>
    )
}
