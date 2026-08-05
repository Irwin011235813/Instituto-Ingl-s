import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { perfil, cerrarSesion } = useAuth();

  return (
<nav className="relative w-full overflow-hidden bg-linear-to-b from-sky-300 via-blue-200 to-white py-4 shadow-lg">
  {/* --- ESTILOS DE ANIMACIÓN (Solo necesarios si no están en tu config global) --- */}
  <style>{`
    @keyframes floatLeft {
      0% { transform: translateX(100vw); }
      100% { transform: translateX(-150px); }
    }
    .animate-float-left {
      animation: floatLeft 35s linear infinite;
    }
    .animate-float-left-fast {
      animation: floatLeft 22s linear infinite;
    }
  `}</style>

  {/* 1. ARCOÍRIS (Fondo inferior) */}
  <div className="absolute bottom-0 left-0 right-0 h-24 opacity-80 pointer-events-none">
    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,100 Q300,0 600,100 T1200,100" fill="none" stroke="#FFB3B3" strokeWidth="15" />
      <path d="M0,100 Q300,15 600,100 T1200,100" fill="none" stroke="#FFD999" strokeWidth="15" />
      <path d="M0,100 Q300,30 600,100 T1200,100" fill="none" stroke="#FFFFCC" strokeWidth="15" />
      <path d="M0,100 Q300,45 600,100 T1200,100" fill="none" stroke="#CCFFCC" strokeWidth="15" />
      <path d="M0,100 Q300,60 600,100 T1200,100" fill="none" stroke="#99CCFF" strokeWidth="15" />
      <path d="M0,100 Q300,75 600,100 T1200,100" fill="none" stroke="#CC99FF" strokeWidth="15" />
    </svg>
  </div>

  {/* 2. NUBES (Movimiento de derecha a izquierda) */}
  <div className="absolute top-4 opacity-90 animate-float-left">
    <svg className="w-32 h-16 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
    </svg>
  </div>
  <div className="absolute top-12 opacity-80 animate-float-left-fast" style={{ animationDelay: '-10s' }}>
    <svg className="w-20 h-10 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
    </svg>
  </div>

  {/* 3. SOL (Esquina superior derecha, girando) */}
<div className="absolute -top-7.5 -right-7.5 opacity-90 animate-spin" style={{ animationDuration: '30s' }}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-36 h-36">
    <g>
      {/* 1. RAYOS (Primero: van al fondo) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line 
          key={i}
          x1="50" y1="50" 
          x2="50" y2="5" /* Rayos más cortos para que no tapen todo */
          stroke={i % 2 === 0 ? "#FF6B6B" : "#4ECDC4"} 
          strokeWidth="4" 
          strokeLinecap="round"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}

      {/* 2. CÍRCULO CENTRAL (Segundo: tapa la base de los rayos) */}
      <circle cx="50" cy="50" r="28" fill="#FFD700" />

      {/* 3. CARA FELIZ (Tercero: siempre visible encima) */}
      <circle cx="40" cy="45" r="3" fill="#333" />
      <circle cx="60" cy="45" r="3" fill="#333" />
      <path d="M 38 55 Q 50 68 62 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  </svg>
</div>

  {/* --- CONTENIDO DE LA NAVBAR (Tu menú actual) --- */}
  <nav className="relative z-10 container mx-auto px-4">
  <div className="flex items-center justify-between">
    
    {/* 1. Logo (Izquierda) */}
    <a href="#" className="group flex items-center gap-3">
      <div className="hidden sm:block">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-10 w-10 animate-pulse">
          <circle cx="50" cy="50" r="18" fill="#FFD700" />
          <line x1="50" y1="10" x2="50" y2="25" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="75" x2="50" y2="90" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="50" x2="25" y2="50" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
          <line x1="75" y1="50" x2="90" y2="50" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="46" r="3" fill="#333" />
          <circle cx="56" cy="46" r="3" fill="#333" />
          <path d="M 42 54 Q 50 62 58 54" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    
    </a>

    {/* 2. Título Centrado (Centro Absoluto) */}
    <div className="relative z-10 container mx-auto px-4 flex items-center justify-center h-20">
  
  {/* Título "SUNSHINE INSTITUTE" */}
  <a href="#" className="group flex items-center gap-3">
    <span 
      className="
        text-3xl font-bold text-white uppercase tracking-widest 
        font-[Fredoka] 
        transition-colors duration-300
        hover:text-yellow-300
      "
      style={{
        textShadow: '0px 0px 4px black, 0px 0px 8px black'
      }}
    >
      SUNSHINE INSTITUTE
    </span>
  </a>

</div>

    {/* 3. Menú de Navegación (Derecha) - Ejemplo placeholder */}
    <div className="hidden md:flex gap-6 text-gray-700">
      <a href="#" className="hover:text-yellow-600 transition">Cursos</a>
      <a href="#" className="hover:text-yellow-600 transition">Contacto</a>
    </div>

  </div>
</nav>
</nav>
  );
}
