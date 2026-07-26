import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Login from './pages/Login';
import Register from './pages/Register';
import Recovery from './pages/Recovery';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import Favoritos from './pages/Favoritos';
import Buscar from './pages/Buscar';
import Ajustes from './pages/Ajustes';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar" element={<Recovery />} />

        
        <Route path="/nueva-ruta" element={<Dashboard />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/ajustes" element={<Ajustes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;