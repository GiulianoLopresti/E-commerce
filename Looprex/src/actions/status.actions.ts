import { STATUS } from '../mocks';
import type {
  StatusProps,
  StatusAllProps,
  StatusResponseProps,
  StatusDeleteProps
} from '../interfaces';

let STATUS_STATE: StatusProps[] = [...STATUS];

const cloneStatus = (status: StatusProps): StatusProps => ({ ...status });

const getNextStatusId = (): number => {
  if (STATUS_STATE.length === 0) {
    return 1;
  }
  return Math.max(...STATUS_STATE.map(status => status.statusId)) + 1;
};

// (Admin)
/** (READ) Obtiene TODOS los estados */
export const getStatus = (): StatusAllProps => {
  return {
    ok: true,
    statusCode: 200,
    status: STATUS_STATE.map(cloneStatus)
  };
};

// (Admin)
/** (CREATE) Crea un nuevo estado */
type CreateStatusData = Omit<StatusProps, 'statusId'>;
export const createStatus = (data: CreateStatusData): StatusResponseProps => {
  const newStatus: StatusProps = {
    ...data,
    statusId: getNextStatusId()
  };
  STATUS_STATE = [...STATUS_STATE, newStatus];
  return { ok: true, statusCode: 201, status: cloneStatus(newStatus) };
};

// (Admin)
/** (UPDATE) Actualiza un estado */
export const updateStatus = (id: number, data: Partial<StatusProps>): StatusResponseProps => {
  const statusIndex = STATUS_STATE.findIndex(s => s.statusId === id);
  if (statusIndex !== -1) {
    const updatedStatus: StatusProps = {
      ...STATUS_STATE[statusIndex],
      ...data,
      statusId: STATUS_STATE[statusIndex].statusId
    };
    STATUS_STATE = [
      ...STATUS_STATE.slice(0, statusIndex),
      updatedStatus,
      ...STATUS_STATE.slice(statusIndex + 1)
    ];
    return { ok: true, statusCode: 200, status: cloneStatus(updatedStatus) };
  }
  return { ok: false, statusCode: 404, status: {} as StatusProps };
};

// (Admin)
/** (DELETE) Elimina un estado */
export const deleteStatus = (id: number): StatusDeleteProps => {
  const initialLength = STATUS_STATE.length;
  STATUS_STATE = STATUS_STATE.filter(status => status.statusId !== id);
  if (STATUS_STATE.length === initialLength) {
    return { ok: false, statusCode: 404, message: 'Estado no encontrado' };
  }
  return { ok: true, statusCode: 200, message: 'Estado eliminado' };
};