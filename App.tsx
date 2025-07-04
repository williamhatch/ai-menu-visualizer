import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import type { MenuItem } from './types';
import * as geminiService from './services/geminiService';

import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import MenuPreview from './components/MenuPreview';
import { SparklesIcon, ArrowPathIcon, CheckIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setMenuImage(null);
    setMenuItems([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  };

  const handleImageSelect = (imageDataUrl: string) => {
    setMenuImage(imageDataUrl);
    setAppState(AppState.IMAGE_SELECTED);
    setError(null);
  };

  const handleAnalyzeAndGenerate = useCallback(async () => {
    if (!menuImage) {
      setError("No image selected.");
      setAppState(AppState.ERROR);
      return;
    }

    try {
      setAppState(AppState.ANALYZING);
      const dishNames = await geminiService.analyzeMenu(menuImage);
      
      if (dishNames.length === 0) {
          setError("The AI could not find any menu items in the image. Please try a clearer picture.");
          setAppState(AppState.ERROR);
          return;
      }

      setAppState(AppState.GENERATING_IMAGES);
      setProgress({ current: 0, total: dishNames.length });
      
      const generatedItems: MenuItem[] = [];
      for (let i = 0; i < dishNames.length; i++) {
        const name = dishNames[i];
        setProgress({ current: i + 1, total: dishNames.length });
        const imageUrl = await geminiService.generateImageForDish(name);
        generatedItems.push({ name, imageUrl });
        // Update state incrementally to show images as they are generated
        setMenuItems([...generatedItems]);
      }

      setAppState(AppState.RESULTS);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error(errorMessage);
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [menuImage]);

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <ImageUploader onImageSelect={handleImageSelect} isLoading={false} />;
      
      case AppState.IMAGE_SELECTED:
        return (
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
            <h2 className="text-3xl font-bold text-center">Ready to Analyze?</h2>
            <img src={menuImage!} alt="Selected Menu" className="rounded-lg shadow-xl max-h-[50vh] w-auto border-4 border-slate-700" />
            <div className="flex gap-4">
              <button onClick={handleReset} className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                <ArrowPathIcon className="w-5 h-5" />
                Start Over
              </button>
              <button onClick={handleAnalyzeAndGenerate} className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg animate-pulse hover:animate-none">
                <SparklesIcon className="w-6 h-6" />
                Visualize Menu
              </button>
            </div>
          </div>
        );

      case AppState.ANALYZING:
        return <Loader text="Scanning your menu for dishes..." />;
        
      case AppState.GENERATING_IMAGES:
          return (
             <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                <Loader text={`Creating image ${progress.current} of ${progress.total}...`} />
                <MenuPreview items={menuItems} />
            </div>
          );

      case AppState.RESULTS:
        return (
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold">Your Visual Menu is Ready!</h2>
                <p className="text-slate-400 mt-2">Here's what our AI imagined your dishes look like.</p>
            </div>
            <MenuPreview items={menuItems} />
            <div className="flex gap-4 mt-4">
              <button onClick={handleReset} className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                <ArrowPathIcon className="w-5 h-5" />
                Start Over
              </button>
              <button onClick={() => setAppState(AppState.FINISHED)} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg">
                <CheckIcon className="w-6 h-6" />
                Finish
              </button>
            </div>
          </div>
        );
      
      case AppState.FINISHED:
        return (
             <div className="text-center flex flex-col items-center gap-6">
                 <CheckIcon className="w-24 h-24 text-green-400" />
                <h2 className="text-4xl font-bold">All Done!</h2>
                <p className="text-slate-400 max-w-md">We hope you enjoyed this visual journey. Ready to try another menu?</p>
                <button onClick={handleReset} className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-lg">
                    <ArrowPathIcon className="w-5 h-5" />
                    Visualize Another Menu
                </button>
            </div>
        );

      case AppState.ERROR:
        return (
           <div className="w-full max-w-lg mx-auto bg-red-900/20 border border-red-500/50 rounded-lg p-8 text-center flex flex-col items-center gap-4">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-400"/>
                <h2 className="text-2xl font-bold text-red-300">An Error Occurred</h2>
                <p className="text-red-300/80">{error}</p>
                 <button onClick={handleReset} className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    <ArrowPathIcon className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
        <header className="absolute top-0 left-0 p-6 flex items-center gap-3">
             <SparklesIcon className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">AI Menu Visualizer</h1>
        </header>
        <main className="w-full flex-grow flex items-center justify-center">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
