// Hook Personalizado - Separación limpia de responsabilidades
import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFilter, CreateTaskCommand, UpdateTaskCommand, TaskStatus, TaskPriority } from '../../domain/entities/Task';
import { Project } from '../../domain/entities/Project';
import { User } from '../../domain/entities/User';
import { TaskApplicationService } from '../../application/TaskApplicationService';
import { ProjectService } from '../../domain/services/ProjectService';
import { MockUserRepository } from '../../infrastructure/adapters/MockUserRepository';
import { DIContainer } from '../../infrastructure/container/DIContainer';

export const useTaskManagement = () => {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [proyectos, setProyectos] = useState<Project[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<TaskFilter>({});

  // Obtener servicios del contenedor DI
  const servicioTareas = DIContainer.obtenerInstancia().obtener<TaskApplicationService>('TaskApplicationService');
  const servicioProyectos = DIContainer.obtenerInstancia().obtener<ProjectService>('ProjectService');
  const repositorioUsuarios = DIContainer.obtenerInstancia().obtener<MockUserRepository>('UserRepository');

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const [datosTareas, datosProyectos, datosUsuarios] = await Promise.all([
        servicioTareas.obtenerTareasFiltradas(filtro),
        servicioProyectos.obtenerTodosLosProyectos(),
        repositorioUsuarios.buscarTodos()
      ]);

      setTareas(datosTareas);
      setProyectos(datosProyectos);
      setUsuarios(datosUsuarios);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setCargando(false);
    }
  }, [filtro, servicioTareas, servicioProyectos, repositorioUsuarios]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const crearTarea = async (comando: CreateTaskCommand): Promise<void> => {
    try {
      await servicioTareas.crearTarea(comando);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarea');
      throw err;
    }
  };

  const actualizarTarea = async (comando: UpdateTaskCommand): Promise<void> => {
    try {
      await servicioTareas.actualizarTarea(comando);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la tarea');
      throw err;
    }
  };

  const eliminarTarea = async (id: string): Promise<void> => {
    try {
      await servicioTareas.eliminarTarea(id);
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la tarea');
      throw err;
    }
  };

  const actualizarFiltro = (nuevoFiltro: TaskFilter): void => {
    setFiltro(nuevoFiltro);
  };

  const limpiarError = (): void => {
    setError(null);
  };

  return {
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
    limpiarError,
    recargar: cargarDatos
  };
};