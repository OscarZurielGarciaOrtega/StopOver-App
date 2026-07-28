import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminParadas() {
  const [paradas, setParadas] = useState([
    { id: '#P-01', nombre: 'Café de Nadie', propietario: 'Maria A', categoria: 'Cafetería', estatus: 'Aprobado' },
    { id: '#P-02', nombre: 'Mirador de Cristal', propietario: 'Carlos M', categoria: 'Mirador', estatus: 'Pendiente' },
    { id: '#P-03', nombre: 'Artesanías Sola', propietario: 'Juana P', categoria: 'Pueblo Mágico', estatus: 'Aprobado' },
  ]);

  const handleApprove = (id) => {
    setParadas(paradas.map(p => p.id === id ? { ...p, estatus: 'Aprobado' } : p));
  };

  const handleDelete = (id) => {
    setParadas(paradas.filter(p => p.id !== id));
  };

  const getStatusClass = (estatus) => {
    return estatus === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F6]">
      
      <header className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6] border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#2A4532]">StopOver Admin</h1>
        <span className="text-sm font-semibold text-gray-700 bg-gray-200 px-3 py-1 rounded-full">Rol: Administrador</span>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-[#FAF9F6] flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Catálogo de Paradas</h2>
              <p className="text-sm text-gray-500 mt-1">Modera y aprueba los establecimientos registrados en la plataforma</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md">
              + Nueva Parada Global
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-gray-100 text-gray-400 text-sm">
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
                    <tr key={parada.id} className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                      <td className="py-4 px-2 font-bold">{parada.id}</td>
                      <td className="py-4 px-2">{parada.nombre}</td>
                      <td className="py-4 px-2 text-gray-500">{parada.propietario}</td>
                      <td className="py-4 px-2">{parada.categoria}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(parada.estatus)}`}>
                          {parada.estatus}
                        </span>
                      </td>
                      <td className="py-4 px-2 flex items-center gap-2">
                        {parada.estatus === 'Pendiente' && (
                          <button 
                            onClick={() => handleApprove(parada.id)}
                            className="text-green-600 hover:text-green-800 font-semibold text-xs bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Aprobar
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(parada.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}