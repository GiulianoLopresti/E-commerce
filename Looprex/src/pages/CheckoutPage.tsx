import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getProductById } from '../actions/products.actions';
import { createOrder } from '../actions/order.actions';
import type { UserProps, Cart, ProductProps, CartItem } from '../interfaces';
import styles from '../style/pages.module.css';

interface CheckoutPageProps {
  currentUser: UserProps | null;
  cart: Cart;
  onClearCart: () => void;
}

interface CartItemWithProduct {
  productId: number;
  quantity: number;
  product: ProductProps;
}

export const CheckoutPage = ({ currentUser, cart, onClearCart }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const itemsWithProducts = cart.items.map(item => {
      const response = getProductById(item.productId);
      return {
        ...item,
        product: response.product!
      };
    });
    setCartItems(itemsWithProducts);
  }, [cart.items]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (cart.items.length === 0) {
    return <Navigate to="/carrito" replace />;
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const cartItemsArray: CartItem[] = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const response = createOrder(
        cartItemsArray,   
        currentUser,      
        1                 
      );
      if (response.ok) {
        onClearCart();
        navigate('/mis-pedidos');
      }
    } catch (error) {
      console.error('Error al procesar orden:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Finalizar Compra</h1>
        </div>

        <form onSubmit={handleSubmitOrder} className={styles.checkoutLayout}>
          <div className={styles.checkoutForm}>
            <div className={styles.checkoutSection}>
              <h2 className={styles.checkoutSectionTitle}>
                <i className="fa-solid fa-truck"></i> {''}
                Información de Envío
              </h2>

              <div className={styles.formGroup}>
                  <label htmlFor="fullName">Nombre Completo</label>
                  <input 
                    id="fullName"
                    name="fullName"
                    type="text" 
                    defaultValue={currentUser.name}
                    required 
                  />
                </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Dirección</label>
                <input 
                  id="address"
                  type="text" 
                  placeholder="Calle, número, departamento"
                  required 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">Ciudad</label>
                  <input id="city" type="text" required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="region">Región</label>
                  <select id="region" required>
                    <option value="">Seleccionar</option>
                    <option value="13">Región Metropolitana</option>
                    <option value="5">Valparaíso</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  defaultValue={currentUser.phone}
                  required 
                />
              </div>
            </div>

            <div className={styles.checkoutSection}>
              <h2 className={styles.checkoutSectionTitle}>
                <i className="fa-solid fa-credit-card"></i>{' '}
                Método de Pago
              </h2>

              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="webpay" defaultChecked />
                  <span>Webpay</span>
                </label>

                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="transfer" />
                  <span>Transferencia Bancaria</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.checkoutSummary}>
            <h3 className={styles.checkoutSummaryTitle}>Resumen del Pedido</h3>

            <div className={styles.orderItems}>
              {cartItems.map(item => (
                <div key={item.productId} className={styles.orderItem}>
                  <img src={item.product.productPhoto} alt={item.product.name} />
                  <div className={styles.orderItemInfo}>
                    <p className={styles.orderItemName}>{item.product.name}</p>
                    <p className={styles.orderItemQuantity}>Cantidad: {item.quantity}</p>
                  </div>
                  <p className={styles.orderItemPrice}>
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.orderTotals}>
              <div className={styles.orderTotalRow}>
                <span>Subtotal</span>
                <span>${calculateTotal().toLocaleString('es-CL')}</span>
              </div>

              <div className={styles.orderTotalRow}>
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div className={styles.orderTotalFinal}>
                <span>Total</span>
                <span>${calculateTotal().toLocaleString('es-CL')}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.placeOrderButton}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>{' '}
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>{''}
                  Realizar Pedido
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};