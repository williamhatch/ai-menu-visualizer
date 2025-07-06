
import React, { useState, useCallback } from 'react';
import { AppState, MenuItem } from './types';
import StartScreen from './components/StartScreen';
import LoadingSpinner from './components/LoadingSpinner';
import VisualizationScreen from './components/VisualizationScreen';
import { SparklesIcon } from './components/Icons';
import { parseMenuFromImage, generateImageForItem } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.START);
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleReset = () => {
    setAppState(AppState.START);
    setMenuImage(null);
    setMenuItems([]);
    setGeneratedImages({});
    setLoadingMessage('');
    setError('');
  };

  const handleImageSelect = useCallback(async (file: File) => {
    setAppState(AppState.LOADING);
    setLoadingMessage('Reading your menu...');
    setError('');
    
    const imageUrl = URL.createObjectURL(file);
    setMenuImage(imageUrl);

    try {
      const parsedItems = await parseMenuFromImage(file);
      if(parsedItems.length === 0) {
        throw new Error("No menu items could be found. Please try a different image.");
      }
      
      setMenuItems(parsedItems);
      setAppState(AppState.VISUALIZING);
      setLoadingMessage('Generating dish visualizations...'); // This can be shown on the visualization screen if needed
      
      // Generate images in parallel
      parsedItems.forEach(async (item) => {
        try {
            const imageBase64 = await generateImageForItem(item);
            setGeneratedImages(prev => ({ ...prev, [item.name]: imageBase64 }));
        } catch (imageError) {
            console.error(`Failed to generate image for ${item.name}:`, imageError);
             // Optionally set a placeholder or skip
        }
      });

    } catch (err: any) {
      console.error("Error processing menu:", err);
      setError(err.message || 'An unknown error occurred.');
      setAppState(AppState.ERROR);
    }
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.START:
        return <StartScreen onImageSelect={handleImageSelect} setAppError={(msg) => { setError(msg); setAppState(AppState.ERROR);}} />;
      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center text-white">
            <LoadingSpinner />
            <p className="mt-4 text-lg">{loadingMessage}</p>
          </div>
        );
      case AppState.VISUALIZING:
        return <VisualizationScreen menuImage={menuImage} menuItems={menuItems} generatedImages={generatedImages} onReset={handleReset} />
      case AppState.ERROR:
        return (
          <div className="bg-slate-800/60 backdrop-blur-sm border border-red-500/50 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong.</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 selection:bg-cyan-300 selection:text-cyan-900">
        <header className="w-full max-w-7xl mx-auto p-4">
            <div className="flex items-center space-x-2">
                <SparklesIcon className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">AI Menu Visualizer</h1>
            </div>
        </header>
        <main className="flex-grow flex items-center justify-center w-full">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
