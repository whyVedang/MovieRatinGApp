import { useRef, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getProject, val } from "@theatre/core";
import { animate, inView, stagger } from "motion";
import { Film, Star, Heart, ArrowRight, Clapperboard } from "lucide-react";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistortion;
  varying vec2 vUv;
  varying float vNoise;

  // Simplex-style noise helpers
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
    // Deep violet-to-ink gradient based on noise + UV
    vec3 colorA = vec3(0.09, 0.06, 0.18);  // near-black violet
    vec3 colorB = vec3(0.48, 0.38, 0.82);  // muted lavender
    vec3 color = mix(colorA, colorB, clamp(vNoise * 0.5 + 0.5, 0.0, 1.0));
    float alpha = 0.82;
    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─── Custom shader material ─────────────────────────────── */
const NoiseMaterial = shaderMaterial(
    { uTime: 0, uDistortion: 0.38 },
    vertexShader,
    fragmentShader
);
extend({ NoiseMaterial });

/* ─── The animated sphere ────────────────────────────────── */
function NoiseSphere({ theatreObj }) {
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
            arr[i * 3] = (Math.random() - 0.5) * 22;
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

/* ─── R3F Hero Scene ─────────────────────────────────────── */
function HeroScene() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[6, 6, 4]} intensity={1.2} color="#c8b5f5" />
            <pointLight position={[-6, -4, -4]} intensity={0.5} color="#8b5cf6" />
            <Suspense fallback={null}>
                <NoiseSphere />
                <ParticleField />
            </Suspense>
        </>
    );
}

/* ─── Feature card data ──────────────────────────────────── */
const features = [
    {
        icon: Star,
        title: "Discover",
        desc: "Explore top-rated cinema, trending picks, and upcoming releases — all in one place.",
        accent: "#e8b34b",
    },
    {
        icon: Heart,
        title: "Collect",
        desc: "Build your personal film collection. Save favourites and revisit them anytime.",
        accent: "#f87171",
    },
    {
        icon: Clapperboard,
        title: "Rate",
        desc: "Give your personal rating to every film you watch. Your taste, recorded.",
        accent: "#c8b5f5",
    },
];

/* ─── Main Landing Page ──────────────────────────────────── */
export default function LandingPage() {
    const navigate = useNavigate();
    const heroTextRef = useRef(null);
    const subTextRef = useRef(null);
    const ctaRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaSectionRef = useRef(null);

    /* ── Motion One entrance animations ── */
    useEffect(() => {
        // Hero headline letter-stagger
        if (heroTextRef.current) {
            animate(
                heroTextRef.current,
                { opacity: [0, 1], y: [40, 0] },
                { duration: 0.9, delay: 0.3, easing: [0.22, 1, 0.36, 1] }
            );
        }
        if (subTextRef.current) {
            animate(
                subTextRef.current,
                { opacity: [0, 1], y: [20, 0] },
                { duration: 0.7, delay: 0.7, easing: [0.22, 1, 0.36, 1] }
            );
        }
        if (ctaRef.current) {
            animate(
                ctaRef.current,
                { opacity: [0, 1], y: [16, 0] },
                { duration: 0.6, delay: 1.0, easing: [0.22, 1, 0.36, 1] }
            );
        }

        // Feature cards — stagger on scroll enter
        if (featuresRef.current) {
            const cards = featuresRef.current.querySelectorAll(".feature-card");
            inView(featuresRef.current, () => {
                animate(
                    cards,
                    { opacity: [0, 1], y: [48, 0] },
                    { duration: 0.55, delay: stagger(0.12), easing: [0.22, 1, 0.36, 1] }
                );
            });
        }

        // CTA section fade-in
        if (ctaSectionRef.current) {
            inView(ctaSectionRef.current, () => {
                animate(
                    ctaSectionRef.current,
                    { opacity: [0, 1], scale: [0.97, 1] },
                    { duration: 0.6, easing: [0.22, 1, 0.36, 1] }
                );
            });
        }
    }, []);

    /* ── Theatre.js project setup ── */
    useEffect(() => {
        // Use Theatre.js to drive a simple timeline on the canvas opacity
        try {
            const project = getProject("LandingPage");
            const sheet = project.sheet("Hero");
            const canvasObj = sheet.object("Canvas", {
                opacity: 0,
                scale: 0.7,
            });

            let frame = 0;
            const totalFrames = 90; // ~3 seconds at 30fps tick
            const tick = () => {
                frame++;
                const progress = Math.min(frame / totalFrames, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // cubic ease
                canvasObj.override({
                    opacity: eased,
                    scale: 0.7 + eased * 0.3,
                });

                const canvas = document.getElementById("hero-canvas");
                if (canvas) {
                    canvas.style.opacity = canvasObj.value.opacity;
                    canvas.style.transform = `scale(${canvasObj.value.scale})`;
                }

                if (frame < totalFrames) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } catch (e) {
            // Theatre.js fallback — just show immediately
            const canvas = document.getElementById("hero-canvas");
            if (canvas) { canvas.style.opacity = 1; canvas.style.transform = "scale(1)"; }
        }
    }, []);

    return (
        <div style={{ background: "var(--bg-base)", minHeight: "100vh", overflowX: "hidden" }}>

            {/* ── Hero ───────────────────────────────────────────── */}
            <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

                {/* R3F Canvas */}
                <div
                    id="hero-canvas"
                    style={{
                        position: "absolute", inset: 0,
                        opacity: 0, transform: "scale(0.7)",
                        transition: "none",
                    }}
                >
                    <Canvas
                        camera={{ position: [0, 0, 6.5], fov: 50 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: "transparent" }}
                    >
                        <HeroScene />
                    </Canvas>
                </div>

                {/* Gradient fade on sides */}
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "radial-gradient(ellipse 60% 80% at 50% 50%, transparent 20%, var(--bg-base) 80%)",
                }} />

                {/* Hero content */}
                <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 40px", width: "100%" }}>

                    {/* Brand mark */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
                        <Film size={14} style={{ color: "var(--accent)" }} />
                        <span style={{
                            fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em",
                            textTransform: "uppercase", color: "var(--text-3)",
                        }}>
                            MovieMate
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        ref={heroTextRef}
                        style={{
                            opacity: 0,
                            fontSize: "clamp(52px, 9vw, 128px)",
                            fontWeight: 300,
                            letterSpacing: "-0.04em",
                            lineHeight: 0.95,
                            color: "var(--text-1)",
                            marginBottom: "28px",
                            maxWidth: "700px",
                        }}
                    >
                        Cinema.<br />
                        <span style={{ fontWeight: 600 }}>Curated.</span>
                    </h1>

                    {/* Sub copy */}
                    <p
                        ref={subTextRef}
                        style={{
                            opacity: 0,
                            fontSize: "16px",
                            color: "var(--text-2)",
                            lineHeight: 1.65,
                            maxWidth: "400px",
                            marginBottom: "44px",
                            fontWeight: 300,
                        }}
                    >
                        Discover top-rated films, build your collection, and share what you love — all in one elegant space.
                    </p>

                    {/* CTA */}
                    <div ref={ctaRef} style={{ opacity: 0, display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                            onClick={() => navigate("/browse")}
                            className="btn-primary"
                        >
                            Enter CineVault
                            <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="btn-ghost"
                        >
                            Sign in
                        </button>
                    </div>
                </div>

                {/* Scroll hint */}
                <div style={{
                    position: "absolute", bottom: "32px", left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                }}>
                    <div style={{
                        width: "1px", height: "48px",
                        background: "linear-gradient(to bottom, var(--text-3), transparent)",
                        animation: "scrollPulse 2s ease-in-out infinite",
                    }} />
                    <style>{`@keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:.8} }`}</style>
                </div>
            </section>

            {/* ── Features ───────────────────────────────────────── */}
            <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "120px 40px" }}>

                <div style={{ marginBottom: "64px" }}>
                    <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "12px" }}>
                        What you get
                    </p>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, letterSpacing: "-0.025em", color: "var(--text-1)", maxWidth: "480px", lineHeight: 1.15 }}>
                        Everything a film lover needs
                    </h2>
                </div>

                <div ref={featuresRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px" }}>
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="feature-card"
                            style={{
                                opacity: 0,
                                padding: "40px 36px",
                                border: "1px solid var(--border)",
                                background: "var(--bg-surface)",
                                transition: "border-color 0.2s ease",
                                cursor: "default",
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-md)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                        >
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                background: `${f.accent}15`,
                                border: `1px solid ${f.accent}25`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginBottom: "24px",
                            }}>
                                <f.icon size={18} style={{ color: f.accent }} />
                            </div>
                            <h3 style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", marginBottom: "10px" }}>
                                {f.title}
                            </h3>
                            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.65 }}>
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ─────────────────────────────────────── */}
            <section style={{ padding: "0 40px 120px", maxWidth: "1100px", margin: "0 auto" }}>
                <div
                    ref={ctaSectionRef}
                    style={{
                        opacity: 0,
                        position: "relative", overflow: "hidden",
                        borderRadius: "20px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-surface)",
                        padding: "80px 60px",
                        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                    }}
                >
                    {/* Mini R3F particle canvas behind CTA */}
                    <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
                        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
                            <Suspense fallback={null}>
                                <ParticleField />
                            </Suspense>
                        </Canvas>
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "16px" }}>
                            Ready to start?
                        </p>
                        <h2 style={{ fontSize: "clamp(28px, 5vw, 56px)", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: "12px" }}>
                            Your next favourite film<br />is one click away.
                        </h2>
                        <p style={{ fontSize: "15px", color: "var(--text-2)", marginBottom: "36px", maxWidth: "380px" }}>
                            No sign-up required to browse. Just enter and explore.
                        </p>
                        <button
                            onClick={() => navigate("/browse")}
                            className="btn-primary"
                        >
                            Browse Films
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────── */}
            <footer style={{
                borderTop: "1px solid var(--border)",
                padding: "32px 40px",
                maxWidth: "1100px", margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "12px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Film size={13} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>MovieMate</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-3)" }}>
                    Powered by{" "}
                    <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer"
                        style={{ color: "var(--text-2)", textDecoration: "none" }}>
                        TMDB
                    </a>
                </p>
            </footer>
        </div>
    );
}
