import React, { useState, useEffect } from 'react';
import ParadaMapModal from './ParadaMapModal';

export default function DetailModal({ isOpen, onClose, rutaId, onCancelar }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  const [rutaInfo, setRutaInfo] = useState(null);
  
  // Estado para saber qué parada seleccionó el usuario para ver el GPS
  const [paradaNavegacion, setParadaNavegacion] = useState(null);

  useEffect(() => {
    if (isOpen && rutaId) {
      const guardadas = localStorage.getItem('stopover_rutas_reales');
      if (guardadas) {
        const rutasArray = JSON.parse(guardadas);
        const encontrada = rutasArray.find(r => r.id === rutaId);
        setRutaInfo(encontrada);
      }
    }
  }, [isOpen, rutaId]);

  if (!isOpen || !rutaInfo) return null;

  let paradas = [];
  if (rutaInfo.escala && !rutaInfo.escala.includes('Directo')) {
    paradas = rutaInfo.escala.split(',').map(p => p.trim());
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
        <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
          
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700 bg-[#1E3324]/30' : 'border-gray-100'}`}>
            <h3 className="text-xl font-bold">Detalle de Ruta: {rutaInfo.id}</h3>
            <button onClick={onClose} className={`text-xl font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>✕</button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            
            <div className="flex gap-4">
              <div className="mt-1 text-red-500 text-xl">📍</div>
              <div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Origen → Destino:</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rutaInfo.origen} → {rutaInfo.destino}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-purple-500 text-xl">⏱️</div>
              <div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Duración estimada:</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rutaInfo.duracion}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-green-500 text-xl">🟢</div>
              <div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Estatus:</h4>
                <p className={`text-sm font-semibold ${rutaInfo.estatus === 'Cancelado' ? 'text-red-500' : 'text-[#4F7959]'}`}>{rutaInfo.estatus}</p>
              </div>
            </div>

            {/* Escalas y Paradas */}
            <div>
              <div className="flex gap-2 items-center mb-4">
                <span className="text-blue-500 text-xl">🗺️</span>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Escalas y Paradas Programadas:</h4>
              </div>

              <div className="ml-2 border-l-2 border-dashed border-gray-300 pl-6 space-y-4 relative">
                {paradas.length === 0 ? (
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Viaje directo, sin paradas registradas.</p>
                  </div>
                ) : (
                  paradas.map((parada, index) => (
                    <div 
                      key={index} 
                      className="relative cursor-pointer group"
                      onClick={() => setParadaNavegacion(parada)}
                    >
                      {/* Puntito en la línea del tiempo (ahora cambia de color al pasar el mouse) */}
                      <div className={`absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-colors ${isDarkMode ? 'bg-gray-800 border-emerald-500 group-hover:bg-emerald-500' : 'bg-white border-[#4F7959] group-hover:bg-[#4F7959]'}`}></div>
                      
                      <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-emerald-500/50' : 'bg-[#FAF9F6] border-gray-100 hover:border-[#4F7959]/50 hover:shadow-md'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">☕</span>
                            <div>
                              <h5 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{parada}</h5>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clic para ver cómo llegar</p>
                            </div>
                          </div>
                          <span className={`text-xl transition-transform group-hover:translate-x-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}>›</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className={`p-6 border-t flex justify-between items-center ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
            <button 
              onClick={onCancelar}
              className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors cursor-pointer"
            >
              Cancelar Viaje
            </button>
            <button 
              onClick={onClose}
              className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>

      {/* AQUÍ INVOCAMOS EL NUEVO MODAL DE MAPA */}
      <ParadaMapModal 
        isOpen={!!paradaNavegacion} 
        onClose={() => setParadaNavegacion(null)} 
        paradaNombre={paradaNavegacion}
      />
    </>
  );
}