import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import HistorialDetailModal from '../components/HistorialDetailModal';
import Sidebar from '../components/Sidebar'; 
import api from '../api/axios';

export default function Historial() {
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rutaAEliminar, setRutaAEliminar] = useState(null);
  const [idRutaRealEliminar, setIdRutaRealEliminar] = useState(null);

  // Estados para el modal de detalle con el objeto completo de la ruta
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  const cargarHistorialRutas = async (pagina = 0) => {
    setLoading(true);
    try {
      const response = await api.get(`/rutas?page=${pagina}&size=5`);
      const data = response.data;
      
      const contenido = data.content || data;
      if (Array.isArray(contenido)) {
        const estatusLocales = JSON.parse(localStorage.getItem('stopover_estatus_rutas') || '{}');
        const escalasLocales = JSON.parse(localStorage.getItem('stopover_escalas_rutas') || '{}');

        const rutasFormateadas = contenido.map(ruta => {
          let escalaFinal = 'Directo (Sin escala)';
          if (escalasLocales[ruta.id]) {
            escalaFinal = escalasLocales[ruta.id];
          } else if (ruta.paradas && ruta.paradas.length > 0) {
            escalaFinal = ruta.paradas.map(p => p.nombre).join(', ');
          }

          return {
            id: `#ST-${ruta.id}`,
            idReal: ruta.id,
            origen: ruta.origen,
            destino: ruta.destino,
            escala: escalaFinal,
            duracion: ruta.fechaSalida || ruta.fecha_salida || 'Por definir',
            estatus: estatusLocales[ruta.id] || ruta.estatus || 'Programado'
          };
        });

        setRutas(rutasFormateadas);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || rutasFormateadas.length);
      }
    } catch (error) {
      console.error("Error al cargar historial de rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorialRutas(paginaActual);
  }, [paginaActual]);

  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 'En Tránsito': return 'bg-emerald-100 text-emerald-700 font-bold';
      case 'Completado': return 'bg-blue-100 text-blue-700 font-bold';
      case 'Programado': return 'bg-purple-100 text-purple-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      case 'Cancelado': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenModal = (idRutaString, idReal) => {
    setRutaAEliminar(idRutaString);
    setIdRutaRealEliminar(idReal);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idRutaRealEliminar) return;
    try {
      await api.delete(`/rutas/${idRutaRealEliminar}`);
      cargarHistorialRutas(paginaActual);
      setIsModalOpen(false);
      setRutaAEliminar(null);
      setIdRutaRealEliminar(null);
    } catch (error) {
      console.error("Error al eliminar ruta en el servidor:", error);
      alert("No se pudo eliminar la ruta en el servidor.");
    }
  };

  const rutasFiltradas = rutas.filter(ruta => {
    const textoMatch = 
      ruta.id.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.origen.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.destino.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.escala.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    const estatusMatch = filtroEstatus === 'Todos' || ruta.estatus === filtroEstatus;
    return textoMatch && estatusMatch;
  });

  const totalCompletadas = rutas.filter(r => r.estatus === 'Completado').length;
  const horasCamino = rutas.length * 6 + 10; 

  const conteoEscalas = {};
  rutas.forEach(r => {
    if (r.escala && !r.escala.includes('km') && !r.escala.includes('Directo') && !r.escala.includes('Por definir')) {
      r.escala.split(',').forEach(parada => {
        const pLimpia = parada.trim();
        conteoEscalas[pLimpia] = (conteoEscalas[pLimpia] || 0) + 1;
      });
    }
  });

  let paradaFrecuente = "Sin registros frecuentes";
  let maxRepeticiones = 0;
  Object.keys(conteoEscalas).forEach(parada => {
    if (conteoEscalas[parada] > maxRepeticiones) {
      maxRepeticiones = conteoEscalas[parada];
      paradaFrecuente = parada;
    }
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      {/* HEADER CON INICIAL IGUAL AL DASHBOARD */}
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombre}</span>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar /> 
       
        <main className={`flex-1 p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#FAF9F6]'}`}>
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historial de viajes</h2>
              <p className="text-sm text-gray-400 mt-1">Revisa tus rutas pasadas y estadísticas de viaje</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rutas completadas</span>
              <span className="text-4xl font-extrabold text-[#16A34A]">{totalCompletadas}</span>
            </div>
            <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Horas en el camino</span>
              <span className="text-4xl font-extrabold text-[#2563EB]">{horasCamino} h</span>
            </div>
            <div className={`p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-32 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parada más frecuente</span>
              <span className="text-xl font-extrabold text-[#F97316] truncate">{paradaFrecuente}</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 flex flex-col transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            
            <div className="flex gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Buscar por origen, destino o parada" 
                value={busquedaTexto}
                onChange={(e) => setBusquedaTexto(e.target.value)}
                className={`border rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`} 
              />
              <select 
                value={filtroEstatus}
                onChange={(e) => setFiltroEstatus(e.target.value)}
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}
              >
                <option value="Todos">Estatus: Todos</option>
                <option value="Programado">Programado</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Completado">Completado</option>
                <option value="Retrasado">Retrasado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="w-full overflow-x-auto mb-4 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                    <th className="py-3 px-2 font-medium">ID Ruta</th>
                    <th className="py-3 px-2 font-medium">Origen - Destino</th>
                    <th className="py-3 px-2 font-medium">Escala / Parada</th>
                    <th className="py-3 px-2 font-medium">Fecha Salida</th>
                    <th className="py-3 px-2 font-medium">Estatus</th>
                    <th className="py-3 px-2 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-medium">Sincronizando historial con la base de datos...</td></tr>
                  ) : rutasFiltradas.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-medium">No se encontraron rutas registradas.</td></tr>
                  ) : (
                    rutasFiltradas.map((ruta) => (
                      <tr key={ruta.idReal} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                        <td className="py-4 px-2 font-bold">{ruta.id}</td>
                        <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                        <td className="py-4 px-2">{ruta.escala}</td>
                        <td className="py-4 px-2">{ruta.duracion}</td>
                        <td className="py-4 px-2"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ruta.estatus)}`}>{ruta.estatus}</span></td>
                        <td className="py-4 px-2 flex items-center gap-3">
                          
                          {/* BOTÓN CONECTADO PARA ABRIR DETAIL MODAL */}
                          <button 
                            onClick={() => {
                              setRutaSeleccionada(ruta);
                              setIsDetailModalOpen(true);
                            }}
                            className="flex items-center gap-1 text-[#4F7959] font-semibold hover:underline cursor-pointer"
                          >
                            Ver detalle
                          </button>

                          <button onClick={() => handleOpenModal(ruta.id, ruta.idReal)} className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-red-900/40 text-red-400 hover:bg-red-900/60' : 'text-red-500 bg-red-50 hover:bg-red-100'}`}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={`flex justify-between items-center text-sm border-t pt-4 mt-auto ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
              <span>Mostrando página {paginaActual + 1} de {totalPages} ({totalElements} rutas en total)</span>
              <div className="flex gap-2 font-semibold">
                <button 
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 0))}
                  disabled={paginaActual === 0}
                  className={`px-2 py-0.5 rounded cursor-pointer ${paginaActual === 0 ? 'text-gray-500 cursor-not-allowed' : ''}`}
                >
                  &lt;
                </button>
                <span className="bg-[#4F7959] text-white px-2.5 py-0.5 rounded">{paginaActual + 1}</span>
                <button 
                  onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={paginaActual >= totalPages - 1}
                  className={`px-2 py-0.5 rounded cursor-pointer ${paginaActual >= totalPages - 1 ? 'text-gray-500 cursor-not-allowed' : ''}`}
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>
          <footer className="text-center text-sm text-gray-500 pt-6">StopOver © 2026</footer>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar esta ruta?"
        message={`Estás a punto de borrar la ruta ${rutaAEliminar}. Esta acción no se puede deshacer y se perderá del registro de PostgreSQL.`}
      />

      {/* DETAIL MODAL CONECTADO */}
      <HistorialDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        rutaInfo={rutaSeleccionada}
      />

    </div>
  );
}