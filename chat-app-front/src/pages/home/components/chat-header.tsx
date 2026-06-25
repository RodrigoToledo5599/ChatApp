import { MoreVertical, Phone, Search, Video } from "lucide-react";




export default function ChatHeader(){

    return (
        <header className="flex items-center justify-between bg-secondary px-4 py-2.5">
        <div className="flex items-center gap-3">
          
          <div className="flex flex-col">
            {/* <span className="font-medium text-foreground">{conversation.users;}</span> */}
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button type="button" aria-label="Chamada de vídeo" className="rounded-full p-2 hover:bg-accent hover:text-foreground">
            <Video className="size-5" />
          </button>
          <button type="button" aria-label="Chamada de voz" className="rounded-full p-2 hover:bg-accent hover:text-foreground">
            <Phone className="size-5" />
          </button>
          <button type="button" aria-label="Pesquisar" className="rounded-full p-2 hover:bg-accent hover:text-foreground">
            <Search className="size-5" />
          </button>
          <button type="button" aria-label="Mais opções" className="rounded-full p-2 hover:bg-accent hover:text-foreground">
            <MoreVertical className="size-5" />
          </button>
        </div>
      </header>
    )

}