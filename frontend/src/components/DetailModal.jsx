import React, { useState } from 'react';
import ParadaMapModal from './ParadaMapModal';
import api from '../api/axios';

export default function DetailModal({ isOpen, onClose, rutaInfo, onCancelar }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  const [paradaNavegacion, setParadaNavegacion] = useState(null);

  if (!isOpen || !rutaInfo) return null;

  let paradas = [];
  if (rutaInfo.escala && !rutaInfo.escala.includes('Directo')) {
    paradas = rutaInfo.escala.split(',').map(p => p.trim());
  }

  // MAGIA REAL: Actualiza el estatus utilizando el PUT /api/rutas/{id} de Emma
  const cambiarEstatus = async (nuevoEstatus) => {
    try {
      await api.put(`/rutas/${rutaInfo.idReal}`, {
        nombre: `Viaje a ${rutaInfo.destino}`,
        origen: rutaInfo.origen,
        destino: rutaInfo.destino,
        fechaSalida: rutaInfo.duracion,
        estatus: nuevoEstatus, // Mandamos el nuevo estatus actualizado
        paradaIds: [] 
      });
      
      alert(`¡Estatus actualizado a: ${nuevoEstatus}! 🚀`);
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      console.error("Error al actualizar estatus:", error);
      alert("El servidor rechazó la actualización del estatus.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
        <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
          
          <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700 bg-[#1E3324]/30' : 'border-gray-100'}`}>
            <h3 className="text-xl font-bold">Detalle de Ruta: {rutaInfo.id}</h3>
            <button onClick={onClose} className={`text-xl font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>✕</button>
          </div>

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
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Fecha de Salida:</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rutaInfo.duracion}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 text-green-500 text-xl">🟢</div>
              <div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Estatus:</h4>
                <p className={`text-sm font-semibold ${
                  rutaInfo.estatus === 'Cancelado' ? 'text-red-500' : 
                  rutaInfo.estatus === 'En Tránsito' ? 'text-blue-500' :
                  rutaInfo.estatus === 'Completado' ? 'text-emerald-500' :
                  'text-purple-600'
                }`}>
                  {rutaInfo.estatus}
                </p>
              </div>
            </div>

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
            <div>
              {rutaInfo.estatus !== 'Completado' && rutaInfo.estatus !== 'Cancelado' && (
                <button 
                  onClick={onCancelar}
                  className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors cursor-pointer"
                >
                  Cancelar Viaje
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {rutaInfo.estatus === 'Programado' && (
                <button 
                  onClick={() => cambiarEstatus('En Tránsito')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>▶️</span> Iniciar
                </button>
              )}

              {rutaInfo.estatus === 'En Tránsito' && (
                <button 
                  onClick={() => cambiarEstatus('Completado')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🏁</span> Completar
                </button>
              )}

              <button 
                onClick={onClose}
                className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
              >
                Cerrar
              </button>
            </div>

          </div>

        </div>
      </div>

      <ParadaMapModal 
        isOpen={!!paradaNavegacion} 
        onClose={() => setParadaNavegacion(null)} 
        paradaNombre={paradaNavegacion}
      />
    </>
  );
}