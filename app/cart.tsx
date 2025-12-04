
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useCart } from '@/contexts/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();

  const handleRemoveItem = (productId: string, size?: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeFromCart(productId, size);
            console.log('Item removed from cart:', productId, size);
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items first!');
      return;
    }

    if (cart.length === 1) {
      // Single item - go directly to Stripe
      try {
        console.log('Opening Stripe checkout for:', cart[0].product.name);
        const result = await WebBrowser.openBrowserAsync(cart[0].product.stripeUrl);
        console.log('Stripe checkout result:', result);
      } catch (error) {
        console.log('Error opening Stripe checkout:', error);
        Alert.alert('Error', 'Could not open checkout. Please try again.');
      }
    } else {
      // Multiple items - show message
      Alert.alert(
        'Checkout',
        'Please checkout each item individually by tapping "Buy Now" on each item. This ensures secure payment processing for each purchase.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCart();
            console.log('Cart cleared');
          },
        },
      ]
    );
  };

  const handleBuyNow = async (item: any) => {
    try {
      console.log('Opening Stripe checkout for:', item.product.name);
      const result = await WebBrowser.openBrowserAsync(item.product.stripeUrl);
      console.log('Stripe checkout result:', result);
      
      // Show info about digital content
      if (item.product.category === 'movie') {
        Alert.alert(
          'Digital Purchase',
          'After completing your payment, you will receive access to stream this content. Please check your email for access instructions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error opening Stripe checkout:', error);
      Alert.alert('Error', 'Could not open checkout. Please try again.');
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={28} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
        {cart.length === 0 && <View style={{ width: 28 }} />}
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol 
            ios_icon_name="cart" 
            android_material_icon_name="shopping_cart" 
            size={80} 
            color={colors.textSecondary} 
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some items to get started!</Text>
          <TouchableOpacity
            style={buttonStyles.primaryButton}
            onPress={() => router.push('/shop')}
          >
            <Text style={buttonStyles.buttonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item, index) => (
              <React.Fragment key={`${item.product.id}-${item.size || 'no-size'}-${index}`}>
                <View style={styles.cartItem}>
                  <Image 
                    source={{ uri: item.product.imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    {item.product.category === 'movie' && (
                      <View style={styles.digitalBadge}>
                        <IconSymbol 
                          ios_icon_name="cloud.fill" 
                          android_material_icon_name="cloud" 
                          size={14} 
                          color={colors.primary} 
                        />
                        <Text style={styles.digitalBadgeText}>Digital Content</Text>
                      </View>
                    )}
                    {item.size && (
                      <Text style={styles.itemSize}>Size: {item.size}</Text>
                    )}
                    <Text style={styles.itemPrice}>
                      ${item.finalPrice.toFixed(2)} × {item.quantity}
                    </Text>
                    <Text style={styles.itemTotal}>
                      Total: ${(item.finalPrice * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(item.product.id, item.size)}
                    >
                      <IconSymbol 
                        ios_icon_name="trash.fill" 
                        android_material_icon_name="delete" 
                        size={24} 
                        color={colors.error} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleBuyNow(item)}
                    >
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            ))}

            <View style={styles.infoBox}>
              <IconSymbol 
                ios_icon_name="checkmark.shield.fill" 
                android_material_icon_name="verified_user" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.infoBoxContent}>
                <Text style={styles.infoBoxTitle}>Secure Checkout</Text>
                <Text style={styles.infoBoxText}>
                  All payments are processed securely through Stripe. Physical items will be shipped to your address. Digital content will be available for streaming after purchase.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Cart Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={handleCheckout}
            >
              <IconSymbol 
                ios_icon_name="lock.fill" 
                android_material_icon_name="lock" 
                size={20} 
                color={colors.background} 
              />
              <Text style={[buttonStyles.buttonText, { marginLeft: 8 }]}>
                {cart.length === 1 ? 'Proceed to Checkout' : 'Checkout Items'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.checkoutNote}>
              {cart.length > 1 
                ? 'Checkout each item individually for secure processing' 
                : 'Secure checkout with Stripe'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  digitalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  digitalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  itemSize: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 8,
  },
  buyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 8,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  summaryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    backgroundColor: colors.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  checkoutNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
