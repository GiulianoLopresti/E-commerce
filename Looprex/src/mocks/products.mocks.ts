import type { ProductProps } from '../interfaces';
import ryzenImg from '../assets/images/products/AMD Ryzen 5 8600G.jpg';
import rtxImg from '../assets/images/products/RTX 5060 TI.png';
import logitechImg from '../assets/images/products/Logitech G502 Hero.png';
import msiKeyboardImg from '../assets/images/products/MSI Forge GK600.png';
import xiaomiMonitorImg from '../assets/images/products/Xiaomi G Pro 27i.jpg';
import ps5Img from '../assets/images/products/Sony PlayStation 5 Slim.png';
import msiMotherboardImg from '../assets/images/products/MSI MAG B760 TOMAHAWK WIFI.png';
import ramImg from '../assets/images/products/RAM 16GB DDR5 FURY.jpg';
import corsairPsuImg from '../assets/images/products/Corsair CX Series CX750 2023.jpg';
import kingstonSsdImg from '../assets/images/products/Kingston NV3 1 TB.jpg';



export const PRODUCTS: ProductProps[] = [
  {
    productId: 1,
    name: 'Procesador AMD Ryzen 5 8600G',
    stock: 50,
    productPhoto: ryzenImg,
    description: 'Procesador de última generación con gráficos integrados Radeon 700M.',
    price: 219990,
    categoryId: 101, // Componentes PC
    statusId: 1
  },
  {
    productId: 2,
    name: 'Tarjeta de Video GIGABYTE RTX 5060 Ti',
    stock: 25,
    productPhoto: rtxImg, 
    description: 'Experimenta la nueva generación de rendimiento gráfico. La RTX 5060 Ti está diseñada para dominar los juegos en 1440p.',
    price: 400000,
    categoryId: 101, // Componentes PC
    statusId: 1
  },
  {
    productId: 3,
    name: 'Mouse Gamer Logitech G502 Hero',
    stock: 100,
    productPhoto: logitechImg, 
    description: 'Mouse alámbrico de alta precisión con sensor HERO 25K y 11 botones programables.',
    price: 49990,
    categoryId: 102, // Periféricos Gamer
    statusId: 1
  },
  {
    productId: 4,
    name: 'Teclado Mecánico MSI Forge GK600',
    stock: 70,
    productPhoto: msiKeyboardImg, 
    description: 'Teclado mecánico TKL (Tenkeyless) con switches Red e iluminación RGB.',
    price: 79990,
    categoryId: 102, // Periféricos Gamer
    statusId: 1
  },
  {
    productId: 5,
    name: 'Monitor Gamer Xiaomi G Pro 27i',
    stock: 30,
    productPhoto: xiaomiMonitorImg,
    description: 'Monitor 27" QHD (2K) 180Hz, 1ms de respuesta, tecnología FAST IPS.',
    price: 249990,
    categoryId: 103, // Monitores
    statusId: 1
  },
  {
    productId: 6,
    name: 'Consola Sony PlayStation 5 Slim',
    stock: 15,
    productPhoto: ps5Img,
    description: 'La última versión de la consola de Sony, ahora en un formato más compacto.',
    price: 649990,
    categoryId: 104, // Consolas
    statusId: 1
  },
  {
    productId: 7,
    name: 'Placa Madre MSI MAG B760 TOMAHAWK WIFI',
    stock: 40,
    productPhoto: msiMotherboardImg,
    description: 'Placa madre para procesadores Intel de 12ª y 13ª gen, con WiFi 6E y DDR5.',
    price: 199990,
    categoryId: 101, // Componentes PC
    statusId: 1
  },
  {
    productId: 8,
    name: 'RAM 16GB (2x8GB) Kingston FURY Beast DDR5 5200MHz',
    stock: 80,
    productPhoto: ramImg,
    description: 'Memoria RAM de alto rendimiento para plataformas de nueva generación.',
    price: 74990,
    categoryId: 101, // Componentes PC
    statusId: 1
  },
  {
    productId: 9,
    name: 'Fuente de Poder Corsair CX750 2023',
    stock: 60,
    productPhoto: corsairPsuImg,
    description: 'Fuente de poder de 750W con certificación 80 Plus Bronze, confiable y eficiente.',
    price: 89990,
    categoryId: 101, // Componentes PC
    statusId: 1
  },
  {
    productId: 10,
    name: 'Unidad SSD Kingston NV3 1TB NVMe M.2',
    stock: 120,
    productPhoto: kingstonSsdImg,
    description: 'Almacenamiento M.2 ultra rápido, ideal para sistema operativo y juegos.',
    price: 69990,
    categoryId: 101, // Componentes PC
    statusId: 1
  }
];