import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // <-- Importamos nuestra API configurada
import globe from '../assets/globe.png';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', telefono: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [serverError, setServerError] = useState(''); // <-- Nuevo estado para los errores de Emma
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiamos el error en tiempo real cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Validar Nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    // 2. Validar Correo (Estilo Login)
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // 3. Validar Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    // 4. Validar Contraseña (Mayúscula, número y carácter especial)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Mín. 8 caracteres, 1 mayúscula, 1 número y 1 especial (@$!%*?&)';
    }

    // 5. Validar Confirmar Contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // AQUÍ ESTÁ LA MAGIA: Convertimos la función a asíncrona
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setServerError(''); // Limpiamos errores previos del servidor

    if (validateForm()) {
      try {
        // Hacemos el POST al endpoint de Emma mapeando los campos como ella los pide
        await api.post('/auth/registro', {
          nombre: formData.name, 
          email: formData.email,
          telefono: formData.telefono,
          password: formData.password
        });
        
        // Si todo sale 100% bien en el backend, mostramos tu modal nativo de Tailwind
        setShowModal(true);
      } catch (error) {
        // Leemos el error estandarizado de Emma (ej. "El correo ya existe")
        const mensajeError = error.response?.data?.mensajes?.[0] || 'Error al conectar con el servidor';
        setServerError(mensajeError);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans relative">
      <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
        
        {/* Lado Izquierdo */}
        <div className="bg-[#B9CEB5] w-full md:w-5/12 p-10 flex flex-col items-center justify-center rounded-[32px]">
          <h1 className="text-4xl font-extrabold text-[#2A4532] mb-8">StopOver</h1>
          <img src={globe} alt="Ilustración StopOver" className="w-full max-w-[250px] object-contain drop-shadow-xl" />
        </div>

        {/* Lado Derecho */}
        <div className="w-full md:w-7/12 p-8 md:px-16 md:py-10 flex flex-col justify-center bg-[#FAFAF8]">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">¡Únete al viaje!</h2>
          <p className="text-gray-500 font-medium mb-6">Crea tu cuenta y empieza a planear</p>

          {/* AQUÍ IMPRIMIMOS EL ERROR DEL SERVIDOR SI ES QUE HAY ALGUNO */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-xl font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-1">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959]`}
              />
              {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-1">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959]`}
              />
              {errors.email && <p className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-1">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.telefono ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959]`}
              />
              {errors.telefono && <p className="text-red-500 text-xs font-semibold mt-1">{errors.telefono}</p>}
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959]`}
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959]`}
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m14.41 14.41l-3.59-3.59"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs font-semibold mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-2">
              CREAR CUENTA
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-400 font-medium">¿Ya tienes cuenta? </span>
              <Link to="/" className="text-sm text-[#4F7959] font-bold hover:underline">Inicia sesión</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Nativo Tailwind */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-[#E8F0E9] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-[#4F7959]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-[#2A4532] mb-2">¡Cuenta creada!</h3>
            <p className="text-gray-500 font-medium mb-8">Te has unido al viaje correctamente. Ya puedes iniciar sesión.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}