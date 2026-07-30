import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Recovery from './pages/Recovery';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import Favoritos from './pages/Favoritos';
import Buscar from './pages/Buscar';
import Ajustes from './pages/Ajustes';
import MiNegocio from './pages/MiNegocio';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminParadas from './pages/AdminParadas';

import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<Recovery />} />
        
        {/* Rutas de Negocio y Admin (Aseguramos ambos alias de ruta para que nunca falle) */}
        <Route path="/mi-negocio" element={<MiNegocio />} />
        <Route path="/negocios/registrar" element={<MiNegocio />} />
        
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/paradas" element={<AdminParadas />} />
        <Route path="/admin/negocios/pendientes" element={<AdminParadas />} />

        {/* Rutas protegidas para Viajeros y usuarios generales */}
        <Route element={<ProtectedRoute />}>
          <Route path="/nueva-ruta" element={<Dashboard />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;