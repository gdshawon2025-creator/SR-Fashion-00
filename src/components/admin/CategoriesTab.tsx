import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, FolderPlus } from 'lucide-react';
import { CategoryItem, Product } from '../../types';

interface CategoriesTabProps {
  categories: CategoryItem[];
  products: Product[];
  onAddCategory: (category: CategoryItem) => void;
  onUpdateCategory: (category: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CATEGORY_PRESET_IMAGES = [
  { label: "Men's Wear", url: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80' },
  { label: "Women's Wear", url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
  { label: 'T-Shirts', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pants & Jeans', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Footwear & Shoes', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80' },
  { label: 'Watches & Accessories', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Traditional Wear', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Winter Collection', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
];

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    image: CATEGORY_PRESET_IMAGES[0].url,
  });
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      title: '',
      image: CATEGORY_PRESET_IMAGES[0].url,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      title: cat.title,
      image: cat.image,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('ক্যাটাগরির নাম প্রদান করুন');
      return;
    }
    if (!formData.image.trim()) {
      setError('ক্যাটাগরির ছবির লিঙ্ক প্রদান করুন');
      return;
    }

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        title: formData.title.trim(),
        categoryKey: formData.title.trim(),
        image: formData.image.trim(),
      });
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        title: formData.title.trim(),
        categoryKey: formData.title.trim(),
        image: formData.image.trim(),
      };
      onAddCategory(newCat);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* HEADER BAR */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">ক্যাটাগরি সমূহ ({categories.length})</h3>
          <p className="text-xs text-neutral-500">হোমপেজে এবং শপ ফিল্টারে প্রদর্শিত ক্যাটাগরিগুলো ম্যানেজ করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] hover:bg-[#e8b04b] hover:text-[#111] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const productCount = products.filter(
            (p) => p.category === category.title || p.category === category.categoryKey
          ).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-neutral-100">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <div className="text-base font-bold">{category.title}</div>
                  <div className="text-xs text-neutral-300">{productCount} টি পণ্য অন্তর্ভুক্ত</div>
                </div>
              </div>

              <div className="p-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[140px]">
                  ID: {category.id}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(category)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="মুছে ফেলুন (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  ক্যাটাগরির শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: Winter Collection বা পাঞ্জাবি"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  কভার ছবি (Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:border-[#111] outline-none font-mono"
                />

                <div className="mt-2.5">
                  <span className="text-[11px] text-neutral-500 block mb-1">স্যাম্পল কভার ছবি বেছে নিন:</span>
                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                    {CATEGORY_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`text-[10px] p-1.5 text-left rounded border truncate transition-colors ${
                          formData.image === preset.url
                            ? 'bg-[#111] text-white border-[#111]'
                            : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {formData.image && (
                <div className="h-28 rounded-lg overflow-hidden border border-neutral-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 border border-neutral-300 text-neutral-700 text-xs rounded-lg hover:bg-neutral-50 font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111] text-white hover:bg-[#e8b04b] hover:text-[#111] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {editingCategory ? 'আপডেট করুন' : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs" 
            onClick={() => setCategoryToDelete(null)} 
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl z-10 border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 text-center mb-1">
              ক্যাটাগরি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-neutral-500 text-center mb-4">
              আপনি কি নিশ্চিত যে &ldquo;{categoryToDelete.title}&rdquo; ক্যাটাগরিটি মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
