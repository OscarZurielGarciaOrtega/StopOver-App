import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Favoritos() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // 👤 CARGAR PERFIL DESDE LOCALSTORAGE
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('stopover_user_avatar') || 'https://i.pravatar.cc/150?img=47';
  });
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('stopover_user_nombre') || 'Maria A';
  });

  // 🔔 ESCUCHAR EN TIEMPO REAL SI EL USUARIO CAMBIA SU FOTO O NOMBRE EN AJUSTES
  useEffect(() => {
    const handleProfileChange = () => {
      setAvatar(localStorage.getItem('stopover_user_avatar') || 'https://i.pravatar.cc/150?img=47');
      setNombre(localStorage.getItem('stopover_user_nombre') || 'Maria A');
    };
    window.addEventListener('user_profile_updated', handleProfileChange);
    return () => window.removeEventListener('user_profile_updated', handleProfileChange);
  }, []);

  // Arreglo inicial de paradas favoritas
  const [favoritos, setFavoritos] = useState([
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
      title: 'CUATRO PALOS', 
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
  ]);

  // Estado para el buscador
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // Función para quitar de favoritos al picarle al corazón
  const toggleFavorito = (id) => {
    setFavoritos(favoritos.filter(item => item.id !== id));
  };

  // Filtrar tarjetas según el buscador y categoría
  const favoritosFiltrados = favoritos.filter(lugar => {
    const textoMatch = 
      lugar.title.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      lugar.route.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      lugar.category.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    const catMatch = filtroCategoria === 'Todos' || lugar.category === filtroCategoria;

    return textoMatch && catMatch;
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* AQUÍ ESTÁ EL CAMBIO DE LA FOTO Y NOMBRE DE PERFIL */}
          <img src={avatar} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover bg-white" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombre}</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        <Sidebar />

        <main className={`flex-1 p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mis paradas favoritas</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Lugares que has guardado para tu próximo viaje</p>
          </div>

          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Buscar por lugar, ruta o categoría..." 
              value={busquedaTexto}
              onChange={(e) => setBusquedaTexto(e.target.value)}
              className={`border rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}
            />
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className={`border rounded-lg px-4 py-2 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              <option value="Todos">Categoría: Todos</option>
              <option value="Pueblo Mágico">Pueblo Mágico</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Mirador">Mirador</option>
              <option value="Mercado">Mercado</option>
              <option value="Playa">Playa</option>
            </select>
          </div>

          {favoritosFiltrados.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-medium">
              No se encontraron paradas favoritas con ese criterio.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {favoritosFiltrados.map((lugar) => (
                <div key={lugar.id} className={`rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  
                  <div className="relative h-44 w-full">
                    <img src={lugar.img} alt={lugar.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                    
                    <div className={`absolute top-3 left-3 ${lugar.iconBg} text-white p-2 rounded-full backdrop-blur-sm`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {lugar.icon}
                      </svg>
                    </div>

                    {/* Botón de favorito dinámico para remover */}
                    <button 
                      onClick={() => toggleFavorito(lugar.id)}
                      title="Eliminar de favoritos"
                      className="absolute top-3 right-3 bg-white/70 hover:bg-white text-red-500 transition-colors p-2 rounded-full backdrop-blur-md cursor-pointer shadow-sm"
                    >
                      <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-5 flex flex-col items-center text-center">
                    <h3 className={`text-lg font-black tracking-wide uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{lugar.title}</h3>
                    <p className="text-xs text-gray-400 font-medium mb-1">{lugar.route}</p>
                    <span className={`text-[11px] font-bold ${lugar.catColor}`}>{lugar.category}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

          <footer className="text-center text-sm text-gray-500 pt-6 mt-auto border-t border-gray-100">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}