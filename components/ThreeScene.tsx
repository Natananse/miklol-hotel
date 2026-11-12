'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './ThreeScene.module.scss';

export type SceneKind = 'coffee' | 'food';
export const floatingFoods = [
  { name: 'The MIKLOL Burger', price: '590 ETB', short: 'Burger', image: 'burger', alt: 'Cheeseburger with lettuce, tomato, and pickles in a bread bun' },
  { name: 'The Margherita', price: '550 ETB', short: 'Pizza', image: 'pizza', alt: 'Pizza with cheese, mushrooms, tomatoes, and herbs' },
  { name: 'Golden Butter Croissant', price: '220 ETB', short: 'Croissant', image: 'croissant', alt: 'Two croissants dusted with powdered sugar on a dark board' },
  { name: 'Chocolate-glazed donut', price: '180 ETB', short: 'Donut', image: 'donut', alt: 'Two chocolate-glazed donuts with white icing stripes' },
  { name: 'Chocolate After Hours', price: '320 ETB', short: 'Cake', image: 'cake', alt: 'Chocolate cake with ganache and piped chocolate frosting' },
];

interface NetworkInfo extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
}

const CanvasScene = dynamic(() => import('./three/CanvasScene'), {
  ssr: false,
  loading: () => <div className={styles.loader} aria-label="Loading the 3D preview"><span /><small>Loading dish previews…</small></div>,
});

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function ThreeScene({ kind }: { kind: SceneKind }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState(false);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [selection, setSelection] = useState(0);
  const webGLSupport = useRef<boolean | null>(null);
  const failed = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const phone = window.matchMedia('(max-width: 600px), (pointer: coarse)');
    const device = navigator as Navigator & { connection?: NetworkInfo; deviceMemory?: number };
    const connection = device.connection;
    const check = () => {
      const slowConnection = connection?.saveData || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '') || (connection?.downlink !== undefined && connection.downlink < 1.5);
      const weakDevice = (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) || (device.deviceMemory !== undefined && device.deviceMemory <= 4);
      // Unknown mobile capabilities keep the photo. Only explicitly fast, capable phones load WebGL.
      const powerfulPhone = navigator.hardwareConcurrency >= 8 && (device.deviceMemory ?? 0) >= 8;
      const fastPhoneConnection = connection?.effectiveType === '4g' && (connection.downlink === undefined || connection.downlink >= 1.5);
      if (failed.current || motion.matches || slowConnection || weakDevice || (phone.matches && (!powerfulPhone || !fastPhoneConnection))) {
        setCapable(false);
        return;
      }
      if (!nearby || !visible) return;
      if (webGLSupport.current !== null) { setCapable(webGLSupport.current); return; }
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
        webGLSupport.current = Boolean(context);
        setCapable(webGLSupport.current);
        context?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch { webGLSupport.current = false; setCapable(false); }
    };
    check();
    motion.addEventListener('change', check);
    phone.addEventListener('change', check);
    connection?.addEventListener?.('change', check);
    return () => {
      motion.removeEventListener('change', check);
      phone.removeEventListener('change', check);
      connection?.removeEventListener?.('change', check);
    };
  }, [nearby, visible]);

  useEffect(() => {
    if (!wrapper.current) return;
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNearby(true); }, { rootMargin: '160px' });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    preload.observe(wrapper.current);
    visibility.observe(wrapper.current);
    return () => { preload.disconnect(); visibility.disconnect(); };
  }, []);

  const fallback = (
    <div className={`${styles.fallback} ${ready && capable ? styles.fallbackHidden : ''}`}>
      <Image
        src={kind === 'coffee' ? '/images/coffee/espresso.jpg' : `/images/food/${floatingFoods[selection].image}.jpg`}
        alt={kind === 'coffee' ? 'Espresso in a dark ceramic cup' : floatingFoods[selection].alt}
        fill sizes={kind === 'coffee' ? '(max-width: 600px) calc(100vw - 40px), 52vw' : '(max-width: 600px) calc(100vw - 40px), (max-width: 1400px) 66vw, 922px'} preload={kind === 'coffee'}
        placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMzgyNjFjIi8+PC9zdmc+"
      />
    </div>
  );

  return (
    <div ref={wrapper} className={`${styles.scene} ${styles[kind]}`}>
      {fallback}
      {capable && nearby && !ready && <div className={styles.loader} role="status"><span /><small>Loading dish previews…</small></div>}
      {capable && nearby && (
        <SceneBoundary fallback={<div className={styles.failure}>{fallback}</div>} onFailure={() => { failed.current = true; setCapable(false); }}>
          <div className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`} aria-hidden="true">
            <CanvasScene kind={kind} active={visible} selection={selection} onSelect={setSelection} onReady={() => setReady(true)} onFailure={() => { failed.current = true; setCapable(false); }} />
          </div>
        </SceneBoundary>
      )}
      {kind === 'food' && (
        <div className={styles.foodInterface}>
          <div className={styles.foodDetail} aria-live="polite"><span>{floatingFoods[selection].name}</span><strong>{floatingFoods[selection].price}</strong></div>
          <div className={styles.foodChoices} aria-label="Choose a dish to see its price">
            {floatingFoods.map((food, index) => <button key={food.name} type="button" onClick={() => setSelection(index)} onFocus={() => setSelection(index)} aria-pressed={selection === index}>{food.short}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
