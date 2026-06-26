"use client"

import { useNavigate } from "react-router-dom"
import { Users, Undo2 } from "lucide-react"

export default function ConversationsMenuBottombar() {
  const router = useNavigate()

  return (
    <div className="w-full h-16 bg-zinc-900 border-t border-zinc-800/60 px-4 flex items-center justify-between shrink-0">
      
        <button
            type="button"
            onClick={() => router("/friendship")} 
            className="flex items-center gap-2.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 
                hover:border-zinc-800 text-zinc-400 hover:text-emerald-400 
                rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 group"
        >
            <Users className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <span>Amigos</span>
        </button>


        <button
            className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-900 
                hover:border-zinc-800 text-zinc-400 hover:text-emerald-400 
                rounded-xl text-xs font-semibold tracking-wide transition-all 
                active:scale-95 group flex items-center gap-0 hover:gap-2 p-2 px-3"
            type="button"
            onClick={() => router("/")} 
        >
            
            <Undo2 size={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors duration-200" />
            
            <span className="max-w-0 overflow-hidden opacity-0 translate-x-2.5 
                group-hover:max-w-xs group-hover:opacity-100 group-hover:translate-x-0 
                transition-all duration-500 ease-out whitespace-nowrap">
                Mudar Conta
            </span>
        </button>


    </div>
  )
}