import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { generateVideo, checkVeoAuth, requestVeoAuth } from '../services/geminiService';
import { GeneratedItem, MediaType } from '../types';

interface Props {
  onSuccess: (item: GeneratedItem) => void;
}

export const VideoGenerator: React.FC<Props> = ({ onSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setCheckingAuth(true);
    try {
      const isAuth = await checkVeoAuth();
      setIsAuthenticated(isAuth);
    } catch (e) {
      console.warn("Auth check failed", e);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleConnect = async () => {
    try {
      await requestVeoAuth();
      // Assume success after dialog (mitigate race condition as per guidelines)
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Ошибка подключения API ключа");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = await generateVideo(prompt, aspectRatio);
      const newItem: GeneratedItem = {
        id: crypto.randomUUID(),
        type: MediaType.VIDEO,
        url,
        prompt,
        createdAt: Date.now(),
        aspectRatio
      };
      onSuccess(newItem);
    } catch (err: any) {
      if (err.message && err.message.includes("Requested entity was not found")) {
        // Handle race condition/invalid key state
        setIsAuthenticated(false);
        setError("Пожалуйста, выберите API ключ снова.");
      } else {
        setError(err.message || "Ошибка генерации видео");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <div className="py-12 text-center text-neutral-500">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/20">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Требуется доступ к Veo</h3>
          <p className="text-neutral-400 max-w-md mx-auto">
            Для генерации видео используется модель Veo, которая требует выбора оплачиваемого проекта GCP.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button onClick={handleConnect} variant="primary">
            Выбрать API ключ
          </Button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Информация о тарификации
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Сценарий видео</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: Кот в скафандре летит через космос в стиле ретро-вейв..."
            className="w-full h-32 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Формат видео</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${
                aspectRatio === '16:9' 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <span className="mr-2">Горизонтальное</span>
              <span className="text-xs opacity-60">16:9</span>
            </button>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${
                aspectRatio === '9:16' 
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              <span className="mr-2">Вертикальное</span>
              <span className="text-xs opacity-60">9:16</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-200/80 text-xs">
        <strong className="block mb-1 text-indigo-400">Обратите внимание:</strong>
        Генерация видео может занять несколько минут. Пожалуйста, не закрывайте вкладку.
      </div>

      <Button 
        onClick={handleGenerate} 
        isLoading={loading} 
        disabled={!prompt.trim()}
        className="w-full"
      >
        Создать Видео (Veo)
      </Button>
    </div>
  );
};