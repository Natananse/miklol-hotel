'use client';

import { useCallback, useSyncExternalStore } from 'react';

const storageKey = 'miklol-favorites';
const changed = 'miklol-favorites-changed';
let cachedValue = '';
let cachedFavorites: string[] = [];
let memoryValue = '[]';
let memoryOnly = false;
const aliases: Record<string, string> = { burger: 'house-burger', pasta: 'pesto-pasta' };

function snapshot() {
  let raw = memoryValue;
  try { if (!memoryOnly) raw = localStorage.getItem(storageKey) || memoryValue; } catch { memoryOnly = true; }
  if (raw !== cachedValue) {
    cachedValue = raw;
    try {
      const parsed: unknown = JSON.parse(raw);
      cachedFavorites = Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string').map(id => aliases[id] || id))] : [];
    } catch { cachedFavorites = []; }
  }
  return cachedFavorites;
}
const empty: string[] = [];
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(changed, callback);
  return () => { window.removeEventListener('storage', callback); window.removeEventListener(changed, callback); };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, snapshot, () => empty);
  const toggleFavorite = useCallback((id: string) => {
    const current = snapshot();
    memoryValue = JSON.stringify(current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
    try { localStorage.setItem(storageKey, memoryValue); } catch { memoryOnly = true; }
    window.dispatchEvent(new Event(changed));
  }, []);
  return { favorites, toggleFavorite, isFavorite: (id: string) => favorites.includes(id) };
}
