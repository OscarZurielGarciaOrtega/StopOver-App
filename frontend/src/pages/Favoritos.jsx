import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Favoritos() {
  // Arreglo de datos simulando los lugares guardados en la base de datos
  const favoritos = [
    { 
      id: 1, 
      title: 'TECATE', 
      route: 'Oaxaca → Tijuana', 
      category: 'Pueblo Mágico', 
      catColor: 'text-[#0284C7]', 
      iconBg: 'bg-[#0284C7]/80',
      img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3.5L19 21zM7 5h10v12.5l-5-2.5-5 2.5V5z" />
    },
    { 
      id: 2, 
      title: 'CAFE DE NADIE', 
      route: 'Oaxaca → CDMX', 
      category: 'Cafetería', 
      catColor: 'text-[#92400E]', 
      iconBg: 'bg-[#92400E]/80',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    },
    { 
      id: 3, 
      title: 'Cuatro Palos', 
      route: 'Oaxaca → Querétaro', 
      category: 'Mirador', 
      catColor: 'text-[#E11D48]', 
      iconBg: 'bg-[#E11D48]/80',
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    },
    { 
      id: 4, 
      title: '20 DE NOVIEMBRE', 
      route: 'Juquila → Oaxaca', 
      category: 'Mercado', 
      catColor: 'text-[#65A30D]', 
      iconBg: 'bg-[#65A30D]/80',
      img: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    },
    { 
      id: 5, 
      title: 'TEQUILA', 
      route: 'Oaxaca → Jalisco', 
      category: 'Pueblo Mágico', 
      catColor: 'text-[#0284C7]', 
      iconBg: 'bg-[#0284C7]/80',
      img: 'https://images.unsplash.com/photo-1564564264624-9b5a1bb40f8e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3.5L19 21zM7 5h10v12.5l-5-2.5-5 2.5V5z" />
    },
    { 
      id: 6, 
      title: 'ZICATELA', 
      route: 'Oaxaca → Río Grande', 
      category: 'Playa', 
      catColor: 'text-[#0891B2]', 
      iconBg: 'bg-[#0891B2]/80',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F6]">
      
      
      <header className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6] border-b border-gray-200">
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300" />
          <span className="text-sm font-semibold text-gray-700">Maria A</span>
        </div>
      </header>

      
      <div className="flex flex-1">
        
        
        <aside className="w-64 bg-[#FAF9F6] border-r border-gray-200 flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-4">
  <NavLink
    to="/nueva-ruta"
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
      }`
    }
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
    Nueva ruta
  </NavLink>

  <NavLink
    to="/historial"
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
      }`
    }
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    Historial
  </NavLink>

  <NavLink
    to="/favoritos"
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
      }`
    }
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    Favoritos
  </NavLink>

  <NavLink
    to="/buscar"
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
      }`
    }
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    Buscar
  </NavLink>

  <NavLink
    to="/ajustes"
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
      }`
    }
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    Ajustes
  </NavLink>
</nav>
        </aside>

        
        <main className="flex-1 p-8 bg-white flex flex-col">
          
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mis paradas favoritas</h2>
            <p className="text-sm text-gray-500 mt-1">Lugares que has guardado para tu próximo viaje</p>
          </div>

         
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Buscar por origen, destino o parada" 
              className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532]"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>Estatus: Todos</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>📅 Esta semana</option>
            </select>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {favoritos.map((lugar) => (
              <div key={lugar.id} className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                
               
                <div className="relative h-44 w-full">
                  <img src={lugar.img} alt={lugar.title} className="w-full h-full object-cover" />
                  
                 
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                  
                  
                  <div className={`absolute top-3 left-3 ${lugar.iconBg} text-white p-2 rounded-full backdrop-blur-sm`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      {lugar.icon}
                    </svg>
                  </div>

                 
                  <div className="absolute top-3 right-3 bg-white/30 hover:bg-white/50 transition-colors text-white p-2 rounded-full backdrop-blur-md">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>

               
                <div className="p-5 flex flex-col items-center text-center">
                  <h3 className="text-lg font-black text-gray-800 tracking-wide uppercase mb-1">{lugar.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-1">{lugar.route}</p>
                  <span className={`text-[11px] font-bold ${lugar.catColor}`}>{lugar.category}</span>
                </div>

              </div>
            ))}
          </div>

          
          <footer className="text-center text-sm text-gray-500 pt-6 mt-auto border-t border-gray-100">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}