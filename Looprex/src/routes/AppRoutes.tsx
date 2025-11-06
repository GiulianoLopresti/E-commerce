import { useRoutes } from 'react-router-dom';
import type { UserProps, Cart } from '../interfaces';
import type { LoginCredentials } from '../actions/user.actions';

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

interface AppRoutesProps {
  currentUser: UserProps | null;
  cart: Cart;
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onLogout: () => void;
  onAddToCart: (productId: number, quantity?: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onUpdateCartQuantity: (productId: number, newQuantity: number) => void;
  onClearCart: () => void;
}

export const AppRoutes = (props: AppRoutesProps) => {
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage onAddToCart={props.onAddToCart} />
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
        />
      )
    },
    {
      path: '/mis-pedidos',
      element: <OrdersPage currentUser={props.currentUser} />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);

  return routes;
};