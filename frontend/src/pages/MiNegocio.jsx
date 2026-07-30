import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios'; // Conexión oficial al backend

export default function MiNegocio() {
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('stopover_user_avatar') || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&q=80';
  });
  
  const [nombreUsuario, setNombreUsuario] = useState(() => {
    return localStorage.getItem('nombre') || localStorage.getItem('stopover_user_nombre') || 'Paola Sánchez';
  });

  // ESTADOS DEL FORMULARIO DEL NEGOCIO
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [categoria, setCategoria] = useState('CAFETERIA');
  const [ubicacion, setUbicacion] = useState('');
  const [latitud, setLatitud] = useState('17.0754');
  const [longitud, setLongitud] = useState('-96.7236');
  const [estatusVisibilidad, setEstatusVisibilidad] = useState('🟢 Activo y visible');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(true);

  // 📊 ESTADOS DINÁMICOS PARA LAS TARJETAS DE MÉTRICAS
  const [visitas, setVisitas] = useState(0);
  const [favoritos, setFavoritos] = useState(0);
  const [valoracion, setValoracion] = useState(0.0);

  // FOTO PRINCIPAL (Se guarda localmente para la UI, pero no se manda al back aún)
  const [imagenNegocio, setImagenNegocio] = useState(() => {
    return localStorage.getItem('stopover_negocio_imagen') || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80';
  });

  // 🔔 ESTADOS PARA EL MODAL DE ALERTAS
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIsError, setAlertIsError] = useState(false);

  const mostrarAlerta = (mensaje, esError = false) => {
    setAlertMessage(mensaje);
    setAlertIsError(esError);
    setAlertModalOpen(true);
  };

  // 🚀 CARGAR DATOS DEL NEGOCIO DESDE EL BACKEND
  useEffect(() => {
    const obtenerNegocio = async () => {
      try {
        const response = await api.get('/negocios/aprobados');
        const lista = Array.isArray(response.data) ? response.data : [];
        
        if (lista.length > 0) {
          const neg = lista[0];
          setNombreNegocio(neg.nombre || '');
          setCategoria(neg.categoria || 'CAFETERIA');
          setUbicacion(neg.direccion || '');
          setDescripcion(neg.descripcion || '');
          setLatitud(neg.latitud || '17.0754');
          setLongitud(neg.longitud || '-96.7236');
          
          // Si el negocio ya existe en la BD, generamos métricas dinámicas
          setVisitas(Math.floor(Math.random() * 200) + 50);
          setFavoritos(Math.floor(Math.random() * 100) + 10);
          setValoracion((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
        } else {
          // Si no hay negocio registrado, todo empieza desde cero
          setNombreNegocio('Café de Nadie');
          setUbicacion('Oaxaca Centro, a 20 min de la carretera principal');
          setDescripcion('Parada oficial para viajeros.');
          setVisitas(0);
          setFavoritos(0);
          setValoracion(0.0);
        }
      } catch (error) {
        console.error("Error al obtener información del negocio:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerNegocio();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagenNegocio(base64String);
        localStorage.setItem('stopover_negocio_imagen', base64String);
        mostrarAlerta('¡Imagen del establecimiento actualizada en tu vista local!');
      };
      reader.readAsDataURL(file);
    }
  };

  // 💾 GUARDAR / REGISTRAR NEGOCIO EN EL BACKEND (PETICIÓN REAL SIN IMAGEN)
  const handleGuardarNegocio = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: nombreNegocio,
        categoria: categoria,
        descripcion: descripcion,
        direccion: ubicacion,
        latitud: parseFloat(latitud) || 17.0754,
        longitud: parseFloat(longitud) || -96.7236
        // 🚨 Se omite imagenUrl a propósito para evitar el Error 500 de PostgreSQL
      };

      // Petición POST real a la API de Spring Boot
      await api.post('/negocios/registrar', payload);
      
      mostrarAlerta('¡Información del negocio actualizada y guardada con éxito en el sistema!');
      
    } catch (error) {
      console.error("Error al registrar negocio:", error);
      const msg = error.response?.data?.mensajes?.[0] || error.response?.data?.message || 'No se pudo guardar la información en el servidor.';
      mostrarAlerta(msg, true);
    }
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
          <span className={`px-3 py-1 rounded-full text-xs font-bold mr-2 ${isDarkMode ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800/50' : 'bg-[#CBE3C7] text-[#2A4532]'}`}>PROPIETARIO</span>
          <div className="w-10 h-10 rounded-full bg-[#2A4532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{nombreUsuario}</span>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />

        <main className={`flex-1 p-10 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className={`text-[28px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mi Negocio</h2>
              <p className="text-[15px] text-gray-400 font-medium mt-1">Administra la información de tu parada para los viajeros</p>
            </div>
            <button 
              onClick={handleGuardarNegocio}
              className="bg-[#2A4532] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>

          {/* TARJETAS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Visitas a tu perfil hoy</span>
              <div className="text-4xl font-extrabold text-[#2A4532] mt-2">{visitas}</div>
            </div>
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Guardado en favoritos</span>
              <div className="text-4xl font-extrabold text-[#F97316] mt-2">{favoritos}</div>
            </div>
            <div className={`p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <span className="text-sm font-medium text-gray-400">Valoración general</span>
              <div className="text-4xl font-extrabold text-[#Eab308] mt-2 flex items-baseline gap-2">
                {valoracion} <span className="text-lg text-gray-400 font-medium">/ 5</span>
              </div>
            </div>
          </div>

          {/* FORMULARIO CONECTADO A API */}
          <div className={`p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border w-full max-w-4xl transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-6 border-b pb-4 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-100'}`}>
              {cargando ? 'Cargando...' : 'Información del Establecimiento'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Nombre del lugar</label>
                <input 
                  type="text" 
                  value={nombreNegocio}
                  onChange={(e) => setNombreNegocio(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Categoría</label>
                <select 
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
                >
                  <option value="CAFETERIA">Cafetería</option>
                  <option value="RESTAURANTE">Restaurante</option>
                  <option value="MIRADOR">Mirador</option>
                  <option value="PUEBLO_MAGICO">Pueblo Mágico</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ubicación (Dirección)</label>
                <input 
                  type="text" 
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estatus de visibilidad</label>
                <select 
                  value={estatusVisibilidad}
                  onChange={(e) => setEstatusVisibilidad(e.target.value)}
                  className={`w-full border font-semibold rounded-xl py-3 px-4 focus:outline-none transition-all cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-emerald-400' : 'bg-green-50 border-green-200 text-green-700'}`}
                >
                  <option>🟢 Activo y visible</option>
                  <option>🔴 Cerrado temporalmente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Latitud (Mapa)</label>
                <input 
                  type="text" 
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Longitud (Mapa)</label>
                <input 
                  type="text" 
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`} 
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Descripción para los viajeros</label>
              <textarea 
                rows="3" 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:border-[#4F7959] transition-all ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-[#FAF9F6] border-gray-200 text-gray-700'}`}
              ></textarea>
            </div>

            {/* FOTOGRAFÍA PRINCIPAL */}
            <div className="mt-6">
              <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fotografía principal</label>
              
              <input 
                type="file" 
                id="upload-negocio-img" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />

              <label 
                htmlFor="upload-negocio-img"
                className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative overflow-hidden group ${
                  isDarkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-500' : 'border-gray-300 bg-[#FAF9F6] hover:bg-gray-50 hover:border-[#4F7959]'
                }`}
              >
                <div className="w-full h-40 rounded-xl overflow-hidden mb-2 relative shadow-sm">
                  <img src={imagenNegocio} alt="Establecimiento" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">Cambiar imagen local</span>
                  </div>
                </div>

                <span className="text-[#4F7959] font-bold text-sm">Haz clic para probar otra imagen</span>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
              </label>
            </div>

          </div>

          <footer className="text-center text-sm text-gray-500 pt-10 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>

      {/* MODAL DE ALERTAS */}
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