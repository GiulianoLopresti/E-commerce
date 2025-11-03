import type { Region } from '../interfaces/region.interfaces';
import { REGIONS } from '../mocks/regions.data'

export const getRegionById = (id: number): Promise<Region | null> => {
    const region = REGIONS.find(r => r.id === id);
    return Promise.resolve(region || null);
};

// Crea una región con id autoincremental
export const createRegion = (data: Omit<Region, 'id'>): Promise<Region> => {
    const nextId = REGIONS.length ? Math.max(...REGIONS.map(r => r.id)) + 1 : 1;
    const newRegion: Region = { id: nextId, ...data };
    REGIONS.push(newRegion);
    return Promise.resolve(newRegion);
};

// Actualiza campos parciales (excepto id)
export const updateRegion = (
    id: number,
    updates: Partial<Omit<Region, 'id'>>
): Promise<Region | null> => {
    const index = REGIONS.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(null);
    const updated: Region = { ...REGIONS[index], ...updates, id };
    REGIONS[index] = updated;
    return Promise.resolve(updated);
};

// Reemplaza completamente una región por id
export const replaceRegion = (region: Region): Promise<Region | null> => {
    const index = REGIONS.findIndex(r => r.id === region.id);
    if (index === -1) return Promise.resolve(null);
    REGIONS[index] = { ...region };
    return Promise.resolve(REGIONS[index]);
};

// Elimina por id; true si eliminada
export const deleteRegion = (id: number): Promise<boolean> => {
    const index = REGIONS.findIndex(r => r.id === id);
    if (index === -1) return Promise.resolve(false);
    REGIONS.splice(index, 1);
    return Promise.resolve(true);
};