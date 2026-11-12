'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './ThreeScene.module.scss';

export type SceneKind = 'coffee' | 'food';
export const floatingFoods = [
  { name: 'The MIKLOL Burger', price: '590 ETB', short: 'Burger', image: 'burger', alt: 'A freshly prepared burger with golden bread and crisp vegetables' },
  { name: 'The Margherita', price: '550 ETB', short: 'Pizza', image: 'pizza', alt: 'A golden margherita pizza with tomato, cheese, and basil' },
  { name: 'Golden Butter Croissant', price: '220 ETB', short: 'Croissant', image: 'croissant', alt: 'A golden flaky butter croissant' },
  { name: 'Chocolate-glazed donut', price: '180 ETB', short: 'Donut', image: 'donut', alt: 'A glazed donut ready for a sweet coffee break' },
  { name: 'Chocolate After Hours', price: '320 ETB', short: 'Cake', image: 'cake', alt: 'A rich slice of chocolate cake' },
];

const CanvasScene = dynamic(() => import('./three/CanvasScene'), {
  ssr: false,
  loading: () => <div className={styles.loader} aria-label="Preparing the 3D scene"><span /><small>A little magic is brewing</small></div>,
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

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const connection = device.connection;
    const check = () => {
      if (motion.matches || connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (device.deviceMemory && device.deviceMemory <= 4)) {
        setCapable(false);
        return;
      }
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
        setCapable(Boolean(context));
        context?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch { setCapable(false); }
    };
    check();
    motion.addEventListener('change', check);
    return () => motion.removeEventListener('change', check);
  }, []);

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
        alt={kind === 'coffee' ? 'Freshly brewed coffee in a ceramic cup' : floatingFoods[selection].alt}
        fill sizes="(max-width: 700px) 100vw, 52vw" preload={kind === 'coffee'}
        placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMzgyNjFjIi8+PC9zdmc+"
      />
    </div>
  );

  return (
    <div ref={wrapper} className={`${styles.scene} ${styles[kind]}`}>
      {fallback}
      {capable && nearby && !ready && <div className={styles.loader} role="status"><span /><small>A little magic is brewing</small></div>}
      {capable && nearby && (
        <SceneBoundary fallback={<div className={styles.failure}>{fallback}</div>} onFailure={() => setCapable(false)}>
          <div className={`${styles.canvas} ${ready ? styles.canvasReady : ''}`} aria-hidden="true">
            <CanvasScene kind={kind} active={visible} selection={selection} onSelect={setSelection} onReady={() => setReady(true)} onFailure={() => setCapable(false)} />
          </div>
        </SceneBoundary>
      )}
      {kind === 'food' && (
        <div className={styles.foodInterface}>
          <div className={styles.foodDetail} aria-live="polite"><span>{floatingFoods[selection].name}</span><strong>{floatingFoods[selection].price}</strong></div>
          <div className={styles.foodChoices} aria-label="Explore floating dishes">
            {floatingFoods.map((food, index) => <button key={food.name} type="button" onClick={() => setSelection(index)} onFocus={() => setSelection(index)} aria-pressed={selection === index}>{food.short}</button>)}
          </div>
        </div>
      )}
    </div>
  );
}
