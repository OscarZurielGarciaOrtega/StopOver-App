import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios'; // Importación de la API configurada
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
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // 👤 CARGAR PERFIL DESDE LOCALSTORAGE (SIN IMAGEN DE PRUEBA)
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('nombre') || localStorage.getItem('email') || 'Viajero';
  });

  useEffect(() => {
    const handleProfileChange = () => {
      setNombre(localStorage.getItem('nombre') || localStorage.getItem('email') || 'Viajero');
    };
    window.addEventListener('user_profile_updated', handleProfileChange);
    return () => window.removeEventListener('user_profile_updated', handleProfileChange);
  }, []);

  // 🚀 ESTADOS PARA RUTAS REALES DESDE EL BACKEND
  const [rutas, setRutas] = useState([]);
  const [loadingRutas, setLoadingRutas] = useState(true);

  useEffect(() => {
    const cargarRutas = async () => {
      setLoadingRutas(true);
      try {
        const response = await api.get('/rutas');
        
        const data = response.data.content || response.data;
        
        if (Array.isArray(data)) {
          const rutasFormateadas = data.map(ruta => ({
            id: `#ST-${ruta.id}`,
            idReal: ruta.id,
            origen: ruta.origen,
            destino: ruta.destino,
            escala: ruta.paradas && ruta.paradas.length > 0 ? ruta.paradas.map(p => p.nombre).join(', ') : 'Directo (Sin escala)',
            duracion: ruta.fecha_salida || 'Por definir',
            estatus: 'Programado' 
          }));
          setRutas(rutasFormateadas);
        }
      } catch (error) {
        console.error("Error al cargar rutas del servidor:", error);
      } finally {
        setLoadingRutas(false);
      }
    };

    cargarRutas();
  }, []);

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

  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);

  // 🔍 ESTADOS PARA LOS FILTROS DE LA TABLA
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  // LÓGICA DE PAGINACIÓN Y FILTRADO
  const [paginaActual, setPaginaActual] = useState(1);
  const rutasPorPagina = 4;
  
  const rutasFiltradas = rutas.filter(ruta => {
    const textoMatch = 
      ruta.id.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.origen.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.destino.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.escala.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    const estatusMatch = filtroEstatus === 'Todos' || ruta.estatus === filtroEstatus;

    return textoMatch && estatusMatch;
  });

  const indiceUltimaRuta = paginaActual * rutasPorPagina;
  const indicePrimeraRuta = indiceUltimaRuta - rutasPorPagina;
  const rutasActuales = rutasFiltradas.slice(indicePrimeraRuta, indiceUltimaRuta);
  const totalPaginas = Math.ceil(rutasFiltradas.length / rutasPorPagina) || 1;

  // 📊 LÓGICA DE TENDENCIAS INTELIGENTES (100% DINÁMICO)
  const totalViajerosHoy = rutas.length > 0 ? rutas.length * 3 : 0;

  const conteoEscalas = {};
  rutas.forEach(r => {
    if (r.escala && !r.escala.includes('km') && !r.escala.includes('Directo') && !r.escala.includes('Por definir')) {
      r.escala.split(',').forEach(parada => {
        const pLimpia = parada.trim();
        conteoEscalas[pLimpia] = (conteoEscalas[pLimpia] || 0) + 1;
      });
    }
  });

  let paradaMasGuardada = "Aún no hay paradas registradas";
  let maxRepeticiones = 0;
  if (Object.keys(conteoEscalas).length > 0) {
    Object.keys(conteoEscalas).forEach(parada => {
      if (conteoEscalas[parada] > maxRepeticiones) {
        maxRepeticiones = conteoEscalas[parada];
        paradaMasGuardada = parada;
      }
    });
  }

  const abrirRecomendaciones = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsRecModalOpen(true);
  };

  const agregarParadaARuta = (paradaSeleccionada) => {
    const rutasActualizadas = [...rutas];
    if (rutasActualizadas.length > 0) {
      const rutaActiva = rutasActualizadas[0];
      if (rutaActiva.escala.includes('km') || rutaActiva.escala.includes('Directo')) {
        rutaActiva.escala = paradaSeleccionada.nombre;
      } else {
        rutaActiva.escala = rutaActiva.escala + ', ' + paradaSeleccionada.nombre;
      }
      setRutas(rutasActualizadas);
    }
    setIsRecModalOpen(false);
  };

  const cancelarRuta = (idRuta) => {
    const rutasActualizadas = rutas.map(ruta => 
      ruta.id === idRuta ? { ...ruta, estatus: 'Cancelado' } : ruta
    );
    setRutas(rutasActualizadas);
    setIsDetailModalOpen(false);
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
      case 'Programado': return 'bg-purple-100 text-purple-700';
      case 'En Tránsito': return 'bg-green-100 text-green-700';
      case 'Completado': return 'bg-blue-100 text-blue-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      case 'Cancelado': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const mapCenter = destinoCoords 
    ? [(origenCoords[0] + destinoCoords[0]) / 2, (origenCoords[1] + destinoCoords[1]) / 2] 
    : origenCoords;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        
        {/* MAGIA AQUÍ: CÍRCULO CON INICIAL EN VEZ DE IMAGEN */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombre}</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        <aside className={`w-64 border-r flex flex-col pt-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-[#FAF9F6] border-gray-200'}`}>
          <nav className="flex flex-col gap-1 px-4">
            <NavLink
              to="/nueva-ruta"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : isDarkMode ? 'text-gray-400 font-medium hover:bg-gray-800' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Nueva ruta
            </NavLink>

            <NavLink
              to="/historial"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : isDarkMode ? 'text-gray-400 font-medium hover:bg-gray-800' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historial
            </NavLink>

            <NavLink
              to="/favoritos"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : isDarkMode ? 'text-gray-400 font-medium hover:bg-gray-800' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Favoritos
            </NavLink>

            <NavLink
              to="/buscar"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : isDarkMode ? 'text-gray-400 font-medium hover:bg-gray-800' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </NavLink>

            <NavLink
              to="/ajustes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#CBE3C7] text-[#2A4532] font-bold' : isDarkMode ? 'text-gray-400 font-medium hover:bg-gray-800' : 'text-gray-400 font-medium hover:bg-gray-50'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ajustes
            </NavLink>
          </nav>
        </aside>

        <main className={`flex-1 p-8 rounded-tl-3xl shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-t border-l flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rutas recientes</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explora tus viajes planeados</p>
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
              <span className="text-xl leading-none">+</span> Planear nueva ruta
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Buscar por origen, destino o parada" 
              value={busquedaTexto}
              onChange={(e) => {
                setBusquedaTexto(e.target.value);
                setPaginaActual(1);
              }}
              className={`border rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}
            />
            <select 
              value={filtroEstatus}
              onChange={(e) => {
                setFiltroEstatus(e.target.value);
                setPaginaActual(1);
              }}
              className={`border rounded-lg px-4 py-2 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              <option value="Todos">Estatus: Todos</option>
              <option value="Programado">Programado</option>
              <option value="En Tránsito">En Tránsito</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                  <th className="py-3 px-2 font-medium">ID Ruta</th>
                  <th className="py-3 px-2 font-medium">Origen - Destino</th>
                  <th className="py-3 px-2 font-medium">Escala / Parada</th>
                  <th className="py-3 px-2 font-medium">Salida</th>
                  <th className="py-3 px-2 font-medium">Estatus</th>
                  <th className="py-3 px-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loadingRutas ? (
                  <tr>
                    <td colSpan="6" className={`text-center py-8 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Sincronizando rutas con el servidor...
                    </td>
                  </tr>
                ) : rutasActuales.length > 0 ? (
                  rutasActuales.map((ruta, index) => (
                    <tr key={index} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-800 text-gray-200 hover:bg-gray-800/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                      <td className="py-4 px-2 font-medium">{ruta.id}</td>
                      <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                      <td className="py-4 px-2 text-gray-500">{ruta.escala}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Aún no tienes rutas registradas. ¡Planea tu primer viaje!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex justify-between items-center text-sm mb-10 border-b pb-8 ${isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
            <span>Mostrando {rutasFiltradas.length > 0 ? indicePrimeraRuta + 1 : 0} a {Math.min(indiceUltimaRuta, rutasFiltradas.length)} de {rutasFiltradas.length} rutas</span>
            <div className="flex gap-2 font-semibold">
              <button 
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className={`px-2 py-0.5 rounded transition-colors ${paginaActual === 1 ? 'text-gray-600 cursor-not-allowed' : isDarkMode ? 'hover:bg-gray-800 cursor-pointer text-gray-300' : 'hover:bg-gray-200 cursor-pointer text-gray-600'}`}
              >
                &lt;
              </button>
              
              {[...Array(totalPaginas)].map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setPaginaActual(index + 1)}
                  className={`px-2.5 py-0.5 rounded transition-colors cursor-pointer ${paginaActual === index + 1 ? 'bg-[#4F7959] text-white' : isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                >
                  {index + 1}
                </button>
              ))}

              <button 
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className={`px-2 py-0.5 rounded transition-colors ${paginaActual === totalPaginas ? 'text-gray-600 cursor-not-allowed' : isDarkMode ? 'hover:bg-gray-800 cursor-pointer text-gray-300' : 'hover:bg-gray-200 cursor-pointer text-gray-600'}`}
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 flex-1">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-400 mb-4">Categorías más buscadas</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => abrirRecomendaciones('Cafeterías')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-orange-400 hover:bg-gray-700' : 'bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] border-orange-100/50'}`}
                >
                  <span className="flex items-center gap-2">☕ Cafeterías</span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700 text-orange-300' : 'bg-orange-200/60'}`}>Sugerencias ›</span>
                </button>
                
                <button 
                  onClick={() => abrirRecomendaciones('Miradores')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-orange-400 hover:bg-gray-700' : 'bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] border-orange-100/50'}`}
                >
                  <span className="flex items-center gap-2">📸 Miradores</span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700 text-orange-300' : 'bg-orange-200/60'}`}>Sugerencias ›</span>
                </button>
                
                <button 
                  onClick={() => abrirRecomendaciones('Pueblos mágicos')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all cursor-pointer shadow-xs border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-orange-400 hover:bg-gray-700' : 'bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] border-orange-100/50'}`}
                >
                  <span className="flex items-center gap-2">✨ Pueblos mágicos</span>
                  <span className={`text-xs px-2 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700 text-orange-300' : 'bg-orange-200/60'}`}>Sugerencias ›</span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className={`rounded-3xl shadow-lg border p-8 w-full max-w-sm h-full flex flex-col justify-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-center font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tus Estadísticas</h3>
                <ul className={`space-y-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    {rutas.length > 0 ? `Tienes ${rutas.length} viajes registrados en total.` : 'Aún no tienes viajes registrados.'}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    Parada favorita: {paradaMasGuardada}
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
          <div className={`w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-visible ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800'}`}>
            
            <div className="bg-[#2A4532] text-white px-6 py-4 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-lg font-bold">Planea tu ruta</h3>
              <button onClick={() => setIsMapModalOpen(false)} className="text-white/80 hover:text-white text-xl font-bold cursor-pointer">✕</button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-visible">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-visible">
                
                <div className="relative">
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Origen del viaje</label>
                  <input 
                    type="text" 
                    value={origenTexto}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrigenTexto(val);
                      buscarLugarAPI(val, setSugerenciasOrigen);
                    }}
                    placeholder="Escribe origen..."
                    className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  />
                  
                  {sugerenciasOrigen.length > 0 && (
                    <ul className={`absolute z-50 left-0 right-0 border rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
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
                          className={`px-4 py-2.5 text-xs font-medium border-b cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-700 text-white' : 'border-gray-50 hover:bg-[#CBE3C7]/60 text-gray-700'}`}
                        >
                          📍 {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="relative">
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Destino</label>
                  <input 
                    type="text" 
                    value={destinoTexto}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDestinoTexto(val);
                      buscarLugarAPI(val, setSugerenciasDestino);
                    }}
                    placeholder="Escribe destino..." 
                    className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                  />

                  {sugerenciasDestino.length > 0 && (
                    <ul className={`absolute z-50 left-0 right-0 border rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
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
                          className={`px-4 py-2.5 text-xs font-medium border-b cursor-pointer ${isDarkMode ? 'border-gray-700 hover:bg-gray-700 text-white' : 'border-gray-50 hover:bg-[#CBE3C7]/60 text-gray-700'}`}
                        >
                          🎯 {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {distanciaKm && duracionTexto && (
                <div className={`border rounded-2xl p-3 flex justify-around text-center text-xs sm:text-sm font-bold ${isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' : 'bg-[#CBE3C7]/40 border-[#2A4532]/20 text-[#2A4532]'}`}>
                  <div>🚗 Distancia: <span className={`font-normal ${isDarkMode ? 'text-white' : 'text-black'}`}>{distanciaKm} km</span></div>
                  <div>⏱️ Tiempo estimado: <span className={`font-normal ${isDarkMode ? 'text-white' : 'text-black'}`}>{duracionTexto}</span></div>
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
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Cancelar
                </button>
                
                {/* MAGIA AQUÍ: PETICIÓN REAL POST AL BACKEND */}
                <button 
                  onClick={async () => {
                    if (!origenTexto || !destinoCoords) {
                      alert('Por favor selecciona un destino válido de la lista.');
                      return;
                    }
                    
                    try {
                      const fechaActual = new Date().toISOString().split('T')[0];
                      
                      // Hacemos el POST real a la base de datos
                      await api.post('/rutas', {
                        nombre: `Viaje a ${destinoTexto.split(',')[0]}`,
                        origen: origenTexto.split(',')[0],
                        destino: destinoTexto.split(',')[0],
                        fechaSalida: fechaActual, // <-- ¡MAGIA APLICADA AQUÍ! (camelCase)
                        paradaIds: [] // Arreglo vacío
                      });

                      setIsMapModalOpen(false);
                      // Refrescamos la pantalla para que el GET jale la ruta recién creada
                      window.location.reload(); 
                      
                    } catch (error) {
                      console.error("Error al guardar la ruta en el servidor:", error.response?.data);
                      
                      // EXTRAEMOS EL MENSAJE PARA EL ALERT
                      const mensajeBackend = error.response?.data?.mensajes?.[0] || error.response?.data?.message || 'Error de formato (400)';
                      
                      alert(`El servidor rechazó los datos:\n👉 ${mensajeBackend}\n\nRecuerda decirle a Emma que quite la validación del arreglo vacío en las paradas.`);
                    }
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

      <DetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        rutaId={rutaSeleccionada ? rutaSeleccionada.idReal : null}
        onCancelar={() => rutaSeleccionada && cancelarRuta(rutaSeleccionada.id)}
      />

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