export interface ComunaProps {
  idComuna: number;
  name: string;
  idRegion: number;
}

/** Para la acción getCommunesByRegion() */
export interface CommunesByRegionProps {
  ok: boolean;
  statusCode: number;
  communes: ComunaProps[];
}