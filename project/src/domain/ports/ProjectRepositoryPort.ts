import { Project, CreateProjectCommand } from '../entities/Project';

export interface ProjectRepositoryPort {
  buscarTodos(): Promise<Project[]>;
  buscarPorId(id: string): Promise<Project | null>;
  crear(comando: CreateProjectCommand): Promise<Project>;
  eliminar(id: string): Promise<void>;
}