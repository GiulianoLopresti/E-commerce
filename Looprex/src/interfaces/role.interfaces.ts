export interface RoleProps {
  roleId: number;
  name: string;
}

export interface RolesAllProps {
  ok: boolean;
  statusCode: number;
  roles: RoleProps[];
}

export interface RoleResponseProps {
  ok: boolean;
  statusCode: number;
  role: RoleProps;
}

export interface RoleDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}