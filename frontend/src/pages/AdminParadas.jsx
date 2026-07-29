import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminParadas() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // PERSISTENCIA REAL: Carga las paradas del navegador o usa las por defecto
  const [paradas, setParadas] = useState(() => {
    const guardadas = localStorage.getItem('stopover_admin_paradas');
    if (guardadas) {
      try {
        return JSON.parse(guardadas);
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }
    return [
      { id: '#P-01', nombre: 'Café de Nadie', propietario: 'Maria A', categoria: 'Cafetería', estatus: 'Aprobado' },
      { id: '#P-02', nombre: 'Mirador de Cristal', propietario: 'Carlos M', categoria: 'Mirador', estatus: 'Pendiente' },
      { id: '#P-03', nombre: 'Artesanías Sola', propietario: 'Juana P', categoria: 'Pueblo Mágico', estatus: 'Aprobado' },
    ];
  });

  // Guardar en localStorage automáticamente cada vez que cambie la lista
  useEffect(() => {
    localStorage.setItem('stopover_admin_paradas', JSON.stringify(paradas));
  }, [paradas]);

  const handleApprove = (id) => {
    setParadas(paradas.map(p => p.id === id ? { ...p, estatus: 'Aprobado' } : p));
  };

  const handleDelete = (id) => {
    setParadas(paradas.filter(p => p.id !== id));
  };

  const getStatusClass = (estatus) => {
    return estatus === 'Aprobado' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-amber-100 text-amber-700';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <h1 className="text-2xl font-bold text-[#2A4532]">StopOver Admin</h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Rol: Administrador</span>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className={`flex-1 p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#FAF9F6]'}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Catálogo de Paradas</h2>
              <p className="text-sm text-gray-400 mt-1">Modera y aprueba los establecimientos registrados en la plataforma</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer">
              + Nueva Parada Global
            </button>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
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
                      <td className="py-4 px-2 font-bold">{parada.id}</td>
                      <td className="py-4 px-2">{parada.nombre}</td>
                      <td className={`py-4 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{parada.propietario}</td>
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
                            className="text-green-600 hover:text-green-800 font-semibold text-xs bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Aprobar
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(parada.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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