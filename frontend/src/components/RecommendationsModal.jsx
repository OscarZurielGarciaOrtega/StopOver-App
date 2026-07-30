import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Conexión oficial a la API

export default function RecommendationsModal({ isOpen, onClose, categoria, destinoRuta, rutaIdActiva, onAgregar }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);

  useEffect(() => {
    if (!isOpen || !categoria) return;

    const cargarNegociosOficiales = async () => {
      setCargando(true);
      let listaOficiales = [];
      let listaRespaldo = [];

      const catBuscada = categoria.toLowerCase().trim();


      try {
        const resAprobados = await api.get('/negocios/aprobados').catch(() => ({ data: [] }));
        const negociosBack = Array.isArray(resAprobados.data) ? resAprobados.data : (resAprobados.data.content || []);

        const filtrados = negociosBack.filter(n => {
          if (!n.categoria) return false;
          const catNegocio = n.categoria.toLowerCase().trim();
          if (catBuscada.includes('cafe') && (catNegocio.includes('cafe') || catNegocio.includes('cafeteria'))) return true;
          if (catBuscada.includes('mirador') && catNegocio.includes('mirador')) return true;
          if (catBuscada.includes('pueblo') && (catNegocio.includes('pueblo') || catNegocio.includes('magico'))) return true;
          return catNegocio === catBuscada;
        });

        if (filtrados.length > 0) {
          listaOficiales = filtrados.map(item => ({
            id: item.id,
            nombre: item.nombre,
            ubicacion: item.direccion || `Ubicación registrada`,
            rating: "4.9 ⭐",
            icono: categoria.toLowerCase().includes('cafe') ? '☕' : categoria.toLowerCase().includes('mirador') ? '📸' : '✨',
            latitud: item.latitud || item.lat,
            longitud: item.longitud || item.lng,
            lat: item.latitud || item.lat,
            lng: item.longitud || item.lng,
            esDeServidor: true
          }));
        }
      } catch (err) {
        console.warn("Error consultando negocios oficiales:", err);
      }

      try {
        const destinoLimpio = destinoRuta ? destinoRuta.split(',')[0].trim() : 'Oaxaca';
        const resGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destinoLimpio)}&count=1&language=es&format=json`);
        const geoData = await resGeo.json();
        
        let latBase = 17.0654;
        let lngBase = -96.7236;
        let bbox = "-97.5,16.5,-95.5,18.0";

        if (geoData && geoData.results && geoData.results.length > 0) {
          latBase = geoData.results[0].latitude;
          lngBase = geoData.results[0].longitude;
          bbox = `${lngBase - 0.2},${latBase - 0.2},${lngBase + 0.2},${latBase + 0.2}`;
        }

        let osmTag = categoria.toLowerCase().includes('cafe') ? 'cafe' : categoria.toLowerCase().includes('mirador') ? 'viewpoint' : 'attraction';
        const urlOSM = `https://nominatim.openstreetmap.org/search?format=json&amenity=${osmTag}&bounded=1&viewbox=${bbox}&countrycodes=mx&limit=4`;
        
        const resOSM = await fetch(urlOSM, { headers: { 'User-Agent': 'StopOverApp/1.0' } });
        const dataOSM = await resOSM.json();

        if (Array.isArray(dataOSM) && dataOSM.length > 0) {
          listaRespaldo = dataOSM.map((item, idx) => ({
            id: item.place_id || (5000 + idx),
            nombre: item.display_name.split(',')[0],
            ubicacion: item.display_name,
            rating: "4.8 ⭐",
            icono: categoria.toLowerCase().includes('cafe') ? '☕' : '📸',
            latitud: parseFloat(item.lat),
            longitud: parseFloat(item.lon),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            esDeServidor: false
          }));
        }
      } catch (mapErr) {
        console.error("Error en mapa OpenStreetMap:", mapErr);
      }

 
      let listaFinal = [...listaOficiales, ...listaRespaldo];


      if (listaFinal.length === 0) {
        listaFinal = [
          {
            id: 9999,
            nombre: `${categoria} de ${destinoRuta || 'Oaxaca'}`,
            ubicacion: `Punto en la ruta hacia ${destinoRuta}`,
            rating: "4.9 ⭐",
            icono: '☕',
            latitud: 17.0654,
            longitud: -96.7236,
            lat: 17.0654,
            lng: -96.7236,
            esDeServidor: false
          }
        ];
      }

      setRecomendaciones(listaFinal);
      setCargando(false);
    };

    cargarNegociosOficiales();
  }, [isOpen, categoria, destinoRuta]);


  const manejarAgregarParada = async (item) => {
    setGuardandoId(item.id);

    try {
      if (rutaIdActiva && item.esDeServidor) {
        await api.post(`/negocios/${item.id}/agregar-a-ruta/${rutaIdActiva}`);
      }

      onAgregar({
        ...item,
        latitud: item.latitud || item.lat,
        longitud: item.longitud || item.lng
      });

      onClose();
    } catch (error) {
      console.error("Error al guardar la parada:", error);
      onAgregar(item);
      onClose();
    } finally {
      setGuardandoId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
      <div className={`rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        

        <div className={`p-6 flex justify-between items-center ${isDarkMode ? 'bg-[#1E3324] border-b border-gray-700 text-white' : 'bg-[#2A4532] text-white'}`}>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#CBE3C7] font-bold">API PostgreSQL & Mapa ⚡</span>
            <h3 className="text-xl font-bold">{categoria} en {destinoRuta}</h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}>
              Lugares oficiales y puntos de ruta disponibles
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>


        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {cargando ? (
            <div className={`text-center py-8 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              🔄 Consultando base de datos y mapa...
            </div>
          ) : recomendaciones.length > 0 ? (
            recomendaciones.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm ${
                  item.esDeServidor 
                    ? (isDarkMode ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-[#CBE3C7]/30 border-[#2A4532]/40') 
                    : (isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-[#FAF9F6] border-gray-100')
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl p-2 rounded-xl shadow-xs ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>{item.icono}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.nombre}</h4>
                      {item.esDeServidor && (
                        <span className="bg-[#2A4532] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Oficial</span>
                      )}
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>{item.ubicacion}</p>
                    <span className="text-xs font-semibold text-[#F97316]">{item.rating}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => manejarAgregarParada(item)}
                  disabled={guardandoId === item.id}
                  className="bg-[#4F7959] hover:bg-[#2A4532] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-sm shrink-0 ml-2 disabled:opacity-50"
                >
                  {guardandoId === item.id ? 'Guardando...' : '+ Agregar'}
                </button>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No hay negocios disponibles en esta categoría.
            </div>
          )}
        </div>

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