export interface AddressProps {
  idAddress: number;
  street: string;
  number: string;
  idComuna: number;
  idUser: number;
}

/** Para la acción getAddressesByUserId() */
export interface AddressesByUserProps {
  ok: boolean;
  statusCode: number;
  addresses: AddressProps[];
}

/** Para la acción createAddress() o updateAddress() */
export interface AddressResponseProps {
  ok: boolean;
  statusCode: number;
  address: AddressProps;
}

/** Para la acción deleteAddress() */
export interface AddressDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}