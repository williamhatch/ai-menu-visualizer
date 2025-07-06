
import React from 'react';
import { MenuItem } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface VisualizationScreenProps {
  menuImage: string | null;
  menuItems: MenuItem[];
  generatedImages: Record<string, string>;
  onReset: () => void;
}

const ImagePlaceholder: React.FC = () => (
  <div className="w-full aspect-video bg-slate-700 rounded-t-lg animate-pulse flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

const MenuItemCard: React.FC<{ item: MenuItem, imageUrl?: string }> = ({ item, imageUrl }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
            {imageUrl ? <img src={imageUrl} alt={item.name} className="w-full h-48 object-cover"/> : <ImagePlaceholder />}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-sm text-slate-300 mt-1 h-10 overflow-hidden">{item.description}</p>
                <p className="text-right text-lg font-semibold text-cyan-400 mt-2">{item.price}</p>
            </div>
        </div>
    );
};


const VisualizationScreen: React.FC<VisualizationScreenProps> = ({
  menuImage,
  menuItems,
  generatedImages,
  onReset,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={onReset}
          className="mb-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Start Over
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-white mb-4">Your Menu</h2>
                {menuImage && (
                    <img src={menuImage} alt="Uploaded menu" className="rounded-lg shadow-2xl w-full" />
                )}
            </div>
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">Visualized Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <MenuItemCard key={item.name} item={item} imageUrl={generatedImages[item.name]} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default VisualizationScreen;
