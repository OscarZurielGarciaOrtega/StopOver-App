import React, { useState } from 'react';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar'; 

export default function Historial() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rutaAEliminar, setRutaAEliminar] = useState(null);

  const [rutas, setRutas] = useState([
    { id: '#ST-901', origen: 'Oaxaca', destino: 'Puebla', escala: 'Cafetería Centro Tehuacán', duracion: '4 h 15 m', estatus: 'En Tránsito' },
    { id: '#ST-902', origen: 'Oaxaca', destino: 'CDMX', escala: 'Mirador Nochixtlán', duracion: '6 h 30 m', estatus: 'Completado' },
    { id: '#ST-903', origen: 'Puebla', destino: 'CDMX', escala: 'Directo (Sin escala)', duracion: '2 h 00 m', estatus: 'Completado' },
    { id: '#ST-904', origen: 'Oaxaca', destino: 'Pto. Escondido', escala: 'Pueblo Mágico Sola de Vega', duracion: '3 h 45 m', estatus: 'Retrasado' },
  ]);

  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 'En Tránsito': return 'bg-green-100 text-green-700';
      case 'Completado': return 'bg-blue-100 text-blue-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleOpenModal = (id) => {
    setRutaAEliminar(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setRutas(rutas.filter(ruta => ruta.id !== rutaAEliminar));
    setRutaAEliminar(null);
  };

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
        <Sidebar /> 
       
        <main className="flex-1 p-8 bg-[#FAF9F6] flex flex-col">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Historial de viajes</h2>
              <p className="text-sm text-gray-500 mt-1">Revisa tus rutas pasadas y estadísticas de viaje</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1E3324] transition-colors shadow-md">
              <span className="text-xl leading-none">+</span> Nueva parada
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Rutas completadas</span>
              <span className="text-4xl font-extrabold text-[#16A34A]">12</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Horas en el camino</span>
              <span className="text-4xl font-extrabold text-[#2563EB]">48 h</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Parada más frecuente</span>
              <span className="text-xl font-extrabold text-[#F97316]">Mirador Nochixtlán</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            <div className="flex gap-4 mb-6">
              <input type="text" placeholder="Buscar por origen, destino o parada" className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532]" />
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]"><option>Estatus: Todos</option></select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]"><option>📅 Esta semana</option></select>
            </div>

            <div className="w-full overflow-x-auto mb-4 flex-1">
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
                  {rutas.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400 font-medium">No hay rutas registradas.</td></tr>
                  ) : (
                    rutas.map((ruta) => (
                      <tr key={ruta.id} className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                        <td className="py-4 px-2 font-bold">{ruta.id}</td>
                        <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                        <td className="py-4 px-2">{ruta.escala}</td>
                        <td className="py-4 px-2">{ruta.duracion}</td>
                        <td className="py-4 px-2"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ruta.estatus)}`}>{ruta.estatus}</span></td>
                        <td className="py-4 px-2 flex items-center gap-3">
                          <button className="flex items-center gap-1 text-[#4F7959] font-semibold hover:underline">Ver detalle</button>
                          <button onClick={() => handleOpenModal(ruta.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-4 mt-auto">
              <span>Mostrando {rutas.length} rutas activas</span>
              <div className="flex gap-2 font-semibold">
                <button className="hover:text-gray-900">&lt;</button>
                <button className="bg-[#4F7959] text-white px-2 py-0.5 rounded">1</button>
                <button className="hover:text-gray-900 px-1">2</button>
                <span className="text-gray-400">|</span>
                <button className="hover:text-gray-900 px-1">3</button>
                <button className="hover:text-gray-900">&gt;</button>
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