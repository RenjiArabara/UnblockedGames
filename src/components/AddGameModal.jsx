import React, { useState } from 'react';
import { X, Play, Code2, Plus } from 'lucide-react';
import { getIframeSrc } from '../utils/iframeHelper.js';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [controls, setControls] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeCode.trim()) {
      setError('Please provide an iframe code or game URL.');
      return;
    }

    let finalIframe = iframeCode.trim();
    if (!finalIframe.startsWith('<iframe')) {
      finalIframe = `<iframe src="${finalIframe}" title="${title}" width="100%" height="100%" frameborder="0" allowfullscreen sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"></iframe>`;
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom added game.',
      iframe: finalIframe,
      controls: controls.trim() || 'Standard keyboard & mouse controls',
      rating: 5.0,
      plays: 1,
      themeColor: '#10b981',
      badge: 'Custom',
      isCustom: true
    };

    onAddGame(newGame);
    onClose();
  };

  const previewSrc = getIframeSrc(iframeCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Game to JSON</h2>
              <p className="text-xs text-slate-400">Embed an unblocked game via iframe or URL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Game Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="e.g. Slope Runner"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Iframe Code or Web URL *</span>
              </label>
              {iframeCode.trim() && (
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>{showPreview ? 'Hide Preview' : 'Test Preview'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={iframeCode}
              onChange={(e) => { setIframeCode(e.target.value); setError(''); }}
              placeholder='<iframe src="https://..." width="100%" height="100%" frameborder="0"></iframe> or direct URL'
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Paste the entire <code className="text-slate-400">&lt;iframe&gt;</code> HTML snippet or any embeddable URL.
            </p>
          </div>

          {/* Optional Test Preview */}
          {showPreview && previewSrc && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2">
              <div className="text-[11px] text-slate-400 mb-1 px-1 flex justify-between">
                <span>Testing embed: <code className="text-slate-300">{previewSrc}</code></span>
              </div>
              <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-800 bg-black">
                <iframe
                  src={previewSrc}
                  title="Test Game Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Controls Summary
            </label>
            <input
              type="text"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="e.g. WASD to move, Space to shoot"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of how the game works..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              Save Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
