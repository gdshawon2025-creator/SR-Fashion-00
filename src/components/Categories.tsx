import React from 'react';
import { CategoryItem } from '../types';

interface CategoriesProps {
  categories: CategoryItem[];
  onSelectCategory: (categoryKey: string) => void;
  selectedCategory: string;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const handleCategoryClick = (category: CategoryItem) => {
    onSelectCategory(category.categoryKey);
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="px-[7%] py-16 md:py-[70px]">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-[35px] font-bold text-neutral-900 mb-2.5">
          Shop By Category
        </h2>
        <p className="text-[#777777] text-base">Find your perfect style</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const isCurrentActive = selectedCategory === cat.categoryKey;
          return (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => handleCategoryClick(cat)}
              className={`group relative h-[220px] rounded-[5px] overflow-hidden cursor-pointer shadow-sm transition-all duration-300 ${
                isCurrentActive ? 'ring-3 ring-[#e8b04b] ring-offset-2' : ''
              }`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center justify-between text-white">
                  <span className="text-xl md:text-[22px] font-bold tracking-wide">
                    {cat.title}
                  </span>
                  <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded text-white group-hover:bg-[#e8b04b] group-hover:text-[#111] transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
