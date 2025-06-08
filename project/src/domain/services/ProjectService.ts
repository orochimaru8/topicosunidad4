import { Project, CreateProjectCommand } from '../entities/Project';
import { ProjectRepositoryPort } from '../ports/ProjectRepositoryPort';

export class ProjectService {
  constructor(private projectRepository: ProjectRepositoryPort) {}

  async obtenerTodosLosProyectos(): Promise<Project[]> {
    return this.projectRepository.buscarTodos();
  }

  async obtenerProyectoPorId(id: string): Promise<Project | null> {
    if (!id) {
      throw new Error('El ID del proyecto es requerido');
    }
    return this.projectRepository.buscarPorId(id);
  }

  async crearProyecto(comando: CreateProjectCommand): Promise<Project> {
    this.validarComandoCrearProyecto(comando);
    return this.projectRepository.crear(comando);
  }

  private validarComandoCrearProyecto(comando: CreateProjectCommand): void {
    if (!comando.nombre?.trim()) {
      throw new Error('El nombre del proyecto es requerido');
    }
    if (!comando.color?.trim()) {
      throw new Error('El color del proyecto es requerido');
    }
  }
}