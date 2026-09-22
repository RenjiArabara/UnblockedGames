import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Gamepad2, 
  Sparkles, 
  Play, 
  ChevronDown
} from 'lucide-react';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonModal } from './components/JsonModal.jsx';
import { formatNumber } from './utils/iframeHelper.js';

const STORAGE_CUSTOM_KEY = 'nexus_custom_games';
const STORAGE_FAVORITES_KEY = 'nexus_favorite_games';
const STORAGE_CLOAK_KEY = 'nexus_tab_cloak';

const CLOAK_CONFIGS = {
  none: {
    title: 'Unblocked Games Portal',
    icon: '/favicon.ico'
  },
  classroom: {
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  drive: {
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  docs: {
    title: 'Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  canvas: {
    title: 'Dashboard - Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  }
};

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const [currentCloak, setCurrentCloak] = useState('none');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch('/games.json');
        if (!res.ok) throw new Error('Failed to load games.json');
        const defaultGames = await res.json();

        // Load custom user games from storage
        const savedCustom = localStorage.getItem(STORAGE_CUSTOM_KEY);
        const customGames = savedCustom ? JSON.parse(savedCustom) : [];

        // Combine
        setGames([...defaultGames, ...customGames]);
      } catch (err) {
        console.error('Error fetching games.json:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGames();

    // Load favorites
    const savedFavs = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error('Error parsing favorites', e);
      }
    }

    // Load saved cloak
    const savedCloak = localStorage.getItem(STORAGE_CLOAK_KEY);
    if (savedCloak && CLOAK_CONFIGS[savedCloak]) {
      applyCloak(savedCloak);
    }
  }, []);

  // Handle Cloak change
  const applyCloak = (cloak) => {
    setCurrentCloak(cloak);
    localStorage.setItem(STORAGE_CLOAK_KEY, cloak);
    const config = CLOAK_CONFIGS[cloak];
    if (config) {
      document.title = config.title;
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.icon;
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Add custom game
  const handleAddGame = (newGame) => {
    const nextGames = [newGame, ...games];
    setGames(nextGames);

    // Save custom games
    const customOnly = nextGames.filter((g) => g.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customOnly));
  };

  // Delete custom game
  const handleDeleteCustom = (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this custom game?')) return;
    const nextGames = games.filter((g) => g.id !== id);
    setGames(nextGames);

    const customOnly = nextGames.filter((g) => g.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customOnly));
  };

  // Reset to default
  const handleResetDefault = async () => {
    localStorage.removeItem(STORAGE_CUSTOM_KEY);
    try {
      const res = await fetch('/games.json');
      const defaultGames = await res.json();
      setGames(defaultGames);
    } catch (e) {
      console.error(e);
    }
  };

  // Import custom JSON array
  const handleImportJson = (newGames) => {
    setGames(newGames);
    const customOnly = newGames.filter((g) => g.isCustom);
    localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customOnly));
  };

  // Play game & increment play counter
  const handlePlayGame = (game) => {
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pick random game
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const rand = games[Math.floor(Math.random() * games.length)];
    handlePlayGame(rand);
  };

  // Featured Game of the Day
  const featuredGame = useMemo(() => {
    return games.find((g) => g.id === 'tetra-blocks') || games[0] || null;
  }, [games]);

  // Categories list
  const categories = [
    'All',
    'Favorites',
    'Arcade',
    'Action',
    'Puzzle',
    'Retro',
    'Sports'
  ];

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Category filter
        if (activeCategory === 'Favorites') {
          if (!favorites.includes(game.id)) return false;
        } else if (activeCategory !== 'All' && game.category !== activeCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchCat = game.category.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchControls = game.controls.toLowerCase().includes(q);
          return matchTitle || matchCat || matchDesc || matchControls;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, activeCategory, searchQuery, sortBy, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar
        onAddGameClick={() => setIsAddModalOpen(true)}
        onJsonClick={() => setIsJsonModalOpen(true)}
        onRandomClick={handleRandomGame}
        onCategorySelect={(cat) => {
          setActiveCategory(cat);
          setSelectedGame(null);
        }}
        activeCategory={activeCategory}
        favoritesCount={favorites.length}
        currentCloak={currentCloak}
        onCloakChange={applyCloak}
        onHomeClick={() => setSelectedGame(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            onBack={() => setSelectedGame(null)}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={(id) => handleToggleFavorite(id)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            {/* Hero Spotlight Section (when not searching and category is 'All') */}
            {activeCategory === 'All' && !searchQuery.trim() && featuredGame && (
              <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8">
                {/* Glow accent */}
                <div
                  className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: featuredGame.themeColor || '#10b981' }}
                />

                <div className="relative z-10 max-w-2xl">
                  {/* Zero-Pill kicker */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FEATURED GAME SPOTLIGHT</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 font-normal">Ready to play</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
                    {featuredGame.title}
                  </h1>

                  {/* Zero-Pill unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 mb-3">
                    <span>{featuredGame.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400">★ {Number(featuredGame.rating).toFixed(1)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{formatNumber(featuredGame.plays)} plays</span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-xl">
                    {featuredGame.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handlePlayGame(featuredGame)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Now</span>
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(featuredGame.id)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                    >
                      {favorites.includes(featuredGame.id) ? 'Favorited ♥' : 'Add to Favorites'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {/* Category Segmented Controls */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {cat === 'Favorites' ? `Favorites (${favorites.length})` : cat}
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search games..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">A to Z</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Games Grid Header Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {activeCategory === 'All' ? 'Catalog' : activeCategory}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{filteredGames.length} games available</span>
                {searchQuery && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>matching &quot;{searchQuery}&quot;</span>
                  </>
                )}
              </div>
            </div>

            {/* Games Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="h-64 rounded-xl bg-slate-900/60 border border-slate-800/80 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteCustom}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 p-8">
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">No games found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {activeCategory === 'Favorites'
                    ? "You haven't marked any games as favorites yet. Click the heart icon on any game to bookmark it!"
                    : "No games matched your search criteria. Try a different query or add a custom game."}
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                  >
                    Add Game
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Nexus Arcade</span>
            <span aria-hidden="true">·</span>
            <span>JSON-Powered Unblocked Iframe Player</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Export games.json
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Add Custom Iframe
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={handleImportJson}
        onResetDefault={handleResetDefault}
      />
    </div>
  );
}
