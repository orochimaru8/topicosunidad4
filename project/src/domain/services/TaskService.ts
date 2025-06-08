// Servicio de Dominio - Lógica de Negocio
// Sigue Principios de Responsabilidad Única y Abierto/Cerrado
import { Task, TaskFilter, CreateTaskCommand, UpdateTaskCommand, TaskStatus } from '../entities/Task';
import { TaskRepositoryPort } from '../ports/TaskRepositoryPort';

export class TaskService {
  constructor(private taskRepository: TaskRepositoryPort) {}

  async obtenerTodasLasTareas(): Promise<Task[]> {
    return this.taskRepository.buscarTodos();
  }

  async obtenerTareaPorId(id: string): Promise<Task | null> {
    if (!id) {
      throw new Error('El ID de la tarea es requerido');
    }
    return this.taskRepository.buscarPorId(id);
  }

  async obtenerTareasFiltradas(filtro: TaskFilter): Promise<Task[]> {
    return this.taskRepository.buscarPorFiltro(filtro);
  }

  async crearTarea(comando: CreateTaskCommand): Promise<Task> {
    this.validarComandoCrearTarea(comando);
    return this.taskRepository.crear(comando);
  }

  async actualizarTarea(comando: UpdateTaskCommand): Promise<Task> {
    this.validarComandoActualizarTarea(comando);
    return this.taskRepository.actualizar(comando);
  }

  async eliminarTarea(id: string): Promise<void> {
    if (!id) {
      throw new Error('El ID de la tarea es requerido');
    }
    
    const tarea = await this.taskRepository.buscarPorId(id);
    if (!tarea) {
      throw new Error('Tarea no encontrada');
    }
    
    return this.taskRepository.eliminar(id);
  }

  async obtenerEstadisticasTareas(): Promise<{
    total: number;
    porHacer: number;
    enProgreso: number;
    completadas: number;
  }> {
    const [total, porHacer, enProgreso, completadas] = await Promise.all([
      this.taskRepository.contar(),
      this.taskRepository.contarPorEstado(TaskStatus.POR_HACER),
      this.taskRepository.contarPorEstado(TaskStatus.EN_PROGRESO),
      this.taskRepository.contarPorEstado(TaskStatus.COMPLETADO)
    ]);

    return { total, porHacer, enProgreso, completadas };
  }

  // Métodos de validación privados - principio de Código Limpio
  private validarComandoCrearTarea(comando: CreateTaskCommand): void {
    if (!comando.titulo?.trim()) {
      throw new Error('El título de la tarea es requerido');
    }
    if (!comando.proyectoId) {
      throw new Error('El ID del proyecto es requerido');
    }
    if (!comando.asignadoId) {
      throw new Error('El ID del asignado es requerido');
    }
    if (comando.fechaVencimiento && comando.fechaVencimiento < new Date()) {
      throw new Error('La fecha de vencimiento no puede estar en el pasado');
    }
  }

  private validarComandoActualizarTarea(comando: UpdateTaskCommand): void {
    if (!comando.id) {
      throw new Error('El ID de la tarea es requerido');
    }
    if (comando.titulo !== undefined && !comando.titulo.trim()) {
      throw new Error('El título de la tarea no puede estar vacío');
    }
    if (comando.fechaVencimiento && comando.fechaVencimiento < new Date()) {
      throw new Error('La fecha de vencimiento no puede estar en el pasado');
    }
  }
}