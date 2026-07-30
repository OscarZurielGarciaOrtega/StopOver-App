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
    if (routeCoords.length > 0) {
      map.fitBounds(L.latLngBounds(routeCoords), { padding: [40, 40] });
    } else if (origen && destino) {
      map.fitBounds(L.latLngBounds([origen, destino]), { padding: [40, 40] });
    }
  }, [map, routeCoords, origen, destino]);
  return null;
}

export default function DestinoMapModal({ isOpen, onClose, destinoNombre }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  
  const [origenCoords, setOrigenCoords] = useState(null); 
  const [destinoCoords, setDestinoCoords] = useState(null); 
  const [routeCoords, setRouteCoords] = useState([]);
  const [distancia, setDistancia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (isOpen && destinoNombre) {
      setCargando(true);
      
      // 1. Obtener coordenadas del destino final usando la API de Open-Meteo Geocoding
      const buscarCoordenadasDestino = async () => {
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destinoNombre)}&count=1&language=es&format=json`);
          const data = await res.json();
          
          let coordsDest = [17.0654, -96.7236]; // Default Oaxaca por seguridad
          if (data && data.results && data.results.length > 0) {
            coordsDest = [data.results[0].latitude, data.results[0].longitude];
          }
          setDestinoCoords(coordsDest);

          // 2. Pedir GPS en tiempo real del usuario
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const userLocation = [pos.coords.latitude, pos.coords.longitude];
                setOrigenCoords(userLocation);
                calcularRuta(userLocation, coordsDest);
              },
              (err) => {
                console.warn("GPS denegado, usando ubicación por defecto.", err);
                const defaultLocation = [17.0654, -96.7236]; 
                setOrigenCoords(defaultLocation);
                calcularRuta(defaultLocation, coordsDest);
              },
              { enableHighAccuracy: true }
            );
          } else {
            const defaultLocation = [17.0654, -96.7236];
            setOrigenCoords(defaultLocation);
            calcularRuta(defaultLocation, coordsDest);
          }

        } catch (error) {
          console.error("Error al buscar coordenadas del destino:", error);
          setCargando(false);
        }
      };

      buscarCoordenadasDestino();
    }
  }, [isOpen, destinoNombre]);

  const calcularRuta = async (origen, destino) => {
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
      console.error("Error obteniendo ruta", err);
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
            <h3 className="text-lg font-bold">Navegación en vivo hacia el Destino</h3>
            <p className="text-xs text-gray-300">Ruta en tiempo real desde tu posición actual</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          
          <div className={`flex justify-between items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏁</span>
              <div>
                <h4 className="font-bold text-sm">Destino: {destinoNombre}</h4>
                {cargando ? (
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Calculando ruta en vivo...</p>
                ) : (
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-[#4F7959]'}`}>
                    A {duracion} ({distancia}) de tu ubicación actual.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="relative w-full h-80 rounded-2xl overflow-hidden border shadow-inner z-10">
            {cargando ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-20">
                <span className="animate-pulse font-bold text-gray-500">Obteniendo señal GPS y calculando ruta...</span>
              </div>
            ) : (
              <MapContainer 
                center={origenCoords || [17.0654, -96.7236]} 
                zoom={13} 
                style={{ width: '100%', height: '100%' }}
              >
                <MapBounds routeCoords={routeCoords} origen={origenCoords} destino={destinoCoords} />
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {origenCoords && (
                  <Marker position={origenCoords}>
                    <Popup>📍 Tu ubicación actual (GPS)</Popup>
                  </Marker>
                )}

                {destinoCoords && (
                  <Marker position={destinoCoords}>
                    <Popup>🏁 Destino Final: {destinoNombre}</Popup>
                  </Marker>
                )}

                {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} color="#10B981" weight={5} />
                )}
              </MapContainer>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button 
              onClick={onClose}
              className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              Cerrar Mapa
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}