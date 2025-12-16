import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UsersService } from '@/services';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('UsersService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('login', () => {
    it('✓ debe autenticar usuario correctamente', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: mockUser,
          message: 'Login exitoso'
        })
      });

      const result = await UsersService.login({
        email: 'test@looprex.cl',
        password: 'password123'
      });

      expect(result.success).toBe(true);
      expect(result.data.email).toBe('test@looprex.cl');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      );
    });

    it('✓ debe rechazar credenciales inválidas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          statusCode: 401,
          message: 'Credenciales incorrectas'
        })
      });

      await expect(async () => {
        await UsersService.login({
          email: 'wrong@email.com',
          password: 'wrongpass'
        });
      }).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    it('✓ debe obtener lista de usuarios (ADMIN)', async () => {
      const mockUsers = [
        {
          userId: 1,
          email: 'admin@looprex.cl',
          name: 'Admin',
          lastname: 'User',
          rut: '11111111-1',
          phone: '+56911111111',
          profilePhoto: '',
          role: { roleId: 1, name: 'Administrador' }
        },
        {
          userId: 2,
          email: 'client@looprex.cl',
          name: 'Client',
          lastname: 'User',
          rut: '22222222-2',
          phone: '+56922222222',
          profilePhoto: '',
          role: { roleId: 2, name: 'Cliente' }
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: mockUsers,
          message: 'OK'
        })
      });

      const result = await UsersService.getAll();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].role.roleId).toBe(1);
    });
  });

  describe('create', () => {
    it('✓ debe crear un nuevo usuario', async () => {
      const newUserData = {
        email: 'nuevo@looprex.cl',
        password: 'password123',
        rut: '33333333-3',
        name: 'Nuevo',
        lastname: 'Usuario',
        phone: '+56933333333',
        role: { roleId: 2 },
        statusId: 1
      };

      const createdUser = {
        userId: 3,
        email: 'nuevo@looprex.cl',
        name: 'Nuevo',
        lastname: 'Usuario',
        rut: '33333333-3',
        phone: '+56933333333',
        profilePhoto: '',
        role: { roleId: 2, name: 'Cliente' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 201,
          data: createdUser,
          message: 'Usuario creado exitosamente'
        })
      });

      const result = await UsersService.create(newUserData);

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
      expect(result.data.email).toBe('nuevo@looprex.cl');
    });

    it('✓ debe rechazar email duplicado', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          statusCode: 400,
          message: 'El email ya está registrado'
        })
      });

      await expect(async () => {
        await UsersService.create({
          email: 'existente@looprex.cl',
          password: 'pass123',
          rut: '44444444-4',
          name: 'Test',
          lastname: 'User',
          phone: '+56944444444',
          role: { roleId: 2 },
          statusId: 1
        });
      }).rejects.toThrow();
    });
  });

  describe('updatePersonalData', () => {
    it('✓ debe actualizar datos personales', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          data: updatedUser,
          message: 'Datos actualizados'
        })
      });

      const result = await UsersService.updatePersonalData(1, {
        name: 'Nombre Actualizado',
        lastname: 'Apellido Actualizado',
        phone: '+56999999999',
        rut: '12345678-9'
      });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Nombre Actualizado');
    });
  });

  describe('updatePassword', () => {
    it('✓ debe cambiar la contraseña correctamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          message: 'Contraseña actualizada'
        })
      });

      const result = await UsersService.updatePassword(1, 'oldpass', 'newpass');

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/1/password'),
        expect.objectContaining({
          method: 'PUT'
        })
      );
    });

    it('✓ debe rechazar contraseña actual incorrecta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          statusCode: 400,
          message: 'Contraseña actual incorrecta'
        })
      });

      await expect(async () => {
        await UsersService.updatePassword(1, 'wrongpass', 'newpass');
      }).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('✓ debe eliminar usuario (ADMIN)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          statusCode: 200,
          message: 'Usuario eliminado'
        })
      });

      const result = await UsersService.delete(5);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/5'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
});