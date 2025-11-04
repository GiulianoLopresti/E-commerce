import { ADDRESSES } from '../mocks';
import type {
  AddressProps,
  AddressesByUserProps,
  AddressResponseProps,
  AddressDeleteProps
} from '../interfaces';

let ADDRESSES_STATE: AddressProps[] = [...ADDRESSES];

const cloneAddress = (address: AddressProps): AddressProps => ({ ...address });

const getNextAddressId = (): number => {
  if (ADDRESSES_STATE.length === 0) {
    return 1;
  }
  return Math.max(...ADDRESSES_STATE.map(address => address.addressId)) + 1;
};

// (Cliente)
/** (READ) Obtiene las direcciones PARA UN USUARIO */
export const getAddressesByUserId = (userId: number): AddressesByUserProps => {
  const addresses = ADDRESSES_STATE.filter(a => a.userId === userId).map(cloneAddress);
  return { ok: true, statusCode: 200, addresses };
};

// (Cliente)
/** (CREATE) Añade una dirección para un cliente */
type CreateAddressData = Omit<AddressProps, 'addressId'>;
export const createAddress = (data: CreateAddressData): AddressResponseProps => {
  const newAddress: AddressProps = {
    ...data,
    addressId: getNextAddressId()
  };
  ADDRESSES_STATE = [...ADDRESSES_STATE, newAddress];
  return { ok: true, statusCode: 201, address: cloneAddress(newAddress) };
};

// (Cliente)
/** (UPDATE) Actualiza una dirección */
export const updateAddress = (addressId: number, data: Partial<AddressProps>): AddressResponseProps => {
  const addressIndex = ADDRESSES_STATE.findIndex(a => a.addressId === addressId);
  if (addressIndex !== -1) {
    const updatedAddress: AddressProps = {
      ...ADDRESSES_STATE[addressIndex],
      ...data,
      addressId: ADDRESSES_STATE[addressIndex].addressId
    };
    ADDRESSES_STATE = [
      ...ADDRESSES_STATE.slice(0, addressIndex),
      updatedAddress,
      ...ADDRESSES_STATE.slice(addressIndex + 1)
    ];
    return { ok: true, statusCode: 200, address: cloneAddress(updatedAddress) };
  }
  return { ok: false, statusCode: 404, address: {} as AddressProps };
};

// (Cliente)
/** (DELETE) Elimina una dirección */
export const deleteAddress = (addressId: number): AddressDeleteProps => {
  const initialLength = ADDRESSES_STATE.length;
  ADDRESSES_STATE = ADDRESSES_STATE.filter(address => address.addressId !== addressId);
  if (ADDRESSES_STATE.length === initialLength) {
    return { ok: false, statusCode: 404, message: 'Dirección no encontrada' };
  }
  return { ok: true, statusCode: 200, message: 'Dirección eliminada' };
};
