import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuantitySelector } from '../components/common/product/Quantityselector';
import { getProductById } from '../actions/products.actions';
import type { Cart, ProductProps } from '../interfaces';
import styles from '../style/pages.module.css';

interface CartPageProps {
  cart: Cart;
  onRemoveFromCart: (productId: number) => void;
  onUpdateCartQuantity: (productId: number, quantity: number) => void;
  onClearCart: () => void;
}

interface CartItemWithProduct {
  productId: number;
  quantity: number;
  product: ProductProps;
}

export const CartPage = ({ 
  cart, 
  onRemoveFromCart, 
  onUpdateCartQuantity, 
  onClearCart 
}: CartPageProps) => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, [cart.items]);

  const loadCartItems = async () => {
    setLoading(true);
    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const item of cart.items) {
      const response = await getProductById(item.productId);
      if (response.ok && response.product) {
        itemsWithProducts.push({
          productId: item.productId,
          quantity: item.quantity,
          product: response.product
        });
      }
    }

    setCartItems(itemsWithProducts);
    setLoading(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.container}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.container}>
          <div className={styles.emptyCartContent}>
            <i className="fa-solid fa-cart-shopping"></i>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar tu compra</p>
            <Link to="/" className={styles.button}>
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Tu Carrito de Compras</h1>
        </div>

        <div className={styles.cartLayout}>
          {/* Lista de productos */}
          <div className={styles.cartItems}>
            {cartItems.map(item => (
              <div key={item.productId} className={styles.cartItem}>
                <img 
                  src={item.product.productPhoto} 
                  alt={item.product.name}
                  className={styles.cartItemImage}
                />

                <div className={styles.cartItemInfo}>
                  <Link 
                    to={`/producto/${item.product.productId}`}
                    className={styles.cartItemName}
                  >
                    {item.product.name}
                  </Link>
                  <p className={styles.cartItemPrice}>
                    ${item.product.price.toLocaleString('es-CL')}
                  </p>
                </div>

                <div className={styles.cartItemActions}>
                  <QuantitySelector 
                    quantity={item.quantity}
                    onChange={(newQuantity) => onUpdateCartQuantity(item.productId, newQuantity)}
                    max={item.product.stock}
                  />
                  
                  <button
                    onClick={() => onRemoveFromCart(item.productId)}
                    className={styles.removeButton}
                    title="Eliminar"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>

                <div className={styles.cartItemTotal}>
                  ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                </div>
              </div>
            ))}

            <button 
              onClick={onClearCart}
              className={styles.clearCartButton}
            >
              <i className="fa-solid fa-trash-can"></i>{' '}
              Vaciar Carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className={styles.cartSummary}>
            <h3 className={styles.cartSummaryTitle}>Resumen del Pedido</h3>
            
            <div className={styles.cartSummaryRow}>
              <span>Subtotal</span>
              <span>${calculateTotal().toLocaleString('es-CL')}</span>
            </div>

            <div className={styles.cartSummaryRow}>
              <span>Envío</span>
              <span>Calculado en checkout</span>
            </div>

            <div className={styles.cartSummaryTotal}>
              <span>Total</span>
              <span>${calculateTotal().toLocaleString('es-CL')}</span>
            </div>

            <Link to="/checkout" className={styles.checkoutButton}>
              Proceder al Pago{' '}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>

            <Link to="/" className={styles.continueShoppingLink}>
              Continuar Comprando{' '}
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};