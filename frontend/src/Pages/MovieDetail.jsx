import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieRecommendations
} from "../services/Movieapi.js";
import { getReview, writeReview } from "../services/Review.js";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Star, Clock, Calendar, Globe, Heart, ArrowLeft,
  Film, Users, MessageSquare, ChevronDown, User,
} from "lucide-react";
import useFavorite from "../hooks/useFavorite";
import Footer from "../components/Footer";

const IMG = "https://image.tmdb.org/t/p";

const formatRuntime = (mins) => {
  if (!mins) return "—";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatDate = (s) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

function StarRating({ movieId }) {
  const [userRating, setUserRating] = useState(
    () => Number(localStorage.getItem(`rating_${movieId}`)) || 0
  );
  const [hover, setHover] = useState(0);

  const handleRate = (v) => {
    setUserRating(v);
    localStorage.setItem(`rating_${movieId}`, v);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
        >
          <Star
            size={22}
            style={{
              fill: (hover || userRating) >= star ? "#facc15" : "none",
              color: (hover || userRating) >= star ? "#facc15" : "var(--text-3)",
              transition: "all 0.15s",
            }}
          />
        </button>
      ))}
      <span style={{ fontSize: "13px", color: "var(--text-3)", marginLeft: "8px" }}>
        {userRating > 0 ? `${userRating}/5` : "Rate this movie"}
      </span>
    </div>
  );
}

function SectionHeading({ icon: Icon, label }) {
  return (
    <h2 style={{
      display: "flex", alignItems: "center", gap: "10px",
      fontSize: "15px", fontWeight: 600, color: "var(--text-1)",
      letterSpacing: "-0.01em", margin: "0 0 24px",
    }}>
      <Icon size={15} style={{ color: "var(--accent)" }} />
      {label}
    </h2>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <Icon size={14} style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: "11px", color: "var(--text-3)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

function GenreBadge({ name }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px", fontWeight: 500,
      background: "var(--accent-dim)",
      border: "1px solid rgba(124,58,237,0.2)",
      color: "var(--accent-hover)",
      marginRight: "8px", marginBottom: "8px",
    }}>
      {name}
    </span>
  );
}

function MovieDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState([]);
  
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { isFav, UpdateFavorite } = useFavorite();

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: (reviewData) => writeReview(reviewData),
    onSuccess: () => {
      setRating(0);
      setContent("");
      setErrorMsg("");
      getReview(id).then(setReviews).catch(console.error);
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to post review");
    },
  });

  useEffect(() => {
    setLoading(true);
    setDetails(null);
    Promise.all([
      fetchMovieDetails(id),
      fetchMovieCredits(id),
      getReview(id),
      fetchMovieRecommendations(id),
    ])
      .then(([det, cred, rev, rec]) => {
        setDetails(det);
        setCredits(cred);
        setReviews(rev);
        setRecommendations(rec);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!rating) {
      setErrorMsg("Please select a rating");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Please write a review");
      return;
    }

    reviewMutation.mutate({
      movieId: Number(id),
      rating: rating,
      content: content.trim(),
    });
  };

  const toggleReview = (rid) =>
    setExpandedReviews((prev) =>
      prev.includes(rid) ? prev.filter((r) => r !== rid) : [...prev, rid]
    );

  const handleFavorite = () => {
    if (!details) return;
    UpdateFavorite({
      id: Number(details.id),
      title: details.title,
      poster_path: details.poster_path,
      vote_average: details.vote_average,
      release_date: details.release_date,
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-base)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!details) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--bg-base)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-3)",
      }}>
        Movie not found.
      </div>
    );
  }

  const favActive = isFav(Number(details.id));
  const sortedRecs = recommendations?.results
    ?.sort((a, b) => (b.popularity * 0.7 + b.vote_average * 0.3) - (a.popularity * 0.7 + a.vote_average * 0.3))
    ?.slice(0, 6) || [];

  return (
    <Tooltip.Provider>
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>

        {/* Backdrop */}
        {details.backdrop_path && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 1.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 0,
              backgroundImage: `url(${IMG}/original${details.backdrop_path})`,
              backgroundSize: "cover", backgroundPosition: "center",
              filter: "blur(4px)",
            }}
          />
        )}

        <div style={{ position: "relative", zIndex: 1, paddingTop: "56px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px 80px" }}>

            {/* Back */}
            <button
              onClick={() => window.history.back()}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-3)", fontSize: "13px",
                marginBottom: "40px", padding: 0,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
            >
              <ArrowLeft size={14} /> Back
            </button>

            {/* Hero — poster + info */}
            <div style={{ display: "flex", gap: "48px", flexWrap: "wrap", marginBottom: "64px" }}>

              {/* Poster */}
              <div style={{ flexShrink: 0, width: "220px" }}>
                <div style={{
                  borderRadius: "var(--radius-md)", overflow: "hidden",
                  border: "1px solid var(--border)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                }}>
                  {details.poster_path ? (
                    <img
                      src={`${IMG}/w500${details.poster_path}`}
                      alt={details.title}
                      style={{ width: "100%", display: "block" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", aspectRatio: "2/3",
                      background: "var(--bg-elevated)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Film size={32} style={{ color: "var(--text-3)" }} />
                    </div>
                  )}
                </div>

                {/* Favourite button */}
                <button
                  onClick={handleFavorite}
                  style={{
                    marginTop: "16px",
                    width: "100%", padding: "11px 0",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: favActive ? "rgba(239,68,68,0.4)" : "var(--border-md)",
                    background: favActive ? "rgba(239,68,68,0.1)" : "transparent",
                    color: favActive ? "#ef4444" : "var(--text-2)",
                    cursor: "pointer", fontSize: "13px", fontWeight: 500,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!favActive) { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#ef4444"; }}}
                  onMouseLeave={(e) => { if (!favActive) { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--text-2)"; }}}
                >
                  <Heart size={14} style={{ fill: favActive ? "#ef4444" : "none" }} />
                  {favActive ? "In Favourites" : "Add to Favourites"}
                </button>

                {/* Info card */}
                <div style={{
                  marginTop: "16px", padding: "20px",
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", flexDirection: "column", gap: "16px",
                }}>
                  <InfoRow icon={Calendar} label="Release" value={formatDate(details.release_date)} />
                  <InfoRow icon={Clock}    label="Runtime" value={formatRuntime(details.runtime)} />
                  <InfoRow icon={Globe}    label="Language" value={details.original_language?.toUpperCase() || "—"} />
                  <InfoRow
                    icon={Star} label="Rating"
                    value={details.vote_average
                      ? `${details.vote_average.toFixed(1)} / 10 (${details.vote_count?.toLocaleString()} votes)`
                      : "Not rated"}
                  />
                </div>
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: "280px" }}>
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300,
                    letterSpacing: "-0.03em", color: "var(--text-1)",
                    margin: "0 0 8px", lineHeight: 1.1,
                  }}
                >
                  {details.title}
                </motion.h1>

                {details.tagline && (
                  <p style={{ fontSize: "14px", color: "var(--accent)", fontStyle: "italic", marginBottom: "20px" }}>
                    "{details.tagline}"
                  </p>
                )}

                {/* Genres */}
                {details.genres?.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    {details.genres.map((g) => <GenreBadge key={g.id} name={g.name} />)}
                  </div>
                )}

                {/* Overview */}
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                    Overview
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75 }}>
                    {details.overview || "No overview available."}
                  </p>
                </div>

                {/* Production companies */}
                {details.production_companies?.length > 0 && (
                  <div style={{ marginBottom: "32px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                      Produced by
                    </p>
                    <div>
                      {details.production_companies.map((pc) => <GenreBadge key={pc.id} name={pc.name} />)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Cast ── */}
            {credits?.cast?.length > 0 && (
              <section style={{ marginBottom: "56px" }}>
                <SectionHeading icon={Users} label="Top Cast" />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: "12px",
                }}>
                  {credits.cast.slice(0, 12).map((actor) => (
                    <div
                      key={actor.id}
                      style={{
                        background: "var(--bg-surface)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", overflow: "hidden",
                        transition: "border-color 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      {actor.profile_path ? (
                        <img
                          src={`${IMG}/w185${actor.profile_path}`}
                          alt={actor.name}
                          style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "140px",
                          background: "var(--bg-elevated)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <User size={28} style={{ color: "var(--text-3)" }} />
                        </div>
                      )}
                      <div style={{ padding: "8px 10px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-1)", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {actor.name}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {actor.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Recommendations ── */}
            {sortedRecs.length > 0 && (
              <section style={{ marginBottom: "56px" }}>
                <SectionHeading icon={Film} label="You Might Also Like" />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "12px",
                }}>
                  {sortedRecs.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/MovieDetail/${movie.id}`}
                      style={{
                        display: "block",
                        background: "var(--bg-surface)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", overflow: "hidden",
                        transition: "border-color 0.2s, transform 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      {movie.poster_path ? (
                        <img
                          src={`${IMG}/w500${movie.poster_path}`}
                          alt={movie.title}
                          style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "2/3", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Film size={24} style={{ color: "var(--text-3)" }} />
                        </div>
                      )}
                      <div style={{ padding: "8px 10px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-1)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {movie.title}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Star size={10} style={{ color: "#facc15", fill: "#facc15" }} />
                          <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                            {movie.vote_average?.toFixed(1) || "—"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Write Review ── */}
            <section style={{ marginBottom: "56px" }}>
              <SectionHeading icon={MessageSquare} label="Write a Review" />
              <form onSubmit={handleSubmit} style={{
                background: "var(--bg-surface)",
                padding: "24px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}>
                {/* Star Selector */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Your Rating
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                      >
                        <Star
                          size={24}
                          style={{
                            fill: star <= rating ? "#facc15" : "none",
                            color: star <= rating ? "#facc15" : "var(--text-3)",
                            transition: "all 0.15s",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Your Review
                  </p>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What did you think of the movie?"
                    style={{
                      width: "100%",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--text-1)",
                      padding: "12px 14px",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      outline: "none",
                      minHeight: "120px",
                      resize: "vertical",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <p style={{ color: "#ef4444", fontSize: "12px", marginBottom: "12px" }}>
                    {errorMsg}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "11px 20px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: reviewMutation.isPending ? "not-allowed" : "pointer",
                    opacity: reviewMutation.isPending ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => !reviewMutation.isPending && (e.currentTarget.style.background = "var(--accent-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
                >
                  {reviewMutation.isPending ? "Posting..." : "Post Review"}
                </button>
              </form>
            </section>

            {/* ── Reviews ── */}
            {reviews?.results?.length > 0 && (
              <section style={{ marginBottom: "56px" }}>
                <SectionHeading icon={MessageSquare} label="User Reviews" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {reviews.results.slice(0, 3).map((review) => {
                    const isExpanded = expandedReviews.includes(review.id);
                    const content = review.content || "";
                    const long = content.length > 300;

                    return (
                      <div
                        key={review.id}
                        style={{
                          padding: "20px 24px",
                          background: "var(--bg-surface)", border: "1px solid var(--border)",
                          borderRadius: "var(--radius-md)",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-md)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        {/* Author row */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: "var(--accent-dim)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px", fontWeight: 700, color: "var(--accent)",
                          }}>
                            {review.author?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)", margin: 0 }}>
                              {review.author}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                              {review.author_details?.rating && (
                                <>
                                  <span style={{ color: "var(--border-md)" }}>·</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                    <Star size={10} style={{ color: "#facc15", fill: "#facc15" }} />
                                    <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                                      {review.author_details.rating}/10
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>
                          {long && !isExpanded ? `${content.substring(0, 300)}…` : content}
                        </p>

                        {long && (
                          <button
                            onClick={() => toggleReview(review.id)}
                            style={{
                              marginTop: "10px", display: "flex", alignItems: "center", gap: "4px",
                              background: "none", border: "none", cursor: "pointer",
                              color: "var(--accent)", fontSize: "12px", padding: 0,
                            }}
                          >
                            {isExpanded ? "Show less" : "Read more"}
                            <ChevronDown
                              size={13}
                              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </Tooltip.Provider>
  );
}

export default MovieDetail;
