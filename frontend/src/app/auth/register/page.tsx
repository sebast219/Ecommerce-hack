'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Home,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { register } = useAuthStore();


  /* Autofocus name */
  useEffect(() => {
    document.getElementById('name')?.focus();
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await register({
        name,
        email,
        password,
      });

      router.push('/');

    } catch {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 min-h-screen flex justify-around bg-slate-50 overflow-hidden">


      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_60%)] z-0" />


      {/* LEFT */}
      <div className="hidden lg:flex flex-col justify-center px-16 xl:px-28 relative">

        <div className="relative z-10 max-w-xl">

          <h1 className="text-5xl xl:text-6xl font-bold text-slate-900 mb-6">
            Únete a <br />
            <span className="text-blue-600">Hack 6</span>
          </h1>

          <p className="text-lg text-slate-600 mb-10">
            Crea tu cuenta y accede a herramientas
            profesionales de ciberseguridad.
          </p>
          
          <Link
            href="/"
            className="
              inline-flex items-center gap-4
              px-8 py-3
              rounded-full
              bg-white
              border border-slate-200
              shadow-sm
              text-slate-700
              font-medium
              transition-all duration-300
              hover:bg-slate-50
              hover:border-slate-300
              hover:shadow-md
              hover:scale-[1.02]
              hover:text-slate-900
              active:scale-[0.98]
              mb-8
            "
            >
            <Home className="h-5 w-5" />
            Volver al Inicio
          </Link>


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



      {/* RIGHT */}
      <div className="lg:max-w-md xl:max-w-lg flex items-center justify-center px-6 py-12 relative z-10">

        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">


          {/* Mobile Logo */}
          <div className="lg:hidden text-center">

            <div className="inline-flex items-center gap-2 mb-6">

              <div className="h-9 w-9 rounded-full bg-black" />

              <span className="text-xl font-bold">
                Hack 6
              </span>

            </div>

          </div>



          {/* Title */}
          <div className="text-center space-y-2">

            <h2 className="text-3xl font-bold text-slate-900">
              Crear Cuenta
            </h2>

            <p className="text-sm text-slate-600">
              Regístrate gratis
            </p>

          </div>



          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="
              w-full h-12 rounded-full gap-2
              border-slate-200
              bg-white
              hover:bg-slate-50
              hover:shadow-md
              transition
            "
          >
            <Chrome className="h-4 w-4" />
            Registrarse con Google
          </Button>



          {/* Divider */}
          <div className="relative my-4">

            <div className="h-px bg-slate-200" />

            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-slate-500">
              o con email
            </span>

          </div>



          {/* Card */}
          <div
            className="
              rounded-2xl p-6
              border border-slate-200/60
              bg-white/70
              backdrop-blur-xl
              shadow-lg
            "
          >


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >


              {/* Error */}
              {error && (
                <div
                  className="
                    bg-red-50 text-red-700
                    px-4 py-3 rounded-xl
                    text-sm border
                  "
                >
                  ⚠️ {error}
                </div>
              )}



              {/* Name */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Nombre
                </label>

                <div className="relative group">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10 h-12 rounded-xl"
                    required
                  />

                </div>

              </div>



              {/* Email */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Correo
                </label>

                <div className="relative group">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="pl-10 h-12 rounded-xl"
                    required
                  />

                </div>

              </div>



              {/* Password */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/> }
                  </button>

                </div>

              </div>



              {/* Confirm */}
              <div className="space-y-1">

                <label className="text-sm font-medium text-slate-700">
                  Confirmar Contraseña
                </label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl"
                  required
                />

              </div>



              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full h-12 rounded-full
                  bg-black text-white
                  font-semibold
                  hover:scale-[1.02]
                  transition
                "
              >

                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}

              </Button>

            </form>

          </div>



          {/* Login */}
          <div className="text-center text-sm text-slate-600">

            ¿Ya tienes cuenta?{' '}

            <a
              href="/auth/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Inicia sesión
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}
