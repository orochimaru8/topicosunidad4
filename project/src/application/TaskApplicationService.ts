// Servicio de Aplicación - Orquesta servicios de dominio
// Sigue Principio de Responsabilidad Única
import { TaskService } from '../domain/services/TaskService';
import { ProjectService } from '../domain/services/ProjectService';
import { Task, TaskFilter, CreateTaskCommand, UpdateTaskCommand } from '../domain/entities/Task';

export class TaskApplicationService {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService
  ) {}

  async obtenerTodasLasTareas(): Promise<Task[]> {
    return this.taskService.obtenerTodasLasTareas();
  }

  async obtenerTareaPorId(id: string): Promise<Task | null> {
    return this.taskService.obtenerTareaPorId(id);
  }

  async obtenerTareasFiltradas(filtro: TaskFilter): Promise<Task[]> {
    return this.taskService.obtenerTareasFiltradas(filtro);
  }

  async crearTarea(comando: CreateTaskCommand): Promise<Task> {
    // Validar que el proyecto existe
    const proyecto = await this.projectService.obtenerProyectoPorId(comando.proyectoId);
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

    return this.taskService.crearTarea(comando);
  }

  async actualizarTarea(comando: UpdateTaskCommand): Promise<Task> {
    return this.taskService.actualizarTarea(comando);
  }

  async eliminarTarea(id: string): Promise<void> {
    return this.taskService.eliminarTarea(id);
  }

  async obtenerEstadisticasTareas() {
    return this.taskService.obtenerEstadisticasTareas();
  }
}