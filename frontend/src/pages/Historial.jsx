import React from 'react';

export default function Historial() {
  
  const rutas = [
    { id: '#ST-901', origen: 'Oaxaca', destino: 'Puebla', escala: 'Cafetería Centro Tehuacán', duracion: '4 h 15 m', estatus: 'En Tránsito' },
    { id: '#ST-902', origen: 'Oaxaca', destino: 'CDMX', escala: 'Mirador Nochixtlán', duracion: '6 h 30 m', estatus: 'Completado' },
    { id: '#ST-903', origen: 'Puebla', destino: 'CDMX', escala: 'Directo (Sin escala)', duracion: '2 h 00 m', estatus: 'Completado' },
    { id: '#ST-904', origen: 'Oaxaca', destino: 'Pto. Escondido', escala: 'Pueblo Mágico Sola de Vega', duracion: '3 h 45 m', estatus: 'Retrasado' },
  ];

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
        
       
        <aside className="w-64 bg-[#FAF9F6] border-r border-gray-200 flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-4">
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Nueva ruta
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#CBE3C7] text-[#2A4532] rounded-lg font-bold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Historial
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Favoritos
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Buscar
            </a>
            
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 font-medium hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Ajustes
            </a>
          </nav>
        </aside>

        
        <main className="flex-1 p-8 bg-[#FAF9F6] flex flex-col">
          
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Historial de viajes</h2>
              <p className="text-sm text-gray-500 mt-1">Revisa tus rutas pasadas y estadísticas de viaje</p>
            </div>
            <button className="bg-[#2A4532] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1E3324] transition-colors shadow-md">
              <span className="text-xl leading-none">+</span> Nueva parada
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Rutas completadas</span>
              <span className="text-4xl font-extrabold text-[#16A34A]">12</span>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Horas en el camino</span>
              <span className="text-4xl font-extrabold text-[#2563EB]">48 h</span>
            </div>
           
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <span className="text-sm font-medium text-gray-600">Parada más frecuente</span>
              <span className="text-xl font-extrabold text-[#F97316]">Mirador Nochixtlán</span>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
            
            
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

            
            <div className="w-full overflow-x-auto mb-4 flex-1">
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

            
            <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-4 mt-auto">
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

          </div>

          
          <footer className="text-center text-sm text-gray-500 pt-6">
            StopOver © 2026
          </footer>

        </main>
      </div>
    </div>
  );
}