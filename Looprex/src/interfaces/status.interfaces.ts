export interface StatusProps {
  statusId: number;
  name: string;
}

export interface StatusAllProps {
  ok: boolean;
  statusCode: number;
  status: StatusProps[];
}

export interface StatusResponseProps {
  ok: boolean;
  statusCode: number;
  status: StatusProps;
}

export interface StatusDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}