"use client"

import { useNavigate } from "react-router-dom"

export default function FriendsBottomBar() {
  const router = useNavigate()

  return (
    <div className="w-full h-16 bg-zinc-900 border-t border-zinc-800/60 px-4 flex items-center justify-between shrink-0">
        <button
            type="button"
            onClick={() => router("/home")} 
            className="flex items-center gap-2.5 px-4 py-2 bg-zinc-950 
                hover:bg-zinc-800 border border-zinc-850 
                hover:border-zinc-800 text-zinc-400 hover:text-emerald-400 rounded-xl 
                text-xs font-semibold tracking-wide transition-all active:scale-95 group"
        >
            Voltar
        </button>
    </div>
  )
}