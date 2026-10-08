import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useLoginWithGoogle } from "../hooks/useAuth"
import { getApiErrorMessage } from "../lib/utils"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function GoogleLoginButton({ text = "signin_with" }: { text?: "signin_with" | "signup_with" }) {
  const { mutateAsync: loginWithGoogle } = useLoginWithGoogle()
  const router = useNavigate()

  // sem client id configurado o botão do Google não funciona, então nem aparece
  if (!GOOGLE_CLIENT_ID) return null

  const handleSuccess = async (credential?: string) => {
    if (!credential) {
      toast.error("Não foi possível entrar com o Google. Tente novamente.")
      return
    }
    try {
      await loginWithGoogle(credential)
      router("/home")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Não foi possível entrar com o Google. Tente novamente."))
    }
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <div className="flex-1 h-px bg-zinc-800" />
        <span>ou</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(response) => handleSuccess(response.credential)}
          onError={() => toast.error("Não foi possível entrar com o Google. Tente novamente.")}
          theme="filled_black"
          shape="pill"
          text={text}
        />
      </div>
    </div>
  )
}
