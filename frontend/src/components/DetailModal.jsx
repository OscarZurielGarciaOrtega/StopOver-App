import React from 'react';

export default function DetailModal({ isOpen, onClose, route }) {
  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{route.id}</span>
            <h3 className="text-xl font-bold text-gray-900">{route.origen} ➔ {route.destino}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Contenido de Detalles */}
        <div className="space-y-4 mb-6">
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Escala / Parada</p>
              <p className="text-sm font-bold text-gray-800">{route.escala}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Duración estimada</p>
              <p className="text-sm font-bold text-gray-800">{route.duracion}</p>
            </div>
          </div>

          {/* Simulación visual de mapa estático (Te ahorra programar librerías pesadas) */}
          <div className="w-full h-36 bg-[#E8EFE9] rounded-2xl border border-[#CBE3C7] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2A4532_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <svg className="w-10 h-10 text-[#4F7959] mb-1 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xs font-bold text-[#2A4532] z-10">Vista de ruta simulada (StopOver Map)</span>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <span className="font-bold text-gray-700">Nota del viaje: </span>
            Se recomienda salir con tanque lleno y revisar niveles de aceite antes de tomar la desviación hacia la escala principal.
          </div>
        </div>

        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
        >
          Cerrar detalles
        </button>

      </div>
    </div>
  );
}