import { STATUS } from '../mocks';
import type { 
  StatusProps,
  StatusAllProps,
  StatusResponseProps,
  StatusDeleteProps
} from '../interfaces';

// (Admin)
/** (READ) Simula la obtención de TODOS los estados */
export const getStatus = async (): Promise<StatusAllProps> => {
  console.log('Simulando API (Admin): Obteniendo Estados...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, status: STATUS });
    }, 50);
  });
};

// (Admin)
/** (CREATE) Simula la creación de un nuevo estado */
type CreateStatusData = Omit<StatusProps, 'idStatus'>;
export const createStatus = async (data: CreateStatusData): Promise<StatusResponseProps> => {
  console.log(`Simulando API (Admin): Creando estado ${data.name}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const newStatus: StatusProps = {
        ...data,
        statusId: Math.floor(Math.random() * 100) + 20
      };
      // Simulación: No modificamos el mock, solo devolvemos la respuesta.
      resolve({ ok: true, statusCode: 201, status: newStatus });
    }, 500);
  });
};

// (Admin)
/** (UPDATE) Simula la actualización de un estado */
export const updateStatus = async (id: number, data: Partial<StatusProps>): Promise<StatusResponseProps> => {
  console.log(`Simulando API (Admin): Actualizando estado ${id}`);
  return new Promise(resolve => {
    const status = STATUS.find(s => s.statusId === id);
    if (status) {
      const updatedStatus = { ...status, ...data };
      resolve({ ok: true, statusCode: 200, status: updatedStatus });
    } else {
      resolve({ ok: false, statusCode: 404, status: {} as StatusProps });
    }
  });
};

// (Admin)
/** (DELETE) Simula la eliminación de un estado */
export const deleteStatus = async (id: number): Promise<StatusDeleteProps> => {
  console.log(`Simulando API (Admin): Eliminando estado ${id}`);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, message: 'Estado eliminado' });
    }, 500);
  });
};