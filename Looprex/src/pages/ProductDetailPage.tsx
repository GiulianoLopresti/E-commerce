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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProduct(Number.parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError('');

    const response = await getProductById(productId);
    
    if (response.ok && response.product) {
      setProduct(response.product);
    } else {
      setError('Producto no encontrado');
      setTimeout(() => navigate('/'), 2000);
    }
    
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      onAddToCart(product.productId, quantity);
      setQuantity(1);
      // Opcional: Mostrar mensaje de éxito
      alert('Producto agregado al carrito');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.container}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.container}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <h2>{error}</h2>
          <p>Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className={styles.productDetail}>
          <div className={styles.productDetailImage}>
            <img src={product.productPhoto} alt={product.name} />
            {product.stock === 0 && (
              <div className={styles.outOfStockBadge}>Agotado</div>
            )}
          </div>

          <div className={styles.productDetailInfo}>
            <h1 className={styles.productDetailTitle}>{product.name}</h1>
            
            {/* Mostrar categoría */}
            <div className={styles.productDetailCategory}>
              <i className="fa-solid fa-tag"></i>
              <span>{product.category.name}</span>
            </div>

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
              {/* Selector de cantidad - SIEMPRE VISIBLE */}
                  <div className={styles.productDetailQuantity}>
                    <label>
                      Cantidad:
                      <QuantitySelector 
                        quantity={quantity}
                        onChange={setQuantity}
                        max={Math.max(product.stock, 0)}
                      />
                    </label>
                  </div>

                  {/* Botón añadir al carrito */}
                  <button 
                    onClick={handleAddToCart}
                    className={styles.addToCartButtonLarge}
                    disabled={product.stock === 0}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    {product.stock === 0 ? 'Fuera de Stock' : 'Agregar al Carrito'}
                  </button>

                  {/* Mensaje informativo si está agotado */}
                  {product.stock === 0 && (
                    <div className={styles.outOfStockMessage}>
                      Este producto no está disponible en este momento
                    </div>
                  )}
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
                <h3>Descripción del Producto</h3>
                <p>{product.description || 'Sin descripción disponible.'}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className={styles.tabPanel}>
                <h3>Especificaciones Técnicas</h3>
                <ul className={styles.specsList}>
                  <li>
                    <strong>Categoría:</strong> {product.category.name}
                  </li>
                  <li>
                    <strong>Estado:</strong> {product.status.name}
                  </li>
                  <li>
                    <strong>Stock Disponible:</strong> {product.stock} unidades
                  </li>
                  <li>
                    <strong>Código de Producto:</strong> LPX-{product.productId.toString().padStart(5, '0')}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};