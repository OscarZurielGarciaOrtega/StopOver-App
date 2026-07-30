import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.getItem('stopover_dark_mode') === 'true');
    };
    window.addEventListener('storage_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage_updated', handleStorageChange);
    };
  }, []);

  // Leemos el rol exacto que guardó el backend al hacer login (en mayúsculas)
  const userRole = (localStorage.getItem('rol') || 'VIAJERO').toUpperCase().trim();

  const activeClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-[#CBE3C7] text-[#2A4532] font-bold";
  const inactiveClass = isDarkMode 
    ? "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 font-medium hover:bg-gray-800 hover:text-emerald-400"
    : "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 font-medium hover:bg-gray-50 hover:text-[#4F7959]";

  return (
    <aside className={`w-64 border-r flex flex-col pt-6 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-[#FAF9F6] border-gray-200'}`}>
      <nav className="flex flex-col gap-1 px-4">
        
        {/* Menú exclusivo para rol VIAJERO */}
        {userRole === 'VIAJERO' && (
          <>
            <NavLink to="/nueva-ruta" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Nueva ruta
            </NavLink>

            <NavLink to="/historial" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Historial
            </NavLink>

            <NavLink to="/favoritos" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Favoritos
            </NavLink>

            <NavLink to="/buscar" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Buscar
            </NavLink>
          </>
        )}
    
        {/* Menú exclusivo para rol PROPIETARIO */}
        {userRole === 'PROPIETARIO' && (
          <NavLink to="/mi-negocio" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            Mi Negocio
          </NavLink>
        )}

        {/* Menú exclusivo para rol ADMIN */}
        {userRole === 'ADMIN' && (
          <>
            <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Gestión Usuarios
            </NavLink>
            
            <NavLink to="/admin/paradas" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Catálogo Paradas
            </NavLink>
          </>
        )}
        
        {/* Ajustes visible para cualquier rol */}
        <NavLink to="/ajustes" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Ajustes
        </NavLink>

      </nav>
    </aside>
  );
}