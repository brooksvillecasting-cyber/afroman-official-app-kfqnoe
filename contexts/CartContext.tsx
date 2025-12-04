
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '@/types/Product';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'afroman_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        setCart(JSON.parse(cartData));
        console.log('Cart loaded successfully');
      }
    } catch (error) {
      console.log('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.log('Error saving cart:', error);
    }
  };

  const calculateFinalPrice = (product: Product, size?: string): number => {
    let price = product.price;
    
    // Add $2 for 4X and 5X sizes
    if (size === '4X' || size === '5X') {
      price += 2;
    }
    
    return price;
  };

  const addToCart = (product: Product, size?: string) => {
    const finalPrice = calculateFinalPrice(product, size);
    
    const existingItemIndex = cart.findIndex(
      item => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
      console.log('Updated cart item quantity:', product.name);
    } else {
      const newItem: CartItem = {
        product,
        size,
        quantity: 1,
        finalPrice,
      };
      setCart([...cart, newItem]);
      console.log('Added to cart:', product.name, size ? `Size: ${size}` : '');
    }
  };

  const removeFromCart = (productId: string, size?: string) => {
    const updatedCart = cart.filter(
      item => !(item.product.id === productId && item.size === size)
    );
    setCart(updatedCart);
    console.log('Removed from cart:', productId);
  };

  const clearCart = () => {
    setCart([]);
    console.log('Cart cleared');
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
