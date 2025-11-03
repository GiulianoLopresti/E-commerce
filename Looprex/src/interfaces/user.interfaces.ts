export interface UserProps {
  idUser: number;
  rut: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;     
  profilePhoto?: string; 
  idRole: number;
  idStatus: number;
}

export interface UsersAllProps { // (NUEVO, para el admin)
  ok: boolean;
  statusCode: number;
  users: UserProps[];
}

/** Para la acción loginUser() */
export interface UserLoginProps {
  ok: boolean;
  statusCode: number;
  user: UserProps;
  token?: string;
}

/** Para la acción registerUser() */
export interface UserRegisterProps {
  ok: boolean;
  statusCode: number;
  user: UserProps;
}

/** Para la acción updateUser() */
export interface UserUpdateProps {
  ok: boolean;
  statusCode: number;
  user: UserProps;
}

export interface UserDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}