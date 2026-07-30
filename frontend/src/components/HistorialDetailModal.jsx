import React, { useState, useEffect } from 'react';

export default function HistorialDetailModal({ isOpen, onClose, rutaInfo }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');

  // Estados para el sistema de reseñas y estrellas
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEnviado(false);
      setComentario('');
      setEstrellas(5);
    }
  }, [isOpen, rutaInfo]);

  if (!isOpen || !rutaInfo) return null;

  // 🧮 Lógica para separar las paradas visitadas
  let paradas = [];
  if (rutaInfo.escala && !rutaInfo.escala.includes('Directo') && !rutaInfo.escala.includes('Por definir')) {
    paradas = rutaInfo.escala.split(',').map(p => p.trim());
  }

  // Guardar la reseña enviada por el viajero
  const handleSubmitReseña = (e) => {
    e.preventDefault();
    const reseñasGuardadas = JSON.parse(localStorage.getItem('stopover_reseñas_negocio') || '[]');
    const nuevaReseña = {
      id: Date.now(),
      rutaId: rutaInfo.id,
      parada: paradas.length > 0 ? paradas[0] : rutaInfo.destino,
      estrellas,
      comentario,
      fecha: new Date().toLocaleDateString()
    };
    localStorage.setItem('stopover_reseñas_negocio', JSON.stringify([nuevaReseña, ...reseñasGuardadas]));
    setEnviado(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
      <div className={`w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-6 border-b shrink-0 ${isDarkMode ? 'border-gray-700 bg-[#1E3324]/30' : 'bg-gray-50 border-gray-100'}`}>
          <div>
            <span className="text-xs font-bold text-[#4F7959] uppercase tracking-wider">Bitácora de viaje</span>
            <h3 className="text-xl font-bold">Resumen: {rutaInfo.id}</h3>
          </div>
          <button onClick={onClose} className={`text-xl font-bold cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Recorrido */}
          <div className="flex gap-4">
            <div className="mt-1 text-red-500 text-xl">📍</div>
            <div>
              <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Recorrido realizado:</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rutaInfo.origen} → {rutaInfo.destino}</p>
            </div>
          </div>

          {/* Fecha / Duración */}
          <div className="flex gap-4">
            <div className="mt-1 text-purple-500 text-xl">⏱️</div>
            <div>
              <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Fecha de salida:</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rutaInfo.duracion}</p>
            </div>
          </div>

          {/* Estatus Final */}
          <div className="flex gap-4">
            <div className="mt-1 text-green-500 text-xl">📋</div>
            <div>
              <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Estado final:</h4>
              <p className={`text-sm font-semibold ${rutaInfo.estatus === 'Cancelado' || rutaInfo.estatus === 'Retrasado' ? 'text-red-500' : 'text-[#4F7959]'}`}>{rutaInfo.estatus}</p>
            </div>
          </div>

          {/* Lugares visitados */}
          <div>
            <div className="flex gap-2 items-center mb-4">
              <span className="text-blue-500 text-xl">📸</span>
              <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Lugares que visitaste:</h4>
            </div>

            <div className="ml-2 border-l-2 border-dashed border-gray-300 pl-6 space-y-4 relative">
              {paradas.length === 0 ? (
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fue un viaje directo, sin paradas registradas.</p>
                </div>
              ) : (
                paradas.map((parada, index) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-[33px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${isDarkMode ? 'bg-gray-800 border-blue-500' : 'bg-white border-blue-400'}`}></div>
                    
                    <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-[#FAF9F6] border-gray-100'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <div>
                          <h5 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{parada}</h5>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Parada completada con éxito</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Valoración y Reseña */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🌟 Valora tu experiencia</h4>
            
            {enviado ? (
              <div className="text-green-600 dark:text-green-400 font-semibold text-xs py-2">
                ¡Gracias por tu reseña! El negocio la verá reflejada en su valoración general.
              </div>
            ) : (
              <form onSubmit={handleSubmitReseña} className="space-y-3">
                <div className="flex gap-1 text-lg items-center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setEstrellas(num)}
                      className={`cursor-pointer transition-colors ${num <= estrellas ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs ml-2 text-gray-500 font-semibold">({estrellas}/5)</span>
                </div>

                <textarea
                  rows="2"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="¿Qué tal estuvo el lugar o servicio? Escribe tu reseña..."
                  className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                  required
                ></textarea>

                <button
                  type="submit"
                  className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Enviar Valoración
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end items-center shrink-0 ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <button 
            onClick={onClose}
            className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md"
          >
            Cerrar resumen
          </button>
        </div>

      </div>
    </div>
  );
}