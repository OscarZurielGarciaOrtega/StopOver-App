import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminUsuarios() {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL (Sincronizado con localStorage)
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // PERSISTENCIA REAL: Carga los usuarios del navegador o usa la lista por defecto
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('stopover_admin_usuarios');
    if (guardadas) {
      try {
        return JSON.parse(guardadas);
      } catch (e) {
        console.error("Error al leer localStorage", e);
      }
    }
    return [
      { id: 1, nombre: 'Oscar García', correo: 'oscar@ito.edu.mx', rol: 'VIAJERO', estatus: 'Activo' },
      { id: 2, nombre: 'Maria A', correo: 'MariaA@gmail.com', rol: 'ADMIN', estatus: 'Activo' },
      { id: 3, nombre: 'Carlos Mendoza', correo: 'carlos.m@gmail.com', rol: 'VIAJERO', estatus: 'Bloqueado' },
    ];
  });

  // Guardar en localStorage automáticamente al modificar la lista
  useEffect(() => {
    localStorage.setItem('stopover_admin_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  // Función para alternar entre Bloqueado y Activo
  const handleToggleBloqueo = (id) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === id) {
        const nuevoEstatus = u.estatus === 'Activo' ? 'Bloqueado' : 'Activo';
        return { ...u, estatus: nuevoEstatus };
      }
      return u;
    }));
  };

  // Función para eliminar usuario
  const handleDelete = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
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
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gestión de Usuarios</h2>
              <p className="text-sm text-gray-400 mt-1">Control total de cuentas registradas en el sistema</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer">
              + Nuevo Usuario
            </button>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                  <th className="py-3 px-2 font-medium">Nombre</th>
                  <th className="py-3 px-2 font-medium">Correo</th>
                  <th className="py-3 px-2 font-medium">Rol</th>
                  <th className="py-3 px-2 font-medium">Estatus</th>
                  <th className="py-3 px-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400 font-medium">
                      No hay usuarios registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                      <td className="py-4 px-2 font-bold">{usuario.nombre}</td>
                      <td className={`py-4 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{usuario.correo}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#CBE3C7] text-[#2A4532]'}`}>
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.estatus === 'Activo' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {usuario.estatus}
                        </span>
                      </td>
                      <td className="py-4 px-2 flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleBloqueo(usuario.id)}
                          className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            usuario.estatus === 'Activo' 
                              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {usuario.estatus === 'Activo' ? 'Bloquear' : 'Desbloquear'}
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
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