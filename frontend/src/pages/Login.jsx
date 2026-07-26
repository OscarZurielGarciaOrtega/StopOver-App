import { useState } from 'react';
import globe from '../assets/globe.png'; // <--- IMPORTAMOS LA IMAGEN AQUÍ

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Debe tener mín. 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulario válido, listo para enviar a la API con Axios');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">
        
        {/* Lado Izquierdo - Ilustración */}
        <div className="bg-[#B9CEB5] w-full md:w-5/12 p-10 flex flex-col items-center justify-center rounded-[32px]">
          <h1 className="text-4xl font-extrabold text-[#2A4532] mb-8">StopOver</h1>
          <img 
            src={globe} // <--- USAMOS LA IMAGEN IMPORTADA AQUÍ
            alt="Ilustración StopOver" 
            className="w-full max-w-[250px] object-contain drop-shadow-xl"
          />
        </div>

        {/* Lado Derecho - Formulario */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center bg-[#FAFAF8]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-500 font-medium mb-10">Ingresa tus datos para continuar tu viaje</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Correo electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-[#4F7959] shadow-sm transition-colors`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold mt-1 leading-tight">{errors.password}</p>}
            </div>

            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm text-gray-400 font-medium hover:text-[#4F7959]">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F7959] hover:bg-[#3D5E45] text-white font-bold py-4 rounded-xl transition-colors shadow-md"
            >
              ENTRAR
            </button>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-400 font-medium">¿No tienes cuenta? </span>
              <a href="#" className="text-sm text-[#4F7959] font-bold hover:underline">Regístrate</a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}