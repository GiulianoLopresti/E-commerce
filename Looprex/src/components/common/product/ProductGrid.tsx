import { ProductCard } from './ProductCard';
import type { ProductProps } from '../../../interfaces';
import styles from './Products.module.css';

interface ProductGridProps {
  products: ProductProps[];
  onAddToCart?: (productId: number) => void;
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <i className="fa-solid fa-box-open"></i>
        <p>No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard 
          key={product.productId}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};