import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Favoritos() {
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // 👤 CARGAR PERFIL DINÁMICO
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('nombre') || localStorage.getItem('email') || 'Viajero';
  });

  useEffect(() => {
    const handleProfileChange = () => {
      setNombre(localStorage.getItem('nombre') || localStorage.getItem('email') || 'Viajero');
    };
    window.addEventListener('user_profile_updated', handleProfileChange);
    return () => window.removeEventListener('user_profile_updated', handleProfileChange);
  }, []);

  // 💖 CARGAR FAVORITOS DESDE LOCALSTORAGE (O USAR RESPALDO SI ESTÁ VACÍO)
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('stopover_favoritos');
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch (e) {
        console.error("Error al leer favoritos", e);
      }
    }
    // Respaldo inicial para que no se vea vacío la primera vez
    return [
      { 
        id: 1, 
        title: 'TECATE', 
        route: 'Oaxaca → Tijuana', 
        category: 'Pueblo Mágico', 
        catColor: 'text-[#0284C7]', 
        iconBg: 'bg-[#0284C7]/80',
        img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&q=80',
      },
      { 
        id: 2, 
        title: 'CAFE DE NADIE', 
        route: 'Oaxaca → CDMX', 
        category: 'Cafetería', 
        catColor: 'text-[#92400E]', 
        iconBg: 'bg-[#92400E]/80',
        img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80',
      },
      { 
        id: 3, 
        title: 'CUATRO PALOS', 
        route: 'Oaxaca → Querétaro', 
        category: 'Mirador', 
        catColor: 'text-[#E11D48]', 
        iconBg: 'bg-[#E11D48]/80',
        img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
      }
    ];
  });

  // Sincronizar cambios en localStorage cada vez que se modifiquen los favoritos
  useEffect(() => {
    localStorage.setItem('stopover_favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  // Estado para el buscador y filtros
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // Quitar de favoritos
  const toggleFavorito = (id) => {
    const actualizados = favoritos.filter(item => item.id !== id);
    setFavoritos(actualizados);
  };

  // Filtrar tarjetas
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
      
      {/* HEADER CON LA INICIAL LIMPIA */}
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {nombre.charAt(0).toUpperCase()}
          </div>
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
              No tienes paradas favoritas guardadas todavía.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {favoritosFiltrados.map((lugar) => (
                <div key={lugar.id} className={`rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  
                  <div className="relative h-44 w-full">
                    <img src={lugar.img} alt={lugar.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

                    {/* Botón para eliminar de favoritos */}
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
                    <span className={`text-[11px] font-bold ${lugar.catColor || 'text-emerald-600'}`}>{lugar.category}</span>
                  </div>

                </div>
              ))}
            </div>
          )}

          <footer className="text-center text-sm text-gray-500 pt-6 mt-auto border-t border-gray-100 dark:border-gray-800">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}