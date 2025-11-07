import { useState, useCallback } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { NavBar } from './components/common/navBar/NavBar'; 
import { CategoryNav } from './components/common/categoryNav/Category'; 
import { Footer } from './components/layout/Footer';
import type { UserProps, Cart } from './interfaces';
import type { LoginCredentials } from './actions/user.actions';

export const ECommerceApp = () => {
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });

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

  return (
    <div className="app-container">
      <header>
        <NavBar 
          currentUser={currentUser}
          cartItemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={handleLogout} onSearch={function (query: string): void {
            throw new Error('Function not implemented.');
          } }        />
        <CategoryNav />
      </header>
      
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