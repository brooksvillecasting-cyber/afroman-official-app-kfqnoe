
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('CartProvider mounted');
    loadCart();
    return () => {
      console.log('CartProvider unmounted');
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCart();
    }
  }, [cart, isLoaded]);

  const loadCart = async () => {
    try {
      console.log('Loading cart from storage...');
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCart(parsedCart);
        console.log('Cart loaded successfully:', parsedCart.length, 'items');
      } else {
        console.log('No cart data found in storage');
      }
    } catch (error) {
      console.log('Error loading cart:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log('Cart saved successfully');
    } catch (error) {
      console.log('Error saving cart:', error);
    }
  };

  const calculateFinalPrice = (product: Product, size?: string): number => {
    try {
      let price = product.price;
      
      // Add $2 for 4X and 5X sizes
      if (size === '4X' || size === '5X') {
        price += 2;
      }
      
      return price;
    } catch (error) {
      console.log('Error calculating price:', error);
      return product.price;
    }
  };

  const addToCart = (product: Product, size?: string) => {
    try {
      console.log('Adding to cart:', product.name, size || 'no size');
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
        console.log('Added new item to cart:', product.name, size ? `Size: ${size}` : '');
      }
    } catch (error) {
      console.log('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId: string, size?: string) => {
    try {
      console.log('Removing from cart:', productId, size || 'no size');
      const updatedCart = cart.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      setCart(updatedCart);
      console.log('Removed from cart successfully');
    } catch (error) {
      console.log('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    try {
      console.log('Clearing cart');
      setCart([]);
      console.log('Cart cleared successfully');
    } catch (error) {
      console.log('Error clearing cart:', error);
    }
  };

  const getCartTotal = (): number => {
    try {
      return cart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
    } catch (error) {
      console.log('Error calculating cart total:', error);
      return 0;
    }
  };

  const getCartItemCount = (): number => {
    try {
      return cart.reduce((count, item) => count + item.quantity, 0);
    } catch (error) {
      console.log('Error calculating cart item count:', error);
      return 0;
    }
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
