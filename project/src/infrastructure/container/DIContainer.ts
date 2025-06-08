// Contenedor de Inyección de Dependencias
// Sigue Principio de Inversión de Dependencias
import { TaskService } from '../../domain/services/TaskService';
import { ProjectService } from '../../domain/services/ProjectService';
import { TaskApplicationService } from '../../application/TaskApplicationService';
import { LocalStorageTaskRepository } from '../adapters/LocalStorageTaskRepository';
import { LocalStorageProjectRepository } from '../adapters/LocalStorageProjectRepository';
import { MockUserRepository } from '../adapters/MockUserRepository';

export class DIContainer {
  private static instancia: DIContainer;
  private servicios: Map<string, any> = new Map();

  private constructor() {
    this.registrarServicios();
  }

  static obtenerInstancia(): DIContainer {
    if (!this.instancia) {
      this.instancia = new DIContainer();
    }
    return this.instancia;
  }

  private registrarServicios(): void {
    // Repositorios
    const repositorioTareas = new LocalStorageTaskRepository();
    const repositorioProyectos = new LocalStorageProjectRepository();
    const repositorioUsuarios = new MockUserRepository();

    // Servicios de Dominio
    const servicioTareas = new TaskService(repositorioTareas);
    const servicioProyectos = new ProjectService(repositorioProyectos);

    // Servicios de Aplicación
    const servicioAplicacionTareas = new TaskApplicationService(servicioTareas, servicioProyectos);

    // Registrar servicios
    this.servicios.set('TaskApplicationService', servicioAplicacionTareas);
    this.servicios.set('ProjectService', servicioProyectos);
    this.servicios.set('UserRepository', repositorioUsuarios);
  }

  obtener<T>(nombreServicio: string): T {
    const servicio = this.servicios.get(nombreServicio);
    if (!servicio) {
      throw new Error(`Servicio ${nombreServicio} no encontrado`);
    }
    return servicio;
  }
}