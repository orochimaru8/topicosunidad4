// Puerto (Interfaz) - Arquitectura Hexagonal
// Define contrato para acceso a datos - sigue Principio de Segregación de Interfaces
import { Task, TaskFilter, CreateTaskCommand, UpdateTaskCommand } from '../entities/Task';

export interface TaskRepositoryPort {
  buscarTodos(): Promise<Task[]>;
  buscarPorId(id: string): Promise<Task | null>;
  buscarPorFiltro(filtro: TaskFilter): Promise<Task[]>;
  crear(comando: CreateTaskCommand): Promise<Task>;
  actualizar(comando: UpdateTaskCommand): Promise<Task>;
  eliminar(id: string): Promise<void>;
  contar(): Promise<number>;
  contarPorEstado(estado?: string): Promise<number>;
}