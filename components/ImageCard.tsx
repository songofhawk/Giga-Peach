import React, { useState } from 'react';
import { Download, MessageSquare, Maximize2, Trash2, Heart } from './Icons';
import { GeneratedImage, GenerationTask } from '../types';

interface ImageCardProps {
  task: GenerationTask;
  onDelete?: (id: string) => void;
  onIterate?: (image: GeneratedImage) => void;
  onView?: (image: GeneratedImage) => void;
  onToggleFavorite?: (image: GeneratedImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ task, onDelete, onIterate, onView, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Aspect ratio class mapping
  const aspectClasses = {
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '4:3': 'aspect-[4/3]',
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-[video]',
    '2:3': 'aspect-[2/3]',
    '3:2': 'aspect-[3/2]',
    '4:5': 'aspect-[4/5]',
    '5:4': 'aspect-[5/4]',
    '21:9': 'aspect-[21/9]'
  };

  const containerClass = `relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 ${aspectClasses[task.aspectRatio] || 'aspect-square'} cursor-pointer`;

  if (task.status === 'pending' || task.status === 'generating') {
    return (
      <div className={`${containerClass} flex items-center justify-center relative cursor-default`}>
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-8 h-8 border-2 border-peach-500 border-t-transparent rounded-full animate-spin" />
        </div>
        {/* Ratio Badge for Placeholder */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur rounded text-[9px] font-mono text-gray-400 border border-white/10">
            {task.aspectRatio}
        </div>
      </div>
    );
  }

  if (task.status === 'error' || !task.data) {
    return (
      <div className={`${containerClass} flex items-center justify-center bg-red-900/10 border-red-900/30 relative cursor-default`}>
         <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur rounded text-[9px] font-mono text-gray-400 border border-white/10">
            {task.aspectRatio}
        </div>
        <span className="text-xs text-red-400 px-2 text-center">Failed</span>
      </div>
    );
  }

  const isFavorite = task.data.isFavorite;

  return (
    <div 
      className={containerClass}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView && onView(task.data!)}
    >
      <img 
        src={task.data.url} 
        alt={task.data.prompt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Top Bar: Ratio & Favorite */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-mono text-gray-300 border border-white/10">
             {task.aspectRatio}
          </div>
          
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(task.data!);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-colors border ${
                isFavorite 
                ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                : 'bg-black/40 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'
            }`}
            title="Favorite"
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>
      </div>
      
      {/* Bottom Overlay Actions */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8 flex flex-col justify-end transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                {onIterate && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onIterate(task.data!); }}
                        className="p-2 bg-gray-800/80 rounded-full hover:bg-peach-500 hover:text-white text-gray-300 transition-colors backdrop-blur-md"
                        title="Iterate / Chat"
                    >
                        <MessageSquare size={16} />
                    </button>
                )}
                 <a 
                    href={task.data.url} 
                    download={`giga-peach-${task.id}.png`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-gray-800/80 rounded-full hover:bg-green-500 hover:text-white text-gray-300 transition-colors backdrop-blur-md"
                    title="Download"
                >
                    <Download size={16} />
                </a>
            </div>

            {onDelete && (
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                className="p-2 bg-gray-800/80 rounded-full hover:bg-red-500/80 hover:text-white text-gray-300 transition-colors backdrop-blur-md"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
           )}
        </div>
      </div>
    </div>
  );
};