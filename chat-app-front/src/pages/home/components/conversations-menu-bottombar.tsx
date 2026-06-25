"use client"

import { useNavigate } from "react-router-dom"
import { Users } from "lucide-react"

export default function ConversationsMenuBottombar() {
  const router = useNavigate()

  return (
    <div className="w-full h-16 bg-zinc-900 border-t border-zinc-800/60 px-4 flex items-center justify-between shrink-0">
      
        <button
            type="button"
            onClick={() => router("/friendship")} 
            className="flex items-center gap-2.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 group"
        >
            <Users className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <span>Amigos</span>
        </button>


        {/* Adiciono depois  */}
        {/* <button
            type="button"
            title="Configurações"
            className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 rounded-xl transition-all active:scale-95"
        >
            <Settings className="w-4 h-4" />
        </button> */}

    </div>
  )
}