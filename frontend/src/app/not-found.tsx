import Link from "next/link";
import { ArrowRight, Home, Search, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="
        fixed inset-0 z-50
        min-h-screen
        flex items-center justify-center
        bg-black text-white
        overflow-hidden
      "
    >

      {/* Animated Gradient Background */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-purple-900/30
          via-black
          to-cyan-900/30
          animate-pulse
        "
      />

      {/* Grid Overlay */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),
              linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Main Content */}
      <div
        className="
          relative z-10
          text-center
          px-6
          max-w-2xl
        "
      >

        {/* Badge */}
        <div
          className="
            inline-flex items-center gap-2
            px-4 py-1.5 mb-6
            rounded-full
            border border-white/10
            bg-white/5
            backdrop-blur
            text-sm text-white/70
          "
        >
          <Zap className="h-4 w-4 text-purple-400" />
          System Error
        </div>

        {/* 404 */}
        <h1
          className="
            text-[8rem] md:text-[11rem]
            font-extrabold

            bg-gradient-to-r
            from-purple-400
            via-blue-400
            to-cyan-400

            bg-clip-text text-transparent

            drop-shadow-[0_0_60px_rgba(139,92,246,0.45)]

            animate-pulse
          "
        >
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold mt-2">
          Acceso Perdido
        </h2>

        {/* Description */}
        <p className="mt-4 text-white/60 leading-relaxed">
          La ruta solicitada no fue encontrada en el sistema.
          Puede haber sido eliminada o restringida.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">


          {/* Primary */}
          <Link
            href="/"
            className="
              group

              relative overflow-hidden

              inline-flex items-center justify-center gap-2

              px-8 py-4
              rounded-full

              bg-white text-black

              font-semibold

              transition-all duration-300

              hover:scale-105
              hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)]
            "
          >

            {/* Shine */}
            <span
              className="
                absolute inset-0
                bg-gradient-to-r
                from-transparent
                via-white/40
                to-transparent
                -translate-x-full
                group-hover:translate-x-full
                transition-transform duration-700
              "
            />

            <Home className="h-5 w-5" />
            Volver al Inicio
          </Link>


          {/* Secondary */}
          <Link
            href="/products"
            className="
              group

              inline-flex items-center justify-center gap-2

              px-8 py-4
              rounded-full

              border border-white/15
              bg-white/5

              backdrop-blur-xl

              text-white

              transition-all duration-300

              hover:bg-white/10
              hover:border-white/30
              hover:scale-105
            "
          >
            <Search className="h-5 w-5" />
            Explorar Catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

        </div>
      </div>
    </div>
  );
}
