// Componente Principal de la Aplicación - Demostración de arquitectura limpia
import React, { useState } from 'react';
import { Task, TaskStatus, CreateTaskCommand, UpdateTaskCommand } from './domain/entities/Task';
import { useTaskManagement } from './presentation/hooks/useTaskManagement';
import { TaskCard } from './presentation/components/TaskCard';
import { TaskForm } from './presentation/components/TaskForm';
import { FilterBar } from './presentation/components/FilterBar';
import { Dashboard } from './presentation/components/Dashboard';
import { Plus, Target, Code, Settings } from 'lucide-react';

function App() {
  const {
    tareas,
    proyectos,
    usuarios,
    cargando,
    error,
    filtro,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    actualizarFiltro,
    limpiarError
  } = useTaskManagement();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Task | undefined>();

  const manejarCrearTarea = async (comando: CreateTaskCommand) => {
    await crearTarea(comando);
    setMostrarFormulario(false);
  };

  const manejarActualizarTarea = async (comando: UpdateTaskCommand) => {
    await actualizarTarea(comando);
    setTareaEditando(undefined);
  };

  const manejarCambioEstado = async (id: string, estado: TaskStatus) => {
    await actualizarTarea({ id, estado });
  };

  const manejarEditar = (tarea: Task) => {
    setTareaEditando(tarea);
  };

  const manejarEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await eliminarTarea(id);
    }
  };

  const obtenerProyectoPorId = (id: string) => proyectos.find(p => p.id === id);
  const obtenerUsuarioPorId = (id: string) => usuarios.find(u => u.id === id);

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando TaskFlow...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-sm text-gray-500">Demo de Arquitectura Hexagonal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Code className="w-4 h-4" />
                <span>Arquitectura Limpia</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Settings className="w-4 h-4" />
                <span>Principios SOLID</span>
              </div>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={limpiarError}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Dashboard */}
        <Dashboard />

        {/* Filtros */}
        <FilterBar
          filtro={filtro}
          proyectos={proyectos}
          usuarios={usuarios}
          onCambioFiltro={actualizarFiltro}
        />

        {/* Lista de Tareas */}
        <div className="space-y-4">
          {tareas.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tareas</h3>
              <p className="text-gray-500 mb-6">
                {Object.keys(filtro).length > 0 
                  ? 'Intenta ajustar tus filtros o crear una nueva tarea para comenzar.'
                  : 'Crea tu primera tarea para comenzar con TaskFlow.'
                }
              </p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Tarea</span>
              </button>
            </div>
          ) : (
            tareas.map(tarea => (
              <TaskCard
                key={tarea.id}
                tarea={tarea}
                proyecto={obtenerProyectoPorId(tarea.proyectoId)}
                asignado={obtenerUsuarioPorId(tarea.asignadoId)}
                onEditar={manejarEditar}
                onEliminar={manejarEliminar}
                onCambioEstado={manejarCambioEstado}
              />
            ))
          )}
        </div>
      </main>

      {/* Modal de Formulario de Tarea */}
      {(mostrarFormulario || tareaEditando) && (
        <TaskForm
          tarea={tareaEditando}
          proyectos={proyectos}
          usuarios={usuarios}
          onEnviar={tareaEditando ? manejarActualizarTarea : manejarCrearTarea}
          onCancelar={() => {
            setMostrarFormulario(false);
            setTareaEditando(undefined);
          }}
        />
      )}

      {/* Pie de Página con Información de Arquitectura */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Arquitectura Hexagonal</h3>
              <p className="text-sm text-gray-600">
                Separación limpia entre lógica de negocio y preocupaciones externas a través de puertos y adaptadores.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Principios SOLID</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Responsabilidad Única</li>
                <li>• Abierto/Cerrado</li>
                <li>• Sustitución de Liskov</li>
                <li>• Segregación de Interfaces</li>
                <li>• Inversión de Dependencias</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Código Limpio</h3>
              <p className="text-sm text-gray-600">
                Código legible y mantenible con nomenclatura adecuada, funciones pequeñas y estructura clara.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;