import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function Ajustes() {
  // 1. Cargar el avatar o usar uno por defecto guardado
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('stopover_user_avatar') || 'https://i.pravatar.cc/150?img=47';
  });
  
  // 2. Cargar el estado del Modo Oscuro desde localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // 3. Cargar el nombre y correo desde localStorage si existen
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('stopover_user_nombre') || 'Maria A';
  });
  const [correo, setCorreo] = useState(() => {
    return localStorage.getItem('stopover_user_correo') || 'MariaA@gmail.com';
  });

  // Función para manejar la subida de la imagen y guardarla en localStorage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      localStorage.setItem('stopover_user_avatar', imageUrl);
    }
  };

  // Función para alternar y guardar el modo oscuro globalmente
  const toggleDarkMode = () => {
    const nuevoEstado = !isDarkMode;
    setIsDarkMode(nuevoEstado);
    localStorage.setItem('stopover_dark_mode', nuevoEstado);
    
    // 🔔 DISPARA UN EVENTO PARA QUE EL SIDEBAR Y OTRAS VISTAS SE ACTUALICEN AL INSTANTE
    window.dispatchEvent(new Event('storage_updated'));
  };

  // Función para guardar los cambios de perfil en localStorage
  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    localStorage.setItem('stopover_user_nombre', nombre);
    localStorage.setItem('stopover_user_correo', correo);
    alert('¡Perfil y cambios guardados con éxito en el sistema!');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      {/* Header */}
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <div className="flex items-center gap-2 text-[#2A4532]">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src={avatar} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover" />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombre}</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        <Sidebar />

        <main className={`flex-1 p-10 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          <div className="mb-10">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Ajustes de tu cuenta</h2>
            <p className="text-sm font-medium mt-1 text-gray-400">Administra tu información y preferencias</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 max-w-5xl">
            
            {/* PERFIL */}
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Perfil</h3>
              
              <div className="flex items-center gap-6 mt-6 mb-6">
                <img src={avatar} alt="Perfil" className="w-16 h-16 rounded-full border border-gray-200 shadow-sm object-cover" />
                
                <input 
                  type="file" 
                  id="upload-avatar" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="upload-avatar" 
                  className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Cambiar foto
                </label>
              </div>

              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nombre</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className={`w-full border rounded-xl py-2.5 px-4 pr-10 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correo electrónico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className={`w-full border rounded-xl py-2.5 px-4 pr-10 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGuardarPerfil} 
                className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Guardar cambios
              </button>
            </div>

            {/* PREFERENCIAS */}
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Preferencias</h3>
              
              <div className="flex flex-col gap-5 mt-6">
                
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-6 bg-[#567E64] rounded-full relative shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notificaciones por correo</span>
                </div>

                {/* SWITCH INTERACTIVO PARA EL MODO OSCURO */}
                <div 
                  className="flex items-center gap-4 cursor-pointer select-none"
                  onClick={toggleDarkMode}
                >
                  <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${isDarkMode ? 'bg-[#567E64]' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md border border-gray-100 transition-all duration-300 ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modo oscuro</span>
                </div>

                <div className="mt-2 w-32">
                  <select className={`w-full border rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:border-[#4F7959] appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <option>Español</option>
                    <option>Inglés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEGURIDAD */}
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Seguridad</h3>
              
              <div className="mt-6 mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contraseña actual</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="*************" 
                    className={`w-full border rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-[#FAF9F6] border-gray-200 text-gray-400'}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nueva contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Escribe tu nueva contraseña"
                    className={`w-full border rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-500'}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                </div>
              </div>

              <button onClick={() => alert('¡Contraseña actualizada!')} className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm">
                Actualizar contraseña
              </button>
            </div>
            
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Otros...</h3>
            </div>

          </div>

          <footer className="text-center text-sm text-gray-500 pt-10 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}