import { Loader2 } from "lucide-react"
import { Navigate, Outlet } from "react-router-dom"
import { useMe } from "../hooks/useAuth"
import { useRealtimeConnection } from "../hooks/useRealtimeConnection"


function AuthenticatedLayout() {
    useRealtimeConnection()
    return <Outlet />
}

// só renderiza as páginas internas depois de confirmar a sessão (o interceptor tenta o refresh antes)
export function ProtectedRoute() {
    const { data: user, isLoading } = useMe()

    if (isLoading) return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
            <Loader2 className="animate-spin w-12 h-12 text-emerald-500" />
        </div>
    )

    if (!user) return <Navigate to="/" replace />

    return <AuthenticatedLayout />
}
