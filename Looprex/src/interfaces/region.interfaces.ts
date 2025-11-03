export interface RegionProps {
  regionId: number;
  name: string;
}

export interface RegionsAllProps {
  ok: boolean;
  statusCode: number;
  regions: RegionProps[];
}