import React from 'react';
import Sidebar from '../components/Sidebar';

export default function MiNegocio() {
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
          <span className="bg-[#CBE3C7] text-[#2A4532] px-3 py-1 rounded-full text-xs font-bold mr-2">PROPIETARIO</span>
          <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&q=80" alt="Perfil Negocio" className="w-10 h-10 rounded-full border-2 border-[#4F7959] object-cover" />
          <span className="text-sm font-semibold text-gray-700">Café de Nadie</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        
        <Sidebar />

        <main className="flex-1 p-10 bg-white flex flex-col">
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-[28px] font-bold text-gray-800">Mi Negocio</h2>
              <p className="text-[15px] text-gray-400 font-medium mt-1">Administra la información de tu parada para los viajeros</p>
            </div>
            <button className="bg-[#2A4532] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md">
              Guardar Cambios
            </button>
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <span className="text-sm font-medium text-gray-500">Visitas a tu perfil hoy</span>
              <div className="text-4xl font-extrabold text-[#2A4532] mt-2">124</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <span className="text-sm font-medium text-gray-500">Guardado en favoritos</span>
              <div className="text-4xl font-extrabold text-[#F97316] mt-2">89</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
              <span className="text-sm font-medium text-gray-500">Valoración general</span>
              <div className="text-4xl font-extrabold text-[#Eab308] mt-2 flex items-baseline gap-2">
                4.8 <span className="text-lg text-gray-400 font-medium">/ 5</span>
              </div>
            </div>
          </div>

         
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-4xl">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Información del Establecimiento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nombre del lugar</label>
                <input 
                  type="text" 
                  defaultValue="Café de Nadie" 
                  className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] focus:ring-1 focus:ring-[#4F7959] transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Categoría</label>
                <select className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] focus:ring-1 focus:ring-[#4F7959] transition-all">
                  <option>Cafetería</option>
                  <option>Restaurante</option>
                  <option>Mirador</option>
                  <option>Pueblo Mágico</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Ubicación (Coordenadas/Dirección)</label>
                <input 
                  type="text" 
                  defaultValue="Oaxaca Centro, a 20 min de la carretera principal" 
                  className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] focus:ring-1 focus:ring-[#4F7959] transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Estatus de visibilidad</label>
                <select className="w-full bg-green-50 border border-green-200 text-green-700 font-semibold rounded-xl py-3 px-4 focus:outline-none focus:border-green-500 transition-all">
                  <option>🟢 Activo y visible</option>
                  <option>🔴 Cerrado temporalmente</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Descripción para los viajeros</label>
              <textarea 
                rows="3" 
                defaultValue="El mejor café de especialidad para recargar energía antes de llegar a la ciudad. Contamos con internet de alta velocidad y estacionamiento seguro." 
                className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] focus:ring-1 focus:ring-[#4F7959] transition-all"
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Fotografía principal</label>
              <div className="border-2 border-dashed border-gray-300 bg-[#FAF9F6] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#4F7959] transition-colors">
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