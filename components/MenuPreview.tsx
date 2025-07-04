import React from 'react';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-sky-500/20 group">
            <div className="aspect-square w-full bg-slate-700 animate-pulse">
                <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                    onLoad={(e) => {
                        e.currentTarget.style.opacity = '1';
                        if(e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.classList.remove('animate-pulse');
                        }
                    }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate" title={item.name}>{item.name}</h3>
            </div>
        </div>
    );
};

interface MenuPreviewProps {
  items: MenuItem[];
}

const MenuPreview: React.FC<MenuPreviewProps> = ({ items }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {items.map((item, index) => (
          <MenuItemCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuPreview;
