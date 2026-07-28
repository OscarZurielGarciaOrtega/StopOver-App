import React from 'react';

export default function DetailModal({ isOpen, onClose, rutaId }) {
  if (!isOpen) return null;

  // 🛑 MOCK DATA: Esto simula el JSON que Emma te regresará en el endpoint GET /api/rutas/{id}
  const mockRuta = {
    idRuta: rutaId || "ST-905",
    origen: "Oaxaca de Juárez",
    destino: "San Francisco Lachigoló",
    duracion: "19 m",
    estatus: "En Tránsito",
    // ¡Aquí está la magia! El arreglo de paradas
    paradas: [
      { id: 1, nombre: "Gasolinera G500", categoria: "Servicios", icono: "⛽" },
      { id: 2, nombre: "Café de Olla Tule", categoria: "Cafeterías", icono: "☕" },
      { id: 3, nombre: "Mirador Valle", categoria: "Miradores", icono: "📸" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Detalle de Ruta: {mockRuta.idRuta}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Origen → Destino:</p>
              <p className="text-sm text-gray-600">{mockRuta.origen} → {mockRuta.destino}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">⏱️</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Duración estimada:</p>
              <p className="text-sm text-gray-600">{mockRuta.duracion}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">🟢</span>
            <div>
              <p className="text-sm font-bold text-gray-900">Estatus:</p>
              <p className="text-sm text-[#4F7959] font-semibold">{mockRuta.estatus}</p>
            </div>
          </div>

          {/* SECCIÓN DINÁMICA DE PARADAS */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>🗺️</span> Escalas y Paradas Programadas:
            </p>
            
            {mockRuta.paradas.length > 0 ? (
              <ul className="space-y-3 pl-8 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-gray-200">
                {mockRuta.paradas.map((parada, index) => (
                  <li key={parada.id} className="relative">
                    {/* El puntito de la línea de tiempo */}
                    <span className="absolute -left-[27px] top-1 w-3 h-3 bg-white border-2 border-[#4F7959] rounded-full"></span>
                    <div className="bg-[#FAFAF8] border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <span className="text-lg">{parada.icono}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{parada.nombre}</p>
                        <p className="text-xs text-gray-500 font-medium">{parada.categoria}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic pl-8">Directo (Sin escalas)</p>
            )}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-6 bg-[#FAFAF8] border-t border-gray-100 flex gap-3">
          <button 
            className="w-1/3 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Cancelar Viaje
          </button>
          <button 
            onClick={onClose}
            className="w-2/3 bg-[#2A4532] hover:bg-[#1f3325] text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}