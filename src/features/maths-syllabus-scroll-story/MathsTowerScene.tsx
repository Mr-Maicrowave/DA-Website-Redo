import { ContactShadows } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import {
  CatmullRomCurve3,
  DoubleSide,
  Quaternion,
  TubeGeometry,
  Vector3,
} from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import {
  TOWER_RAIL_POINTS,
  getCameraPose,
  getEndingProgress,
  getRailPoint,
} from './maths-tower-scene-data';

// Three r170 needs the LTC lookup textures installed before area-light shaders compile.
// ESM module evaluation makes this a single initialization for the scene bundle.
RectAreaLightUniformsLib.init();

interface MathsTowerSceneProps {
  progress: number;
  onContextFailure(): void;
}

interface RailTransform {
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

interface RailTieTransform extends RailTransform {
  length: number;
}

const FLOOR_LEVELS = [5.16, 3.42, 1.68, -0.06, -1.8, -3.54, -5.28] as const;
const COLUMN_ANGLES = [0, Math.PI / 2, Math.PI, Math.PI * 1.5] as const;
const RAIL_TIE_PROGRESS = [0.08, 0.15, 0.23, 0.31, 0.39, 0.47, 0.55, 0.63, 0.71, 0.79, 0.87] as const;
const RAIL_COLLAR_PROGRESS = [0.18, 0.36, 0.54, 0.72, 0.88] as const;
const TOWER_TOP = 5.82;
const TOWER_BOTTOM = -5.9;
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

function clampProgress(progress: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
}

function towerRadiusAt(y: number): number {
  const heightProgress = Math.min(1, Math.max(0, (y - TOWER_BOTTOM) / (TOWER_TOP - TOWER_BOTTOM)));
  return 1.16 + (0.72 - 1.16) * heightProgress;
}

function makeRailTies(curve: CatmullRomCurve3): RailTieTransform[] {
  return RAIL_TIE_PROGRESS.map((progress) => {
    const railPoint = curve.getPointAt(progress);
    const radialDirection = new Vector3(railPoint.x, 0, railPoint.z);
    if (radialDirection.lengthSq() < 0.001) radialDirection.set(1, 0, 0);
    radialDirection.normalize();

    const towerPoint = new Vector3(
      radialDirection.x * towerRadiusAt(railPoint.y),
      railPoint.y,
      radialDirection.z * towerRadiusAt(railPoint.y),
    );
    const direction = railPoint.clone().sub(towerPoint);
    const midpoint = towerPoint.clone().add(railPoint).multiplyScalar(0.5);
    const quaternion = new Quaternion().setFromUnitVectors(Y_AXIS, direction.clone().normalize());

    return {
      position: midpoint.toArray(),
      quaternion: quaternion.toArray(),
      length: Math.max(0.14, direction.length()),
    };
  });
}

function makeRailCollars(curve: CatmullRomCurve3): RailTransform[] {
  return RAIL_COLLAR_PROGRESS.map((progress) => {
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const quaternion = new Quaternion().setFromUnitVectors(Z_AXIS, tangent);

    return {
      position: point.toArray(),
      quaternion: quaternion.toArray(),
    };
  });
}

function ContextFailureBridge({ onContextFailure }: Pick<MathsTowerSceneProps, 'onContextFailure'>) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextFailure();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, { passive: false });
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl, onContextFailure]);

  return null;
}

function CameraRig({ progress }: Pick<MathsTowerSceneProps, 'progress'>) {
  const camera = useThree((state) => state.camera);

  useLayoutEffect(() => {
    const pose = getCameraPose(progress);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    camera.updateMatrixWorld();
  }, [camera, progress]);

  return null;
}

function TowerArchitecture({ landingGlow }: { landingGlow: number }) {
  const landing = getRailPoint(1).position;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 1.16, TOWER_TOP - TOWER_BOTTOM, 12, 1, true]} />
        <meshPhysicalMaterial
          color="#fff7df"
          depthTest
          depthWrite
          opacity={0.28}
          roughness={0.52}
          side={DoubleSide}
          transparent
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.2, 0.27, 11.48, 12]} />
        <meshStandardMaterial color="#12294b" metalness={0.42} roughness={0.34} />
      </mesh>

      {COLUMN_ANGLES.map((angle) => (
        <mesh
          castShadow
          key={angle}
          position={[Math.cos(angle) * 0.7, -0.04, Math.sin(angle) * 0.7]}
          receiveShadow
        >
          <cylinderGeometry args={[0.045, 0.065, 11.5, 8]} />
          <meshStandardMaterial color="#f4ead1" metalness={0.1} roughness={0.5} />
        </mesh>
      ))}

      {FLOOR_LEVELS.map((level, index) => {
        const radius = towerRadiusAt(level);
        return (
          <group key={level} position={[0, level, 0]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, 0.095, 48]} />
              <meshPhysicalMaterial
                color="#fff8e7"
                depthTest
                depthWrite
                opacity={0.72}
                roughness={0.4}
                transparent
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius * 0.94, 0.025, 8, 64]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? '#d5a83f' : '#18345d'}
                metalness={0.78}
                roughness={0.24}
              />
            </mesh>
          </group>
        );
      })}

      <group position={[landing[0], landing[1], landing[2]]}>
        <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[1.38, 1.56, 0.22, 64]} />
          <meshStandardMaterial color="#102645" metalness={0.42} roughness={0.28} />
        </mesh>
        <mesh receiveShadow position={[0, 0.035, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.08, 64]} />
          <meshPhysicalMaterial
            color="#fff6dc"
            emissive="#c6952e"
            emissiveIntensity={0.12 + landingGlow * 0.8}
            metalness={0.24}
            roughness={0.32}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.085, 0]}>
          <torusGeometry args={[1.23, 0.045, 10, 72]} />
          <meshStandardMaterial color="#d9ad48" emissive="#805b12" emissiveIntensity={0.26} metalness={0.88} roughness={0.16} />
        </mesh>
        <pointLight color="#e7bd58" decay={2} distance={5.5} intensity={1.2 + landingGlow * 7} position={[0, 0.8, 0]} />
      </group>
    </group>
  );
}

function TowerRail({ curve }: { curve: CatmullRomCurve3 }) {
  const geometry = useMemo(() => new TubeGeometry(curve, 240, 0.105, 16, false), [curve]);
  const ties = useMemo(() => makeRailTies(curve), [curve]);
  const collars = useMemo(() => makeRailCollars(curve), [curve]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh castShadow geometry={geometry} receiveShadow>
        <meshPhysicalMaterial
          clearcoat={0.72}
          clearcoatRoughness={0.18}
          color="#d7aa43"
          emissive="#5d420c"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {ties.map((tie, index) => (
        <mesh
          castShadow
          key={RAIL_TIE_PROGRESS[index]}
          position={tie.position}
          quaternion={tie.quaternion}
          receiveShadow
        >
          <cylinderGeometry args={[0.026, 0.038, tie.length, 8]} />
          <meshStandardMaterial color="#152f55" metalness={0.68} roughness={0.27} />
        </mesh>
      ))}

      {collars.map((collar, index) => (
        <mesh
          key={RAIL_COLLAR_PROGRESS[index]}
          position={collar.position}
          quaternion={collar.quaternion}
        >
          <torusGeometry args={[0.14, 0.025, 10, 32]} />
          <meshStandardMaterial color="#17335b" metalness={0.76} roughness={0.23} />
        </mesh>
      ))}
    </group>
  );
}

export function MathsTowerScene({ progress: requestedProgress, onContextFailure }: MathsTowerSceneProps) {
  const progress = clampProgress(requestedProgress);
  const curve = useMemo(
    () => new CatmullRomCurve3(TOWER_RAIL_POINTS.map(({ position }) => new Vector3(...position))),
    [],
  );
  const point = curve.getPointAt(progress);
  const ending = getEndingProgress(progress);

  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 36, near: 0.1, far: 100, position: [9.5, 6.1, 11.5] }}
      className="maths-tower-story__canvas"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      shadows
      style={{ background: 'transparent', pointerEvents: 'none' }}
    >
      <ContextFailureBridge onContextFailure={onContextFailure} />
      <CameraRig progress={progress} />

      <ambientLight intensity={0.48} />
      <hemisphereLight color="#fff5d8" groundColor="#0e203c" intensity={1.15} />
      <directionalLight
        castShadow
        color="#fff0c7"
        intensity={2.35}
        position={[6.5, 10, 8]}
        shadow-bias={-0.00035}
        shadow-mapSize={[1024, 1024]}
      />
      <rectAreaLight color="#f0bd56" height={8} intensity={3.4} position={[-5, 1, 5]} rotation={[0, -0.65, 0]} width={4} />
      <rectAreaLight color="#8ba9da" height={7} intensity={2.2} position={[5, -1, 4]} rotation={[0, 0.65, 0]} width={3} />

      <TowerArchitecture landingGlow={ending.logoProgress} />
      <TowerRail curve={curve} />

      <mesh castShadow name="maths-tower-ball" position={point} receiveShadow>
        <sphereGeometry args={[0.34, 40, 40]} />
        <meshPhysicalMaterial
          clearcoat={1}
          clearcoatRoughness={0.08}
          color="#d8aa3f"
          emissive="#6b490b"
          emissiveIntensity={0.18}
          metalness={0.94}
          roughness={0.14}
        />
      </mesh>

      <ContactShadows
        blur={2.8}
        color="#10233e"
        far={16}
        frames={1}
        opacity={0.34}
        position={[0, -6.16, 0]}
        resolution={512}
        scale={14}
      />
    </Canvas>
  );
}

export default MathsTowerScene;
