import type { AddressProps } from '../interfaces';

// Usamos idUser (2=Juan, 3=María) y idComuna (101=Santiago, 201=Viña)
export const ADDRESSES: AddressProps[] = [
  {
    addressId: 501,
    street: 'Av. Falsa',
    number: '123',
    comunaId: 101, // Santiago
    userId: 2      // Usuario Juan Pérez
  },
  {
    addressId: 502,
    street: 'Calle Verdadera',
    number: '456',
    comunaId: 201, // Viña del Mar
    userId: 3      // Usuario María González
  },
  {
    addressId: 503,
    street: 'Pasaje Secreto',
    number: '789',
    comunaId: 102, // Providencia
    userId: 4      // Usuario Pedro Pérez
  }
];