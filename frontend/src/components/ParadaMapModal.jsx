import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Arreglo para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para ajustar el mapa para que se vean ambos puntos
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

export default function ParadaMapModal({ isOpen, onClose, paradaNombre }) {
  const [isDarkMode] = useState(() => localStorage.getItem('stopover_dark_mode') === 'true');
  
  const [origenCoords, setOrigenCoords] = useState(null); // Ubicación real del usuario
  const [destinoCoords, setDestinoCoords] = useState(null); // Ubicación de la parada
  const [routeCoords, setRouteCoords] = useState([]);
  const [distancia, setDistancia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cargando, setCargando] = useState(true);

  // Diccionario de paradas para la presentación (coordenadas exactas para que no falle)
  const coordenadasParadas = {
    "Cafetería Centro Tehuacán": [18.4628, -97.3928],
    "Café de la Brisa": [15.8596, -97.0722], // Pto Escondido
    "Mirador Nochixtlán": [17.4566, -97.2255],
    "Pueblo Mágico Sola de Vega": [16.5090, -96.9790],
    "Café de Olla Tule": [17.0465, -96.6358],
    "Mirador Valle": [17.0200, -96.6000],
    "Gasolinera G500": [17.0700, -96.7200],
  };

  useEffect(() => {
    if (isOpen && paradaNombre) {
      setCargando(true);
      
      // 1. Obtener coordenadas de la parada (si no existe en el dic, usa una genérica cerca de Oaxaca)
      const coordsParada = coordenadasParadas[paradaNombre] || [17.0654, -96.7236];
      setDestinoCoords(coordsParada);

      // 2. Pedir GPS del usuario
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLocation = [pos.coords.latitude, pos.coords.longitude];
            setOrigenCoords(userLocation);
            calcularRuta(userLocation, coordsParada);
          },
          (err) => {
            console.warn("GPS denegado o falló, usando ubicación por defecto.", err);
            const defaultLocation = [17.0500, -96.7000]; // Zócalo Oaxaca
            setOrigenCoords(defaultLocation);
            calcularRuta(defaultLocation, coordsParada);
          }
        );
      } else {
        const defaultLocation = [17.0500, -96.7000];
        setOrigenCoords(defaultLocation);
        calcularRuta(defaultLocation, coordsParada);
      }
    }
  }, [isOpen, paradaNombre]);

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
            <h3 className="text-lg font-bold">Navegación hacia parada</h3>
            <p className="text-xs text-gray-300">Ruta desde tu ubicación actual</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          
          {/* Tarjeta de info */}
          <div className={`flex justify-between items-center p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h4 className="font-bold text-sm">{paradaNombre}</h4>
                {cargando ? (
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Calculando ruta y tráfico...</p>
                ) : (
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-[#4F7959]'}`}>
                    A {duracion} ({distancia}) de ti.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative w-full h-80 rounded-2xl overflow-hidden border shadow-inner z-10">
            {cargando ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 z-20">
                <span className="animate-pulse font-bold text-gray-500">Obteniendo señal GPS...</span>
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
                
                {/* Tu ubicación */}
                {origenCoords && (
                  <Marker position={origenCoords}>
                    <Popup>📍 Tu ubicación actual</Popup>
                  </Marker>
                )}

                {/* Destino de la parada */}
                {destinoCoords && (
                  <Marker position={destinoCoords}>
                    <Popup>🎯 {paradaNombre}</Popup>
                  </Marker>
                )}

                {/* Trazado de ruta */}
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