// Componente Barra de Filtros
import React from 'react';
import { TaskStatus, TaskPriority, TaskFilter } from '../../domain/entities/Task';
import { Project } from '../../domain/entities/Project';
import { User } from '../../domain/entities/User';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  filtro: TaskFilter;
  proyectos: Project[];
  usuarios: User[];
  onCambioFiltro: (filtro: TaskFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filtro,
  proyectos,
  usuarios,
  onCambioFiltro
}) => {
  const manejarCambioFiltro = (clave: keyof TaskFilter, valor: string) => {
    const nuevoFiltro = {
      ...filtro,
      [clave]: valor || undefined
    };
    onCambioFiltro(nuevoFiltro);
  };

  const limpiarFiltros = () => {
    onCambioFiltro({});
  };

  const tieneFiltrosActivos = Object.values(filtro).some(valor => valor !== undefined && valor !== '');

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar todo</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={filtro.terminoBusqueda || ''}
            onChange={(e) => manejarCambioFiltro('terminoBusqueda', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          value={filtro.estado || ''}
          onChange={(e) => manejarCambioFiltro('estado', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Todos los Estados</option>
          {Object.values(TaskStatus).map(estado => (
            <option key={estado} value={estado}>
              {obtenerTextoEstado(estado)}
            </option>
          ))}
        </select>

        <select
          value={filtro.prioridad || ''}
          onChange={(e) => manejarCambioFiltro('prioridad', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Todas las Prioridades</option>
          {Object.values(TaskPriority).map(prioridad => (
            <option key={prioridad} value={prioridad}>
              {prioridad}
            </option>
          ))}
        </select>

        <select
          value={filtro.proyectoId || ''}
          onChange={(e) => manejarCambioFiltro('proyectoId', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Todos los Proyectos</option>
          {proyectos.map(proyecto => (
            <option key={proyecto.id} value={proyecto.id}>
              {proyecto.nombre}
            </option>
          ))}
        </select>

        <select
          value={filtro.asignadoId || ''}
          onChange={(e) => manejarCambioFiltro('asignadoId', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Todos los Asignados</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};