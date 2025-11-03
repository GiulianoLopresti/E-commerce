import type { AddressProps } from '../interfaces';

// Usamos idUser (2=Juan, 3=María) y idComuna (101=Santiago, 201=Viña)
export const ADDRESSES: AddressProps[] = [
  {
    idAddress: 501,
    street: 'Av. Falsa',
    number: '123',
    idComuna: 101, // Santiago
    idUser: 2      // Usuario Juan Pérez
  },
  {
    idAddress: 502,
    street: 'Calle Verdadera',
    number: '456',
    idComuna: 201, // Viña del Mar
    idUser: 3      // Usuario María González
  },
  {
    idAddress: 503,
    street: 'Pasaje Secreto',
    number: '789',
    idComuna: 102, // Providencia
    idUser: 4      // Usuario Pedro Pérez
  }
];