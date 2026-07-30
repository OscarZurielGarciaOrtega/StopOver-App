import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Ajustes() {

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

 
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('nombre') || localStorage.getItem('email') || 'Maria A';
  });
  const [correo, setCorreo] = useState(() => {
    return localStorage.getItem('email') || localStorage.getItem('stopover_user_correo') || 'kopleskanon@gmail.com';
  });

  // Estados para contraseñas
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');

  // 🔔 ESTADOS PARA EL MODAL DE ALERTAS
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIsError, setAlertIsError] = useState(false);

  const mostrarAlerta = (mensaje, esError = false) => {
    setAlertMessage(mensaje);
    setAlertIsError(esError);
    setAlertModalOpen(true);
  };

  useEffect(() => {
    const handleProfileChange = () => {
      setNombre(localStorage.getItem('nombre') || localStorage.getItem('email') || 'Maria A');
      setCorreo(localStorage.getItem('email') || localStorage.getItem('stopover_user_correo') || 'kopleskanon@gmail.com');
    };
    window.addEventListener('user_profile_updated', handleProfileChange);
    return () => window.removeEventListener('user_profile_updated', handleProfileChange);
  }, []);

  // Función para alternar modo oscuro
  const toggleDarkMode = () => {
    const nuevoEstado = !isDarkMode;
    setIsDarkMode(nuevoEstado);
    localStorage.setItem('stopover_dark_mode', nuevoEstado);
    window.dispatchEvent(new Event('storage_updated'));
  };

  // Guardar perfil
  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('email', correo);
    window.dispatchEvent(new Event('user_profile_updated'));
    mostrarAlerta('¡Perfil y configuración guardados con éxito en el sistema!');
  };

  // Actualizar contraseña
  const handleActualizarPassword = (e) => {
    e.preventDefault();
    if (!passwordNueva || !passwordActual) {
      mostrarAlerta('Por favor escribe tu contraseña actual y la nueva antes de actualizar.', true);
      return;
    }
    mostrarAlerta('¡Tu contraseña ha sido actualizada correctamente en el sistema!');
    setPasswordActual('');
    setPasswordNueva('');
  };

  // FUNCIÓN PARA CERRAR SESIÓN
  const handleCerrarSesion = () => {
    // Limpiamos los datos de sesión del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    localStorage.removeItem('stopover_user_correo');
    localStorage.removeItem('stopover_user_nombre');
    
    // Redirigimos al login (ajusta la ruta '/' o '/login' según maneje tu Router)
    window.location.href = '/';
  };

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
          <div className="w-10 h-10 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {correo.charAt(0).toUpperCase()}
          </div>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{correo}</span>
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
            

            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Perfil</h3>
              
              <div className="flex items-center gap-6 mt-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-gray-300">
                  {correo.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{nombre}</p>
                  <p className="text-xs text-gray-400">{correo}</p>
                </div>
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

            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Preferencias</h3>
              
              <div className="flex flex-col gap-5 mt-6">
                <div 
                  className="flex items-center gap-4 cursor-pointer select-none"
                  onClick={toggleDarkMode}
                >
                  <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${isDarkMode ? 'bg-[#567E64]' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md border border-gray-100 transition-all duration-300 ${isDarkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modo oscuro</span>
                </div>
              </div>
            </div>

         
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Seguridad</h3>
              
              <div className="mt-6 mb-4">
                <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contraseña actual</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    placeholder="Escribe tu contraseña actual" 
                    className={`w-full border rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
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
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    placeholder="Escribe tu nueva contraseña"
                    className={`w-full border rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959] ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleActualizarPassword} 
                className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Actualizar contraseña
              </button>
            </div>
            
        
            <div>
              <h3 className={`text-[22px] font-medium mb-2 border-b-2 pb-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-900'}`}>Sesión</h3>
              <p className={`text-sm mb-4 mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Finaliza tu sesión actual de forma segura para cambiar de cuenta o rol.
              </p>
              <button 
                onClick={handleCerrarSesion}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Cerrar sesión
              </button>
            </div>

          </div>

          <footer className="text-center text-sm text-gray-500 pt-10 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>

    
      {alertModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <div className="flex justify-center mb-4">
              <span className="text-5xl">{alertIsError ? '⚠️' : '✅'}</span>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {alertIsError ? 'Atención' : '¡Éxito!'}
            </h3>
            <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {alertMessage}
            </p>
            <button
              onClick={() => setAlertModalOpen(false)}
              className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer w-full"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}