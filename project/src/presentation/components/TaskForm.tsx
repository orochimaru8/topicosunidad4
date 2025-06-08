// Componente Formulario de Tarea - Manejo limpio de formularios
import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, CreateTaskCommand, UpdateTaskCommand } from '../../domain/entities/Task';
import { Project } from '../../domain/entities/Project';
import { User } from '../../domain/entities/User';
import { X, Save } from 'lucide-react';

interface TaskFormProps {
  tarea?: Task;
  proyectos: Project[];
  usuarios: User[];
  onEnviar: (comando: CreateTaskCommand | UpdateTaskCommand) => Promise<void>;
  onCancelar: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  tarea,
  proyectos,
  usuarios,
  onEnviar,
  onCancelar
}) => {
  const [datosFormulario, setDatosFormulario] = useState({
    titulo: tarea?.titulo || '',
    descripcion: tarea?.descripcion || '',
    prioridad: tarea?.prioridad || TaskPriority.MEDIA,
    proyectoId: tarea?.proyectoId || proyectos[0]?.id || '',
    asignadoId: tarea?.asignadoId || usuarios[0]?.id || '',
    fechaVencimiento: tarea?.fechaVencimiento ? tarea.fechaVencimiento.toISOString().split('T')[0] : ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      if (tarea) {
        // Actualizar tarea existente
        const comando: UpdateTaskCommand = {
          id: tarea.id,
          titulo: datosFormulario.titulo,
          descripcion: datosFormulario.descripcion,
          prioridad: datosFormulario.prioridad,
          fechaVencimiento: datosFormulario.fechaVencimiento ? new Date(datosFormulario.fechaVencimiento) : undefined
        };
        await onEnviar(comando);
      } else {
        // Crear nueva tarea
        const comando: CreateTaskCommand = {
          titulo: datosFormulario.titulo,
          descripcion: datosFormulario.descripcion,
          prioridad: datosFormulario.prioridad,
          proyectoId: datosFormulario.proyectoId,
          asignadoId: datosFormulario.asignadoId,
          fechaVencimiento: datosFormulario.fechaVencimiento ? new Date(datosFormulario.fechaVencimiento) : undefined
        };
        await onEnviar(comando);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {tarea ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </h2>
          <button
            onClick={onCancelar}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={datosFormulario.titulo}
              onChange={manejarCambio}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ingrese el título de la tarea"
            />
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={datosFormulario.descripcion}
              onChange={manejarCambio}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Ingrese la descripción de la tarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                id="prioridad"
                name="prioridad"
                value={datosFormulario.prioridad}
                onChange={manejarCambio}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {Object.values(TaskPriority).map(prioridad => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={datosFormulario.fechaVencimiento}
                onChange={manejarCambio}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {!tarea && (
            <>
              <div>
                <label htmlFor="proyectoId" className="block text-sm font-medium text-gray-700 mb-1">
                  Proyecto *
                </label>
                <select
                  id="proyectoId"
                  name="proyectoId"
                  value={datosFormulario.proyectoId}
                  onChange={manejarCambio}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="asignadoId" className="block text-sm font-medium text-gray-700 mb-1">
                  Asignado *
                </label>
                <select
                  id="asignadoId"
                  name="asignadoId"
                  value={datosFormulario.asignadoId}
                  onChange={manejarCambio}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{cargando ? 'Guardando...' : tarea ? 'Actualizar Tarea' : 'Crear Tarea'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};