import { Product, CategoryItem, SiteSettings, Coupon, Order, HeroBanner } from '../types';

export const DEFAULT_HERO_BANNERS: HeroBanner[] = [
  {
    id: 'banner-1',
    tag: 'NEW COLLECTION 2026',
    title: 'Define Your',
    highlight: 'Style',
    description: 'Discover the latest fashion trends with SR Fashion. Quality products, modern designs, and affordable prices tailored for your everyday confidence.',
    bgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'SHOP NOW',
    categoryFilter: 'All',
    isActive: true,
  },
  {
    id: 'banner-2',
    tag: 'STREET & CASUAL',
    title: 'Modern Urban',
    highlight: 'Streetwear',
    description: 'Elevate your everyday wardrobe with our hand-picked stylish t-shirts, premium polo, and comfortable daily fits.',
    bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'MENS COLLECTION',
    categoryFilter: "Men's Fashion",
    isActive: true,
  },
  {
    id: 'banner-3',
    tag: 'LIMITED SPECIAL',
    title: 'Exclusive Deals &',
    highlight: 'Up to 50% OFF',
    description: 'Special seasonal offers on luxury wear. Experience unmatched comfort, premium fabrics, and royal aesthetics.',
    bgImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'SHOP SALE DEALS',
    categoryFilter: 'Sale Deals',
    isActive: true,
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'SR',
  logoHighlight: 'Fashion',
  announcementText: '🔥 ফ্রি ডেলিভারি সারা বাংলাদেশে ২০০০ টাকার অর্ডারে! স্পেশাল কালেকশন লাইভ!',
  announcementEnabled: true,
  heroTag: 'NEW COLLECTION 2026',
  heroTitle: 'Define Your',
  heroHighlight: 'Style',
  heroDescription: 'Discover the latest fashion trends with SR Fashion. Quality products, modern designs, and affordable prices tailored for your everyday confidence.',
  heroBgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
  heroButtonText: 'SHOP NOW',
  offerTag: 'Flash Season Sale',
  offerTitle: 'UP TO',
  offerHighlight: '50% OFF',
  offerDescription: 'Special collection available for a limited time. Grab premium wardrobe essentials before stocks run out.',
  offerButtonText: 'SHOP SALE',
  contactPhone: '01352113432',
  contactEmail: 'gdyounus2025@gmail.com',
  contactAddress: 'Keshobpur, Jessore, Bangladesh',
  currencySymbol: '৳',
  freeDeliveryThreshold: 2000,
  bkashNumber: '01804459691',
  nagadNumber: '01804459691',
  whatsappNumber: '01352113432',
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'SR10',
    discountPercent: 10,
    minOrderAmount: 1000,
    isActive: true,
  },
  {
    id: 'c-2',
    code: 'EID2026',
    discountPercent: 15,
    minOrderAmount: 1500,
    isActive: true,
  },
  {
    id: 'c-3',
    code: 'FLASH20',
    discountPercent: 20,
    minOrderAmount: 2500,
    isActive: true,
  },
];

export const DEFAULT_ORDERS: Order[] = [];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    title: "Men's Fashion",
    categoryKey: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'cat-2',
    title: "Women's Fashion",
    categoryKey: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'cat-3',
    title: "T-Shirts",
    categoryKey: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 'cat-4',
    title: "Pants",
    categoryKey: "Pants",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
  },
];

export const PRODUCTS: Product[] = [];

