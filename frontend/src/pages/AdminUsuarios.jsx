import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import api from '../api/axios'; // Conexión oficial al backend

export default function AdminUsuarios() {
  const [isDarkMode] = useState(() => {
    return localStorage.getItem('stopover_dark_mode') === 'true';
  });

  // ESTADOS CONECTADOS AL BACKEND
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ESTADOS PARA LOS MODALES
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // ESTADOS PARA CAMBIO DE ROL
  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRolSeleccionado, setNuevoRolSeleccionado] = useState('');

  // Campos para el formulario de nuevo usuario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoRol, setNuevoRol] = useState('VIAJERO');
  const [nuevoPassword, setNuevoPassword] = useState('Password123!');

  // 🚀 CARGAR USUARIOS DESDE EL BACKEND
  const fetchUsuarios = async () => {
    try {
      setCargando(true);
      const response = await api.get('/usuarios');
      const lista = response.data.content || response.data;
      
      const usuariosFormateados = lista.map(u => ({
        id: u.id,
        nombre: u.nombre,
        correo: u.email, 
        rol: u.rol || 'VIAJERO', 
        estatus: u.estatus || 'Activo' // Ahora mapeamos el estatus real si el backend lo manda
      }));

      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔒 BLOQUEAR / DESBLOQUEAR REAL CON EL BACKEND
  const handleToggleBloqueo = async (id, estatusActual) => {
    try {
      const nuevoEstatus = estatusActual === 'Activo' ? 'Bloqueado' : 'Activo';
      await api.put(`/admin/usuarios/${id}/estatus`, { estatus: nuevoEstatus });
      
      setUsuarios(usuarios.map(u => {
        if (u.id === id) {
          return { ...u, estatus: nuevoEstatus };
        }
        return u;
      }));
    } catch (error) {
      console.error("Error al cambiar estatus del usuario:", error);
      alert("No se pudo actualizar el estatus en el servidor.");
    }
  };

  // 🔴 Eliminar usuario real
  const handleOpenDeleteModal = (id) => {
    setUsuarioAEliminar(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/admin/usuarios/${usuarioAEliminar}`);
      setUsuarios(usuarios.filter(u => u.id !== usuarioAEliminar));
      setUsuarioAEliminar(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario en el servidor.");
    }
  };

  // 🟢 Crear Usuario Real (Endpoint de Admin)
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoCorreo) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const payload = {
        nombre: nuevoNombre,
        email: nuevoCorreo,
        password: nuevoPassword,
        rol: nuevoRol
      };

      await api.post('/admin/usuarios', payload);
      
      // Recargamos la lista desde la base de datos
      await fetchUsuarios();

      setNuevoNombre('');
      setNuevoCorreo('');
      setNuevoRol('VIAJERO');
      setIsNuevoModalOpen(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      const msg = error.response?.data?.mensajes?.[0] || error.response?.data?.message || 'No se pudo crear el usuario.';
      alert(msg);
    }
  };

  // 🔵 Abrir modal de Cambio de Rol
  const handleAbrirModalRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNuevoRolSeleccionado(usuario.rol);
    setIsRolModalOpen(true);
  };

  // 🔵 Confirmar Cambio de Rol Real con el Backend
  const handleConfirmarCambioRol = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/usuarios/${usuarioSeleccionado.id}/rol`, {
        rol: nuevoRolSeleccionado
      });
      
      setUsuarios(usuarios.map(u => 
        u.id === usuarioSeleccionado.id ? { ...u, rol: nuevoRolSeleccionado } : u
      ));
      setIsRolModalOpen(false);
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      alert("No se pudo actualizar el rol en el servidor.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-[#FAF9F6] text-gray-800'}`}>
      
      <header className={`flex items-center justify-between px-8 py-4 border-b transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-[#FAF9F6] border-gray-200'}`}>
        <h1 className="text-2xl font-bold text-[#2A4532]">StopOver Admin</h1>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Rol: Administrador</span>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className={`flex-1 p-8 flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-[#FAF9F6]'}`}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gestión de Usuarios</h2>
              <p className="text-sm text-gray-400 mt-1">Control total de cuentas registradas en el sistema</p>
            </div>
            <button 
              onClick={() => setIsNuevoModalOpen(true)}
              className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1E3324] transition-colors shadow-md cursor-pointer"
            >
              + Nuevo Usuario
            </button>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm border flex-1 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {cargando ? (
              <div className="text-center py-8 text-gray-500 font-semibold">Cargando usuarios desde PostgreSQL...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className={`border-y-2 text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                      <th className="py-3 px-2 font-medium">Nombre</th>
                      <th className="py-3 px-2 font-medium">Correo</th>
                      <th className="py-3 px-2 font-medium">Rol</th>
                      <th className="py-3 px-2 font-medium">Estatus</th>
                      <th className="py-3 px-2 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400 font-medium">
                          No hay usuarios registrados en el sistema.
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id} className={`border-b text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-700/50' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}>
                          <td className="py-4 px-2 font-bold">{usuario.nombre}</td>
                          <td className={`py-4 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{usuario.correo}</td>
                          <td className="py-4 px-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              usuario.rol === 'ADMIN' 
                                ? (isDarkMode ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#CBE3C7] text-[#2A4532]')
                                : usuario.rol === 'PROPIETARIO'
                                ? (isDarkMode ? 'bg-orange-950/60 text-orange-300' : 'bg-orange-100 text-orange-700')
                                : (isDarkMode ? 'bg-blue-950/60 text-blue-300' : 'bg-blue-100 text-blue-700')
                            }`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              usuario.estatus === 'Activo' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {usuario.estatus}
                            </span>
                          </td>
                          <td className="py-4 px-2 flex items-center gap-2">
                            <button 
                              onClick={() => handleAbrirModalRol(usuario)}
                              className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                isDarkMode ? 'text-blue-400 bg-blue-900/40 hover:bg-blue-900/60' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                              }`}
                            >
                              Cambiar Rol
                            </button>
                            <button 
                              onClick={() => handleToggleBloqueo(usuario.id, usuario.estatus)}
                              className={`font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                usuario.estatus === 'Activo' 
                                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                                  : 'text-green-600 bg-green-50 hover:bg-green-100'
                              }`}
                            >
                              {usuario.estatus === 'Activo' ? 'Bloquear' : 'Desbloquear'}
                            </button>
                            <button 
                              onClick={() => handleOpenDeleteModal(usuario.id)}
                              className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 🔵 MODAL PARA CAMBIAR ROL */}
      {isRolModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-sm rounded-3xl shadow-2xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Cambiar Rol de Usuario</h3>
              <button onClick={() => setIsRolModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleConfirmarCambioRol} className="space-y-4">
              <div>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Selecciona el nuevo rol para <strong>{usuarioSeleccionado?.nombre}</strong>:
                </p>
                <select 
                  value={nuevoRolSeleccionado}
                  onChange={(e) => setNuevoRolSeleccionado(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-blue-500 cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  <option value="VIAJERO">VIAJERO</option>
                  <option value="PROPIETARIO">PROPIETARIO</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsRolModalOpen(false)}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Actualizar Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟢 MODAL PARA CREAR NUEVO USUARIO */}
      {isNuevoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans">
          <div className={`w-full max-w-md rounded-3xl shadow-2xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Registrar Nuevo Usuario</h3>
              <button onClick={() => setIsNuevoModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Nombre completo</label>
                <input 
                  type="text" 
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Correo electrónico</label>
                <input 
                  type="email" 
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Contraseña temporal</label>
                <input 
                  type="password" 
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Rol del sistema</label>
                <select 
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:border-[#2A4532] cursor-pointer ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                >
                  <option value="VIAJERO">VIAJERO</option>
                  <option value="PROPIETARIO">PROPIETARIO</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsNuevoModalOpen(false)}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm cursor-pointer ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#2A4532] hover:bg-[#1E3324] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔴 MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Estás seguro de eliminar este usuario?"
        message="Esta acción borrará la cuenta de forma permanente del sistema y no se podrá deshacer."
      />

    </div>
  );
}