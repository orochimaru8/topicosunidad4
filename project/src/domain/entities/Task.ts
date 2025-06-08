// Entidad de Dominio - Objeto de negocio principal
// Sigue Código Limpio: Responsabilidad Única, nomenclatura descriptiva
export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  estado: TaskStatus;
  prioridad: TaskPriority;
  proyectoId: string;
  asignadoId: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  fechaVencimiento?: Date;
  fechaCompletado?: Date;
}

export enum TaskStatus {
  POR_HACER = 'POR_HACER',
  EN_PROGRESO = 'EN_PROGRESO',
  EN_REVISION = 'EN_REVISION',
  COMPLETADO = 'COMPLETADO'
}

export enum TaskPriority {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

// Objetos de Valor para mejor modelado del dominio
export interface TaskFilter {
  estado?: TaskStatus;
  prioridad?: TaskPriority;
  proyectoId?: string;
  asignadoId?: string;
  terminoBusqueda?: string;
}

export interface CreateTaskCommand {
  titulo: string;
  descripcion: string;
  prioridad: TaskPriority;
  proyectoId: string;
  asignadoId: string;
  fechaVencimiento?: Date;
}

export interface UpdateTaskCommand {
  id: string;
  titulo?: string;
  descripcion?: string;
  estado?: TaskStatus;
  prioridad?: TaskPriority;
  fechaVencimiento?: Date;
}