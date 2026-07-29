import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function MiNegocio() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // ESTADOS DEL FORMULARIO DEL NEGOCIO (Persistentes con localStorage)
  const [nombreNegocio, setNombreNegocio] = useState(() => {
    return localStorage.getItem('stopover_negocio_nombre') || 'Café de Nadie';
  });
  const [categoria, setCategoria] = useState(() => {
    return localStorage.getItem('stopover_negocio_categoria') || 'Cafetería';
  });
  const [ubicacion, setUbicacion] = useState(() => {
    return localStorage.getItem('stopover_negocio_ubicacion') || 'Oaxaca Centro, a 20 min de la carretera principal';
  });
  const [estatusVisibilidad, setEstatusVisibilidad] = useState(() => {
    return localStorage.getItem('stopover_negocio_estatus') || '🟢 Activo y visible';
  });
  const [descripcion, setDescripcion] = useState(() => {
    return localStorage.getItem('stopover_negocio_descripcion') || 'El mejor café de especialidad para recargar energía antes de llegar a la ciudad. Contamos con internet de alta velocidad y estacionamiento seguro.';
  });

  // FUNCIÓN PARA GUARDAR CAMBIOS REALES
  const handleGuardarNegocio = () => {
    localStorage.setItem('stopover_negocio_nombre', nombreNegocio);
    localStorage.setItem('stopover_negocio_categoria', categoria);
    localStorage.setItem('stopover_negocio_ubicacion', ubicacion);
    localStorage.setItem('stopover_negocio_estatus', estatusVisibilidad);
    localStorage.setItem('stopover_negocio_descripcion', descripcion);
    
    alert('¡Información del negocio actualizada y guardada con éxito!');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      {/* Header */}
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold mr-2 ${isDarkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#CBE3C7] text-[#2A4532]'}`}>PROPIETARIO</span>
          <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&q=80" alt="Perfil Negocio" className="w-10 h-10 rounded-full border-2 border-[#4F7959] object-cover" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombreNegocio}</span>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />

        <main className={`flex-1 p-10 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mi Negocio</h2>
              <p className="text-[15px] text-gray-400 font-medium mt-1">Administra la información de tu parada para los viajeros</p>
            </div>
            <button 
              onClick={handleGuardarNegocio}
              className="bg-[#2A4532] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>

          {/* TARJETAS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Visitas a tu perfil hoy</span>
              <div className="text-4xl font-extrabold text-[#2A4532] mt-2">124</div>
            </div>
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Guardado en favoritos</span>
              <div className="text-4xl font-extrabold text-[#F97316] mt-2">89</div>
            </div>
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Valoración general</span>
              <div className="text-4xl font-extrabold text-[#Eab308] mt-2 flex items-baseline gap-2">
                4.8 <span className="text-lg text-gray-400 font-medium">/ 5</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border w-full max-w-4xl transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 border-b pb-4 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-100'}`}>Información del Establecimiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nombre del lugar</label>
                <input 
                  type="text" 
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
                >
                  <option>Cafetería</option>
                  <option>Restaurante</option>
                  <option>Mirador</option>
                  <option>Pueblo Mágico</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ubicación (Coordenadas/Dirección)</label>
                <input 
                  type="text" 
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estatus de visibilidad</label>
                <select 
                  value={estatusVisibilidad}
                  onChange={(e) => setEstatusVisibilidad(e.target.value)}
                  className={`w-full border font-semibold rounded-xl py-3 px-4 focus:outline-none transition-all cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-emerald-400' : 'bg-green-50 border-green-200 text-green-700'}`}
                >
                  <option>🟢 Activo y visible</option>
                  <option>🔴 Cerrado temporalmente</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Descripción para los viajeros</label>
              <textarea 
                rows="3" 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
              ></textarea>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fotografía principal</label>
              <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDarkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-500' : 'border-gray-300 bg-[#FAF9F6] hover:bg-gray-50 hover:border-[#4F7959]'}`}>
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="text-[#4F7959] font-bold">Subir nueva imagen</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
              </div>
            </div>
          </div>

          <footer className="text-center text-sm text-gray-500 pt-10 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}