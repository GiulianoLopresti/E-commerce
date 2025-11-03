import type { Product } from '../interfaces/index';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Teclado Mecánico RGB',
    description: 'Switches rojos, iluminación RGB personalizable',
    price: 49990,
    stock: 15,
    image: null,
    categoryId: 1,
    statusId: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Mouse Gamer Inalámbrico',
    description: '16000 DPI, 7 botones programables',
    price: 29990,
    stock: 25,
    image: null,
    categoryId: 1,
    statusId: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Monitor 24" 144Hz',
    description: 'Full HD, panel IPS, 1ms',
    price: 189990,
    stock: 8,
    image: null,
    categoryId: 2,
    statusId: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Auriculares Gaming',
    description: 'Sonido 7.1, micrófono extraíble',
    price: 39990,
    stock: 20,
    image: null,
    categoryId: 1,
    statusId: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Webcam Full HD',
    description: '1080p 60fps, enfoque automático',
    price: 59990,
    stock: 12,
    image: null,
    categoryId: 3,
    statusId: 1,
    createdAt: new Date().toISOString()
  }
];
