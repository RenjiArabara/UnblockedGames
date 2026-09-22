import React from 'react';
import { Play, Heart, Trash2, Sparkles, Gamepad } from 'lucide-react';
import { formatNumber } from '../utils/iframeHelper.js';

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
  onDelete
}) => {
  const accentColor = game.themeColor || '#10b981';

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative flex flex-col justify-between bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-200"
    >
      {/* Top Banner & Graphic Artwork */}
      <div className="relative w-full h-36 bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        {/* Ambient subtle glow background */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity blur-2xl"
          style={{ background: accentColor }}
        />

        {/* Center Graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-200">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
              border: `1px solid ${accentColor}66`
            }}
          >
            <Gamepad className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            {game.category}
          </span>
        </div>

        {/* Play Overlay Button that appears on hover */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-20 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </div>
        </div>

        {/* Favorite Icon (Top-Right) */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? 'Remove favorite' : 'Add favorite'}
          className={`absolute top-2.5 right-2.5 z-30 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            isFavorite
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Custom Game Badge or Delete Button */}
        {game.isCustom && onDelete && (
          <button
            onClick={(e) => onDelete(game.id, e)}
            title="Delete custom game"
            className="absolute top-2.5 left-2.5 z-30 p-1.5 rounded-lg bg-slate-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Badge (Hot, Classic, Popular) quiet indicator */}
        {game.badge && !game.isCustom && (
          <div className="absolute top-2.5 left-2.5 z-30 flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3" />
            <span>{game.badge}</span>
          </div>
        )}
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          {/* Zero-Pill Unboxed Metadata with typographic separator */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{formatNumber(game.plays)} plays</span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[190px]">{game.controls}</span>
          <span className="text-emerald-400 font-medium group-hover:underline shrink-0">Play →</span>
        </div>
      </div>
    </div>
  );
};
