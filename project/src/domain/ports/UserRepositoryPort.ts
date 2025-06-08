import { User } from '../entities/User';

export interface UserRepositoryPort {
  buscarTodos(): Promise<User[]>;
  buscarPorId(id: string): Promise<User | null>;
  obtenerUsuarioActual(): Promise<User | null>;
}