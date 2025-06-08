import { Project, CreateProjectCommand } from '../../domain/entities/Project';
import { ProjectRepositoryPort } from '../../domain/ports/ProjectRepositoryPort';
import { v4 as uuidv4 } from 'uuid';

export class LocalStorageProjectRepository implements ProjectRepositoryPort {
  private readonly STORAGE_KEY = 'proyectos';

  async buscarTodos(): Promise<Project[]> {
    return this.obtenerProyectosDelStorage();
  }

  async buscarPorId(id: string): Promise<Project | null> {
    const proyectos = this.obtenerProyectosDelStorage();
    return proyectos.find(proyecto => proyecto.id === id) || null;
  }

  async crear(comando: CreateProjectCommand): Promise<Project> {
    const proyecto: Project = {
      id: uuidv4(),
      nombre: comando.nombre,
      descripcion: comando.descripcion,
      color: comando.color,
      fechaCreacion: new Date(),
      activo: true
    };

    const proyectos = this.obtenerProyectosDelStorage();
    proyectos.push(proyecto);
    this.guardarProyectosEnStorage(proyectos);

    return proyecto;
  }

  async eliminar(id: string): Promise<void> {
    const proyectos = this.obtenerProyectosDelStorage();
    const proyectosFiltrados = proyectos.filter(proyecto => proyecto.id !== id);
    this.guardarProyectosEnStorage(proyectosFiltrados);
  }

  private obtenerProyectosDelStorage(): Project[] {
    try {
      const almacenado = localStorage.getItem(this.STORAGE_KEY);
      if (!almacenado) {
        // Inicializar con proyectos por defecto
        const proyectosPorDefecto = this.obtenerProyectosPorDefecto();
        this.guardarProyectosEnStorage(proyectosPorDefecto);
        return proyectosPorDefecto;
      }
      
      const parseado = JSON.parse(almacenado);
      return parseado.map((proyecto: any) => ({
        ...proyecto,
        fechaCreacion: new Date(proyecto.fechaCreacion)
      }));
    } catch (error) {
      console.error('Error al parsear proyectos del localStorage:', error);
      return this.obtenerProyectosPorDefecto();
    }
  }

  private guardarProyectosEnStorage(proyectos: Project[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proyectos));
    } catch (error) {
      console.error('Error al guardar proyectos en localStorage:', error);
      throw new Error('Error al guardar los proyectos');
    }
  }

  private obtenerProyectosPorDefecto(): Project[] {
    return [
      {
        id: '1',
        nombre: 'Rediseño del Sitio Web',
        descripcion: 'Rediseño completo del sitio web de la empresa',
        color: '#3B82F6',
        fechaCreacion: new Date(),
        activo: true
      },
      {
        id: '2',
        nombre: 'Aplicación Móvil',
        descripcion: 'Desarrollo de aplicación móvil',
        color: '#10B981',
        fechaCreacion: new Date(),
        activo: true
      },
      {
        id: '3',
        nombre: 'Integración de API',
        descripcion: 'Proyecto de integración con APIs de terceros',
        color: '#F59E0B',
        fechaCreacion: new Date(),
        activo: true
      }
    ];
  }
}