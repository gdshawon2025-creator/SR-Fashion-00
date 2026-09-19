export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isSale?: boolean;
  description: string;
  sizes?: string[];
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  categoryKey: string;
  image: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending Verification';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus?: PaymentStatus;
  transactionId?: string;
  senderPhone?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  couponCode?: string;
}

export interface SiteSettings {
  storeName: string;
  logoHighlight: string;
  announcementText: string;
  announcementEnabled: boolean;
  heroTag: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroBgImage: string;
  heroButtonText: string;
  offerTag: string;
  offerTitle: string;
  offerHighlight: string;
  offerDescription: string;
  offerButtonText: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  currencySymbol: string;
  freeDeliveryThreshold: number;
  bkashNumber?: string;
  nagadNumber?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface HeroBanner {
  id: string;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  bgImage: string;
  buttonText: string;
  categoryFilter?: string;
  isActive?: boolean;
}

