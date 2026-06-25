"use client"

import { useNavigate } from "react-router-dom"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import { FormInputField } from "../../components/FormInputField"
import type { LoginParams } from "../../lib/types/auth.types"
import axios from "axios"
import { useLogin } from "../../hooks/useAuth"
import { LockKeyhole, MessageSquareCode, ArrowRight } from "lucide-react"

export function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin()
  const router = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!form.email || !form.password) {
      toast.error("Preencha todos os campos!")
      return
    }

    try {
      const params: LoginParams = { email: form.email, password: form.password }
      await login(params)
      router("/home")
    } catch (err: unknown) {
      let errorMessage = "Credenciais inválidas"

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 antialiased font-sans">
      <div className="w-full max-w-md space-y-8">
        
        {/* LOGO E TOPO */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 mb-4 shadow-lg shadow-emerald-500/5">
            <MessageSquareCode className="w-8 h-8" />
          </div>
          <h2 className="text-zinc-100 font-bold text-3xl tracking-tight">Bem-vindo de volta</h2>
          <p className="text-zinc-400 text-sm mt-1.5">Entre com sua conta para acessar seus chats</p>
        </div>

        {/* CARD DE LOGIN (Estilo Vidro Fumê) */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Note: Certifique-se de que o FormInputField aceita classes customizadas de texto claro, ou ajuste as labels dele para text-zinc-300 */}
            <div className="space-y-1">
              <FormInputField
                id="email"
                name="E-mail"
                type="email"
                value={form.email}
                onChange={(text) => setForm({ ...form, email: text })}
                placeholder="seu@email.com"
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
              />
            </div>
            
            {/* LEMBRAR / ESQUECEU A SENHA */}
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-300 transition-colors">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-600 focus:ring-emerald-500/30 focus:ring-offset-0 transition-all cursor-pointer"
                />
                Lembrar de mim
              </label>
              <a href="#" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* BOTÃO SUBMIT */}
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
            <a href="/cadastrar" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Cadastre-se grátis
            </a>
          </p>
          
          <div className="w-12 h-px bg-zinc-800 my-1" />

          <a 
            href="/cadastrar-seller" 
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-900/30 px-3 py-1.5 border border-zinc-800/40 rounded-full"
          >
            <LockKeyhole className="w-3 h-3" />
            Acesso profissional / Vendedor
          </a>
        </div>
      
      </div>
    </div>
  )
}