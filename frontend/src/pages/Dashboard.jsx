import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DetailModal from '../components/DetailModal';
import RecommendationsModal from '../components/RecommendationsModal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Dashboard() {
  // PERSISTENCIA REAL: Carga las rutas del navegador o usa las por defecto
  const [rutas, setRutas] = useState(() => {
    const guardadas = localStorage.getItem('stopover_rutas_reales');
    if (guardadas) {
      try {
        return JSON.parse(guardadas);
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }
    return [
      { id: '#ST-901', origen: 'Oaxaca', destino: 'Puebla', escala: 'Cafetería Centro Tehuacán', duracion: '4 h 15 m', estatus: 'En Tránsito' },
      { id: '#ST-902', origen: 'Oaxaca', destino: 'CDMX', escala: 'Mirador Nochixtlán', duracion: '6 h 30 m', estatus: 'Completado' },
      { id: '#ST-903', origen: 'Puebla', destino: 'CDMX', escala: 'Directo (Sin escala)', duracion: '2 h 00 m', estatus: 'Completado' },
      { id: '#ST-904', origen: 'Oaxaca', destino: 'Pto. Escondido', escala: 'Pueblo Mágico Sola de Vega', duracion: '3 h 45 m', estatus: 'Retrasado' },
    ];
  });

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [origenTexto, setOrigenTexto] = useState('Oaxaca de Juárez, México');
  const [origenCoords, setOrigenCoords] = useState([17.0654, -96.7236]);
  
  const [destinoTexto, setDestinoTexto] = useState('');
  const [destinoCoords, setDestinoCoords] = useState(null);

  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);

  const [routeCoords, setRouteCoords] = useState([]);
  const [distanciaKm, setDistanciaKm] = useState(null);
  const [duracionTexto, setDuracionTexto] = useState(null);

  // Estados para el modal de Ver Detalle
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  const abrirRecomendaciones = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsRecModalOpen(true);
  };

  // 👇 LA FUNCIÓN AHORA SÍ ESTÁ EN EL LUGAR CORRECTO 👇
  const agregarParadaARuta = (paradaSeleccionada) => {
    const rutasActualizadas = [...rutas]; // Clonamos tu arreglo de rutas
    
    if (rutasActualizadas.length > 0) {
      const rutaActiva = rutasActualizadas[0]; // Tomamos la ruta más reciente (la de hasta arriba)
      
      // Lógica: Si la escala dice "km por carretera" o "Directo", la sobreescribimos. Si ya tiene una parada, se la sumamos con una coma.
      if (rutaActiva.escala.includes('km') || rutaActiva.escala.includes('Directo')) {
        rutaActiva.escala = paradaSeleccionada.nombre;
      } else {
        rutaActiva.escala = rutaActiva.escala + ', ' + paradaSeleccionada.nombre;
      }
      
      // Actualizamos el estado y el LocalStorage
      setRutas(rutasActualizadas);
      localStorage.setItem('stopover_rutas_reales', JSON.stringify(rutasActualizadas));
    }
    
    setIsRecModalOpen(false); // Cerramos el modal
  };

  const buscarLugarAPI = async (texto, setSugerenciasState) => {
    if (texto.trim().length < 2) {
      setSugerenciasState([]);
      return;
    }
    
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(texto)}&count=5&language=es&format=json`);
      const data = await response.json();
      
      if (!data || !data.results) {
        setSugerenciasState([]);
        return;
      }

      const resultados = data.results.map(item => {
        let label = item.name;
        if (item.admin1) label += `, ${item.admin1}`;
        if (item.country) label += `, ${item.country}`;

        return {
          label: label,
          lat: item.latitude,
          lon: item.longitude
        };
      });

      setSugerenciasState(resultados);
    } catch (error) {
      console.error("Error al consultar la API:", error);
      setSugerenciasState([]);
    }
  };

  const calcularRutaCarretera = async (orig, dest) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${orig[1]},${orig[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordsFormateadas = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coordsFormateadas);

        const km = (route.distance / 1000).toFixed(1);
        setDistanciaKm(km);

        const horas = Math.floor(route.duration / 3600);
        const minutos = Math.round((route.duration % 3600) / 60);
        setDuracionTexto(`${horas > 0 ? horas + ' h ' : ''}${minutos} m`);
      }
    } catch (err) {
      console.error("Error en OSRM:", err);
      setRouteCoords([orig, dest]);
    }
  };

  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 'En Tránsito': return 'bg-green-100 text-green-700';
      case 'Completado': return 'bg-blue-100 text-blue-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const mapCenter = destinoCoords 
    ? [(origenCoords[0] + destinoCoords[0]) / 2, (origenCoords[1] + destinoCoords[1]) / 2] 
    : origenCoords;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F6]">
      
      <header className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6] border-b border-gray-200">
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300" />
          <span className="text-sm font-semibold text-gray-700">Maria A</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        <aside className="w-64 bg-[#FAF9F6] border-r border-gray-200 flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-4">
            <NavLink
              to="/nueva-ruta"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              Nueva ruta
            </NavLink>

            <NavLink
              to="/historial"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              Historial
            </NavLink>

            <NavLink
              to="/favoritos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              Favoritos
            </NavLink>

            <NavLink
              to="/buscar"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              Buscar
            </NavLink>

            <NavLink
              to="/ajustes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              Ajustes
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-t border-l border-gray-100 flex flex-col">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rutas recientes</h2>
              <p className="text-sm text-gray-500 mt-1">Basado en tu ruta de Oaxaca a Puebla</p>
            </div>
            <button 
              onClick={() => {
                setIsMapModalOpen(true);
                setRouteCoords([]);
                setDistanciaKm(null);
                setDuracionTexto(null);
              }}
              className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer"
            >
              <span className="text-xl leading-none">+</span> Planear nueva parada
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Buscar por origen, destino o parada" 
              className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532]"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>Estatus: Todos</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>📅 Esta semana</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-gray-100 text-gray-400 text-sm">
                  <th className="py-3 px-2 font-medium">ID Ruta</th>
                  <th className="py-3 px-2 font-medium">Origen - Destino</th>
                  <th className="py-3 px-2 font-medium">Escala / Parada</th>
                  <th className="py-3 px-2 font-medium">Duración</th>
                  <th className="py-3 px-2 font-medium">Estatus</th>
                  <th className="py-3 px-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {rutas.map((ruta, index) => (
                  <tr key={index} className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                    <td className="py-4 px-2">{ruta.id}</td>
                    <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                    <td className="py-4 px-2">{ruta.escala}</td>
                    <td className="py-4 px-2">{ruta.duracion}</td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ruta.estatus)}`}>
                        {ruta.estatus}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <button 
                        onClick={() => {
                          setRutaSeleccionada(ruta);
                          setIsDetailModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-[#4F7959] font-semibold hover:underline cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-10 border-b border-gray-200 pb-8">
            <span>Mostrando 1 a 4 de 12 rutas</span>
            <div className="flex gap-2 font-semibold">
              <button className="hover:text-gray-900">&lt;</button>
              <button className="bg-[#4F7959] text-white px-2 py-0.5 rounded">1</button>
              <button className="hover:text-gray-900 px-1">2</button>
              <span className="text-gray-400">|</span>
              <button className="hover:text-gray-900 px-1">3</button>
              <button className="hover:text-gray-900">&gt;</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 flex-1">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Categorías más buscadas</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => abrirRecomendaciones('Cafeterías')}
                  className="w-full flex items-center justify-between bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border border-orange-100/50"
                >
                  <span className="flex items-center gap-2">☕ Cafeterías</span>
                  <span className="text-xs bg-orange-200/60 px-2 py-1 rounded-lg">Sugerencias ›</span>
                </button>
                
                <button 
                  onClick={() => abrirRecomendaciones('Miradores')}
                  className="w-full flex items-center justify-between bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border border-orange-100/50"
                >
                  <span className="flex items-center gap-2">📸 Miradores</span>
                  <span className="text-xs bg-orange-200/60 px-2 py-1 rounded-lg">Sugerencias ›</span>
                </button>
                
                <button 
                  onClick={() => abrirRecomendaciones('Pueblos mágicos')}
                  className="w-full flex items-center justify-between bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border border-orange-100/50"
                >
                  <span className="flex items-center gap-2">✨ Pueblos mágicos</span>
                  <span className="text-xs bg-orange-200/60 px-2 py-1 rounded-lg">Sugerencias ›</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 w-full max-w-sm h-fit">
                <h3 className="text-center font-bold text-gray-800 mb-6">Tendencia ahora</h3>
                <ul className="space-y-6 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    247 viajeros exploraron Oaxaca hoy
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    "Mural del Centro" es la parada más guardada esta semana
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <footer className="text-center text-sm text-gray-500 pt-8 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>

      
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-visible">
            
            <div className="bg-[#2A4532] text-white px-6 py-4 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-lg font-bold">Planea tu ruta</h3>
              <button onClick={() => setIsMapModalOpen(false)} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-visible">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-visible">
                
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origen del viaje</label>
                  <input 
                    type="text" 
                    value={origenTexto}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrigenTexto(val);
                      buscarLugarAPI(val, setSugerenciasOrigen);
                    }}
                    placeholder="Escribe origen..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#2A4532]"
                  />
                  
                  {sugerenciasOrigen.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto">
                      {sugerenciasOrigen.map((item, idx) => (
                        <li 
                          key={idx}
                          onClick={() => {
                            setOrigenTexto(item.label);
                            const nuevasCoords = [item.lat, item.lon];
                            setOrigenCoords(nuevasCoords);
                            setSugerenciasOrigen([]);
                            if (destinoCoords) calcularRutaCarretera(nuevasCoords, destinoCoords);
                          }}
                          className="px-4 py-2.5 text-xs text-gray-700 hover:bg-[#CBE3C7]/60 cursor-pointer font-medium border-b border-gray-50"
                        >
                          📍 {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destino</label>
                  <input 
                    type="text" 
                    value={destinoTexto}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDestinoTexto(val);
                      buscarLugarAPI(val, setSugerenciasDestino);
                    }}
                    placeholder="Escribe destino..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#2A4532]"
                  />

                  {sugerenciasDestino.length > 0 && (
                    <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto">
                      {sugerenciasDestino.map((item, idx) => (
                        <li 
                          key={idx}
                          onClick={() => {
                            setDestinoTexto(item.label);
                            const nuevasCoords = [item.lat, item.lon];
                            setDestinoCoords(nuevasCoords);
                            setSugerenciasDestino([]);
                            calcularRutaCarretera(origenCoords, nuevasCoords);
                          }}
                          className="px-4 py-2.5 text-xs text-gray-700 hover:bg-[#CBE3C7]/60 cursor-pointer font-medium border-b border-gray-50"
                        >
                          🎯 {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {distanciaKm && duracionTexto && (
                <div className="bg-[#CBE3C7]/40 border border-[#2A4532]/20 rounded-2xl p-3 flex justify-around text-center text-xs sm:text-sm font-bold text-[#2A4532]">
                  <div>🚗 Distancia: <span className="text-black font-normal">{distanciaKm} km</span></div>
                  <div>⏱️ Tiempo estimado: <span className="text-black font-normal">{duracionTexto}</span></div>
                </div>
              )}

              <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-inner z-10 mt-2">
                <MapContainer 
                  center={mapCenter} 
                  zoom={destinoCoords ? 7 : 13} 
                  style={{ width: '100%', height: '100%' }}
                >
                  <ChangeView center={mapCenter} />
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  <Marker position={origenCoords}>
                    <Popup>Origen: {origenTexto}</Popup>
                  </Marker>

                  {destinoCoords && (
                    <>
                      <Marker position={destinoCoords}>
                        <Popup>Destino: {destinoTexto}</Popup>
                      </Marker>
                      <Polyline 
                        positions={routeCoords.length > 0 ? routeCoords : [origenCoords, destinoCoords]} 
                        color="#2A4532" 
                        weight={5} 
                      />
                    </>
                  )}
                </MapContainer>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button 
                  onClick={() => setIsMapModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    if (!origenTexto || !destinoCoords) {
                      alert('Por favor selecciona un destino válido de la lista.');
                      return;
                    }
                    const nuevaRutaObj = {
                      id: `#ST-90${rutas.length + 1}`,
                      origen: origenTexto.split(',')[0],
                      destino: destinoTexto.split(',')[0],
                      escala: `${distanciaKm || '0'} km por carretera`,
                      duracion: duracionTexto || 'Calculado',
                      estatus: 'En Tránsito'
                    };
                    
                    // PERSISTENCIA REAL EN LOCALSTORAGE
                    const rutasActualizadas = [nuevaRutaObj, ...rutas];
                    setRutas(rutasActualizadas);
                    localStorage.setItem('stopover_rutas_reales', JSON.stringify(rutasActualizadas));

                    setIsMapModalOpen(false);
                  }}
                  className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Trazar Ruta y Guardar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL VER DETALLE EXTERNO */}
      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        rutaId={rutaSeleccionada ? rutaSeleccionada.id : null}
      />

      {/* MODAL DE RECOMENDACIONES DE CATEGORÍAS */}
      <RecommendationsModal 
        isOpen={isRecModalOpen}
        onClose={() => setIsRecModalOpen(false)}
        categoria={categoriaSeleccionada}
        destinoRuta={rutas[0]?.destino}
        onAgregar={agregarParadaARuta}
      />

    </div>
  );
}