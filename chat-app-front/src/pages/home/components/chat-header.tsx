import { Users } from "lucide-react";

interface ChatHeaderProps {
    conversationName: string
    isGroup: boolean
}

export default function ChatHeader({ conversationName, isGroup }: ChatHeaderProps){
    const initial = conversationName ? conversationName.charAt(0).toUpperCase() : "?"

    return (
        <header className="flex items-center gap-3 bg-zinc-900 px-4 py-3 border-b border-zinc-800/50">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 text-zinc-200 font-semibold text-sm border border-zinc-700">
                {isGroup ? <Users className="w-5 h-5" /> : initial}
            </div>
            <span className="font-semibold text-zinc-100">{conversationName}</span>
        </header>
    )
}
