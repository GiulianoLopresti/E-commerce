import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../actions/products.actions';
import { createBuyFromCart } from '../actions/buy.actions';
import { getAddressesByUserId } from '../actions/addresses.actions';
import type { UserProps, Cart, ProductProps, CartItemProps, AddressProps } from '../interfaces';
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
  const [userAddress, setUserAddress] = useState<AddressProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Cargar productos del carrito y dirección del usuario
  useEffect(() => {
    if (currentUser && cart.items.length > 0) {
      loadCheckoutData();
    }
  }, [cart.items, currentUser?.userId]);

  // Redirecciones
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (cart.items.length === 0 && !isProcessing) {
    return <Navigate to="/carrito" replace />;
  }

  const loadCheckoutData = async () => {
    setLoading(true);

    // Cargar productos del carrito
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

    // Cargar dirección del usuario
    setLoadingAddress(true);
    const addressResponse = await getAddressesByUserId(currentUser.userId);
    if (addressResponse.ok && addressResponse.addresses.length > 0) {
      // Usar la primera dirección del usuario
      setUserAddress(addressResponse.addresses[0]);
    } else {
      setError('No tienes direcciones registradas. Por favor, agrega una dirección en tu perfil.');
    }
    setLoadingAddress(false);

    setLoading(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que tenga dirección
    if (!userAddress) {
      setError('Debes tener al menos una dirección registrada para realizar el pedido');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Convertir cart.items a CartItemProps para el servicio
      const cartItemsForApi: CartItemProps[] = cartItems.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        productPhoto: item.product.productPhoto,
        price: item.product.price,
        quantity: item.quantity,
        stock: item.product.stock,
      }));

      // Crear la compra (Buy + Details)
      const response = await createBuyFromCart(
        cartItemsForApi,
        currentUser.userId,
        userAddress.addressId // Usar la dirección cargada
      );

      console.log('Respuesta de createBuyFromCart:', response);

      if (response.ok) {

        navigate(`/confirmacion-pedido?orderId=${response.buy?.buyId}`);
        console.log('Redirigiendo a confirmación con buyId:', response.buy?.buyId);

        setTimeout(() => {
           onClearCart();
          }, 100);
      } else {
        setError(response.message || 'Error al procesar el pedido');
      }
    } catch (error: any) {
      console.error('Error al procesar orden:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.container}>
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Cargando información del pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Finalizar Compra</h1>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className={styles.errorMessage}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
            {error.includes('dirección') && (
              <Link to="/mi-cuenta" className={styles.errorLink}>
                Ir a mi cuenta
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className={styles.checkoutLayout}>
          <div className={styles.checkoutForm}>
            {/* Sección de Información Personal */}
            <div className={styles.checkoutSection}>
              <h2 className={styles.checkoutSectionTitle}>
                <i className="fa-solid fa-user"></i>{}
                Información Personal
              </h2>

              <div className={styles.formGroup}>
                <label htmlFor="fullName">Nombre Completo</label>
                <input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  value={`${currentUser.name} ${currentUser.lastname}`}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rut">RUT</label>
                <input 
                  id="rut"
                  name="rut"
                  type="text" 
                  value={currentUser.rut}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  value={currentUser.email}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  value={currentUser.phone}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            {/* Sección de Dirección de Envío */}
            <div className={styles.checkoutSection}>
              <h2 className={styles.checkoutSectionTitle}>
                <i className="fa-solid fa-truck"></i>{}
                Dirección de Envío
              </h2>

              {loadingAddress && (
                <div className={styles.loadingAddress}>
                  <i className="fa-solid fa-spinner fa-spin"></i> Cargando dirección...
                </div>
              )}

              {!loadingAddress && userAddress && (
                <div className={styles.addressCard}>
                  <div className={styles.addressInfo}>
                    <p><strong>Calle:</strong> {userAddress.street}</p>
                    <p><strong>Número:</strong> {userAddress.number}</p>
                    <p><strong>Comuna:</strong> {userAddress.comuna.name}</p>
                  </div>
                  <Link to="/agregar-direccion" className={styles.changeAddressLink}>
                      <i className="fa-solid fa-pen"></i> Cambiar dirección
                  </Link>
                </div>
              )}

              {!loadingAddress && !userAddress && (
                <div className={styles.noAddress}>
                  <i className="fa-solid fa-location-dot"></i>
                  <p>No tienes direcciones registradas</p>
                  <Link to="/agregar-direccion" className={styles.addAddressButton}>
                      <i className="fa-solid fa-plus"></i> Agregar Dirección
                  </Link>
                </div>
              )}
            </div>

            {/* Sección de Método de Pago */}
            <div className={styles.checkoutSection}>
              <h2 className={styles.checkoutSectionTitle}>
                <i className="fa-solid fa-credit-card"></i>{}
                Método de Pago
              </h2>

              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="webpay" defaultChecked />
                  <span>
                    <i className="fa-solid fa-credit-card"></i> Webpay
                  </span>
                </label>

                <label className={styles.paymentMethod}>
                  <input type="radio" name="payment" value="transfer" />
                  <span>
                    <i className="fa-solid fa-money-bill-transfer"></i> Transferencia Bancaria
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className={styles.checkoutSummary}>
            <h3 className={styles.checkoutSummaryTitle}>Resumen del Pedido</h3>

            <div className={styles.orderItems}>
              {cartItems.map(item => (
                <div key={item.productId} className={styles.orderItem}>
                  <img src={item.product.productPhoto} alt={item.product.name} />
                  <div className={styles.orderItemInfo}>
                    <p className={styles.orderItemName}>{item.product.name}</p>
                    <p className={styles.orderItemQuantity}>
                      Cantidad: {item.quantity} × ${item.product.price.toLocaleString('es-CL')}
                    </p>
                  </div>
                  <p className={styles.orderItemPrice}>
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}
            </div>
            
            <div className={styles.orderTotals}>
              {/* Subtotal */}
              <div className={styles.orderTotalRow}>
                <span>Subtotal</span>
                <span>${calculateTotal().toLocaleString('es-CL')}</span>
              </div>
            
              {/* IVA (19%) */}
              <div className={styles.orderTotalRow}>
                <span>IVA (19%)</span>
                <span>${Math.round(calculateTotal() * 0.19).toLocaleString('es-CL')}</span>
              </div>
            
              {/* Envío */}
              <div className={styles.orderTotalRow}>
                <span>Envío</span>
                <span className={styles.freeShipping}>
                  {calculateTotal() > 50000 ? (
                    <>
                      <i className="fa-solid fa-truck"></i> Gratis
                    </>
                  ) : (
                    '$5.990'
                  )}
                </span>
              </div>
                
              {/* Total Final */}
              <div className={styles.orderTotalFinal}>
                <span>Total</span>
                <span>
                  ${(
                    calculateTotal() + 
                    Math.round(calculateTotal() * 0.19) + 
                    (calculateTotal() > 50000 ? 0 : 5990)
                  ).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
                
            {/* Información adicional de envío */}
            {calculateTotal() <= 50000 && (
              <div className={styles.shippingInfo}>
                <i className="fa-solid fa-info-circle"></i>
                <span>
                  Compra ${(50000 - calculateTotal()).toLocaleString('es-CL')} más para envío gratis
                </span>
              </div>
            )}

            <button 
              type="submit" 
              className={styles.placeOrderButton}
              disabled={isProcessing || loading || !userAddress}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>{}
                  Procesando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>{}
                  Realizar Pedido
                </>
              )}
            </button>
            
            {!userAddress && (
              <p className={styles.checkoutWarning}>
                <i className="fa-solid fa-triangle-exclamation"></i>{}
                Debes tener una dirección registrada
              </p>
            )}

            <p className={styles.checkoutNote}>
              <i className="fa-solid fa-info-circle"></i>{}
              Al realizar el pedido, aceptas nuestros términos y condiciones
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};