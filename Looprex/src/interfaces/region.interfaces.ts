export interface RegionProps {
  idRegion: number;
  name: string;
}

export interface RegionsAllProps {
  ok: boolean;
  statusCode: number;
  regions: RegionProps[];
}