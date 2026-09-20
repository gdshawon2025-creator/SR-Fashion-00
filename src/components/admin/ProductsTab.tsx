import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Layers,
  Tag
} from 'lucide-react';
import { Product, CategoryItem, SiteSettings } from '../../types';

interface ProductsTabProps {
  products: Product[];
  categories: CategoryItem[];
  settings: SiteSettings;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddCategory?: (category: CategoryItem) => void;
  isAddModalOpenInitially?: boolean;
  onCloseInitialAddModal?: () => void;
}

const PRESET_IMAGES = [
  { label: 'Black T-Shirt', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { label: 'Denim Jeans', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fashion Jacket', url: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Summer Dress', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Linen Blouse', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80' },
  { label: 'White Tee', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chino Pants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
  { label: 'Casual Shirt', url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Leather Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
  { label: 'Casual Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Polo Shirt', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' },
];

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

const DEFAULT_FALLBACK_CATEGORIES = [
  "Men's Fashion",
  "Women's Fashion",
  'T-Shirts',
  'Pants',
  'Panjabi',
  'Polo Shirt',
  'Winter Collection',
  'Shoes & Footwear',
  'Accessories',
];

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  categories,
  settings,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  isAddModalOpenInitially = false,
  onCloseInitialAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'inStock' | 'outOfStock'>('All');

  // Selected products for bulk delete
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState('');

  // Available categories combined from props, products, and fallbacks
  const availableCategories = useMemo(() => {
    const list: string[] = [];
    const addUnique = (title: string) => {
      const clean = title?.trim();
      if (clean && !list.some((existing) => existing.toLowerCase() === clean.toLowerCase())) {
        list.push(clean);
      }
    };

    categories.forEach((c) => addUnique(c.title));
    products.forEach((p) => addUnique(p.category));

    if (list.length === 0) {
      DEFAULT_FALLBACK_CATEGORIES.forEach((c) => addUnique(c));
    }
    return list;
  }, [categories, products]);

  // Custom Category Input Toggle
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: number;
    oldPrice: string;
    image: string;
    description: string;
    sizes: string;
    inStock: boolean;
    isSale: boolean;
    rating: number;
    reviewCount: number;
  }>({
    name: '',
    category: categories[0]?.title || availableCategories[0] || "Men's Fashion",
    price: 950,
    oldPrice: '',
    image: PRESET_IMAGES[0].url,
    description: 'উচ্চমানের আরামদায়ক ফেব্রিক, প্রিমিয়াম ফিনিশিং এবং আধুনিক কাটিং।',
    sizes: 'S, M, L, XL',
    inStock: true,
    isSale: false,
    rating: 5,
    reviewCount: 15,
  });

  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('ছবির সাইজ ৫MB এর কম হতে হবে।');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle size in size string
  const handleToggleSize = (sizeName: string) => {
    const currentSizes = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let updatedSizes: string[];
    if (currentSizes.includes(sizeName)) {
      updatedSizes = currentSizes.filter((s) => s !== sizeName);
    } else {
      updatedSizes = [...currentSizes, sizeName];
    }
    setFormData((prev) => ({ ...prev, sizes: updatedSizes.join(', ') }));
  };

  // Handle open add modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    const defaultCat = categories[0]?.title || availableCategories[0] || "Men's Fashion";
    setFormData({
      name: '',
      category: defaultCat,
      price: 950,
      oldPrice: '',
      image: PRESET_IMAGES[Math.floor(Math.random() * PRESET_IMAGES.length)].url,
      description: 'উচ্চমানের আরামদায়ক ফেব্রিক, প্রিমিয়াম ফিনিশিং এবং আধুনিক কাটিং।',
      sizes: 'S, M, L, XL',
      inStock: true,
      isSale: false,
      rating: 5,
      reviewCount: 10,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsCustomCategory(false);
    setCustomCategoryInput('');
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      image: product.image,
      description: product.description,
      sizes: product.sizes ? product.sizes.join(', ') : 'S, M, L, XL',
      inStock: product.inStock !== false,
      isSale: Boolean(product.isSale),
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Duplicate product
  const handleDuplicate = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (কপি)`,
    };
    onAddProduct(duplicated);
    showToast(`"${duplicated.name}" সফলভাবে ডুপ্লিকেট করা হয়েছে!`);
  };

  // Handle submit product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('পণ্যের নাম প্রদান করুন');
      return;
    }

    const finalCategory = (isCustomCategory ? customCategoryInput.trim() : formData.category.trim());
    if (!finalCategory) {
      setFormError('অনুগ্রহ করে পণ্যের একটি ক্যাটাগরি নির্ধারণ করুন অথবা নতুন ক্যাটাগরির নাম লিখুন');
      return;
    }

    if (formData.price <= 0) {
      setFormError('সঠিক মূল্য প্রদান করুন');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('পণ্যের ছবির লিঙ্ক দিন অথবা ছবি আপলোড করুন');
      return;
    }

    // Auto-register newly created category in the store's categories
    if (onAddCategory) {
      const alreadyExists = categories.some(
        (c) => c.title.trim().toLowerCase() === finalCategory.toLowerCase()
      );
      if (!alreadyExists) {
        onAddCategory({
          id: `cat-${Date.now()}`,
          title: finalCategory,
          categoryKey: finalCategory,
          image: formData.image.trim() || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        });
      }
    }

    const sizesArr = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const oldPriceNum = formData.oldPrice ? parseFloat(formData.oldPrice) : undefined;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        name: formData.name.trim(),
        category: finalCategory,
        price: Number(formData.price),
        oldPrice: oldPriceNum,
        image: formData.image.trim(),
        description: formData.description.trim(),
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        inStock: formData.inStock,
        isSale: formData.isSale,
      };
      onUpdateProduct(updated);
      showToast(`"${updated.name}" পণ্যটি সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      // Add new
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name.trim(),
        category: finalCategory,
        price: Number(formData.price),
        oldPrice: oldPriceNum,
        image: formData.image.trim(),
        description: formData.description.trim(),
        sizes: sizesArr.length > 0 ? sizesArr : undefined,
        inStock: formData.inStock,
        isSale: formData.isSale,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
      };
      onAddProduct(newProduct);
      showToast(`নতুন পণ্য "${newProduct.name}" সফলভাবে স্টোরে যোগ করা হয়েছে!`);
    }

    setIsModalOpen(false);
    if (onCloseInitialAddModal) {
      onCloseInitialAddModal();
    }
  };

  // Confirm and delete single product
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const name = productToDelete.name;
    onDeleteProduct(productToDelete.id);
    setSelectedProductIds((prev) => prev.filter((id) => id !== productToDelete.id));
    setProductToDelete(null);
    showToast(`"${name}" পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!`);
  };

  // Confirm and delete bulk products
  const handleConfirmBulkDelete = () => {
    const count = selectedProductIds.length;
    selectedProductIds.forEach((id) => {
      onDeleteProduct(id);
    });
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast(`${count}টি পণ্য সফলভাবে মুছে ফেলা হয়েছে!`);
  };

  // Select all visible filtered products
  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  // Toggle single product selection
  const handleToggleSelect = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();

    let matchesStock = true;
    if (stockFilter === 'inStock') matchesStock = p.inStock !== false;
    if (stockFilter === 'outOfStock') matchesStock = p.inStock === false;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const parsedCurrentSizes = formData.sizes
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-5">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium shadow-sm animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ACTION BAR */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* SEARCH & FILTERS */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="পণ্য খুঁজুন (নাম বা ক্যাটাগরি)..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none bg-white text-neutral-700"
          >
            <option value="All">সকল ক্যাটাগরি ({products.length})</option>
            {availableCategories.map((catTitle) => (
              <option key={catTitle} value={catTitle}>
                {catTitle}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none bg-white text-neutral-700"
          >
            <option value="All">সকল স্টক</option>
            <option value="inStock">ইন স্টক (In Stock)</option>
            <option value="outOfStock">আউট অফ স্টক (Out of Stock)</option>
          </select>
        </div>

        {/* BULK ACTIONS & ADD PRODUCT BUTTON */}
        <div className="flex items-center gap-2">
          {selectedProductIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>মুছুন ({selectedProductIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            id="add-new-product-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন (Add Product)</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProductIds.length === filteredProducts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-[#111] focus:ring-[#e8b04b] w-4 h-4 cursor-pointer"
                    title="সবগুলো নির্বাচন করুন"
                  />
                </th>
                <th className="p-3.5">ছবি</th>
                <th className="p-3.5">পণ্যের নাম ও বিবরণ</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">মূল্য</th>
                <th className="p-3.5">সাইজসমূহ</th>
                <th className="p-3.5">অফার</th>
                <th className="p-3.5">স্টক</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isInStock = product.inStock !== false;
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-neutral-50/70 transition-colors ${
                        isSelected ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* CHECKBOX */}
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded border-neutral-300 text-[#111] focus:ring-[#e8b04b] w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* IMAGE */}
                      <td className="p-3.5">
                        <div className="w-12 h-14 rounded overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                            }}
                          />
                        </div>
                      </td>

                      {/* NAME */}
                      <td className="p-3.5 max-w-[240px]">
                        <div className="font-bold text-neutral-900 text-sm line-clamp-1">{product.name}</div>
                        <div className="text-neutral-500 text-[11px] line-clamp-1 mt-0.5">{product.description}</div>
                        <div className="text-[10px] text-amber-600 mt-1 font-medium">★ {product.rating} ({product.reviewCount} reviews)</div>
                      </td>

                      {/* CATEGORY */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[11px] font-medium border border-neutral-200">
                          {product.category}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-bold text-sm text-neutral-900">
                          {settings.currencySymbol}{product.price.toLocaleString()}
                        </div>
                        {product.oldPrice && (
                          <div className="text-[11px] text-neutral-400 line-through">
                            {settings.currencySymbol}{product.oldPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* SIZES */}
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {product.sizes && product.sizes.length > 0 ? (
                            product.sizes.map((sz) => (
                              <span key={sz} className="px-1.5 py-0.2 bg-neutral-100 text-neutral-700 rounded text-[10px] font-mono border border-neutral-200">
                                {sz}
                              </span>
                            ))
                          ) : (
                            <span className="text-neutral-400 text-[11px]">Free Size</span>
                          )}
                        </div>
                      </td>

                      {/* SALE TOGGLE */}
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateProduct({ ...product, isSale: !product.isSale });
                            showToast(`"${product.name}" সেলে যুক্ত/বাতিল করা হয়েছে।`);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                            product.isSale
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                          title="ক্লিক করে সেল অফার টগল করুন"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{product.isSale ? 'SALE ON' : 'Regular'}</span>
                        </button>
                      </td>

                      {/* STOCK TOGGLE */}
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateProduct({ ...product, inStock: !isInStock });
                            showToast(`"${product.name}" এর স্টক স্ট্যাটাস পরিবর্তিত হয়েছে।`);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                            isInStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="ক্লিক করে স্টক পরিবর্তন করুন"
                        >
                          {isInStock ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          <span>{isInStock ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                            title="কপি/ডুপ্লিকেট করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            title="মুছে ফেলুন (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-neutral-500">
                    কোনো পণ্য পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* IN-APP CONFIRMATION MODAL FOR SINGLE PRODUCT DELETION */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setProductToDelete(null)} 
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-neutral-200 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              পণ্যটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-4">
              আপনি কি নিশ্চিত যে এই পণ্যটি স্টোর থেকে চিরতরে মুছে ফেলতে চান?
            </p>

            {/* PRODUCT MINI CARD */}
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 mb-5">
              <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {productToDelete.name}
                </h4>
                <p className="text-[11px] text-neutral-500">{productToDelete.category}</p>
                <p className="text-xs font-bold text-[#111]">
                  {settings.currencySymbol}{productToDelete.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BULK DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setIsBulkDeleteModalOpen(false)} 
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              {selectedProductIds.length}টি পণ্য মুছে ফেলবেন?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-5">
              নির্বাচিত সকল পণ্য একসাথে ডিলিট হয়ে যাবে। এই অ্যাকশনটি ফিরিয়ে আনা যাবে না।
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                সব মুছে ফেলুন ({selectedProductIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT PRODUCT MODAL WITH DEVICE UPLOAD & LIVE PREVIEW */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => {
              setIsModalOpen(false);
              if (onCloseInitialAddModal) onCloseInitialAddModal();
            }} 
          />

          <div className="relative bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto border border-neutral-200">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e8b04b] text-[#111] flex items-center justify-center font-bold">
                  {editingProduct ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {editingProduct ? 'পণ্য সম্পাদনা করুন (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add New Product)'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {editingProduct ? 'পণ্যের তথ্য ও ছবি পরিবর্তন করুন' : 'দোকানে বিক্রি করার জন্য নতুন আইটেম যুক্ত করুন'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseInitialAddModal) onCloseInitialAddModal();
                }}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PRODUCT NAME */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  পণ্যের নাম (Product Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: Premium Cotton Polo Shirt"
                  className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              {/* CATEGORY & PRICE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700 uppercase">
                      ক্যাটাগরি <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        if (!isCustomCategory) {
                          setCustomCategoryInput('');
                        }
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline"
                    >
                      {isCustomCategory ? 'তালিকা থেকে বেছে নিন' : '+ নতুন লিখুন'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customCategoryInput}
                        onChange={(e) => {
                          setCustomCategoryInput(e.target.value);
                          setFormData({ ...formData, category: e.target.value });
                        }}
                        placeholder="যেমন: পাঞ্জাবি / টি-শার্ট"
                        className="w-full text-xs px-3 py-2.5 border-2 border-blue-500 rounded-lg focus:outline-none bg-blue-50/20 font-medium text-neutral-900"
                        autoFocus
                      />
                      {customCategoryInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCategoryInput('');
                            setFormData({ ...formData, category: '' });
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsCustomCategory(true);
                          setCustomCategoryInput('');
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none bg-white font-medium text-neutral-900 cursor-pointer"
                    >
                      {formData.category && !availableCategories.includes(formData.category) && (
                        <option value={formData.category}>{formData.category}</option>
                      )}
                      {availableCategories.map((catName) => (
                        <option key={catName} value={catName}>
                          {catName}
                        </option>
                      ))}
                      <option value="__add_new__" className="font-bold text-blue-600">
                        ➕ নতুন ক্যাটাগরি তৈরি করুন...
                      </option>
                    </select>
                  )}

                  {/* QUICK SUGGESTIONS CHIPS */}
                  <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] text-neutral-400">সাজেশন:</span>
                    {['Men\'s Fashion', 'Women\'s Fashion', 'T-Shirts', 'Pants', 'Panjabi'].map((quickCat) => (
                      <button
                        key={quickCat}
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setFormData({ ...formData, category: quickCat });
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                          formData.category === quickCat && !isCustomCategory
                            ? 'bg-[#111] text-white font-bold'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {quickCat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    বিক্রয় মূল্য ({settings.currencySymbol}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="950"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-bold text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    আগের মূল্য / ডিসকাউন্ট কাট ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="1200 (ঐচ্ছিক)"
                    className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGE UPLOAD & SELECTION */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#e8b04b]" />
                    <span>পণ্যের ছবি (Device Upload / URL / Presets)</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">মোবাইল বা পিসি থেকে ছবি দিন</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* UPLOAD BUTTON */}
                  <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-neutral-300 hover:border-[#111] rounded-xl bg-white text-center cursor-pointer transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ডিভাইস থেকে ছবি আপলোড করুন
                    </button>
                    <span className="text-[10px] text-neutral-400 mt-1">JPG, PNG, WEBP (Max 5MB)</span>
                  </div>

                  {/* URL INPUT & PREVIEW */}
                  <div className="flex flex-col justify-center bg-white border border-neutral-200 rounded-xl p-3">
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                      অথবা অনলাইন ছবির লিঙ্ক (URL):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 text-xs px-2.5 py-1.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono"
                      />
                      {formData.image && (
                        <div className="w-10 h-10 rounded-md border border-neutral-300 overflow-hidden shrink-0 bg-neutral-100">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRESETS */}
                <div>
                  <span className="text-[11px] font-bold text-neutral-500 block mb-1.5">
                    বা স্যাম্পল ফ্যাশন ছবি থেকে সিলেক্ট করুন:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          formData.image === preset.url
                            ? 'bg-[#111] text-white border-[#111] shadow-2xs font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIZES WITH QUICK TOGGLE PILLS */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  উপলব্ধ সাইজসমূহ (Available Sizes)
                </label>

                {/* QUICK SIZE BUTTONS */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = parsedCurrentSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#111] text-white border-[#111]'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                        }`}
                      >
                        {size} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="যেমন: S, M, L, XL"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              {/* STOCK & SALE TOGGLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-neutral-300 text-[#111] focus:ring-[#e8b04b] w-4 h-4 cursor-pointer"
                  />
                  <span>স্টকে উপলব্ধ রয়েছে (In Stock)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                  />
                  <span>স্পেশাল অফার / সেল ব্যাজ প্রদর্শন (Sale Deal)</span>
                </label>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  পণ্যের বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ফেব্রিক ডিটেইলস, আরামদায়ক ফিটিং এবং ওয়াশ কেয়ার..."
                  className="w-full text-xs px-3 py-2.5 border border-neutral-300 rounded-lg focus:border-[#111] outline-none resize-none"
                />
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    if (onCloseInitialAddModal) onCloseInitialAddModal();
                  }}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'আপডেট সংরক্ষণ করুন' : 'পণ্য যোগ করুন (Add Product)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
