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
    if (onAddToCart && product.stock > 0) {
      onAddToCart(product.productId);
    }
  };

  // Verificar que el producto esté activo (opcional)
  const isActive = product.status?.statusId === 1;

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

        {product.stock > 0 && isActive && (
          <button 
            onClick={() => onAddToCart?.(product.productId)}
            className={styles.addToCartButton}
            disabled={product.stock === 0 || !onAddToCart}  
          >
            {product.stock === 0 ? (
              <>
                <i className="fa-solid fa-ban"></i>{}
                Fuera de Stock
              </>
            ) : (
              <>
                <i className="fa-solid fa-cart-plus"></i>{}
                Añadir al carrito
              </>
            )}
          </button>
        )}

        {!isActive && (
          <p className={styles.inactiveProduct}>Producto no disponible</p>
        )}
      </div>
    </Link>
  );
};