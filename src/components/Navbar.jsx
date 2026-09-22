import React, { useState } from 'react';
import { Gamepad2, Shuffle, Plus, FileJson, Shield, Heart } from 'lucide-react';

export const Navbar = ({
  onAddGameClick,
  onJsonClick,
  onRandomClick,
  onCategorySelect,
  activeCategory,
  favoritesCount,
  currentCloak,
  onCloakChange,
  onHomeClick
}) => {
  const [showCloakMenu, setShowCloakMenu] = useState(false);

  const cloakLabels = {
    none: 'Default',
    classroom: 'Google Classroom',
    drive: 'Google Drive',
    docs: 'Google Docs',
    canvas: 'Canvas LMS'
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-colors">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            Nexus Arcade
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onCategorySelect('All')}
            className={`transition-colors hover:text-white ${
              activeCategory === 'All' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onCategorySelect('Favorites')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeCategory === 'Favorites' ? 'text-pink-400 font-semibold' : ''
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-xs text-slate-400">({favoritesCount})</span>
            )}
          </button>
          <button
            onClick={onJsonClick}
            className="flex items-center gap-1.5 transition-colors hover:text-white text-slate-400 hover:text-slate-200"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>games.json</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* Tab Cloak selector */}
          <div className="relative">
            <button
              onClick={() => setShowCloakMenu(!showCloakMenu)}
              title="Disguise tab title and icon"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Cloak:</span>
              <span className="text-emerald-400 font-medium">{cloakLabels[currentCloak]}</span>
            </button>

            {showCloakMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Tab Disguise
                </div>
                {Object.keys(cloakLabels).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onCloakChange(type);
                      setShowCloakMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                      currentCloak === type
                        ? 'bg-slate-800 text-emerald-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span>{cloakLabels[type]}</span>
                    {currentCloak === type && <span className="text-emerald-400 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onRandomClick}
            title="Pick a random game"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Random</span>
          </button>

          <button
            onClick={onAddGameClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
