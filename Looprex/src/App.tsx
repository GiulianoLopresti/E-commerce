import { useState, useCallback, useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { NavBar } from './components/common/navBar/NavBar'; 
import { CategoryNav } from './components/common/categoryNav/Category'; 
import { Footer } from './components/layout/Footer';
import type { UserProps, Cart } from './interfaces';


export const ECommerceApp = () => {
  const [currentUser, setCurrentUser] = useState<UserProps | null>(null);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const handleUserUpdate = useCallback((updatedUser: UserProps) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));}, []);

  // Recuperar usuario de localStorage al montar (opcional)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al recuperar usuario:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  /**
   * Handler para login
   */
  const handleLogin = useCallback(async (email: string, password: string) => {
    const { loginUser } = await import('./actions/user.actions');
    const response = await loginUser(email, password);
    
    if (response.ok && response.user) {
      setCurrentUser(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    } else {
      throw new Error(response.message || 'Error al iniciar sesión');
    }
  }, []);

  /**
   * Handler para logout
   */
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  /**
   * Handler para agregar al carrito
   * IMPORTANTE: Ahora obtiene la información completa del producto
   */
  const handleAddToCart = useCallback(async (productId: number, quantity: number = 1) => {
    const { getProductById } = await import('./actions/products.actions');
    const response = await getProductById(productId);
    
    if (!response.ok || !response.product) {
      console.error('Error al obtener producto');
      alert('Error al agregar producto al carrito');
      return;
    }

    const product = response.product;

    // Validar stock
    if (product.stock < quantity) {
      alert(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      
      if (existingItem) {
        // Verificar que no exceda el stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Solo hay ${product.stock} unidades disponibles`);
          return prevCart;
        }

        return {
          items: prevCart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        };
      }
      
      // Crear nuevo item con toda la información
      return {
        items: [
          ...prevCart.items, 
          {
            productId: product.productId,
            productName: product.name,
            productPhoto: product.productPhoto,
            price: product.price,
            quantity: quantity,
            stock: product.stock
          }
        ]
      };
    });
  }, []);

  /**
   * Handler para remover del carrito
   */
  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => ({
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  }, []);

  /**
   * Handler para actualizar cantidad en carrito
   */
  const handleUpdateCartQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const item = prevCart.items.find(i => i.productId === productId);
      
      // Validar stock
      if (item && newQuantity > item.stock) {
        alert(`Solo hay ${item.stock} unidades disponibles`);
        return prevCart;
      }

      return {
        items: prevCart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      };
    });
  }, [handleRemoveFromCart]);

  /**
   * Handler para limpiar carrito
   */
  const handleClearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  /**
   * Handler para búsqueda
   */
  const handleSearch = useCallback((query: string) => {
    console.log('Búsqueda activada:', query);
    setSearchQuery(query);
  }, []);

  return (
    <div className="app-container">
      <header>
        <NavBar 
          currentUser={currentUser}
          cartItemCount={cart.items.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={handleLogout}
          onSearch={handleSearch}
        />
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
          searchQuery={searchQuery}
          onUserUpdate={handleUserUpdate}
        />
      </main>
      
      <Footer />
    </div>
  );
};