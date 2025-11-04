// src/routes/AppRoutes.tsx
import { useRoutes } from 'react-router-dom';
import type { UserProps, Cart } from '../interfaces';
import type { LoginCredentials } from '../actions/user.actions';

// --- Importaciones de Páginas ---
// (Crearemos estas páginas en el siguiente paso, por ahora las simulamos)
// import { HomePage } from '../pages/home/HomePage';
// import { LoginPage } from '../pages/login/LoginPage';
// import { CartPage } from '../pages/cart/CartPage';
// import { ProductDetailPage } from '../pages/productDetail/ProductDetailPage';
// import { RegisterPage } from '../pages/register/RegisterPage';
// import { AccountPage } from '../pages/account/AccountPage';

// --- (Simulación temporal de las páginas) ---
// (Borraremos esto cuando creemos las páginas reales)
const HomePage = ({ onAddToCart }: { onAddToCart: (id: number) => void }) => (
  <div>Página de Inicio (HomePage) - <button onClick={() => onAddToCart(1)}>Añadir Prod 1</button></div>
);
const LoginPage = ({ onLogin }: { onLogin: (c: LoginCredentials) => void }) => (
  <div>Página de Login (LoginPage) - <button onClick={() => onLogin({ email: 'test', password: '123' })}>Login</button></div>
);
const CartPage = ({ cart }: { cart: Cart }) => (
  <div>Página de Carrito (CartPage) - Items: {cart.items.length}</div>
);
const ProductDetailPage = ({ onAddToCart }: { onAddToCart: (id: number) => void }) => (
  <div>Página de Detalle de Producto (ProductDetailPage) - <button onClick={() => onAddToCart(2)}>Añadir Prod 2</button></div>
);
const RegisterPage = () => <div>Página de Registro (RegisterPage)</div>;
const AccountPage = ({ user }: { user: UserProps | null }) => (
  <div>Página de Mi Cuenta (AccountPage) - Usuario: {user?.name}</div>
);
// --- (Fin de la simulación) ---


/**
 * Estas son todas las props que el "Cerebro" (ECommerceApp)
 * le pasa al "Cartero" (AppRoutes).
 */
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

/**
 * Este es el "Cartero", idéntico al AppRoutes de breadsk.
 * Recibe las props globales y las distribuye a las páginas.
 */
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
      element: <CartPage cart={props.cart} />
      // (También pasaremos onRemoveFromCart, onUpdateCartQuantity)
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
      element: <AccountPage user={props.currentUser} />
      // (También pasaremos onLogout)
    },
    // {
    //   path: '/checkout',
    //   element: <CheckoutPage user={props.currentUser} cart={props.cart} />
    // },
    // {
    //   path: '/*',
    //   element: <div>Página 404 No Encontrada</div>
    // }
  ]);

  return routes;
};