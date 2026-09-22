import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Heart, 
  ExternalLink, 
  Tv, 
  Share2, 
  Check, 
  Info,
  Sliders
} from 'lucide-react';
import { getIframeSrc, formatNumber } from '../utils/iframeHelper.js';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const src = getIframeSrc(game.iframe);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error('Fullscreen request failed', err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stealth about:blank cloak feature
  const handleOpenAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Pop-up blocked! Please allow pop-ups for stealth mode.');
      return;
    }
    win.document.title = 'Google Docs';
    const link = win.document.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    win.document.head.appendChild(link);

    const iframe = win.document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.src = window.location.origin + src;
    win.document.body.style.margin = '0';
    win.document.body.appendChild(iframe);
  };

  return (
    <div className={`flex flex-col gap-4 ${isTheater ? 'max-w-none' : 'max-w-6xl'} mx-auto px-4 py-4 transition-all duration-200`}>
      {/* Top Bar for Player */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
              {game.title}
            </h1>
            {/* Zero-Pill unboxed metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{formatNumber(game.plays)} plays</span>
            </div>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              isFavorite
                ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Exit theater mode' : 'Theater mode'}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              isTheater
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={handleReload}
            title="Restart / Reload Game"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleOpenAboutBlank}
            title="Open in stealth about:blank window"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stealth Tab</span>
          </button>

          <button
            onClick={handleShare}
            title="Share Game"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Game Screen / Iframe Container */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center ${
          isFullscreen
            ? 'h-screen w-screen rounded-none border-none'
            : isTheater
            ? 'h-[80vh]'
            : 'h-[620px] max-h-[75vh]'
        }`}
      >
        <iframe
          key={reloadKey}
          ref={iframeRef}
          src={src}
          title={game.title}
          className="w-full h-full border-0 block"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals"
        />
      </div>

      {/* Controls & Details Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Controls Info */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Sliders className="w-4 h-4" />
            <span>How To Play & Controls</span>
          </div>
          <p className="text-sm text-slate-200 font-medium">
            {game.controls || 'Use keyboard or mouse controls as indicated inside the game viewport.'}
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Quick Tips & JSON Iframe info */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
              <Info className="w-4 h-4" />
              <span>Iframe Embed Data</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              {game.iframe}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Identifier: <code className="text-slate-300 font-mono">{game.id}</code></span>
            <span className="text-emerald-400 font-medium">Sandboxed ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
