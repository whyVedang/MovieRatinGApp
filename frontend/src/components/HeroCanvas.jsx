// components/HeroCanvas.jsx — self-contained 3D module (lazy-loaded)
import { useRef, Suspense } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── GLSL Shaders ───────────────────────────────────────── */
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistortion;
  varying vec2 vUv;
  varying float vNoise;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ *ns.x + ns.yyyy;
    vec4 y  = y_ *ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    float noise = snoise(vec3(position * 0.6 + uTime * 0.18));
    vNoise = noise;
    vec3 displaced = position + normal * noise * uDistortion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vNoise;

  void main() {
    vec3 colorA = vec3(0.09, 0.06, 0.18);
    vec3 colorB = vec3(0.48, 0.38, 0.82);
    vec3 color = mix(colorA, colorB, clamp(vNoise * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(color, 0.82);
  }
`;

const NoiseMaterial = shaderMaterial(
    { uTime: 0, uDistortion: 0.38 },
    vertexShader,
    fragmentShader
);
extend({ NoiseMaterial });

function NoiseSphere() {
    const meshRef = useRef();
    const matRef = useRef();

    useFrame(({ clock }) => {
        if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.0018;
            meshRef.current.rotation.x += 0.0006;
        }
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.2, 64]} />
            <noiseMaterial
                ref={matRef}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

/* ─── Particle field ─────────────────────────────────────── */
function ParticleField() {
    const count = 1800;
    const positions = useRef(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3]     = (Math.random() - 0.5) * 22;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
        }
        return arr;
    }).current();

    const pointsRef = useRef();
    useFrame(({ clock }) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.028}
                color="#c8b5f5"
                transparent
                opacity={0.35}
                sizeAttenuation
            />
        </points>
    );
}

export default function HeroCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6.5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[6, 6, 4]} intensity={1.2} color="#c8b5f5" />
            <pointLight position={[-6, -4, -4]} intensity={0.5} color="#8b5cf6" />
            <Suspense fallback={null}>
                <NoiseSphere />
                <ParticleField />
            </Suspense>
        </Canvas>
    );
}