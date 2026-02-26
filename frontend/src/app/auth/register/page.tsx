'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/ui/input';
// v2 — full redesign matching Hack 6 B&W editorial system

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0]);

  const router = useRouter();
  const { register } = useAuthStore();

  useEffect(() => {
    document.getElementById('name')?.focus();
  }, []);

  // Animación de contadores
  useEffect(() => {
    const finalValues = [10000, 500, 98];
    const duration = 2000;
    const steps = 100;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues([
        Math.floor(finalValues[0] * progress),
        Math.floor(finalValues[1] * progress),
        Math.floor(finalValues[2] * progress)
      ]);
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
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
      setError('Mínimo 6 caracteres');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register({ name, email, password });
      router.push('/');
    } catch {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex overflow-hidden">

      {/* ── LEFT PANEL ───────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-black text-white px-16 xl:px-24 py-16 relative overflow-hidden">

        {/* Ambient */}
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px]" />

        {/* Top */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="uppercase tracking-[0.4em] text-xs text-white/40 font-medium">
            • Seguridad • Tecnología • Futuro •
          </span>
          <Link
            href="/"
            className="
              inline-flex items-center gap-2
              text-xs text-white/40 uppercase tracking-[0.3em]
              hover:text-white transition-colors duration-300
            "
          >
            <ArrowLeft className="h-3 w-3" />
            Inicio
          </Link>
        </div>

        {/* Middle headline */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-[clamp(3.5rem,6vw,5.5rem)] font-semibold tracking-[-0.03em] leading-[0.92]">
            Empieza
            <br />
            <span className="text-white/25">aquí.</span>
          </h1>

          <p className="text-base text-white/45 leading-relaxed max-w-xs">
            Accede a herramientas profesionales de ciberseguridad
            usadas por equipos en todo el mundo.
          </p>

          {/* Divider stats */}
          <div className="pt-8 grid grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {[
              [animatedValues[0], 'Profesionales', '10K+'],
              [animatedValues[1], 'Herramientas', '500+'],
              [animatedValues[2], 'Satisfacción', '98%'],
            ].map(([val, label, display]) => (
              <div key={label} className="bg-black px-6 py-5 flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight">
                  {display === '10K+' ? `${Math.floor((val as number) / 1000)}K+` : display === '98%' ? `${val}%` : val}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/35">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <div className="h-px bg-white/10 mb-6" />
          <p className="text-xs text-white/25 uppercase tracking-[0.3em]">
            Seguridad • Tecnología • Futuro
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between px-8 sm:px-14 xl:px-20 py-16 overflow-y-auto">

        {/* Top label */}
        <div className="flex items-center justify-between mb-12">
          <span className="lg:hidden uppercase tracking-[0.4em] text-xs text-black/35 font-medium">
            Hack 6
          </span>
          <span className="uppercase tracking-[0.4em] text-xs text-black/35 font-medium ml-auto">
            Crear cuenta
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm space-y-10">

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-4xl font-semibold tracking-[-0.02em] leading-tight">
                Nueva cuenta
              </h2>
              <p className="text-sm text-black/40">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-black font-medium underline underline-offset-2 hover:opacity-60 transition-opacity">
                  Inicia sesión
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl border border-black/10 bg-black/[0.03] text-sm text-black/70">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Nombre
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="
                    h-12 rounded-xl
                    border-black/15 bg-transparent
                    placeholder:text-black/25
                    focus:border-black focus:ring-0
                    text-sm
                  "
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Correo
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="
                    h-12 rounded-xl
                    border-black/15 bg-transparent
                    placeholder:text-black/25
                    focus:border-black focus:ring-0
                    text-sm
                  "
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="
                      h-12 rounded-xl pr-10
                      border-black/15 bg-transparent
                      placeholder:text-black/25
                      focus:border-black focus:ring-0
                      text-sm
                    "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-[0.25em] text-black/40 font-medium">
                  Confirmar contraseña
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="
                    h-12 rounded-xl
                    border-black/15 bg-transparent
                    placeholder:text-black/25
                    focus:border-black focus:ring-0
                    text-sm
                  "
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group w-full h-12 rounded-full
                    bg-black text-white
                    text-sm font-medium
                    flex items-center justify-center gap-2
                    hover:scale-[1.02]
                    hover:shadow-[0_10px_40px_rgba(0,0,0,0.18)]
                    disabled:opacity-50 disabled:scale-100
                    transition-all duration-300
                  "
                >
                  {loading ? 'Creando cuenta...' : (
                    <>
                      Crear cuenta
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Divider + Google */}
            <div className="space-y-4">
              <div className="relative">
                <div className="h-px bg-black/10" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-[9px] bg-white px-3 text-[10px] uppercase tracking-[0.25em] text-black/30">
                  o continúa con
                </span>
              </div>

              <button
                type="button"
                className="
                  w-full h-12 rounded-full
                  border border-black/15
                  text-sm font-medium text-black/70
                  flex items-center justify-center gap-3
                  hover:border-black/40 hover:text-black hover:bg-black/[0.02]
                  transition-all duration-300
                "
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Registrarse con Google
              </button>
            </div>

          </div>
        </div>

        {/* Bottom divider */}
        <div className="mt-12 h-px bg-black/10" />

      </div>
    </div>
  );
}
