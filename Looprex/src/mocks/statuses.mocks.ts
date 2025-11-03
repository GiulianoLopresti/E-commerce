import type { StatusProps } from '../interfaces';

export const STATUS: StatusProps[] = [
  {
    statusId: 1,
    name: 'Activo' // Para usuarios
  },
  {
    statusId: 2,
    name: 'Inactivo' // Para usuarios
  },
  {
    statusId: 10,
    name: 'Pendiente de Pago' // Para órdenes
  },
  {
    statusId: 11,
    name: 'En Preparación' // Para órdenes
  },
  {
    statusId: 12,
    name: 'Enviado' // Para órdenes
  },
  {
    statusId  : 13,
    name: 'Entregado' // Para órdenes
  },
  {
    statusId: 14,
    name: 'Cancelado' // Para órdenes
  }
];