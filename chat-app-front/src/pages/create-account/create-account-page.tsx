"use client"

import { useNavigate } from "react-router-dom"
import { type FormEvent, useState } from "react"
import { z } from "zod";
import { toast } from "sonner"
import { FormInputField } from "../../components/FormInputField"
import axios from "axios"
import { useCreateAccount } from "../../hooks/useAccount"
import { UserPlus, ArrowRight } from "lucide-react"
import type { CreateAccountRequestSend } from "../../lib/types/create-account.types";

export function CreateAccountPage() {
  const { mutateAsync: createAccount, isPending } = useCreateAccount()
  const router = useNavigate()
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const createAccountSchema = z.object({
    name: z
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .max(50, "Nome longo demais"),
    
    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .email("Insira um e-mail válido"),
    
    password: z
      .string()
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    
    phone: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 10, {
        message: "O telefone deve ter um formato válido",
      }),
  })

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    
    const validation = createAccountSchema.safeParse(form)

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
      const params : CreateAccountRequestSend = {
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
        ...(validation.data.phone ? { phone: validation.data.phone } : {})
      }
      
      await createAccount(params)
      router("/")
    } catch (err: unknown) {
      let errorMessage = "Erro ao criar conta. Tente novamente."
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message
      }
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 antialiased font-sans">
      <div className="w-full max-w-md space-y-6">
        
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10 mb-4 shadow-lg shadow-emerald-500/5">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-zinc-100 font-bold text-3xl tracking-tight">Crie sua conta</h2>
          <p className="text-zinc-400 text-sm mt-1.5">Comece a conversar com seus amigos hoje mesmo</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            <div className="space-y-1">
              <FormInputField
                id="name"
                name="Nome completo"
                type="text"
                value={form.name}
                onChange={(text) => setForm({ ...form, name: text })}
                placeholder="Seu nome"
                error={errors.name}
              />
            </div>

            <div className="space-y-1">
              <FormInputField
                id="email"
                name="E-mail"
                value={form.email}
                onChange={(text) => setForm({ ...form, email: text })}
                placeholder="seu@email.com"
                error={errors.email}
              />
            </div>

            <div className="space-y-1">
              <FormInputField
                id="phone"
                name="Telefone (Opcional)"
                value={form.phone}
                onChange={(text) => setForm({ ...form, phone: text })}
                placeholder="(00) 00000-0000"
                error={errors.phone}
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
              className="w-full flex items-center justify-center font-medium text-white rounded-xl py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-600/10 mt-3"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Criando conta...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Criar minha conta</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-3 text-sm pt-1">
          <p className="text-zinc-400">
            Já tem uma conta?{" "}
            <a href="/" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Fazer login
            </a>
          </p>
        </div>
      
      </div>
    </div>
  )
}