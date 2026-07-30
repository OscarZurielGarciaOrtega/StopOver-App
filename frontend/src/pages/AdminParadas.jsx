import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios'; // 🚀 Importamos la conexión al backend

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationSelector({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function AdminParadas() {
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // 🚀 ESTADOS CONECTADOS AL BACKEND
  const [paradas, setParadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ESTADOS PARA MODALES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paradaAEliminar, setParadaAEliminar] = useState(null);

  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPropietario, setNuevoPropietario] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('CAFETERIA');
  const [nuevaCoord, setNuevaCoord] = useState([17.0754, -96.7236]);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  // ESTADO PARA MODAL DE MAPA
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [paradaSeleccionadaMapa, setParadaSeleccionadaMapa] = useState(null);

  // 📥 CARGAR PARADAS (Aprobadas y Pendientes)
  const fetchParadas = async () => {
    try {
      setCargando(true);
      // Hacemos las dos peticiones en paralelo para mayor velocidad
      const [pendientesRes, aprobadosRes] = await Promise.all([
        api.get('/admin/negocios/pendientes'),
        api.get('/negocios/aprobados')
      ]);

      const pendientes = Array.isArray(pendientesRes.data) ? pendientesRes.data : (pendientesRes.data.content || []);
      const aprobados = Array.isArray(aprobadosRes.data) ? aprobadosRes.data : (aprobadosRes.data.content || []);

      // Juntamos ambas listas y las mapeamos a la estructura de la UI
      const combinadas = [...pendientes, ...aprobados].map(n => ({
        id: n.id,
        nombre: n.nombre,
        propietario: 'Propietario', // El backend actual no devuelve el nombre del dueño en este endpoint
        categoria: n.categoria,
        estatus: n.estatus === 'PENDIENTE' ? 'Pendiente' : 'Aprobado',
        coords: [n.latitud || 17.0754, n.longitud || -96.7236]
      }));

      // Ordenamos para que los pendientes salgan hasta arriba
      combinadas.sort((a, b) => (a.estatus === 'Pendiente' ? -1 : 1));

      setParadas(combinadas);
    } catch (error) {
      console.error("Error al cargar el catálogo de paradas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchParadas();
  }, []);

  // ✅ APROBAR NEGOCIO
  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/negocios/${id}/aprobar`);
      // Actualizamos localmente para no tener que recargar toda la página
      setParadas(paradas.map(p => p.id === id ? { ...p, estatus: 'Aprobado' } : p));
    } catch (error) {
      console.error("Error al aprobar negocio:", error);
      alert("Hubo un error al aprobar el establecimiento.");
    }
  };

  // 🗑️ RECHAZAR/ELIMINAR NEGOCIO
  const handleOpenDeleteModal = (id) => {
    setParadaAEliminar(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.put(`/admin/negocios/${paradaAEliminar}/rechazar`);
      setParadas(paradas.filter(p => p.id !== paradaAEliminar));
      setParadaAEliminar(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al rechazar negocio:", error);
      alert("Hubo un error al eliminar el establecimiento.");
    }
  };

  // 📝 CREAR NUEVA PARADA DESDE EL ADMIN
  const handleCrearParada = async (e) => {
    e.preventDefault();
    if (!nuevoNombre) {
      alert('Por favor completa el nombre del lugar.');
      return;
    }

    try {
      const payload = {
        nombre: nuevoNombre,
        categoria: nuevaCategoria,
        descripcion: nuevaDescripcion || 'Parada creada por administración',
        direccion: 'Ubicación seleccionada en mapa',
        latitud: parseFloat(nuevaCoord[0]),
        longitud: parseFloat(nuevaCoord[1])
      };

      // Registramos la parada
      await api.post('/negocios/registrar', payload);
      
      // Recargamos la lista para obtener el ID real de la base de datos
      await fetchParadas();

      setNuevoNombre('');
      setNuevoPropietario('');
      setNuevaDescripcion('');
      setIsNuevoModalOpen(false);
    } catch (error) {
      console.error("Error al crear parada:", error);
      alert("No se pudo crear la parada.");
    }
  };

  const getStatusClass = (estatus) => {
    if (estatus === 'Aprobado') {
      return isDarkMode ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-green-100 text-green-700';
    } else {
      return isDarkMode ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' : 'bg-amber-100 text-amber-700';
    }
  };

  // Función para formatear el ID (Ej: ID 6 -> #P-06)
  const formatId = (id) => {
    return `#P-${id.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <h1 className="text-2xl font-bold text-[#2A4532]">StopOver Admin</h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700'}`}>Rol: Administrador</span>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className={`flex-1 p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#FAF9F6]'}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Catálogo de Paradas</h2>
              <p className="text-sm text-gray-400 mt-1">Modera y aprueba los establecimientos registrados en la plataforma</p>
            </div>
            <button 
              onClick={() => setIsNuevoModalOpen(true)}
              className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer"
            >
              + Nueva Parada Global
            </button>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {cargando ? (
              <div className="text-center py-10 font-semibold text-gray-500">
                Sincronizando con PostgreSQL...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                    <th className="py-3 px-2 font-medium">ID</th>
                    <th className="py-3 px-2 font-medium">Nombre del Lugar</th>
                    <th className="py-3 px-2 font-medium">Propietario</th>
                    <th className="py-3 px-2 font-medium">Categoría</th>
                    <th className="py-3 px-2 font-medium">Estatus</th>
                    <th className="py-3 px-2 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {paradas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400 font-medium">
                        No hay paradas registradas en el catálogo.
                      </td>
                    </tr>
                  ) : (
                    paradas.map((parada) => (
                      <tr key={parada.id} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                        <td className="py-4 px-2 font-bold">{formatId(parada.id)}</td>
                        <td className="py-4 px-2 font-semibold">{parada.nombre}</td>
                        <td className={`py-4 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{parada.propietario}</td>
                        <td className="py-4 px-2">{parada.categoria}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(parada.estatus)}`}>
                            {parada.estatus}
                          </span>
                        </td>
                        <td className="py-4 px-2 flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setParadaSeleccionadaMapa(parada);
                              setIsMapModalOpen(true);
                            }}
                            className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDarkMode 
                                ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/50' 
                                : 'text-[#4F7959] bg-[#CBE3C7]/40 hover:bg-[#CBE3C7]'
                            }`}
                          >
                            Ver ubicación
                          </button>

                          {parada.estatus === 'Pendiente' && (
                            <button 
                              onClick={() => handleApprove(parada.id)}
                              className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDarkMode 
                                  ? 'bg-green-950/80 text-green-300 hover:bg-green-900 border border-green-800/50' 
                                  : 'text-green-600 bg-green-50 hover:bg-green-100'
                              }`}
                            >
                              Aprobar
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenDeleteModal(parada.id)}
                            className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                              isDarkMode 
                                ? 'bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-800/50' 
                                : 'text-red-500 bg-red-50 hover:bg-red-100'
                            }`}
                          >
                            Rechazar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* 🗺️ MODAL PARA VER UBICACIÓN EN EL MAPA */}
      {isMapModalOpen && paradaSeleccionadaMapa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-xl rounded-3xl shadow-2xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Ubicación: {paradaSeleccionadaMapa.nombre}</h3>
              <button onClick={() => setIsMapModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer">✕</button>
            </div>
            
            <div className="w-full h-72 rounded-2xl overflow-hidden border border-gray-300 shadow-inner mb-4 relative z-10">
              <MapContainer 
                center={paradaSeleccionadaMapa.coords || [17.0754, -96.7236]} 
                zoom={14} 
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={paradaSeleccionadaMapa.coords || [17.0754, -96.7236]} />
              </MapContainer>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsMapModalOpen(false)}
                className="bg-[#2A4532] text-white px-6 py-2 rounded-xl font-bold text-sm cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 MODAL PARA CREAR NUEVA PARADA CON MAPA INTERACTIVO */}
      {isNuevoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-xl rounded-3xl shadow-2xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Registrar Nueva Parada Global</h3>
              <button onClick={() => setIsNuevoModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCrearParada} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Nombre del Lugar</label>
                  <input 
                    type="text" 
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej. Café de la Brisa"
                    className={`w-full border rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Categoría</label>
                  <select 
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    className={`w-full border rounded-xl py-2 px-3 text-sm font-semibold focus:outline-none focus:border-[#2A4532] cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <option value="CAFETERIA">Cafetería</option>
                    <option value="MIRADOR">Mirador</option>
                    <option value="PUEBLO_MAGICO">Pueblo Mágico</option>
                    <option value="RESTAURANTE">Restaurante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Selecciona ubicación en el mapa (haz clic)</label>
                <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-300 shadow-inner relative z-10">
                  <MapContainer center={[17.0754, -96.7236]} zoom={12} style={{ width: '100%', height: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector position={nuevaCoord} setPosition={setNuevaCoord} />
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-400 mt-1">Lat: {nuevaCoord[0].toFixed(4)}, Lng: {nuevaCoord[1].toFixed(4)}</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsNuevoModalOpen(false)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Guardar Parada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 MODAL DE ELIMINACIÓN */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de rechazar/eliminar esta parada?"
        message="Esta acción removerá permanentemente el establecimiento del sistema y de la vista de los viajeros."
      />

    </div>
  );
}