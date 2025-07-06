
import React, { useRef } from 'react';
import { CameraIcon, UploadIcon } from './Icons';

interface StartScreenProps {
  onImageSelect: (file: File) => void;
  setAppError: (message: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onImageSelect, setAppError }) => {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        setAppError("Please select a valid image file.");
      }
    }
     // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
      <h1 className="text-3xl font-bold text-white mb-2">Visualize Your Menu</h1>
      <p className="text-slate-300 mb-8">Upload or take a picture of a menu to get started.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="camera-input"
        />
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 bg-cyan-500/90 hover:bg-cyan-500 text-white rounded-lg transition-colors duration-200 h-36"
        >
          <CameraIcon className="w-10 h-10 mb-2" />
          <span className="font-semibold">Take a Picture</span>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={uploadInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="upload-input"
        />
        <button
          onClick={() => uploadInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 h-36"
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="font-semibold">Upload from Device</span>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
