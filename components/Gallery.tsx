import React from 'react';
import { GeneratedItem, MediaType } from '../types';

interface Props {
  items: GeneratedItem[];
}

export const Gallery: React.FC<Props> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <div className="mb-4 text-6xl">🎨</div>
        <p className="text-neutral-400 text-lg">История пуста. Создайте что-нибудь прекрасное!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {items.map((item) => (
        <div key={item.id} className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
          <div className={`aspect-square relative ${item.aspectRatio === '16:9' ? 'aspect-video' : item.aspectRatio === '9:16' ? 'aspect-[9/16]' : ''} bg-neutral-950`}>
            {item.type === MediaType.IMAGE ? (
              <img 
                src={item.url} 
                alt={item.prompt} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <video 
                src={item.url} 
                controls 
                className="w-full h-full object-cover"
                poster="https://picsum.photos/800/450?grayscale" // generic poster until loaded
              />
            )}
            
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.type === MediaType.VIDEO ? 'bg-pink-500/90 text-white' : 'bg-indigo-500/90 text-white'}`}>
                {item.type === MediaType.VIDEO ? 'Veo' : 'Img'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-sm text-neutral-300 line-clamp-2 mb-3" title={item.prompt}>
              {item.prompt}
            </p>
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              <a 
                href={item.url} 
                download={`creative-flow-${item.id}.${item.type === MediaType.VIDEO ? 'mp4' : 'png'}`}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Скачать
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};