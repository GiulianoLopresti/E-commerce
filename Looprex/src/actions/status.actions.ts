import { STATUS } from '../mocks';
import type { 
  StatusProps,
  StatusAllProps,
  StatusResponseProps,
  StatusDeleteProps
} from '../interfaces';

// (Admin)
/** (READ) Simula la obtención de TODOS los estados */
export const getStatus = (): StatusAllProps => {
  return { ok: true, statusCode: 200, status: STATUS };
};

// (Admin)
/** (CREATE) Crea un nuevo estado */
type CreateStatusData = Omit<StatusProps, 'statusId'>;
export const createStatus = (data: CreateStatusData): StatusResponseProps => {
  const newStatus: StatusProps = {
    ...data,
    statusId: Math.floor(Math.random() * 100) + 20
  };
  return { ok: true, statusCode: 201, status: newStatus };
};

// (Admin)
/** (UPDATE) Actualiza un estado */
export const updateStatus = (id: number, data: Partial<StatusProps>): StatusResponseProps => {
  const status = STATUS.find(s => s.statusId === id);
  if (status) {
    const updatedStatus = { ...status, ...data };
    return { ok: true, statusCode: 200, status: updatedStatus };
  }
  return { ok: false, statusCode: 404, status: {} as StatusProps };
};

// (Admin)
/** (DELETE) Elimina un estado */
export const deleteStatus = (): StatusDeleteProps => {
  return { ok: true, statusCode: 200, message: 'Estado eliminado' };
};