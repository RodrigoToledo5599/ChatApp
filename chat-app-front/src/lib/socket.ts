import { io } from "socket.io-client"

// conexão única do app; conectada pelo useRealtimeConnection nas páginas autenticadas
export const socket = io(import.meta.env.VITE_SOCKET_URL,{
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: false
})
