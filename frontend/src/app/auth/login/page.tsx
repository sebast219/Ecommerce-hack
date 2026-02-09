'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { login } = useAuthStore();


  /* Autofocus email */
  useEffect(() => {
    const el = document.getElementById('email');
    el?.focus();
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await login(email, password);

      router.push('/');

    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-slate-100">


      {/* LEFT — HERO */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-28 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_60%)]" />

        <div className="relative z-10 max-w-xl">

          <h1 className="text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Bienvenido a <br />
            <span className="text-blue-600">Hack 6</span>
          </h1>

          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Plataforma profesional para herramientas de
            ciberseguridad y tecnología avanzada.
          </p>


          {/* Badges */}
          <div className="flex gap-6 text-sm">

            {[
              ['Seguro', 'bg-green-500'],
              ['Rápido', 'bg-blue-500'],
              ['Profesional', 'bg-purple-500'],
            ].map(([label, color]) => (
              <div
                key={label}
                className="flex items-center gap-2 text-slate-600"
              >
                <span className={`w-2 h-2 rounded-full ${color}`} />
                {label}
              </div>
            ))}

          </div>

        </div>

      </div>



      {/* RIGHT — FORM */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center px-6 py-12 bg-white">

        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


          {/* Mobile Logo */}
          <div className="lg:hidden text-center">

            <div className="inline-flex items-center gap-2 mb-6">

              <div className="h-9 w-9 rounded-full bg-black shadow-sm" />

              <span className="text-xl font-bold tracking-wide">
                Hack 6
              </span>

            </div>

          </div>



          {/* Title */}
          <div className="text-center space-y-2">

            <h2 className="text-3xl font-bold text-slate-900">
              Iniciar Sesión
            </h2>

            <p className="text-sm text-slate-600">
              Accede a tu panel profesional
            </p>

          </div>



          {/* Google */}
          <Button
            variant="outline"
            className="w-full h-12 rounded-full gap-2 border-slate-200 hover:bg-slate-50 hover:shadow-sm transition"
          >
            <Chrome className="h-4 w-4" />
            Continuar con Google
          </Button>



          {/* Divider */}
          <div className="relative my-4">

            <div className="h-px bg-slate-200" />

            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-slate-500">
              o con email
            </span>

          </div>



          {/* Card */}
          <div className="rounded-2xl p-6 border border-slate-100 bg-white/80 backdrop-blur shadow-sm">


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
                  ⚠️ {error}
                </div>
              )}



              {/* Email */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Correo
                </label>

                <div className="relative group">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition" />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    className="pl-10 h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition"
                    required
                  />

                </div>

              </div>



              {/* Password */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>

                <div className="relative group">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition" />

                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/> }
                  </button>

                </div>

              </div>



              {/* Forgot */}
              <div className="text-right">

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>

              </div>



              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-black text-white hover:bg-slate-800 transition font-medium"
              >

                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  'Entrar'
                )}

              </Button>

            </form>

          </div>



          {/* Register */}
          <div className="text-center text-sm text-slate-600">

            ¿No tienes cuenta?{' '}

            <Link
              href="/auth/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Regístrate gratis
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
