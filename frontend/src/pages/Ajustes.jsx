import React from 'react';

export default function Ajustes() {
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
        
        
        <aside className="w-64 bg-[#FAF9F6] border-r border-gray-200 flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-4">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Nueva ruta
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Historial
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Favoritos
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Buscar
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#CBE3C7] text-[#2A4532] rounded-lg font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Ajustes
            </a>
          </nav>
        </aside>

        
        <main className="flex-1 p-10 bg-white flex flex-col">
          
         
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800">Ajustes de tu cuenta</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Administra tu información y preferencias</p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 max-w-5xl">
            
            
            <div>
              <h3 className="text-[22px] font-medium text-gray-900 mb-2 border-b-2 border-gray-900 pb-2">Perfil</h3>
              
              
              <div className="flex items-center gap-6 mt-6 mb-6">
                <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-16 h-16 rounded-full border border-gray-200 shadow-sm" />
                <button className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors">
                  Cambiar foto
                </button>
              </div>

              
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Nombre</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="Maria A" 
                    className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-500 rounded-xl py-2.5 px-4 pr-10 shadow-sm focus:outline-none focus:border-[#4F7959]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                </div>
              </div>

              
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Correo electronico</label>
                <div className="relative">
                  <input 
                    type="email" 
                    defaultValue="MariaA@gmail.com" 
                    className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-500 rounded-xl py-2.5 px-4 pr-10 shadow-sm focus:outline-none focus:border-[#4F7959]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                </div>
              </div>

              <button className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                Guardar cambios
              </button>
            </div>

            
            <div>
              <h3 className="text-[22px] font-medium text-gray-900 mb-2 border-b-2 border-gray-900 pb-2">Preferencias</h3>
              
              <div className="flex flex-col gap-5 mt-6">
                
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-6 bg-[#567E64] rounded-full relative shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Notificaciones por correo</span>
                </div>

                
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-md border border-gray-100"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Modo oscuro</span>
                </div>

                
                <div className="mt-2 w-32">
                  <select className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:border-[#4F7959] appearance-none cursor-pointer">
                    <option>Español</option>
                    <option>Inglés</option>
                  </select>
                </div>
              </div>
            </div>

            
            <div>
              <h3 className="text-[22px] font-medium text-gray-900 mb-2 border-b-2 border-gray-900 pb-2">Seguridad</h3>
              
              
              <div className="mt-6 mb-4">
                <label className="block text-sm text-gray-600 mb-2">Contraseña actual</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="*************" 
                    className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-400 rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <svg className="w-5 h-5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </div>
                </div>
              </div>

              
              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Nueva contraseña</label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="Escribe tu nueva contraseña"
                    className="w-full bg-[#FAF9F6] border border-gray-200 text-gray-500 rounded-xl py-2.5 px-4 pr-16 shadow-sm focus:outline-none focus:border-[#4F7959]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <svg className="w-5 h-5 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </div>
                </div>
              </div>

              <button className="bg-[#567E64] hover:bg-[#43644F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                Actualizar contraseña
              </button>
            </div>

            
            <div>
              <h3 className="text-[22px] font-medium text-gray-900 mb-2 border-b-2 border-gray-900 pb-2">Otros...</h3>
              
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