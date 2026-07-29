import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Buscar() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // Lista robusta de lugares para simular la búsqueda y filtrado
  const [todosLosLugares] = useState([
    { 
      id: 1, 
      title: 'Cuatro Palos', 
      route: 'Oaxaca → Querétaro', 
      category: 'Miradores', 
      catColor: 'text-[#E11D48]', 
      iconBg: 'bg-[#E11D48]/80',
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    },
    { 
      id: 2, 
      title: 'ZICATELA', 
      route: 'Oaxaca → Río Grande', 
      category: 'Playa', 
      catColor: 'text-[#0891B2]', 
      iconBg: 'bg-[#0891B2]/80',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    },
    { 
      id: 3, 
      title: '20 DE NOVIEMBRE', 
      route: 'Juquila → Oaxaca', 
      category: 'Mercado', 
      catColor: 'text-[#65A30D]', 
      iconBg: 'bg-[#65A30D]/80',
      img: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    },
    { 
      id: 4, 
      title: 'CAFÉ DE OLLA EL TULE', 
      route: 'Oaxaca → Mitla', 
      category: 'Cafeterías', 
      catColor: 'text-[#92400E]', 
      iconBg: 'bg-[#92400E]/80',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    },
    { 
      id: 5, 
      title: 'PUEBLO MÁGICO SOLA DE VEGA', 
      route: 'Oaxaca → Puerto Escondido', 
      category: 'Pueblos mágicos', 
      catColor: 'text-[#0284C7]', 
      iconBg: 'bg-[#0284C7]/80',
      img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3.5L19 21zM7 5h10v12.5l-5-2.5-5 2.5V5z" />
    },
    { 
      id: 6, 
      title: 'CAPULÁLPAM DE MÉNDEZ', 
      route: 'Oaxaca → Sierra Norte', 
      category: 'Pueblos mágicos', 
      catColor: 'text-[#0284C7]', 
      iconBg: 'bg-[#0284C7]/80',
      img: 'https://images.unsplash.com/photo-1564564264624-9b5a1bb40f8e?w=500&q=80',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3.5L19 21zM7 5h10v12.5l-5-2.5-5 2.5V5z" />
    }
  ]);

  // Estados para búsqueda de texto y categoría seleccionada
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');

  // Lógica de filtrado combinada (Texto + Categoría)
  const resultadosFiltrados = todosLosLugares.filter(lugar => {
    const textoMatch = 
      lugar.title.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      lugar.route.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      lugar.category.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    const categoriaMatch = categoriaActiva === 'Todos' || lugar.category === categoriaActiva;

    return textoMatch && categoriaMatch;
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
          <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Maria A</span>
        </div>
      </header>

      <div className="flex flex-1">
    
        <Sidebar />

        <main className={`flex-1 p-10 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          <div className="mb-8">
            <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Encuentra tu próxima parada</h2>
            <p className="text-[15px] text-gray-400 font-medium mt-1">Busca destinos, rutas o lugares de interés</p>
          </div>

          {/* BARRA DE BÚSQUEDA INTERACTIVA */}
          <div className="relative w-full max-w-4xl mb-6">
            <input 
              type="text" 
              placeholder="Buscar por ciudad, ruta o punto de interés..." 
              value={busquedaTexto}
              onChange={(e) => setBusquedaTexto(e.target.value)}
              className={`w-full border-2 rounded-2xl py-4 pl-6 pr-14 font-medium text-lg focus:outline-none transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:border-gray-500' 
                  : 'bg-[#E5E7EB]/50 border-2 border-gray-200 text-gray-700 focus:border-gray-400 focus:bg-white'
              }`}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* BOTONES DE FILTRADO POR CATEGORÍA */}
          <div className="flex flex-wrap gap-3 mb-12">
            {['Todos', 'Cafeterías', 'Miradores', 'Pueblos mágicos', 'Restaurantes'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`border rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-colors cursor-pointer ${
                  categoriaActiva === cat 
                    ? 'bg-[#2A4532] text-white border-[#2A4532]' 
                    : isDarkMode 
                      ? 'border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700' 
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-gray-400 font-semibold mb-6">{resultadosFiltrados.length} resultados encontrados</p>
            
            {resultadosFiltrados.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium">
                No hay resultados que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resultadosFiltrados.map((lugar) => (
                  <div key={lugar.id} className={`rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border flex flex-col overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                    
                    <div className="relative h-44 w-full">
                      <img src={lugar.img} alt={lugar.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                      
                      <div className={`absolute top-3 left-3 ${lugar.iconBg} text-white p-2 rounded-full backdrop-blur-sm shadow-md`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          {lugar.icon}
                        </svg>
                      </div>
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
          </div>

          <footer className="text-center text-sm text-gray-500 pt-10 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}