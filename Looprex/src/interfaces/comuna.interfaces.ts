export interface ComunaProps {
  comunaId: number;
  name: string;
  regionId: number;
}

/** Para la acción getCommunesByRegion() */
export interface CommunesByRegionProps {
  ok: boolean;
  statusCode: number;
  communes: ComunaProps[];
}