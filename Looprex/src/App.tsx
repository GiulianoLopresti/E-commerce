import { useState, useCallback } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { NavBar } from './pages/Components/NavBar/NavBar';
import { CategoryNav } from './pages/Components/CategoryNav/Category';
import type { UserProps, Cart, CartItem } from './interfaces';
import { loginUser } from './actions';

type LoginCredentials = Pick<UserProps, 'email' | 'password'>;

export const ECommerceApp = () => {

  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });

  const handleLogin = useCallback((credentials: LoginCredentials) => {
    // Llamamos a la acción de login que ya creamos
    const { user } =  loginUser(credentials);
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
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
  }, [handleRemoveFromCart]); // Esta función depende de 'handleRemoveFromCart'

  /** (Cart) Vacía el carrito (ej. después de una compra) */
  const handleClearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  
  // --- (C) RENDERIZADO ---
  return (
    <>
      {/* Renderizamos el NavBar y CategoryNav aquí, por encima de las rutas.
        Así se mostrarán en TODAS las páginas.
      */}
      <header>
        <NavBar 
          currentUser={currentUser} 
          cartItemCount={cart.items.length} 
          onLogout={handleLogout}
        />
        <CategoryNav />
      </header>
      
      {/* Aquí renderizamos el "Cartero" (AppRoutes).
        Le pasamos el paquete completo de estados y funciones 
        para que él los distribuya a las páginas correctas.
      */}
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