// Entidad de Dominio para Usuario
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
  fechaCreacion: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  DESARROLLADOR = 'DESARROLLADOR'
}