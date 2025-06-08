// Componente Dashboard - Estadísticas y resumen
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { TaskApplicationService } from '../../application/TaskApplicationService';
import { DIContainer } from '../../infrastructure/container/DIContainer';

export const Dashboard: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    porHacer: 0,
    enProgreso: 0,
    completadas: 0
  });
  const [cargando, setCargando] = useState(true);

  const servicioTareas = DIContainer.obtenerInstancia().obtener<TaskApplicationService>('TaskApplicationService');

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const stats = await servicioTareas.obtenerEstadisticasTareas();
        setEstadisticas(stats);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarEstadisticas();
  }, [servicioTareas]);

  const tasaCompletado = estadisticas.total > 0 ? Math.round((estadisticas.completadas / estadisticas.total) * 100) : 0;

  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{estadisticas.total}</span>
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">Total de Tareas</h3>
        <p className="text-sm text-gray-500">Todas las tareas del sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{estadisticas.porHacer + estadisticas.enProgreso}</span>
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">En Progreso</h3>
        <p className="text-sm text-gray-500">Tareas en desarrollo</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{estadisticas.completadas}</span>
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">Completadas</h3>
        <p className="text-sm text-gray-500">Finalizadas exitosamente</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{tasaCompletado}%</span>
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">Tasa de Completado</h3>
        <p className="text-sm text-gray-500">Progreso general</p>
      </div>
    </div>
  );
};