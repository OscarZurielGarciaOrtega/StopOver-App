import React, { useState } from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  // 🌙 ESTADO PARA EL MODO OSCURO GLOBAL
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 text-center transition-colors duration-300 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-red-100/80 rounded-full flex items-center justify-center text-red-500 shadow-sm">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
        
        <div className="flex justify-center gap-3">
          <button 
            onClick={onClose} 
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer w-full ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-md w-full"
          >
            Sí, eliminar
          </button>
        </div>

      </div>
    </div>
  );
}