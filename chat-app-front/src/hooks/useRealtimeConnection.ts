import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { socket } from "../lib/socket"
import { http } from "../api/http"
import { TanStackKeys } from "../lib/tan-stack-keys"

const MAX_AUTH_RETRIES = 2

export function useRealtimeConnection() {
    const queryClient = useQueryClient()

    useEffect(() => {
        let authRetries = 0

        const onConnect = () => { authRetries = 0 }

        // o handshake usa o cookie do access token; se ele expirou, renova e reconecta
        // (erros do middleware do servidor não disparam a reconexão automática do socket.io)
        const onConnectError = async () => {
            if (socket.active || authRetries >= MAX_AUTH_RETRIES) return
            authRetries++
            try {
                await http.post("auth/refresh-token")
                socket.connect()
            } catch {
                // o interceptor do http já redireciona para o login quando o refresh falha
            }
        }

        const onConversationsUpdated = () =>
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.conversations] })
        const onFriendsUpdated = () =>
            queryClient.invalidateQueries({ queryKey: [TanStackKeys.friends] })

        socket.on("connect", onConnect)
        socket.on("connect_error", onConnectError)
        socket.on("conversations_updated", onConversationsUpdated)
        socket.on("friends_updated", onFriendsUpdated)
        socket.connect()

        return () => {
            socket.off("connect", onConnect)
            socket.off("connect_error", onConnectError)
            socket.off("conversations_updated", onConversationsUpdated)
            socket.off("friends_updated", onFriendsUpdated)
        }
    }, [queryClient])
}
