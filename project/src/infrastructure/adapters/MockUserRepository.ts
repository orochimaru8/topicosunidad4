import { User, UserRole } from '../../domain/entities/User';
import { UserRepositoryPort } from '../../domain/ports/UserRepositoryPort';

export class MockUserRepository implements UserRepositoryPort {
  private usuarios: User[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      rol: UserRole.ADMIN,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      fechaCreacion: new Date()
    },
    {
      id: '2',
      nombre: 'María García',
      email: 'maria@ejemplo.com',
      rol: UserRole.GERENTE,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      fechaCreacion: new Date()
    },
    {
      id: '3',
      nombre: 'Carlos López',
      email: 'carlos@ejemplo.com',
      rol: UserRole.DESARROLLADOR,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      fechaCreacion: new Date()
    }
  ];

  async buscarTodos(): Promise<User[]> {
    return [...this.usuarios];
  }

  async buscarPorId(id: string): Promise<User | null> {
    return this.usuarios.find(usuario => usuario.id === id) || null;
  }

  async obtenerUsuarioActual(): Promise<User | null> {
    // Simular usuario actual (vendría de autenticación en app real)
    return this.usuarios[0];
  }
}