import { useState, useCallback } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import type { UserProps, Cart } from './interfaces';
import type { LoginCredentials } from './actions/user.actions';

export const ECommerceApp = () => {
  // ==================== ESTADO GLOBAL ====================
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });

  // ==================== AUTH HANDLERS ====================
  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    const { loginUser } = await import('./actions/user.actions');
    const response = loginUser(credentials);
    
    if (response.ok && response.user) {
      setCurrentUser(response.user);
    } else {
      throw new Error(response.token || 'Error al iniciar sesión');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // ==================== CART HANDLERS ====================
  const handleAddToCart = useCallback((productId: number, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return {
          items: prevCart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        items: [...prevCart.items, { productId, quantity }]
      };
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
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
  }, [handleRemoveFromCart]);

  const handleClearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  // ==================== RENDER ====================
  return (
    <div className="app-container">
      <Header 
        currentUser={currentUser} 
        cartItemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
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
      
      <Footer />
    </div>
  );
};