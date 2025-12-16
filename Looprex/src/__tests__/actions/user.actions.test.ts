import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginUser, registerUser, updateUserPersonalData } from '@/actions/user.actions';
import { UsersService } from '@/services';

vi.mock('@/services', () => ({
  UsersService: {
    login: vi.fn(),
    create: vi.fn(),
    updatePersonalData: vi.fn(),
  }
}));

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginUser', () => {
    it('Debe autenticar correctamente con credenciales válidas', async () => {
      const mockUser = {
        userId: 1,
        email: 'test@looprex.cl',
        name: 'Test',
        lastname: 'User',
        rut: '12345678-9',
        phone: '+56912345678',
        profilePhoto: '',
        role: { roleId: 2, name: 'Cliente' }
      };

      vi.mocked(UsersService.login).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: mockUser,
        message: 'Login exitoso'
      });

      const result = await loginUser('test@looprex.cl', 'password123');

      expect(result.ok).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.user?.email).toBe('test@looprex.cl');
    });

    it('Debe rechazar credenciales incorrectas', async () => {
      vi.mocked(UsersService.login).mockResolvedValue({
        success: false,
        statusCode: 401,
        data: null as any,
        message: 'Credenciales incorrectas'
      });

      const result = await loginUser('wrong@email.com', 'wrongpass');

      expect(result.ok).toBe(false);
      expect(result.user).toBeNull();
      expect(result.message).toBe('Credenciales incorrectas');
    });

    it('Debe manejar errores de conexión', async () => {
      vi.mocked(UsersService.login).mockRejectedValue(new Error('Network error'));

      const result = await loginUser('test@looprex.cl', 'password123');

      expect(result.ok).toBe(false);
      expect(result.user).toBeNull();
      expect(result.message).toContain('Error al conectar');
    });
  });

  describe('registerUser', () => {
    it('Debe crear un nuevo usuario correctamente', async () => {
      const userData = {
        email: 'nuevo@looprex.cl',
        password: 'password123',
        rut: '98765432-1',
        name: 'Nuevo',
        lastname: 'Usuario',
        phone: '+56987654321'
      };

      const mockCreatedUser = {
        userId: 5,
        ...userData,
        profilePhoto: '',
        role: { roleId: 2, name: 'Cliente' }
      };

      vi.mocked(UsersService.create).mockResolvedValue({
        success: true,
        statusCode: 201,
        data: mockCreatedUser,
        message: 'Usuario creado exitosamente'
      });

      const result = await registerUser(userData);

      expect(result.ok).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('nuevo@looprex.cl');
      expect(result.message).toContain('exitosamente');
    });

    it('Debe rechazar email duplicado', async () => {
      vi.mocked(UsersService.create).mockResolvedValue({
        success: false,
        statusCode: 400,
        data: undefined as any,
        message: 'El email ya está registrado'
      });

      const result = await registerUser({
        email: 'existente@looprex.cl',
        password: 'pass123',
        rut: '11111111-1',
        name: 'Test',
        lastname: 'User',
        phone: '+56911111111'
      });

      expect(result.ok).toBe(false);
      expect(result.user).toBeUndefined();
    });
  });

  describe('updateUserPersonalData', () => {
    it('Debe actualizar datos personales correctamente', async () => {
      const updatedUser = {
        userId: 1,
        email: 'test@looprex.cl',
        name: 'Nombre Actualizado',
        lastname: 'Apellido Actualizado',
        rut: '12345678-9',
        phone: '+56999999999',
        profilePhoto: '',
        role: { roleId: 2, name: 'Cliente' }
      };

      vi.mocked(UsersService.updatePersonalData).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: updatedUser,
        message: 'Datos actualizados'
      });

      const result = await updateUserPersonalData(1, {
        name: 'Nombre Actualizado',
        lastname: 'Apellido Actualizado',
        phone: '+56999999999',
        rut: '12345678-9'
      });

      expect(result.ok).toBe(true);
      expect(result.user?.name).toBe('Nombre Actualizado');
      expect(result.user?.phone).toBe('+56999999999');
    });
  });
});