import React, { useRef } from 'react';
import { CameraIcon, UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (imageDataUrl: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onImageSelect(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 rounded-2xl shadow-2xl p-8 border border-slate-700">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Visualize Your Menu</h2>
        <p className="text-slate-400 mt-2">Upload or take a picture of a menu to get started.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={isLoading}
        />
        
        <button
          onClick={triggerFileSelect}
          disabled={isLoading}
          className="flex-1 flex flex-col items-center justify-center gap-3 p-8 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-opacity-50"
        >
          <CameraIcon className="w-10 h-10" />
          <span className="font-semibold text-lg">Take a Picture</span>
        </button>

        <button
          onClick={triggerFileSelect}
          disabled={isLoading}
          className="flex-1 flex flex-col items-center justify-center gap-3 p-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          <UploadIcon className="w-10 h-10" />
          <span className="font-semibold text-lg">Upload from Device</span>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
