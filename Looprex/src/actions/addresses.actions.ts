import { ADDRESSES } from '../mocks';
import type { 
  AddressProps,
  AddressesByUserProps,
  AddressResponseProps,
  AddressDeleteProps
} from '../interfaces';

// (Cliente)
/** (READ) Simula la obtención de direcciones PARA UN USUARIO */
export const getAddressesByUserId = async (idUser: number): Promise<AddressesByUserProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = ADDRESSES.filter(a => a.idUser === idUser);
      resolve({ ok: true, statusCode: 200, addresses: results });
    }, 200);
  });
};

// (Cliente)
/** (CREATE) Simula un cliente añadiendo una dirección */
type CreateAddressData = Omit<AddressProps, 'idAddress'>;
export const createAddress = async (data: CreateAddressData): Promise<AddressResponseProps> => {
  return new Promise(resolve => {
    const newAddress: AddressProps = {
      ...data,
      idAddress: Math.floor(Math.random() * 100) + 50
    };
    resolve({ ok: true, statusCode: 201, address: newAddress });
  });
};

// (Cliente)
/** (UPDATE) Simula un cliente actualizando su dirección */
export const updateAddress = async (idAddress: number, data: Partial<AddressProps>): Promise<AddressResponseProps> => {
  return new Promise(resolve => {
    const address = ADDRESSES.find(a => a.idAddress === idAddress);
    if(address) {
      const updatedAddress = { ...address, ...data };
      resolve({ ok: true, statusCode: 200, address: updatedAddress });
    } else {
      resolve({ ok: false, statusCode: 404, address: {} as AddressProps });
    }
  });
};

// (Cliente)
/** (DELETE) Simula un cliente eliminando una dirección */
export const deleteAddress = async (): Promise<AddressDeleteProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, message: 'Dirección eliminada' });
    }, 40);
  });
};