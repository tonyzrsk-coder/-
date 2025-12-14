import React, { useState } from 'react';
import { Button } from './Button';
import { generateImage } from '../services/geminiService';
import { GeneratedItem, MediaType } from '../types';

interface Props {
  onSuccess: (item: GeneratedItem) => void;
}

export const ImageGenerator: React.FC<Props> = ({ onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = await generateImage(prompt, aspectRatio, isPro);
      const newItem: GeneratedItem = {
        id: crypto.randomUUID(),
        type: MediaType.IMAGE,
        url,
        prompt,
        createdAt: Date.now(),
        aspectRatio
      };
      onSuccess(newItem);
    } catch (err: any) {
      setError(err.message || "Ошибка генерации изображения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Опишите изображение</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: Футуристический город в стиле киберпанк, неоновые огни, дождь..."
            className="w-full h-32 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Соотношение сторон</label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    aspectRatio === ratio
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Модель</label>
            <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setIsPro(false)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                  !isPro ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Flash (Быстро)
              </button>
              <button
                onClick={() => setIsPro(true)}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isPro ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pro (Качество)
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button 
        onClick={handleGenerate} 
        isLoading={loading} 
        disabled={!prompt.trim()}
        className="w-full"
      >
        Сгенерировать Изображение
      </Button>
    </div>
  );
};