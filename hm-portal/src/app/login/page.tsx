"use client";

import { Button } from "@/components/ui/Button";
import { login } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-lg h-12 mt-4 shadow-indigo-500/25" disabled={pending}>
      {pending ? "Ingresando..." : "Iniciar Sesión"}
    </Button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      sessionStorage.setItem("active_session", "true");
      window.location.href = "/portal/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/40 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-200/40 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-cyan-100/40 blur-[90px]"
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-white shadow-sm transition-all group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver a la página principal
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Image 
            src="/images/logo.png" 
            alt="MH Logo" 
            width={200} 
            height={200} 
            className="mb-4 object-contain drop-shadow-md" 
          />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal MH
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-white/50"
        >
          <form action={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-700">
                Nombre de Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium sm:text-sm"
                  placeholder="Ej: adminMH"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center justify-center text-center"
              >
                {error}
              </motion.div>
            )}

            <SubmitButton />
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-4">
              En caso de olvido o pérdida de usuario y/o contraseña, contáctese con el administrador.
            </p>
            <a 
              href="mailto:mhhigieneyseguridad@gmail.com"
              className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors shadow-sm"
              title="Enviar correo al administrador"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
