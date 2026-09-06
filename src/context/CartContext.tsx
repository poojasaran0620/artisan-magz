import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, CustomizationData } from '../types/product';
import { buildWhatsAppOrderMessage } from '../utils/formatters';

interface CustomerDeliveryInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    selectedVariant: ProductVariant | undefined,
    customization: CustomizationData,
    quantity?: number
  ) => CartItem;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  discountCode: string;
  applyDiscount: (code: string) => { success: boolean; message: string };
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  sendWhatsAppOrder: (
    itemsOrCustomerInfo?: CartItem[] | CustomerDeliveryInfo,
    customerInfo?: CustomerDeliveryInfo
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_ribbon_cart_v1';
const FREE_SHIPPING_MIN = 1499;
const STANDARD_SHIPPING_FEE = 99;
const WHATSAPP_BUSINESS_NUMBER = '919876543210'; // Replaceable with studio business number

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items', e);
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (
    product: Product,
    selectedVariant: ProductVariant | undefined,
    customization: CustomizationData,
    quantity = 1
  ): CartItem => {
    let unitPrice = selectedVariant ? selectedVariant.price : product.basePrice;

    // If it's a hamper, calculate total from box + items
    if (customization.hamperDetails) {
      const boxPrice = customization.hamperDetails.box.price;
      const goodiesTotal = customization.hamperDetails.items.reduce(
        (sum, item) => sum + item.goodie.price * item.quantity,
        0
      );
      unitPrice = boxPrice + goodiesTotal;
    }

    // If add-ons are selected (e.g. gift wrap, letter, combo)
    if (customization.addOnPrice && customization.addOnPrice > 0) {
      unitPrice += customization.addOnPrice;
    }

    const cartItemId = `${product.id}-${selectedVariant?.id || 'base'}-${Date.now()}`;

    const newItem: CartItem = {
      cartItemId,
      product,
      selectedVariant,
      quantity,
      customization,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCartItems(prev => [newItem, ...prev]);
    setIsCartOpen(true);
    return newItem;
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyDiscount = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AURA10') {
      setDiscountCode('AURA10');
      setDiscountPercent(0.10);
      return { success: true, message: '🎉 10% discount applied successfully!' };
    }
    if (cleanCode === 'LOVE20') {
      setDiscountCode('LOVE20');
      setDiscountPercent(0.20);
      return { success: true, message: '💖 20% celebration discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try AURA10 or LOVE20' };
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round(subtotal * discountPercent);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shippingFee = subtotal === 0 || subtotalAfterDiscount >= FREE_SHIPPING_MIN ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotalAfterDiscount + shippingFee;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - subtotalAfterDiscount);

  const sendWhatsAppOrder = (
    itemsOrCustomerInfo?: CartItem[] | CustomerDeliveryInfo,
    customerInfo?: CustomerDeliveryInfo
  ) => {
    let itemsToProcess: CartItem[] = cartItems;
    let deliveryDetails: CustomerDeliveryInfo | undefined = undefined;

    if (Array.isArray(itemsOrCustomerInfo)) {
      itemsToProcess = itemsOrCustomerInfo;
      deliveryDetails = customerInfo;
    } else if (itemsOrCustomerInfo && typeof itemsOrCustomerInfo === 'object') {
      deliveryDetails = itemsOrCustomerInfo;
    }

    if (!itemsToProcess || itemsToProcess.length === 0) {
      console.warn('sendWhatsAppOrder: No items to order.');
      return;
    }

    const effectiveDiscountCode = discountCode;
    const effectiveDiscountAmount = discountAmount;

    const encodedMessage = buildWhatsAppOrderMessage(
      itemsToProcess,
      deliveryDetails?.name,
      deliveryDetails?.phone,
      deliveryDetails?.address,
      deliveryDetails?.city,
      deliveryDetails?.pincode,
      deliveryDetails?.notes,
      effectiveDiscountCode,
      effectiveDiscountAmount
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        discountCode,
        applyDiscount,
        freeShippingThreshold: FREE_SHIPPING_MIN,
        amountNeededForFreeShipping,
        sendWhatsAppOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
