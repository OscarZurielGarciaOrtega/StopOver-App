import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function RecommendationsModal({ isOpen, onClose, categoria, destinoRuta, onAgregar }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerTipoBack = (cat) => {
    switch (cat) {
      case 'Cafeterías': return 'CAFETERIA';
      case 'Miradores': return 'MIRADOR';
      case 'Pueblos mágicos': return 'PUEBLO_MAGICO';
      default: return 'CAFETERIA';
    }
  };

  useEffect(() => {
    if (!isOpen || !categoria) return;

    const cargarParadasEnLaRuta = async () => {
      setCargando(true);
      const tipoBuscado = obtenerTipoBack(categoria);
      const destinoLimpio = destinoRuta ? destinoRuta.split(',')[0].trim() : '';

      try {
        // 1. Consultamos los negocios aprobados o paradas del servidor de Emma
        const resNegocios = await api.get('/negocios/aprobados').catch(() => ({ data: [] }));
        const listaNegocios = Array.isArray(resNegocios.data) ? resNegocios.data : [];

        let filtrados = listaNegocios.filter(n => 
          n.categoria && n.categoria.toUpperCase() === tipoBuscado
        );

        if (filtrados.length === 0) {
          const resParadas = await api.get('/paradas/recomendaciones', {
            params: { tipo: tipoBuscado, destino: destinoLimpio }
          }).catch(() => ({ data: [] }));
          
          const dataParadas = resParadas.data.content || resParadas.data;
          if (Array.isArray(dataParadas)) {
            filtrados = dataParadas;
          }
        }

        if (filtrados.length > 0) {
          const formateados = filtrados.map(item => ({
            id: item.id,
            nombre: item.nombre,
            ubicacion: item.direccion || item.ubicacion || `En ruta hacia ${destinoLimpio}`,
            rating: "4.9 ⭐",
            icono: categoria === 'Cafeterías' ? '☕' : categoria === 'Miradores' ? '📸' : '✨',
            latitud: item.latitud,
            longitud: item.longitud
          }));
          setRecomendaciones(formateados);
        } else {
          // 2. Si el back no tiene suficientes, usamos paradas reales que SÍ están en la línea del trayecto Oaxaca -> Lachigoló / Tule
          setRecomendaciones(obtenerParadasIntermediasReales(destinoLimpio, categoria));
        }

      } catch (error) {
        console.error("Error al cargar recomendaciones de la ruta:", error);
        setRecomendaciones(obtenerParadasIntermediasReales(destinoLimpio, categoria));
      } finally {
        setCargando(false);
      }
    };

    cargarParadasInLaRuta = cargarParadasEnLaRuta();
  }, [isOpen, categoria, destinoRuta]);

  // BANCO DE PARADAS INTERMEDIAS REALES (Sobre la línea exacta del trayecto, sin pasarse del destino)
  const obtenerParadasIntermediasReales = (destino, cat) => {
    const d = destino.toLowerCase();

    // Si el viaje es hacia Lachigoló, Tule o zonas del Valle
    if (d.includes('lachigoló') || d.includes('tule') || d.includes('mitla') || d.includes('tlacolula')) {
      if (cat === 'Cafeterías') {
        return [
          { id: 501, nombre: "Café del Portal El Tule", ubicacion: "Santa María del Tule (En ruta)", rating: "4.8 ⭐", icono: "☕", latitud: 17.0465, longitud: -96.6358 },
          { id: 502, nombre: "Cafetería Carretera 190", ubicacion: "Tlalixtac de Cabrera", rating: "4.7 ⭐", icono: "☕", latitud: 17.0700, longitud: -96.6700 }
        ];
      } else if (cat === 'Miradores') {
        return [
          { id: 503, nombre: "Mirador de Tlalixtac", ubicacion: "Entrada a Tlalixtac de Cabrera", rating: "4.9 ⭐", icono: "📸", latitud: 17.0750, longitud: -96.6650 }
        ];
      } else {
        return [
          { id: 504, nombre: "Punto Turístico El Tule", ubicacion: "Centro de Santa María del Tule", rating: "5.0 ⭐", icono: "✨", latitud: 17.0450, longitud: -96.6340 }
        ];
      }
    }

    // Respaldo general sobre la zona metropolitana de Oaxaca
    return cat === 'Cafeterías' ? [
      { id: 601, nombre: "Café Brújula Centro", ubicacion: "Macedonio Alcalá, Oaxaca", rating: "4.9 ⭐", icono: "☕", latitud: 17.0625, longitud: -96.7214 }
    ] : [
      { id: 602, nombre: "Mirador Cerro del Fortín", ubicacion: "Oaxaca de Juárez", rating: "4.9 ⭐", icono: "📸", latitud: 17.0750, longitud: -96.7320 }
    ];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
      <div className={`rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        
        {/* Cabecera */}
        <div className={`p-6 flex justify-between items-center ${isDarkMode ? 'bg-[#1E3324] border-b border-gray-700 text-white' : 'bg-[#2A4532] text-white'}`}>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#CBE3C7] font-bold">Optimizador de Trayecto ⚡</span>
            <h3 className="text-xl font-bold">{categoria || 'Sugerencias'} en la Ruta</h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}>
              {destinoRuta ? `Puntos intermedios hacia ${destinoRuta}` : "Sugerencias en ruta"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        {/* Lista */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {cargando ? (
            <div className={`text-center py-8 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              🗺️ Filtrando paradas sobre la línea de ruta...
            </div>
          ) : recomendaciones.length > 0 ? (
            recomendaciones.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm ${isDarkMode ? 'bg-gray-900 border-gray-700 hover:border-emerald-500/40' : 'bg-[#FAF9F6] border-gray-100 hover:border-[#2A4532]/40'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl p-2 rounded-xl shadow-xs ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>{item.icono}</span>
                  <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.nombre}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.ubicacion}</p>
                    <span className="text-xs font-semibold text-[#F97316]">{item.rating}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => onAgregar(item)}
                  className="bg-[#4F7959] hover:bg-[#2A4532] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  + Agregar
                </button>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay paradas intermedias registradas para este tramo.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <button 
            onClick={onClose}
            className={`text-xs font-bold cursor-pointer ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Cerrar sugerencias
          </button>
        </div>

      </div>
    </div>
  );
}