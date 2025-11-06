import { Link } from 'react-router-dom';
import type { ProductProps } from '../../../interfaces';
import styles from './Products.module.css';

interface ProductCardProps {
  product: ProductProps;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.productId);
    }
  };

  return (
    <Link to={`/producto/${product.productId}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.productPhoto} alt={product.name} />
        {product.stock === 0 && (
          <div className={styles.outOfStock}>Agotado</div>
        )}
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>
          ${product.price.toLocaleString('es-CL')}
        </p>

        {product.stock > 0 && (
          <button 
            onClick={handleAddToCart}
            className={styles.addToCartButton}
          >
            <i className="fa-solid fa-cart-plus"></i>{''}
            Agregar al Carrito
          </button>
        )}
      </div>
    </Link>
  );
};