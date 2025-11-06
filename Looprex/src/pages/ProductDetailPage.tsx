import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QuantitySelector } from '../components/common/product/Quantityselector';
import { getProductById } from '../actions/products.actions';
import type { ProductProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface ProductDetailPageProps {
  onAddToCart: (productId: number, quantity: number) => void;
}

export const ProductDetailPage = ({ onAddToCart }: ProductDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  useEffect(() => {
    if (id) {
      const response = getProductById(Number.parseInt(id));
      if (response.ok && response.product) {
        setProduct(response.product);
      } else {
        navigate('/404');
      }
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product.productId, quantity);
      setQuantity(1);
    }
  };

  if (!product) {
    return (
      <div className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/productos">Productos</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className={styles.productDetail}>
          <div className={styles.productDetailImage}>
            <img src={product.productPhoto} alt={product.name} />
          </div>

          <div className={styles.productDetailInfo}>
            <h1 className={styles.productDetailTitle}>{product.name}</h1>
            
            <div className={styles.productDetailPrice}>
              ${product.price.toLocaleString('es-CL')}
            </div>

            <div className={styles.productDetailStock}>
              {product.stock > 0 ? (
                <>
                  <i className="fa-solid fa-circle-check"></i>
                  <span>En stock ({product.stock} unidades)</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-xmark"></i>
                  <span>Sin stock</span>
                </>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className={styles.productDetailQuantity}>
                  <label>
                    Cantidad:
                    <QuantitySelector 
                      quantity={quantity}
                      onChange={setQuantity}
                      max={product.stock}
                    />
                  </label>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className={styles.addToCartButtonLarge}
                >
                  <i className="fa-solid fa-cart-plus"></i>{' '}
                  Agregar al Carrito
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.productTabs}>
          <div className={styles.tabButtons}>
            <button 
              onClick={() => setActiveTab('description')}
              className={activeTab === 'description' ? styles.tabActive : ''}
            >
              Descripción
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              className={activeTab === 'specifications' ? styles.tabActive : ''}
            >
              Especificaciones
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.tabPanel}>
                <p>{product.description || 'Sin descripción disponible.'}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className={styles.tabPanel}>
                <p>Especificaciones técnicas disponibles próximamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
