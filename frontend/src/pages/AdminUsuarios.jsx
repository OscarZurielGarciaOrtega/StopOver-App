import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminUsuarios() {
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
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
              <p className="text-sm text-gray-500 mt-1">Control total de cuentas registradas en el sistema</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md">
              + Nuevo Usuario
            </button>
          </div>

          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-gray-100 text-gray-400 text-sm">
                  <th className="py-3 px-2 font-medium">Nombre</th>
                  <th className="py-3 px-2 font-medium">Correo</th>
                  <th className="py-3 px-2 font-medium">Rol</th>
                  <th className="py-3 px-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                  <td className="py-4 px-2 font-bold">Oscar García</td>
                  <td className="py-4 px-2">oscar@ito.edu.mx</td>
                  <td className="py-4 px-2"><span className="bg-[#CBE3C7] text-[#2A4532] px-3 py-1 rounded-full text-xs font-bold">VIAJERO</span></td>
                  <td className="py-4 px-2">
                    <button className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Bloquear</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}