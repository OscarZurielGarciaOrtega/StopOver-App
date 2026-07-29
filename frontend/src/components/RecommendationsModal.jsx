import React from 'react';

export default function RecommendationsModal({ isOpen, onClose, categoria, destinoRuta, onAgregar }) {
  if (!isOpen) return null;

  // 🧠 BANCO DE PARADAS INTELIGENTE (Etiquetado por zona/destino clave)
  const bancoDeParadas = {
    Cafeterías: [
      { id: 101, nombre: "Café de Olla El Tule", ubicacion: "Carretera a Mitla, Km 12", rating: "4.8 ⭐", icono: "☕", zona: ["Tule", "Mitla", "Oaxaca"] },
      { id: 102, nombre: "Cafetería Centro Tehuacán", ubicacion: "Tehuacán, Puebla", rating: "4.6 ⭐", icono: "🥐", zona: ["Puebla", "Tehuacán"] },
      { id: 103, nombre: "Espresso del Valle", ubicacion: "Tlacolula, Oaxaca", rating: "4.9 ⭐", icono: "☕", zona: ["Tlacolula", "Oaxaca", "Lachigoló"] },
      { id: 104, nombre: "Café de la Brisa", ubicacion: "Puerto Escondido, Oax.", rating: "4.9 ⭐", icono: "🌊", zona: ["Puerto Escondido", "Sola de Vega", "Costa"] },
    ],
    Miradores: [
      { id: 201, nombre: "Mirador Panorámico Nochixtlán", ubicacion: "Autopista Oaxaca-Puebla", rating: "4.9 ⭐", icono: "📸", zona: ["Nochixtlán", "Puebla", "CDMX", "Oaxaca"] },
      { id: 202, nombre: "Vista del Cerro del Fortín", ubicacion: "Oaxaca de Juárez", rating: "4.7 ⭐", icono: "🌄", zona: ["Oaxaca"] },
      { id: 203, nombre: "Mirador de la Boquilla", ubicacion: "Puerto Escondido, Oax.", rating: "4.9 ⭐", icono: "🔭", zona: ["Puerto Escondido", "Costa"] },
    ],
    "Pueblos mágicos": [
      { id: 301, nombre: "Pueblo Mágico Sola de Vega", ubicacion: "Ruta a Costa", rating: "4.8 ⭐", icono: "✨", zona: ["Puerto Escondido", "Sola de Vega"] },
      { id: 302, nombre: "Capulálpam de Méndez", ubicacion: "Sierra Norte", rating: "5.0 ⭐", icono: "🏔️", zona: ["Oaxaca", "Sierra Norte", "Puebla"] },
    ]
  };

  // 🔍 ALGORITMO DE FILTRADO INTELIGENTE
  const listaCategoria = bancoDeParadas[categoria] || [];
  
  const recomendaciones = listaCategoria.filter(item => {
    if (!destinoRuta) return true; // Si no hay destino, muestra todo por defecto
    // Compara si alguna de las zonas clave coincide con el destino de la ruta actual
    return item.zona.some(z => destinoRuta.toLowerCase().includes(z.toLowerCase()));
  });

  // 🛡️ PLAN B (Fallback): Si el filtro estricto no encuentra nada exacto para un destino lejano, 
  // mostramos las opciones generales de esa categoría para que el usuario nunca se quede con el modal vacío.
  const resultadoFinal = recomendaciones.length > 0 ? recomendaciones : listaCategoria;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Cabecera */}
        <div className="bg-[#2A4532] text-white p-6 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#CBE3C7] font-bold">Recomendador Inteligente 🧠</span>
            <h3 className="text-xl font-bold">{categoria} recomendadas</h3>
            <p className="text-xs text-gray-200 mt-0.5">
              {destinoRuta ? `Optimizadas para tu trayecto a ${destinoRuta}` : "Sugerencias generales para tu viaje"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        {/* Lista de Recomendaciones */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {resultadoFinal.map((item) => (
            <div 
              key={item.id}
              className="bg-[#FAF9F6] border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-[#2A4532]/40 transition-all shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-white rounded-xl shadow-xs">{item.icono}</span>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{item.nombre}</h4>
                  <p className="text-xs text-gray-500">{item.ubicacion}</p>
                  <span className="text-xs font-semibold text-[#F97316]">{item.rating}</span>
                </div>
              </div>
              
              <button 
                onClick={() => onAgregar(item)}
                className="bg-[#4F7959] hover:bg-[#2A4532] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                + Agregar
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Cerrar sugerencias
          </button>
        </div>

      </div>
    </div>
  );
}