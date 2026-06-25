import { MessageSquareDashed, ShieldCheck } from "lucide-react";


export default function PageDescriptionWithNoConversationSelected(){

    return (
        <div className="hidden md:flex md:flex-1 h-full flex-col items-center justify-center bg-zinc-900/20 relative">
            <div className="max-w-md text-center flex flex-col items-center px-6">
            
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="relative p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-emerald-400 shadow-2xl">
                    <MessageSquareDashed className="w-10 h-10 stroke-[1.5]" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Suas conversas criptografadas
                </h2>
                <p className="text-sm text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    Selecione um chat na barra lateral ou comece uma nova conversa com seus amigos para iniciar.
                </p>
            </div>

            <div className="absolute bottom-6 flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 bg-zinc-950/40 px-3 py-1 rounded-full border border-zinc-800/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>Fim-a-fim criptografado</span>
            </div>
        </div>
    )
}