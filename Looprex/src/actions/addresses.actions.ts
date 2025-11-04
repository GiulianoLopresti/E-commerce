import { ADDRESSES } from '../mocks';
import type { 
  AddressProps,
  AddressesByUserProps,
  AddressResponseProps,
  AddressDeleteProps
} from '../interfaces';

// (Cliente)
/** (READ) Simula la obtención de direcciones PARA UN USUARIO */
export const getAddressesByUserId = (userId: number): AddressesByUserProps => {
  const addresses = ADDRESSES.filter(a => a.userId === userId);
  return { ok: true, statusCode: 200, addresses };
};

// (Cliente)
/** (CREATE) Simula un cliente añadiendo una dirección */
type CreateAddressData = Omit<AddressProps, 'addressId'>;
export const createAddress = (data: CreateAddressData): AddressResponseProps => {
  const newAddress: AddressProps = {
    ...data,
    addressId: Math.floor(Math.random() * 100) + 50
  };
  return { ok: true, statusCode: 201, address: newAddress };
};

// (Cliente)
/** (UPDATE) Simula un cliente actualizando su dirección */
export const updateAddress = (addressId: number, data: Partial<AddressProps>): AddressResponseProps => {
  const address = ADDRESSES.find(a => a.addressId === addressId);
  if (address) {
    const updatedAddress = { ...address, ...data };
    return { ok: true, statusCode: 200, address: updatedAddress };
  }
  return { ok: false, statusCode: 404, address: {} as AddressProps };
};

// (Cliente)
/** (DELETE) Simula un cliente eliminando una dirección */
export const deleteAddress = (): AddressDeleteProps => {
  return { ok: true, statusCode: 200, message: 'Dirección eliminada' };
};