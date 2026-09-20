import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, CategoryItem, SiteSettings, Coupon, HeroBanner, OrderStatus, PaymentStatus } from '../types';

/**
 * Sanitizes an object before writing to Firestore.
 * Firestore strictly forbids `undefined` field values and will throw an unhandled exception.
 * This recursively strips out any `undefined` keys or converts them safely.
 */
export const sanitizeForFirestore = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        clean[key] = sanitizeForFirestore(val);
      }
    }
    return clean;
  }
  return obj;
};

// ================= PRODUCTS =================
export const subscribeProducts = (onUpdate: (products: Product[]) => void) => {
  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Product);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore products subscription warning:', err);
    }
  );
};

export const syncSaveProduct = async (product: Product): Promise<void> => {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, sanitizeForFirestore(product), { merge: true });
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
};

export const syncDeleteProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
};

// ================= CATEGORIES =================
export const subscribeCategories = (onUpdate: (categories: CategoryItem[]) => void) => {
  const colRef = collection(db, 'categories');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: CategoryItem[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as CategoryItem);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore categories subscription warning:', err);
    }
  );
};

export const syncSaveCategory = async (category: CategoryItem): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, sanitizeForFirestore(category), { merge: true });
  } catch (err) {
    console.error('Error saving category to Firestore:', err);
  }
};

export const syncDeleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting category from Firestore:', err);
  }
};

// ================= ORDERS =================
export const subscribeOrders = (onUpdate: (orders: Order[]) => void) => {
  const colRef = collection(db, 'orders');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Order);
      });
      // Sort orders descending by createdAt
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore orders subscription warning:', err);
    }
  );
};

export const syncSaveOrder = async (order: Order): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', order.id);
    const cleanOrder = sanitizeForFirestore(order);
    await setDoc(docRef, cleanOrder, { merge: true });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }
};

export const syncUpdateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, { status }, { merge: true });
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
};

export const syncUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await setDoc(docRef, { paymentStatus }, { merge: true });
  } catch (err) {
    console.error('Error updating payment status in Firestore:', err);
  }
};

export const syncDeleteOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting order from Firestore:', err);
  }
};

// ================= SETTINGS =================
export const subscribeSettings = (onUpdate: (settings: SiteSettings) => void) => {
  const docRef = doc(db, 'settings', 'store_config');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as SiteSettings);
      }
    },
    (err) => {
      console.warn('Firestore settings subscription warning:', err);
    }
  );
};

export const syncSaveSettings = async (settings: SiteSettings): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'store_config');
    await setDoc(docRef, sanitizeForFirestore(settings), { merge: true });
  } catch (err) {
    console.error('Error saving settings to Firestore:', err);
  }
};

// ================= ADMIN PIN =================
export const subscribeAdminPin = (onUpdate: (pin: string) => void) => {
  const docRef = doc(db, 'settings', 'admin_pin');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.pin) {
          onUpdate(data.pin);
        }
      }
    },
    (err) => {
      console.warn('Firestore admin pin subscription warning:', err);
    }
  );
};

export const syncSaveAdminPin = async (pin: string): Promise<void> => {
  try {
    const docRef = doc(db, 'settings', 'admin_pin');
    await setDoc(docRef, { pin }, { merge: true });
  } catch (err) {
    console.error('Error saving admin pin to Firestore:', err);
  }
};

// ================= COUPONS =================
export const subscribeCoupons = (onUpdate: (coupons: Coupon[]) => void) => {
  const colRef = collection(db, 'coupons');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Coupon[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Coupon);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore coupons subscription warning:', err);
    }
  );
};

export const syncSaveCoupon = async (coupon: Coupon): Promise<void> => {
  try {
    const docRef = doc(db, 'coupons', coupon.id);
    await setDoc(docRef, sanitizeForFirestore(coupon), { merge: true });
  } catch (err) {
    console.error('Error saving coupon to Firestore:', err);
  }
};

export const syncDeleteCoupon = async (couponId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'coupons', couponId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting coupon from Firestore:', err);
  }
};

// ================= BANNERS =================
export const subscribeBanners = (onUpdate: (banners: HeroBanner[]) => void) => {
  const colRef = collection(db, 'banners');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: HeroBanner[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as HeroBanner);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore banners subscription warning:', err);
    }
  );
};

export const syncSaveBanner = async (banner: HeroBanner): Promise<void> => {
  try {
    const docRef = doc(db, 'banners', banner.id);
    await setDoc(docRef, sanitizeForFirestore(banner), { merge: true });
  } catch (err) {
    console.error('Error saving banner to Firestore:', err);
  }
};

export const syncDeleteBanner = async (bannerId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'banners', bannerId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting banner from Firestore:', err);
  }
};

// ================= INITIAL DATA SEEDING =================
// Seeds local/fallback data to Firestore if the cloud database is empty
export const seedFirestoreIfEmpty = async (initial: {
  products: Product[];
  categories: CategoryItem[];
  settings: SiteSettings;
  coupons: Coupon[];
  banners: HeroBanner[];
  adminPin: string;
  orders?: Order[];
}): Promise<void> => {
  try {
    // 1. Check categories
    const catSnap = await getDocs(collection(db, 'categories'));
    if (catSnap.empty && initial.categories.length > 0) {
      for (const cat of initial.categories) {
        await setDoc(doc(db, 'categories', cat.id), sanitizeForFirestore(cat));
      }
    }

    // 2. Check products
    const prodSnap = await getDocs(collection(db, 'products'));
    if (prodSnap.empty && initial.products.length > 0) {
      for (const prod of initial.products) {
        await setDoc(doc(db, 'products', prod.id), sanitizeForFirestore(prod));
      }
    }

    // 3. Check settings
    const settingsCol = collection(db, 'settings');
    const settingsSnap = await getDocs(settingsCol);
    if (settingsSnap.empty) {
      await setDoc(doc(db, 'settings', 'store_config'), sanitizeForFirestore(initial.settings));
      await setDoc(doc(db, 'settings', 'admin_pin'), { pin: initial.adminPin || 'admin123' });
    }

    // 4. Check banners
    const bannerSnap = await getDocs(collection(db, 'banners'));
    if (bannerSnap.empty && initial.banners.length > 0) {
      for (const b of initial.banners) {
        await setDoc(doc(db, 'banners', b.id), sanitizeForFirestore(b));
      }
    }

    // 5. Check coupons
    const couponSnap = await getDocs(collection(db, 'coupons'));
    if (couponSnap.empty && initial.coupons.length > 0) {
      for (const c of initial.coupons) {
        await setDoc(doc(db, 'coupons', c.id), sanitizeForFirestore(c));
      }
    }

    // 6. Check orders
    if (initial.orders && initial.orders.length > 0) {
      const orderSnap = await getDocs(collection(db, 'orders'));
      if (orderSnap.empty) {
        for (const o of initial.orders) {
          await setDoc(doc(db, 'orders', o.id), sanitizeForFirestore(o));
        }
      }
    }
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
  }
};
