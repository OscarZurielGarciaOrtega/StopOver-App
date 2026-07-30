import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import globe from '../assets/globe.png';
import api from '../api/axios'; // Conexión oficial a la API de Emma

export default function Recovery() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 CONEXIÓN OFICIAL AL ENDPOINT DE RECUPERACIÓN DE EMMA
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCargando(true);
    setMensajeExito('');

    try {
      // Consumimos el endpoint oficial: POST /api/auth/recuperar-password
      await api.post('/auth/recuperar-password', { email });

      setMensajeExito('¡Código de recuperación enviado con éxito! Revisa tu bandeja.');
      
      // Opcional: después de 3 segundos lo mandamos al login o a la pantalla de reset
      setTimeout(() => {
        navigate('/');
      }, 3500);

    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      const mensajeBack = error.response?.data?.mensajes?.[0] || error.response?.data?.message || 'No se pudo procesar la solicitud en el servidor.';
      setErrors({ email: mensajeBack });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      
      {/* Contenedor Principal (Tarjeta) */}
      <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
        
        {/* Lado Izquierdo - Ilustración */}
        <div className="bg-[#B9CEB5] w-full md:w-5/12 p-10 flex flex-col items-center justify-center rounded-[32px]">
          <h1 className="text-4xl font-extrabold text-[#2A4532] mb-8">StopOver</h1>
          <img 
            src={globe} 
            alt="Ilustración StopOver" 
            className="w-full max-w-[250px] object-contain drop-shadow-xl"
          />
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#FAFAF8]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">¿Olvidaste tu contraseña?</h2>
          <p className="text-gray-500 font-medium mb-8 text-center">No te preocupes, te ayudamos a recuperarla</p>

          {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-xl text-sm font-semibold text-center">
              {mensajeExito}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Correo */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959] shadow-sm transition-colors`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-4 cursor-pointer disabled:opacity-50"
            >
              {cargando ? 'ENVIANDO SOLICITUD...' : 'ENVIAR ENLACE DE RECUPERACION'}
            </button>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-400 font-medium">¿Ya te acordaste? </span>
              <Link to="/" className="text-sm text-[#4F7959] font-bold hover:underline">Inicia sesión</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}