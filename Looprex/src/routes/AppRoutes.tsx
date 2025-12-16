import { useRoutes } from 'react-router-dom';
import type { UserProps, Cart } from '../interfaces';

// Pages
import { HomePage } from '../pages/HomePages';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { OrdersPage } from '../pages/OrderPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminPage } from '../pages/AdminPage';
import { AddAddressPage } from '../pages/AddressPage';
import { DetailOrderPage } from '../pages/DetailOrderPage';

interface AppRoutesProps {
  currentUser: UserProps | null;
  cart: Cart;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
  onAddToCart: (productId: number, quantity?: number) => Promise<void>;
  onRemoveFromCart: (productId: number) => void;
  onUpdateCartQuantity: (productId: number, newQuantity: number) => void;
  onClearCart: () => void;
  searchQuery?: string;
  onUserUpdate: (user: UserProps) => void;
}

export const AppRoutes = (props: AppRoutesProps) => {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <HomePage 
          onAddToCart={props.onAddToCart} 
          currentUser={props.currentUser}
          searchQuery={props.searchQuery}
        />
      )
    },
    {
      path: '/producto/:id',
      element: <ProductDetailPage onAddToCart={props.onAddToCart} />
    },
    {
      path: '/carrito',
      element: (
        <CartPage 
          cart={props.cart}
          onRemoveFromCart={props.onRemoveFromCart}
          onUpdateCartQuantity={props.onUpdateCartQuantity}
          onClearCart={props.onClearCart}
        />
      )
    },
    {
      path: '/checkout',
      element: (
        <CheckoutPage 
          currentUser={props.currentUser}
          cart={props.cart}
          onClearCart={props.onClearCart}
        />
      )
    },
    {
      path: '/login',
      element: <LoginPage onLogin={props.onLogin} />
    },
    {
      path: '/registro',
      element: <RegisterPage />
    },
    {
      path: '/mi-cuenta',
      element: (
        <AccountPage 
          currentUser={props.currentUser}
          onLogout={props.onLogout}
          onUserUpdated={props.onUserUpdate}
        />
      )
    },
    {
      path: '/mis-pedidos',
      element: <OrdersPage currentUser={props.currentUser} />
    },
    {
      path: '/admin',
      element: <AdminPage currentUser={props.currentUser} />
    },
    {
      path: '*',
      element: <NotFoundPage />
    },
    {
      path: '/agregar-direccion',
      element: <AddAddressPage currentUser={props.currentUser} />
    },
    {
      path: '/confirmacion-pedido',
      element: <DetailOrderPage />
    },
  ]);

  return routes;
};