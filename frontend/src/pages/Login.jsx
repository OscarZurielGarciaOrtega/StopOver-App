import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import globe from '../assets/globe.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🚀 Petición oficial al backend de Emma
      const response = await api.post('/auth/login', { email, password });
      
      // La respuesta oficial trae: { token, email, rol }
      const token = response.data.token;
      const rol = response.data.rol ? response.data.rol.toUpperCase().trim() : 'VIAJERO';
      
      // Guardamos en el localStorage exactamente lo que pide la API
      localStorage.setItem('token', token);
      localStorage.setItem('rol', rol);
      localStorage.setItem('email', email);
      localStorage.setItem('nombre', email);
      
      window.dispatchEvent(new Event('user_profile_updated'));

      // 🔀 REDIRECCIÓN EXACTA SEGÚN EL ROL DE LA BASE DE DATOS
      if (rol === 'ADMIN') {
        navigate('/admin/negocios/pendientes'); 
      } else if (rol === 'PROPIETARIO') {
        navigate('/negocios/registrar'); // O la ruta de registro/panel de propietario que tengas configurada
      } else {
        navigate('/nueva-ruta'); // Rol VIAJERO por defecto
      }

    } catch (err) {
      console.error("Error en login con backend:", err);
      
      const mensajeError = err.response?.data?.mensajes?.[0] || err.response?.data?.message || 'Credenciales incorrectas o error al conectar con el servidor';
      setServerError(mensajeError);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
        
        {/* Lado izquierdo - Ilustración */}
        <div className="bg-[#B9CEB5] w-full md:w-5/12 p-10 flex flex-col items-center justify-center rounded-[32px]">
          <h1 className="text-4xl font-extrabold text-[#2A4532] mb-8">StopOver</h1>
          <img src={globe} alt="Ilustración StopOver" className="w-full max-w-[250px] object-contain drop-shadow-xl" />
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#FAFAF8]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-500 font-medium mb-8">Ingresa tus datos para continuar tu viaje</p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959] shadow-sm`}
                  placeholder="tucorreo@email.com"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959] shadow-sm`}
                  placeholder="••••••••"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <Link to="/recuperar" className="text-sm text-gray-500 hover:text-[#4F7959] font-medium">¿Olvidaste tu contraseña?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-4 rounded-xl transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'CONECTANDO...' : 'ENTRAR'}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-400 font-medium">¿No tienes cuenta? </span>
              <Link to="/registro" className="text-sm text-[#4F7959] font-bold hover:underline">Regístrate</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}