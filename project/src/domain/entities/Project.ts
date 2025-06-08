// Entidad de Dominio para Proyecto
export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface CreateProjectCommand {
  nombre: string;
  descripcion: string;
  color: string;
}