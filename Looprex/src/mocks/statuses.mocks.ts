import type { StatusProps } from '../interfaces';

export const STATUS: StatusProps[] = [
  {
    idStatus: 1,
    name: 'Activo' // Para usuarios
  },
  {
    idStatus: 2,
    name: 'Inactivo' // Para usuarios
  },
  {
    idStatus: 10,
    name: 'Pendiente de Pago' // Para órdenes
  },
  {
    idStatus: 11,
    name: 'En Preparación' // Para órdenes
  },
  {
    idStatus: 12,
    name: 'Enviado' // Para órdenes
  },
  {
    idStatus: 13,
    name: 'Entregado' // Para órdenes
  },
  {
    idStatus: 14,
    name: 'Cancelado' // Para órdenes
  }
];