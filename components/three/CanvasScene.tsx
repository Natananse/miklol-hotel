'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SceneKind } from '../ThreeScene';

interface SceneProps {
  kind: SceneKind;
  active: boolean;
  selection: number;
  onSelect: (index: number) => void;
  onReady: () => void;
}

function SceneCamera() {
  const { camera } = useThree();
  useEffect(() => { camera.lookAt(0, 0, 0); }, [camera]);
  return null;
}

function Steam() {
  const steam = useRef<THREE.Group>(null);
  const curves = useMemo(() => Array.from({ length: 3 }, (_, i) => {
    const x = (i - 1) * .24;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, .76, -.05), new THREE.Vector3(x + .12, 1.02, -.04),
      new THREE.Vector3(x - .1, 1.32, .01), new THREE.Vector3(x + .12, 1.6, .06),
      new THREE.Vector3(x, 1.95, .08),
    ]);
  }), []);
  useFrame(({ clock }) => {
    if (!steam.current) return;
    const t = clock.getElapsedTime();
    steam.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * .65 + i * 2) * .07;
      child.scale.x = 1 + Math.sin(t * .5 + i) * .2;
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = .08 + (Math.sin(t * .8 + i * 2) + 1) * .045;
    });
  });
  return <group ref={steam}>{curves.map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 28, .018 + i * .003, 5, false]} /><meshBasicMaterial color="#f7e5ce" transparent opacity={.12} depthWrite={false} /></mesh>)}</group>;
}

function CoffeeCup() {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => [
    [.48, -.64], [.57, -.63], [.61, -.53], [.66, -.39], [.72, -.16], [.79, .13], [.84, .4],
    [.86, .57], [.85, .62], [.81, .63], [.79, .58], [.77, .4], [.72, .12], [.64, -.2], [.56, -.47], [.48, -.5],
  ].map(([x, y]) => new THREE.Vector2(x, y)), []);
  const saucer = useMemo(() => [[0, -.76], [.7, -.76], [.88, -.73], [1.28, -.69], [1.46, -.63], [1.48, -.59], [1.42, -.57], [1.1, -.62], [.75, -.67], [0, -.67]].map(([x, y]) => new THREE.Vector2(x, y)), []);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.26 + pointer.x * .22 + Math.sin(t * .18) * .12 + scroll * .35, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, .04 - pointer.y * .08 + scroll * .13, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -.14 + pointer.x * .04, 3, delta);
    group.current.position.y = Math.sin(t * .8) * .075 - scroll * .18;
  });
  return (
    <group ref={group} scale={1.35}>
      <mesh><latheGeometry args={[points, 64]} /><meshPhysicalMaterial color="#eee0c9" roughness={.24} metalness={.04} clearcoat={.65} clearcoatRoughness={.2} side={THREE.DoubleSide} /></mesh>
      <mesh position={[1.0, -.04, 0]} scale={[.86, 1, 1]}><torusGeometry args={[.41, .105, 12, 36]} /><meshPhysicalMaterial color="#e6d3b8" roughness={.24} clearcoat={.6} /></mesh>
      <mesh position={[0, .535, 0]}><cylinderGeometry args={[.788, .788, .025, 64]} /><meshPhysicalMaterial color="#261409" roughness={.19} metalness={.1} clearcoat={1} /></mesh>
      <mesh position={[0, .552, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.65, .778, 64]} /><meshStandardMaterial color="#a76631" roughness={.75} /></mesh>
      <mesh position={[0, .56, 0]} rotation={[-Math.PI / 2, 0, -.4]} scale={[1, .65, 1]}><ringGeometry args={[.21, .235, 48, 1, 0, Math.PI * 1.6]} /><meshStandardMaterial color="#cd9b61" roughness={.6} /></mesh>
      <mesh position={[0, .6, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.831, .025, 10, 64]} /><meshStandardMaterial color="#fff0d8" roughness={.3} /></mesh>
      <mesh><latheGeometry args={[saucer, 64]} /><meshPhysicalMaterial color="#d7bea1" roughness={.32} clearcoat={.4} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, -.585, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.43, .018, 8, 64]} /><meshStandardMaterial color="#f8e5c9" roughness={.3} /></mesh>
      <Steam />
      {[[-1.5, -.33, .15], [1.5, .63, -.45], [-.95, 1.08, -.4]].map((position, i) => <Float key={i} speed={1.2} rotationIntensity={.6} floatIntensity={.25}><group position={position as [number, number, number]} rotation={[.4, .3, i * .7]}><mesh scale={[.12, .075, .19]}><sphereGeometry args={[1, 14, 10]} /><meshStandardMaterial color="#6d3720" roughness={.68} /></mesh><mesh position={[0, .066, 0]} rotation={[0, .05, .1]} scale={[.012, .012, .14]}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#29170e" /></mesh></group></Float>)}
    </group>
  );
}

function Burger() {
  return <group scale={.8}>
    <mesh position={[0, .38, 0]}><sphereGeometry args={[.65, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#df903d" roughness={.56} /></mesh>
    <mesh position={[0, .38, 0]}><cylinderGeometry args={[.65, .65, .08, 28]} /><meshStandardMaterial color="#d18a3d" /></mesh>
    <mesh position={[0, .28, 0]} scale={[1, .1, 1]}><torusGeometry args={[.49, .16, 8, 28]} /><meshStandardMaterial color="#71a43b" roughness={.8} /></mesh>
    <mesh position={[0, .18, 0]}><cylinderGeometry args={[.59, .59, .085, 28]} /><meshStandardMaterial color="#d84024" /></mesh>
    <mesh position={[0, .09, 0]} rotation={[0, .35, 0]}><boxGeometry args={[1.1, .035, 1.1]} /><meshStandardMaterial color="#f4bb32" /></mesh>
    <mesh position={[0, -.03, 0]}><cylinderGeometry args={[.6, .58, .2, 28]} /><meshStandardMaterial color="#523020" roughness={.9} /></mesh>
    <mesh position={[0, -.22, 0]}><cylinderGeometry args={[.6, .53, .2, 28]} /><meshStandardMaterial color="#d88b3b" roughness={.75} /></mesh>
    {Array.from({ length: 12 }, (_, i) => { const angle = i * 2.4; const r = .2 + (i % 3) * .12; return <mesh key={i} position={[Math.cos(angle) * r, .38 + Math.sqrt(.65 ** 2 - r ** 2), Math.sin(angle) * r]} rotation={[0, angle, .3]} scale={[.025, .012, .06]}><sphereGeometry args={[1, 6, 4]} /><meshStandardMaterial color="#ffe8b8" /></mesh>; })}
  </group>;
}

function Pizza() {
  const slice = useMemo(() => { const shape = new THREE.Shape(); shape.moveTo(0, -.7); shape.lineTo(.62, .5); shape.quadraticCurveTo(0, .75, -.62, .5); shape.closePath(); return shape; }, []);
  return <group rotation={[-1.1, -.05, -.2]} scale={.9}>
    <mesh><extrudeGeometry args={[slice, { depth: .13, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .045, bevelThickness: .025 }]} /><meshStandardMaterial color="#dc9c4c" roughness={.7} /></mesh>
    <mesh position={[0, 0, .145]} scale={[.91, .93, 1]}><shapeGeometry args={[slice]} /><meshStandardMaterial color="#f1c057" roughness={.7} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, .53, .13]} rotation={[0, 0, Math.PI]} scale={[1.55, .5, 1]}><torusGeometry args={[.37, .11, 10, 20, Math.PI]} /><meshStandardMaterial color="#c88335" /></mesh>
    {[[0, -.27], [.25, .2], [-.23, .24], [0, .4]].map(([x, y], i) => <mesh key={i} position={[x, y, .17]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.115, .115, .025, 16]} /><meshStandardMaterial color="#a53824" /></mesh>)}
    <mesh position={[.16, -.02, .18]} rotation={[0, 0, .6]} scale={[.08, .19, .02]}><sphereGeometry args={[1, 10, 6]} /><meshStandardMaterial color="#4c7834" /></mesh>
  </group>;
}

function Croissant() {
  return <group rotation={[.3, 0, -.25]} scale={.9}>
    {Array.from({ length: 7 }, (_, i) => { const angle = (i - 3) * .32; const taper = 1 - Math.abs(i - 3) * .18; return <mesh key={i} position={[Math.sin(angle) * .64, Math.cos(angle) * .42 - .3, 0]} rotation={[0, 0, -angle]} scale={[.22 * taper, .45 * taper, .33 * taper]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={i % 2 ? '#d7953f' : '#e7aa54'} roughness={.58} /></mesh>; })}
  </group>;
}

function Donut() {
  return <group rotation={[.45, -.3, .1]} scale={.85}>
    <mesh><torusGeometry args={[.42, .23, 18, 40]} /><meshStandardMaterial color="#c68a43" roughness={.7} /></mesh>
    <mesh position={[0, 0, .075]} scale={[1, 1, .65]}><torusGeometry args={[.42, .22, 18, 40]} /><meshPhysicalMaterial color="#5e3025" roughness={.28} clearcoat={.45} /></mesh>
    {Array.from({ length: 15 }, (_, i) => { const a = i * 2.4; const r = .35 + (i % 3) * .065; return <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, .23]} rotation={[0, 0, a]}><capsuleGeometry args={[.012, .065, 2, 5]} /><meshStandardMaterial color={['#f2c467', '#eee0c5', '#d47a6c'][i % 3]} /></mesh>; })}
  </group>;
}

function Cake() {
  const wedge = useMemo(() => { const shape = new THREE.Shape(); shape.moveTo(-.5, -.4); shape.lineTo(.65, 0); shape.lineTo(-.5, .4); shape.closePath(); return shape; }, []);
  return <group rotation={[-Math.PI / 2, 0, -.25]} scale={.85}>
    <mesh position={[0, 0, -.22]}><extrudeGeometry args={[wedge, { depth: .68, bevelEnabled: true, bevelSegments: 1, bevelSize: .02, bevelThickness: .02 }]} /><meshStandardMaterial color="#5d3024" roughness={.8} /></mesh>
    {[0, .22].map((z) => <mesh key={z} position={[0, 0, z]}><extrudeGeometry args={[wedge, { depth: .06, bevelEnabled: false }]} /><meshStandardMaterial color="#c29574" roughness={.8} /></mesh>)}
    <mesh position={[0, 0, .48]}><extrudeGeometry args={[wedge, { depth: .04, bevelEnabled: true, bevelSegments: 1, bevelSize: .025, bevelThickness: .02 }]} /><meshPhysicalMaterial color="#3a1f18" roughness={.3} clearcoat={.4} /></mesh>
    <mesh position={[-.2, 0, .62]}><sphereGeometry args={[.12, 18, 12]} /><meshStandardMaterial color="#bd3527" roughness={.34} /></mesh>
  </group>;
}

const positions: [number, number, number][] = [[-2.1, .2, -.1], [-1.05, -.35, .3], [0, .22, -.3], [1.08, -.2, .3], [2.14, .25, -.1]];
const models = [Burger, Pizza, Croissant, Donut, Cake];
function FoodItem({ index, selected, onSelect }: { index: number; selected: boolean; onSelect: (index: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const Model = models[index];
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.position.y = positions[index][1] + Math.sin(t * .7 + index * 1.4) * .12;
    group.current.rotation.y = Math.sin(t * .35 + index) * .3;
    group.current.rotation.z = Math.sin(t * .4 + index) * .07;
    const size = selected ? 1.12 : .94;
    group.current.scale.lerp(new THREE.Vector3(size, size, size), Math.min(delta * 4, 1));
  });
  const select = (event: ThreeEvent<PointerEvent | MouseEvent>) => { event.stopPropagation(); onSelect(index); };
  return <group ref={group} position={positions[index]} onPointerOver={select} onClick={select}><Model /></group>;
}

export default function CanvasScene({ kind, active, selection, onSelect, onReady }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]} frameloop={active ? 'always' : 'never'}
      camera={{ position: kind === 'coffee' ? [0, 2.3, 6.6] : [0, 1.6, 8], fov: kind === 'coffee' ? 40 : 43 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => { gl.setClearColor('#211813', 0); onReady(); }}
    >
      <SceneCamera />
      <ambientLight intensity={1.25} color="#fff1dc" />
      <directionalLight position={[-3, 5, 4]} intensity={3.8} color="#fff1d9" />
      <directionalLight position={[3, 1, -2]} intensity={2.6} color="#ed9957" />
      <pointLight position={[0, -3, 3]} intensity={8} color="#b47a47" />
      <Suspense fallback={null}>
        {kind === 'coffee' ? <CoffeeCup /> : <group position={[0, .3, 0]}>{models.map((_, index) => <FoodItem key={index} index={index} selected={selection === index} onSelect={onSelect} />)}</group>}
      </Suspense>
    </Canvas>
  );
}
