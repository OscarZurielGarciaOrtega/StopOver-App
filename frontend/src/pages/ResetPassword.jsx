import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import globe from '../assets/globe.png';
import api from '../api/axios';

export default function ResetPassword() {
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const emailGuardado = localStorage.getItem('reset_email') || '';

  const handleReset = async (e) => {
    e.preventDefault();
    if (!codigo || !nuevaPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (codigo.length !== 6) {
      setError('El código debe ser de exactamente 6 dígitos.');
      return;
    }

    setCargando(true);
    setError('');

    try {
      // Ajusta la ruta si tu compa creó un endpoint para validar y cambiar contraseña (ej. /auth/reset-password o /auth/cambiar-password)
      await api.post('/auth/reset-password', {
        email: emailGuardado,
        codigo: codigo,
        nuevaPassword: nuevaPassword
      });

      setMensajeExito('¡Contraseña actualizada con éxito! Redirigiendo al login...');
      localStorage.removeItem('reset_email');

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setError(err.response?.data?.message || 'Código inválido o expirado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
        <div className="bg-[#B9CEB5] w-full md:w-5/12 p-10 flex flex-col items-center justify-center rounded-[32px]">
          <h1 className="text-4xl font-extrabold text-[#2A4532] mb-8">StopOver</h1>
          <img src={globe} alt="Ilustración StopOver" className="w-full max-w-[250px] object-contain drop-shadow-xl" />
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#FAFAF8]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Nueva contraseña</h2>
          <p className="text-gray-500 font-medium mb-6 text-center">
            Ingresa el código de 6 dígitos enviado a <span className="font-bold text-gray-700">{emailGuardado || 'tu correo'}</span>
          </p>

          {mensajeExito && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-xl text-sm font-semibold text-center">
              {mensajeExito}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Código de 6 dígitos</label>
              <input
                type="text"
                maxLength="6"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#4F7959] text-center tracking-widest text-xl font-bold shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Nueva contraseña</label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#4F7959] shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
            
              className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-4 rounded-xl transition-colors shadow-md mt-4 cursor-pointer disabled:opacity-50"
            >
              {cargando ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}