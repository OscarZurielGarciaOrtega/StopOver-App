import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar'; 

export default function Historial() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rutaAEliminar, setRutaAEliminar] = useState(null);

  // PERSISTENCIA REAL: Sincronizado con el localStorage del Dashboard
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

  // ESTADOS PARA LOS FILTROS
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  // Guardar cambios en localStorage automáticamente cuando se elimine una ruta
  useEffect(() => {
    localStorage.setItem('stopover_rutas_reales', JSON.stringify(rutas));
  }, [rutas]);

  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 'En Tránsito': return 'bg-green-100 text-green-700';
      case 'Completado': return 'bg-blue-100 text-blue-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      case 'Cancelado': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenModal = (id) => {
    setRutaAEliminar(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const rutasActualizadas = rutas.filter(ruta => ruta.id !== rutaAEliminar);
    setRutas(rutasActualizadas);
    setRutaAEliminar(null);
    setIsModalOpen(false);
  };

  // 🧮 FILTRAR RUTAS SEGÚN BÚSQUEDA Y ESTATUS
  const rutasFiltradas = rutas.filter(ruta => {
    const textoMatch = 
      ruta.id.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.origen.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.destino.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      ruta.escala.toLowerCase().includes(busquedaTexto.toLowerCase());
    
    const estatusMatch = filtroEstatus === 'Todos' || ruta.estatus === filtroEstatus;

    return textoMatch && estatusMatch;
  });

  // 📊 ESTADÍSTICAS DINÁMICAS (Calculadas de las rutas reales)
  const totalCompletadas = rutas.filter(r => r.estatus === 'Completado').length + 8; // Base estética + reales
  const horasCamino = rutas.length * 12 + 2; // Simulado dinámico en base al volumen de rutas

  // Calcular parada más frecuente basada en las escalas guardadas
  const conteoEscalas = {};
  rutas.forEach(r => {
    if (r.escala && !r.escala.includes('km') && !r.escala.includes('Directo')) {
      r.escala.split(',').forEach(parada => {
        const pLimpia = parada.trim();
        conteoEscalas[pLimpia] = (conteoEscalas[pLimpia] || 0) + 1;
      });
    }
  });

  let paradaFrecuente = "Mirador Nochixtlán";
  let maxRepeticiones = 0;
  Object.keys(conteoEscalas).forEach(parada => {
    if (conteoEscalas[parada] > maxRepeticiones) {
      maxRepeticiones = conteoEscalas[parada];
      paradaFrecuente = parada;
    }
  });

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Maria A</span>
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

          {/* TARJETAS DE ESTADÍSTICAS EN VIVO */}
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
              <span className="text-xl font-extrabold text-[#F97316]">{paradaFrecuente}</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 flex flex-col transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            
            {/* INPUTS DE FILTRADO */}
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
                <option value="En Tránsito">En Tránsito</option>
                <option value="Completado">Completado</option>
                <option value="Retrasado">Retrasado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <select className={`border rounded-lg px-4 py-2 focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'border-gray-300 text-gray-700'}`}>
                <option>📅 Esta semana</option>
              </select>
            </div>

            <div className="w-full overflow-x-auto mb-4 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                    <th className="py-3 px-2 font-medium">ID Ruta</th>
                    <th className="py-3 px-2 font-medium">Origen - Destino</th>
                    <th className="py-3 px-2 font-medium">Escala / Parada</th>
                    <th className="py-3 px-2 font-medium">Duración</th>
                    <th className="py-3 px-2 font-medium">Estatus</th>
                    <th className="py-3 px-2 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {rutasFiltradas.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-medium">No se encontraron rutas registradas.</td></tr>
                  ) : (
                    rutasFiltradas.map((ruta) => (
                      <tr key={ruta.id} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                        <td className="py-4 px-2 font-bold">{ruta.id}</td>
                        <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                        <td className="py-4 px-2">{ruta.escala}</td>
                        <td className="py-4 px-2">{ruta.duracion}</td>
                        <td className="py-4 px-2"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ruta.estatus)}`}>{ruta.estatus}</span></td>
                        <td className="py-4 px-2 flex items-center gap-3">
                          <button className="flex items-center gap-1 text-[#4F7959] font-semibold hover:underline cursor-pointer">Ver detalle</button>
                          <button onClick={() => handleOpenModal(ruta.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={`flex justify-between items-center text-sm border-t pt-4 mt-auto ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-600'}`}>
              <span>Mostrando {rutasFiltradas.length} rutas encontradas</span>
              <div className="flex gap-2 font-semibold">
                <button className={`hover:text-gray-900 ${isDarkMode ? 'hover:text-white' : ''}`}>&lt;</button>
                <button className="bg-[#4F7959] text-white px-2 py-0.5 rounded">1</button>
                <button className={`hover:text-gray-900 ${isDarkMode ? 'hover:text-white' : ''}`}>&gt;</button>
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
        message={`Estás a punto de borrar la ruta ${rutaAEliminar}. Esta acción no se puede deshacer y se perderá del registro.`}
      />
    </div>
  );
}