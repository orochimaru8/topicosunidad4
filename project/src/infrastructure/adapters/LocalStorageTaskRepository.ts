// Adaptador - Arquitectura Hexagonal
// Implementa la interfaz del puerto - sigue Principio de Inversión de Dependencias
import { Task, TaskFilter, CreateTaskCommand, UpdateTaskCommand, TaskStatus } from '../../domain/entities/Task';
import { TaskRepositoryPort } from '../../domain/ports/TaskRepositoryPort';
import { v4 as uuidv4 } from 'uuid';

export class LocalStorageTaskRepository implements TaskRepositoryPort {
  private readonly STORAGE_KEY = 'tareas';

  async buscarTodos(): Promise<Task[]> {
    const tareas = this.obtenerTareasDelStorage();
    return tareas.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  }

  async buscarPorId(id: string): Promise<Task | null> {
    const tareas = this.obtenerTareasDelStorage();
    return tareas.find(tarea => tarea.id === id) || null;
  }

  async buscarPorFiltro(filtro: TaskFilter): Promise<Task[]> {
    let tareas = this.obtenerTareasDelStorage();

    if (filtro.estado) {
      tareas = tareas.filter(tarea => tarea.estado === filtro.estado);
    }

    if (filtro.prioridad) {
      tareas = tareas.filter(tarea => tarea.prioridad === filtro.prioridad);
    }

    if (filtro.proyectoId) {
      tareas = tareas.filter(tarea => tarea.proyectoId === filtro.proyectoId);
    }

    if (filtro.asignadoId) {
      tareas = tareas.filter(tarea => tarea.asignadoId === filtro.asignadoId);
    }

    if (filtro.terminoBusqueda) {
      const busquedaMinuscula = filtro.terminoBusqueda.toLowerCase();
      tareas = tareas.filter(tarea => 
        tarea.titulo.toLowerCase().includes(busquedaMinuscula) ||
        tarea.descripcion.toLowerCase().includes(busquedaMinuscula)
      );
    }

    return tareas.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  }

  async crear(comando: CreateTaskCommand): Promise<Task> {
    const ahora = new Date();
    const tarea: Task = {
      id: uuidv4(),
      titulo: comando.titulo,
      descripcion: comando.descripcion,
      estado: TaskStatus.POR_HACER,
      prioridad: comando.prioridad,
      proyectoId: comando.proyectoId,
      asignadoId: comando.asignadoId,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
      fechaVencimiento: comando.fechaVencimiento
    };

    const tareas = this.obtenerTareasDelStorage();
    tareas.push(tarea);
    this.guardarTareasEnStorage(tareas);

    return tarea;
  }

  async actualizar(comando: UpdateTaskCommand): Promise<Task> {
    const tareas = this.obtenerTareasDelStorage();
    const indiceTarea = tareas.findIndex(tarea => tarea.id === comando.id);
    
    if (indiceTarea === -1) {
      throw new Error('Tarea no encontrada');
    }

    const tareaExistente = tareas[indiceTarea];
    const tareaActualizada: Task = {
      ...tareaExistente,
      ...comando,
      fechaActualizacion: new Date(),
      fechaCompletado: comando.estado === TaskStatus.COMPLETADO && tareaExistente.estado !== TaskStatus.COMPLETADO 
        ? new Date() 
        : comando.estado !== TaskStatus.COMPLETADO 
          ? undefined 
          : tareaExistente.fechaCompletado
    };

    tareas[indiceTarea] = tareaActualizada;
    this.guardarTareasEnStorage(tareas);

    return tareaActualizada;
  }

  async eliminar(id: string): Promise<void> {
    const tareas = this.obtenerTareasDelStorage();
    const tareasFiltradas = tareas.filter(tarea => tarea.id !== id);
    this.guardarTareasEnStorage(tareasFiltradas);
  }

  async contar(): Promise<number> {
    const tareas = this.obtenerTareasDelStorage();
    return tareas.length;
  }

  async contarPorEstado(estado?: string): Promise<number> {
    const tareas = this.obtenerTareasDelStorage();
    if (!estado) return tareas.length;
    return tareas.filter(tarea => tarea.estado === estado).length;
  }

  // Métodos auxiliares privados
  private obtenerTareasDelStorage(): Task[] {
    try {
      const almacenado = localStorage.getItem(this.STORAGE_KEY);
      if (!almacenado) return [];
      
      const parseado = JSON.parse(almacenado);
      return parseado.map((tarea: any) => ({
        ...tarea,
        fechaCreacion: new Date(tarea.fechaCreacion),
        fechaActualizacion: new Date(tarea.fechaActualizacion),
        fechaVencimiento: tarea.fechaVencimiento ? new Date(tarea.fechaVencimiento) : undefined,
        fechaCompletado: tarea.fechaCompletado ? new Date(tarea.fechaCompletado) : undefined
      }));
    } catch (error) {
      console.error('Error al parsear tareas del localStorage:', error);
      return [];
    }
  }

  private guardarTareasEnStorage(tareas: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas en localStorage:', error);
      throw new Error('Error al guardar las tareas');
    }
  }
}