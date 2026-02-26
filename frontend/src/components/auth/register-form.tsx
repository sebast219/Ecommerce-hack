'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/auth/login');
    }, 2000);
  };

  const inputClass = `
    h-12 rounded-xl
    border-black/15 bg-transparent
    placeholder:text-black/25
    focus:border-black focus:ring-0
    text-sm
  `;

  const labelClass = 'text-[10px] uppercase tracking-[0.28em] text-black/40 font-medium';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-md space-y-10">

        {/* Header */}
        <div className="space-y-3">
          <span className="uppercase tracking-[0.4em] text-xs text-black/35 font-medium block">
            Hack 6
          </span>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] leading-tight">
            Crear cuenta
          </h2>
          <p className="text-sm text-black/40">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/auth/login"
              className="text-black font-medium underline underline-offset-2 hover:opacity-60 transition-opacity"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Thin divider */}
        <div className="h-px bg-black/10" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First + Last */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Nombre</label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Apellido</label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Pérez"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className={labelClass}>Correo</label>
            <Input
              name="email"
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={labelClass}>Contraseña</label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
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
            <label className={labelClass}>Confirmar contraseña</label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-1">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 rounded border-black/20 accent-black"
            />
            <label htmlFor="agree-terms" className="text-xs text-black/45 leading-relaxed">
              Acepto los{' '}
              <Link href="#" className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity">
                términos y condiciones
              </Link>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
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
              {isLoading ? 'Creando cuenta...' : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Google */}
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
  );
}