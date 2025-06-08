// Componente Tarjeta de Tarea - Componente limpio y enfocado
import React from 'react';
import { Task, TaskStatus, TaskPriority } from '../../domain/entities/Task';
import { Project } from '../../domain/entities/Project';
import { User } from '../../domain/entities/User';
import { Calendar, User as UserIcon, AlertTriangle, CheckCircle, Clock, Edit3, Trash2 } from 'lucide-react';

interface TaskCardProps {
  tarea: Task;
  proyecto?: Project;
  asignado?: User;
  onEditar: (tarea: Task) => void;
  onEliminar: (id: string) => void;
  onCambioEstado: (id: string, estado: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  tarea,
  proyecto,
  asignado,
  onEditar,
  onEliminar,
  onCambioEstado
}) => {
  const obtenerIconoEstado = (estado: TaskStatus) => {
    switch (estado) {
      case TaskStatus.COMPLETADO:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case TaskStatus.EN_PROGRESO:
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const obtenerColorPrioridad = (prioridad: TaskPriority) => {
    switch (prioridad) {
      case TaskPriority.URGENTE:
        return 'text-red-500 bg-red-50';
      case TaskPriority.ALTA:
        return 'text-orange-500 bg-orange-50';
      case TaskPriority.MEDIA:
        return 'text-yellow-500 bg-yellow-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const obtenerColorEstado = (estado: TaskStatus) => {
    switch (estado) {
      case TaskStatus.COMPLETADO:
        return 'text-green-700 bg-green-100';
      case TaskStatus.EN_PROGRESO:
        return 'text-blue-700 bg-blue-100';
      case TaskStatus.EN_REVISION:
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const obtenerTextoEstado = (estado: TaskStatus) => {
    switch (estado) {
      case TaskStatus.POR_HACER:
        return 'Por Hacer';
      case TaskStatus.EN_PROGRESO:
        return 'En Progreso';
      case TaskStatus.EN_REVISION:
        return 'En Revisión';
      case TaskStatus.COMPLETADO:
        return 'Completado';
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(fecha);
  };

  const estaVencida = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== TaskStatus.COMPLETADO;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              const siguienteEstado = tarea.estado === TaskStatus.POR_HACER 
                ? TaskStatus.EN_PROGRESO 
                : tarea.estado === TaskStatus.EN_PROGRESO 
                  ? TaskStatus.COMPLETADO 
                  : TaskStatus.POR_HACER;
              onCambioEstado(tarea.id, siguienteEstado);
            }}
            className="hover:scale-110 transition-transform"
          >
            {obtenerIconoEstado(tarea.estado)}
          </button>
          <div>
            <h3 className={`font-semibold text-lg ${tarea.estado === TaskStatus.COMPLETADO ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {tarea.titulo}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{tarea.descripcion}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditar(tarea)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEliminar(tarea.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {proyecto && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: proyecto.color }}
              />
              <span className="text-sm font-medium text-gray-700">{proyecto.nombre}</span>
            </div>
          )}
          
          {asignado && (
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-400" />
              {asignado.avatar ? (
                <img 
                  src={asignado.avatar} 
                  alt={asignado.nombre}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full" />
              )}
              <span className="text-sm text-gray-600">{asignado.nombre}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorPrioridad(tarea.prioridad)}`}>
            {tarea.prioridad}
          </span>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorEstado(tarea.estado)}`}>
            {obtenerTextoEstado(tarea.estado)}
          </span>

          {tarea.fechaVencimiento && (
            <div className={`flex items-center space-x-1 text-sm ${estaVencida ? 'text-red-500' : 'text-gray-500'}`}>
              {estaVencida && <AlertTriangle className="w-4 h-4" />}
              <Calendar className="w-4 h-4" />
              <span>{formatearFecha(tarea.fechaVencimiento)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};