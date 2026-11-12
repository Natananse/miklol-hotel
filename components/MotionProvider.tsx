'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/** Load only opacity/transform animation features, without drag or layout projection. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>;
}
