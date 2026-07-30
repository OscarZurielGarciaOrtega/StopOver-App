import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapBounds({ routeCoords, origen, destino }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      map.fitBounds(L.latLngBounds(routeCoords), { padding: [50, 50] });
    } else if (origen && destino) {
      map.fitBounds(L.latLngBounds([origen, destino]), { padding: [50, 50] });
    }
  }, [map, routeCoords, origen, destino]);
  return null;
}

export default function ParadaMapModal({ isOpen, onClose, paradaNombre, paradaLat, paradaLng }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  
  const [origenCoords, setOrigenCoords] = useState(null);
  const [destinoCoords, setDestinoCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distancia, setDistancia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setCargando(true);

    const inicializarMapaEstrictoOaxaca = async () => {
      let latFinal = parseFloat(paradaLat);
      let lngFinal = parseFloat(paradaLng);

      // Si las coordenadas son inválidas o vienen nulas, hacemos una búsqueda ultra estricta amarrada a Oaxaca, México
      if (!latFinal || !lngFinal || isNaN(latFinal) || isNaN(lngFinal)) {
        try {
          const queryEstricta = `${paradaNombre}, Oaxaca, Mexico`;
          const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryEstricta)}&countrycodes=mx&limit=1`);
          const dataGeo = await resGeo.json();
          
          if (Array.isArray(dataGeo) && dataGeo.length > 0) {
            latFinal = parseFloat(dataGeo[0].lat);
            lngFinal = parseFloat(dataGeo[0].lon);
          } else {
            // Coordenada por defecto en el centro de Oaxaca si de plano no existe
            latFinal = 17.0654;
            lngFinal = -96.7236;
          }
        } catch (e) {
          console.error("Error en geocodificación estricta:", e);
          latFinal = 17.0654;
          lngFinal = -96.7236;
        }
      }

      const destinoReal = [latFinal, lngFinal];
      setDestinoCoords(destinoReal);

      // Obtener GPS del usuario en tiempo real
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLocation = [pos.coords.latitude, pos.coords.longitude];
            setOrigenCoords(userLocation);
            calcularRutaOSRM(userLocation, destinoReal);
          },
          (err) => {
            console.warn("GPS denegado, usando Oaxaca centro.", err);
            const fallback = [17.0654, -96.7236];
            setOrigenCoords(fallback);
            calcularRutaOSRM(fallback, destinoReal);
          },
          { enableHighAccuracy: true }
        );

        const watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const liveLocation = [pos.coords.latitude, pos.coords.longitude];
            setOrigenCoords(liveLocation);
          },
          (err) => console.error("Error watchPosition:", err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
      } else {
        const fallback = [17.0654, -96.7236];
        setOrigenCoords(fallback);
        calcularRutaOSRM(fallback, destinoReal);
      }
    };

    inicializarMapaEstrictoOaxaca();
  }, [isOpen, paradaNombre, paradaLat, paradaLng]);

  const calcularRutaOSRM = async (origen, destino) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteCoords(route.geometry.coordinates.map(c => [c[1], c[0]]));
        setDistancia((route.distance / 1000).toFixed(1) + ' km');
        
        const horas = Math.floor(route.duration / 3600);
        const minutos = Math.round((route.duration % 3600) / 60);
        setDuracion(`${horas > 0 ? horas + ' h ' : ''}${minutos} m`);
      }
    } catch (err) {
      console.error("Error OSRM:", err);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans">
      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
        
        <div className={`px-6 py-4 flex justify-between items-center ${isDarkMode ? 'bg-[#1E3324] border-b border-gray-700 text-white' : 'bg-[#2A4532] text-white'}`}>
          <div>
            <h3 className="text-lg font-bold">Navegación en Vivo hacia Parada 🛰️</h3>
            <p className="text-xs text-gray-200">Ubicación real en Oaxaca y GPS activo</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          
          <div className={`flex justify-between items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h4 className="font-bold text-sm">{paradaNombre}</h4>
                {cargando ? (
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Verificando coordenadas en Oaxaca...</p>
                ) : (
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-[#4F7959]'}`}>
                    A {duracion} ({distancia}) de tu ubicación.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="relative w-full h-80 rounded-2xl overflow-hidden border shadow-inner z-10">
            {cargando ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/60 dark:bg-gray-900/60 z-20">
                <span className="animate-pulse font-bold text-emerald-600 dark:text-emerald-400">🗺️ Localizando punto exacto en Oaxaca...</span>
              </div>
            ) : (
              <MapContainer 
                center={destinoCoords || [17.0654, -96.7236]} 
                zoom={14} 
                style={{ width: '100%', height: '100%' }}
              >
                <MapBounds routeCoords={routeCoords} origen={origenCoords} destino={destinoCoords} />
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {origenCoords && (
                  <Marker position={origenCoords}>
                    <Popup>📍 Tu ubicación actual</Popup>
                  </Marker>
                )}

                {destinoCoords && (
                  <Marker position={destinoCoords}>
                    <Popup>🎯 {paradaNombre} (Oaxaca)</Popup>
                  </Marker>
                )}

                {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} color="#3B82F6" weight={5} />
                )}
              </MapContainer>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button 
              onClick={onClose}
              className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}