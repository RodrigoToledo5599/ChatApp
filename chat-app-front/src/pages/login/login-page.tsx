import { useNavigate, useSearchParams } from "react-router-dom"
import { type FormEvent, useEffect, useState } from "react"
import { z } from "zod";
import { toast } from "sonner"
import { FormInputField } from "../../components/FormInputField"
import type { LoginParams } from "../../lib/types/auth.types"
import { useLogin } from "../../hooks/useAuth"
import { getApiErrorMessage } from "../../lib/utils"
import { MessageSquareCode, ArrowRight } from "lucide-react"

export function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin()
  const router = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [form, setForm] = useState({ email: "", password: "" })

  // o interceptor do http redireciona para /?session=expired quando o refresh falha
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.info("Sua sessão expirou. Entre novamente.")
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const loginSchema = z.object({      
    email: z
      .string()
      .min(1, "O e-mail é obrigatório"),
      
    password: z
      .string()
      .min(1, "A senha é obrigatória"),

  })

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    setErrors({})
    const validation = loginSchema.safeParse(form)

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {}
      
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message
        }
      })

      setErrors(formattedErrors)
      return 
    }

    try {
      const params: LoginParams = { email: form.email, password: form.password }
      await login(params)
      router("/home")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Não foi possível entrar. Tente novamente."))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 antialiased font-sans">
      <div className="w-full max-w-md space-y-8">
        
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 mb-4 shadow-lg shadow-emerald-500/5">
            <MessageSquareCode className="w-8 h-8" />
          </div>
          <h2 className="text-zinc-100 font-bold text-3xl tracking-tight">Bem-vindo de volta</h2>
          <p className="text-zinc-400 text-sm mt-1.5">Entre com sua conta para acessar seus chats</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            <div className="space-y-1">
              <FormInputField
                id="email"
                name="E-mail"
                type="email"
                value={form.email}
                onChange={(text) => setForm({ ...form, email: text })}
                placeholder="seu@email.com"
                error={errors.email}
              />
            </div>
            
            <div className="space-y-1">
              <FormInputField
                id="password"
                name="Senha"
                type="password"
                value={form.password}
                onChange={(text) => setForm({ ...form, password: text })}
                placeholder="••••••••"
                error={errors.password}
              />
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center font-medium text-white rounded-xl py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-600/10 mt-2"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Entrar no App</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3 text-sm pt-2">
          <p className="text-zinc-400">
            Não tem uma conta?{" "}
            <a href="/create-account" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Cadastre-se grátis
            </a>
          </p>
        </div>
      
      </div>
    </div>
  )
}