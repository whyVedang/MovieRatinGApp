import { useRef, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { getProject } from "@theatre/core";
import { animate, inView, stagger } from "motion";
import { Film, Star, Heart, ArrowRight, Clapperboard } from "lucide-react";

// Three.js Canvas is lazy-loaded so it never bloats the initial bundle
const HeroCanvas = lazy(() => import("../components/HeroCanvas"));

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

    /* ── Theatre.js canvas intro animation ── */
    useEffect(() => {
        try {
            const project = getProject("LandingPage");
            const sheet = project.sheet("Hero");
            const canvasObj = sheet.object("Canvas", { opacity: 0, scale: 0.7 });

            let frame = 0;
            const totalFrames = 90;
            const tick = () => {
                frame++;
                const progress = Math.min(frame / totalFrames, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                canvasObj.override({ opacity: eased, scale: 0.7 + eased * 0.3 });

                const el = document.getElementById("hero-canvas");
                if (el) {
                    el.style.opacity = canvasObj.value.opacity;
                    el.style.transform = `scale(${canvasObj.value.scale})`;
                }
                if (frame < totalFrames) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } catch {
            // Theatre.js unavailable — reveal immediately
            const el = document.getElementById("hero-canvas");
            if (el) { el.style.opacity = 1; el.style.transform = "scale(1)"; }
        }
    }, []);

    return (
        <div style={{ background: "var(--bg-base)", minHeight: "100vh", overflowX: "hidden" }}>

            {/* ── Hero ───────────────────────────────────────────── */}
            <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

                {/* Lazy-loaded R3F Canvas */}
                <div
                    id="hero-canvas"
                    style={{ position: "absolute", inset: 0, opacity: 0, transform: "scale(0.7)" }}
                >
                    <Suspense fallback={null}>
                        <HeroCanvas />
                    </Suspense>
                </div>

                {/* Radial vignette */}
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
                            CineVault
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
                        <button onClick={() => navigate("/browse")} className="btn-primary">
                            Enter CineVault
                            <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate("/login")} className="btn-ghost">
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
                                cursor: "default",
                            }}
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
                    {/* Mini particle canvas behind CTA */}
                    <div style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }}>
                        <Suspense fallback={null}>
                            <HeroCanvas />
                        </Suspense>
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
                        <button onClick={() => navigate("/browse")} className="btn-primary">
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
                    <span style={{ fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>CineVault</span>
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