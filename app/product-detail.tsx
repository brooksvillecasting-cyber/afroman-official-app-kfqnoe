
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  if (!product) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const calculatePrice = () => {
    let price = product.price;
    if (selectedSize === '4X' || selectedSize === '5X') {
      price += 2;
    }
    return price;
  };

  const handleAddToCart = () => {
    if (product.category === 'clothing' && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }

    addToCart(product, selectedSize);
    Alert.alert(
      'Added to Cart',
      `${product.name}${selectedSize ? ` (${selectedSize})` : ''} has been added to your cart`,
      [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: () => router.push('/cart'),
        },
      ]
    );
  };

  const handleBuyNow = async () => {
    if (product.category === 'clothing' && !selectedSize) {
      Alert.alert('Select Size', 'Please select a size before purchasing');
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(product.stripeUrl);
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
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Image 
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${calculatePrice().toFixed(2)}</Text>
          {(selectedSize === '4X' || selectedSize === '5X') && (
            <Text style={styles.priceNote}>+$2.00 for {selectedSize} size</Text>
          )}
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Size Selection for Clothing */}
          {product.category === 'clothing' && product.sizes && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeTitle}>Select Size:</Text>
              <View style={styles.sizeGrid}>
                {product.sizes.map((size, index) => (
                  <React.Fragment key={size}>
                    <TouchableOpacity
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.sizeButtonSelected,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          selectedSize === size && styles.sizeButtonTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                      {(size === '4X' || size === '5X') && (
                        <Text style={styles.sizeExtraText}>+$2</Text>
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[buttonStyles.outlineButton, styles.addToCartButton]}
              onPress={handleAddToCart}
            >
              <IconSymbol 
                ios_icon_name="cart.badge.plus" 
                android_material_icon_name="add_shopping_cart" 
                size={24} 
                color={colors.primary} 
              />
              <Text style={buttonStyles.outlineButtonText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.primaryButton, styles.buyNowButton]}
              onPress={handleBuyNow}
            >
              <Text style={buttonStyles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
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
                All payments are processed securely through Stripe. Your payment information is never stored on our servers.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  productImage: {
    width: '100%',
    height: 400,
    backgroundColor: colors.card,
  },
  infoSection: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 4,
  },
  priceNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  sizeSection: {
    marginBottom: 24,
  },
  sizeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: colors.primary,
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sizeButtonTextSelected: {
    color: colors.background,
  },
  sizeExtraText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  addToCartButton: {
    flexDirection: 'row',
    gap: 8,
  },
  buyNowButton: {
    // Additional styles if needed
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary,
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
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
