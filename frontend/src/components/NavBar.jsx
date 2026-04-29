import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search, Menu, X, Film, User, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoutButton from "../auth/LogoutButton";

/* ── Dropdown ──────────────────────────────────────────── */
function DropdownItem({ to, label, hint }) {
  return (
    <Link
      to={to}
      style={{
        position: "relative",
        padding: "12px 16px",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontSize: "13px", color: "var(--text-1)" }}>{label}</span>
      <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{hint}</span>
    </Link>
  );
}

function MoviesDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "13px",
          color: "var(--text-2)",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
      >
        Movies
        <ChevronDown
          size={12}
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              left: 0,
              width: "220px",
              borderRadius: "var(--radius-md)",
              padding: "6px",
              background: "rgba(14,14,17,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            <DropdownItem
              to="/category/top_rated"
              label="Top Rated"
              hint="Best of all time"
            />
            <DropdownItem
              to="/category/popular"
              label="Popular"
              hint="Trending now"
            />
            <DropdownItem
              to="/category/upcoming"
              label="Upcoming"
              hint="Releasing soon"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Navbar ────────────────────────────────────────────── */
export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("movie_mate_token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    if (searchOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const navStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 50,
    backdropFilter: "blur(20px)",
    backgroundColor: scrolled ? "rgba(8,8,9,0.95)" : "rgba(8,8,9,0.5)",
    borderBottom: scrolled
      ? "1px solid var(--border)"
      : "1px solid transparent",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  };

  return (
    <div>
      {/* ── Navbar ── */}
      <nav style={navStyle}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/browse"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Film size={15} style={{ color: "var(--accent)" }} />
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--text-1)",
                fontWeight: 500,
              }}
            >
              CineVault
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "32px" }}
          >
            <MoviesDropdown />
            {isAuthenticated && (
              <>
                <Link
                  to="/favourites"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-2)",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-2)")
                  }
                >
                  Favourites
                </Link>

                <Link
                  to="/reviews"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-2)",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-2)")
                  }
                >
                  Reviews
                </Link>
              </>
            )}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-2)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-2)")
              }
            >
              <Search size={15} />
            </button>
            {!isAuthenticated ? (
              <Link
                to="/login"
                style={{ color: "var(--text-2)", transition: "color 0.15s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text-1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-2)")
                }
              >
                <User size={15} />
              </Link>
            ) : (
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-2)",
            }}
          >
            <Menu size={17} />
          </button>
        </div>
      </nav>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              backgroundColor: "rgba(8,8,9,0.97)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              style={{
                maxWidth: "560px",
                margin: "0 auto",
                paddingTop: "120px",
                padding: "120px 24px 0",
              }}
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a film..."
                  style={{
                    width: "100%",
                    fontSize: "28px",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border-md)",
                    outline: "none",
                    color: "var(--text-1)",
                    paddingBottom: "12px",
                    fontFamily: "inherit",
                  }}
                />
              </form>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-3)",
                  marginTop: "12px",
                }}
              >
                Press Enter to search · Esc to close
              </p>
            </div>
            <button
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-3)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-3)")
              }
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                zIndex: 40,
              }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                height: "100%",
                width: "280px",
                zIndex: 50,
                padding: "24px",
                backgroundColor: "var(--bg-surface)",
                borderLeft: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-3)",
                  alignSelf: "flex-end",
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {[
                  { to: "/category/top_rated", label: "Top Rated" },
                  { to: "/category/popular", label: "Popular" },
                  { to: "/category/upcoming", label: "Upcoming" },
                  { to: "/favourites", label: "Favourites" },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "14px",
                      color: "var(--text-1)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-elevated)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div style={{ marginTop: "auto" }}>
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Outlet />
    </div>
  );
}
