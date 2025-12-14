import React, { useState } from 'react';
import { ImageGenerator } from './components/ImageGenerator';
import { VideoGenerator } from './components/VideoGenerator';
import { Gallery } from './components/Gallery';
import { GeneratedItem } from './types';

enum Tab {
  IMAGE = 'image',
  VIDEO = 'video',
  GALLERY = 'gallery'
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.IMAGE);
  const [history, setHistory] = useState<GeneratedItem[]>([]);

  const handleSuccess = (item: GeneratedItem) => {
    setHistory(prev => [item, ...prev]);
    // Optionally switch to gallery or show a toast
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center pt-6 pb-20 px-4 sm:px-6">
      <header className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            CreativeFlow AI
          </h1>
        </div>
        
        <nav className="flex p-1 bg-neutral-900 rounded-xl border border-neutral-800 shadow-sm">
          <button
            onClick={() => setActiveTab(Tab.IMAGE)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.IMAGE ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Изображения
          </button>
          <button
            onClick={() => setActiveTab(Tab.VIDEO)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.VIDEO ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Видео (Veo)
          </button>
          <button
            onClick={() => setActiveTab(Tab.GALLERY)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === Tab.GALLERY ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            История
            {history.length > 0 && (
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      <main className="w-full max-w-4xl">
        <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          {activeTab === Tab.IMAGE && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Генерация Изображений</h2>
                <p className="text-neutral-400 text-sm">Используйте Gemini 2.5 Flash для быстрых результатов или Gemini 3 Pro для максимального качества.</p>
              </div>
              <ImageGenerator onSuccess={handleSuccess} />
            </div>
          )}

          {activeTab === Tab.VIDEO && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Генерация Видео</h2>
                <p className="text-neutral-400 text-sm">Создавайте потрясающие видео 720p/1080p с помощью Google Veo.</p>
              </div>
              <VideoGenerator onSuccess={handleSuccess} />
            </div>
          )}

          {activeTab === Tab.GALLERY && (
            <div>
               <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Ваша Галерея</h2>
                  <p className="text-neutral-400 text-sm">Все ваши сгенерированные шедевры хранятся здесь (локально).</p>
                </div>
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                  disabled={history.length === 0}
                >
                  Очистить всё
                </button>
              </div>
              <Gallery items={history} />
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-12 text-center text-neutral-600 text-xs">
        <p>Powered by Google Gemini API & Veo • Developed for CreativeFlow</p>
      </footer>
    </div>
  );
}

export default App;