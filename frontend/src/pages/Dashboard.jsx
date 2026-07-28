import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  // Arreglo de datos simulando la base de datos para la tabla
  const rutas = [
    { id: '#ST-901', origen: 'Oaxaca', destino: 'Puebla', escala: 'Cafetería Centro Tehuacán', duracion: '4 h 15 m', estatus: 'En Tránsito' },
    { id: '#ST-902', origen: 'Oaxaca', destino: 'CDMX', escala: 'Mirador Nochixtlán', duracion: '6 h 30 m', estatus: 'Completado' },
    { id: '#ST-903', origen: 'Puebla', destino: 'CDMX', escala: 'Directo (Sin escala)', duracion: '2 h 00 m', estatus: 'Completado' },
    { id: '#ST-904', origen: 'Oaxaca', destino: 'Pto. Escondido', escala: 'Pueblo Mágico Sola de Vega', duracion: '3 h 45 m', estatus: 'Retrasado' },
  ];

  // Función para dar color a la etiqueta de estado
  const getStatusClass = (estatus) => {
    switch (estatus) {
      case 'En Tránsito': return 'bg-green-100 text-green-700';
      case 'Completado': return 'bg-blue-100 text-blue-700';
      case 'Retrasado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FAF9F6]">
      
      <header className="flex items-center justify-between px-8 py-4 bg-[#FAF9F6] border-b border-gray-200">
        <div className="flex items-center gap-2 text-[#2A4532]">
          
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h1 className="text-2xl font-bold">StopOver</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=47" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-gray-300" />
          <span className="text-sm font-semibold text-gray-700">Maria A</span>
        </div>
      </header>

      <div className="flex flex-1">
        
        <Sidebar />
        
        <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-t border-l border-gray-100 flex flex-col">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rutas recientes</h2>
              <p className="text-sm text-gray-500 mt-1">Basado en tu ruta de Oaxaca a Puebla</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1E3324] transition-colors shadow-md">
              <span className="text-xl leading-none">+</span> Planear nueva parada
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Buscar por origen, destino o parada" 
              className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:border-[#2A4532]"
            />
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>Estatus: Todos</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#2A4532]">
              <option>📅 Esta semana</option>
            </select>
          </div>

          <div className="w-full overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y-2 border-gray-100 text-gray-400 text-sm">
                  <th className="py-3 px-2 font-medium">ID Ruta</th>
                  <th className="py-3 px-2 font-medium">Origen - Destino</th>
                  <th className="py-3 px-2 font-medium">Escala / Parada</th>
                  <th className="py-3 px-2 font-medium">Duración</th>
                  <th className="py-3 px-2 font-medium">Estatus</th>
                  <th className="py-3 px-2 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {rutas.map((ruta, index) => (
                  <tr key={index} className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                    <td className="py-4 px-2">{ruta.id}</td>
                    <td className="py-4 px-2">{ruta.origen} → {ruta.destino}</td>
                    <td className="py-4 px-2">{ruta.escala}</td>
                    <td className="py-4 px-2">{ruta.duracion}</td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(ruta.estatus)}`}>
                        {ruta.estatus}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <button className="flex items-center gap-1 text-[#4F7959] font-semibold hover:underline">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 mb-10 border-b border-gray-200 pb-8">
            <span>Mostrando 1 a 4 de 12 rutas</span>
            <div className="flex gap-2 font-semibold">
              <button className="hover:text-gray-900">&lt;</button>
              <button className="bg-[#4F7959] text-white px-2 py-0.5 rounded">1</button>
              <button className="hover:text-gray-900 px-1">2</button>
              <span className="text-gray-400">|</span>
              <button className="hover:text-gray-900 px-1">3</button>
              <button className="hover:text-gray-900">&gt;</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 flex-1">
            
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Categorías más buscadas</h3>
              <div className="flex flex-col gap-3">
                <button className="w-full flex items-center gap-4 bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Cafeterías
                </button>
                <button className="w-full flex items-center gap-4 bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Miradores
                </button>
                <button className="w-full flex items-center gap-4 bg-[#FFF8F3] hover:bg-[#FFEEDB] text-[#F97316] p-4 rounded-2xl font-bold transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Pueblos mágicos
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 w-full max-w-sm h-fit">
                <h3 className="text-center font-bold text-gray-800 mb-6">Tendencia ahora</h3>
                <ul className="space-y-6 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    247 viajeros exploraron Oaxaca hoy
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#2A4532] mt-1">•</span>
                    "Mural del Centro" es la parada más guardada esta semana
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <footer className="text-center text-sm text-gray-500 pt-8 mt-auto">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}