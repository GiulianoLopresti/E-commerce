// src/ECommerceApp.tsx
import { useState, useCallback } from 'react';
import { AppRoutes } from './routes/AppRoutes';
//** */ import { NavBar } from './pages/shared/NavBar'; // <-- Importarás tu NavBar aquí
import type { UserProps, Cart, CartItem } from './interfaces';
import { loginUser } from './actions';
import type { LoginCredentials } from './actions/user.actions';


export const ECommerceApp = () => {
  // (1) ESTADO GLOBAL: El usuario que ha iniciado sesión
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

  // (2) ESTADO GLOBAL: El carrito de compras
  // Usamos tu interfaz 'Cart' de cart.interfaces.ts
  const [cart, setCart] = useState<Cart>({ items: [] });

  // === FUNCIONES (CALLBACKS) PARA MODIFICAR EL ESTADO ===
  // Estas funciones se pasarán como props a las páginas que las necesiten.
  // Es el mismo patrón que 'handleSearch' en RobotsApp.tsx.

  /** (Auth) Maneja el inicio de sesión */
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { user } = await loginUser(credentials);
      setCurrentUser(user);
      // Podríamos guardar en localStorage aquí si quisiéramos persistencia
    } catch (error) {
      console.error('Error de login:', error);
      throw error; // Lanzamos el error para que la página de Login lo muestre
    }
  }, []); // El array vacío significa que esta función nunca cambia

  /** (Auth) Maneja el cierre de sesión */
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    // Limpiar localStorage si se usó
  }, []);

  /** (Cart) Añade un producto al carrito */
  const handleAddToCart = useCallback((productId: number, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      let newItems: CartItem[];

      if (existingItem) {
        // Si existe, actualiza la cantidad
        newItems = prevCart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, añádelo
        newItems = [...prevCart.items, { productId, quantity }];
      }

      // Devolvemos el nuevo estado del carrito
      return { items: newItems };
    });
  }, []); // El array vacío significa que esta función nunca cambia

  /** (Cart) Elimina un producto del carrito */
  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  }, []);

  /** (Cart) Actualiza la cantidad de un ítem en el carrito */
  const handleUpdateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menos, eliminarlo
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart => ({
      items: prevCart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    }));
  }, [handleRemoveFromCart]); // Depende de handleRemoveFromCart

  /** (Cart) Vacía el carrito (ej. después de una compra) */
  const handleClearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  // (3) RENDERIZADO
  // Pasamos todos los estados y funciones al "Cartero" (AppRoutes)
  // que se encargará de distribuirlos.
  return (
    <>
      {/* Aquí renderizamos el NavBar directamente 
        para que siempre reciba el 'currentUser' y el 'cart'
      */}
      {/* <NavBar 
        user={currentUser} 
        cartItemCount={cart.items.length} 
        onLogout={handleLogout}
      /> */}
      
      <main>
        <AppRoutes 
          currentUser={currentUser}
          cart={cart}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onClearCart={handleClearCart}
        />
      </main>

      {/* <Footer /> */}
    </>
  );
};