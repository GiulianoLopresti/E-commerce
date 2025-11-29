import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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

  if (cart.items.length === 0) {
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

      if (response.ok) {
        alert('¡Pedido realizado con éxito!');
        onClearCart();
        navigate('/mis-pedidos');
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
              <a href="/mi-cuenta" className={styles.errorLink}>
                Ir a Mi Cuenta
              </a>
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
                    {userAddress.apartment && (
                      <p><strong>Departamento:</strong> {userAddress.apartment}</p>
                    )}
                    <p><strong>Comuna:</strong> {userAddress.comuna.name}</p>
                    <p><strong>Región:</strong> {userAddress.comuna.regionId}</p>
                  </div>
                  <a href="/mi-cuenta" className={styles.changeAddressLink}>
                    <i className="fa-solid fa-pen"></i> Cambiar dirección
                  </a>
                </div>
              )}

              {!loadingAddress && !userAddress && (
                <div className={styles.noAddress}>
                  <i className="fa-solid fa-location-dot"></i>
                  <p>No tienes direcciones registradas</p>
                  <a href="/mi-cuenta" className={styles.addAddressButton}>
                    <i className="fa-solid fa-plus"></i> Agregar Dirección
                  </a>
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
                <span className={styles.freeShipping}>
                  <i className="fa-solid fa-truck"></i> Gratis
                </span>
              </div>

              <div className={styles.orderTotalFinal}>
                <span>Total</span>
                <span>${calculateTotal().toLocaleString('es-CL')}</span>
              </div>
            </div>

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