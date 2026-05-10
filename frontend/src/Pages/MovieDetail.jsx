import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMovieCredits, fetchMovieDetails, fetchMovieRecommendations } from "../services/Movieapi.js";
import { getMovieReviews, writeReview } from "../services/Review.js";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Star, Clock, Calendar, Globe, Heart, ArrowLeft, Film, Users, MessageSquare, ChevronDown, User } from "lucide-react";
import useFavorite from "../hooks/useFavorite";
import Footer from "../components/Footer";

const IMG = "https://image.tmdb.org/t/p";

const formatRuntime = (mins) => {
  if (!mins) return "N/A";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

const formatDate = (s) => {
  if (!s) return "N/A";
  return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

function SectionHeading({ icon: Icon, label }) {
  return (
    <h2 className="flex items-center gap-2.5 text-[15px] font-semibold text-[var(--text-1)] tracking-tight mb-6">
      <Icon size={15} className="text-[var(--accent)]" />
      {label}
    </h2>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 items-start">
      <Icon size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-[var(--text-3)] m-0 mb-0.5 uppercase tracking-wider">{label}</p>
        <p className="text-[13px] text-[var(--text-2)] m-0">{value}</p>
      </div>
    </div>
  );
}

function GenreBadge({ name }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-dim)] border border-purple-500/20 text-[var(--accent-hover)] mr-2 mb-2">
      {name}
    </span>
  );
}

function ReviewItem({ review, isExpanded, toggleReview }) {
  const content = review.content || "";
  const long = content.length > 300;
  
  return (
    <div className="p-5 px-6 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-md)] transition-colors hover:border-[var(--border-md)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[var(--accent-dim)] flex items-center justify-center text-sm font-bold text-[var(--accent)]">
          {review.author?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-1)] m-0">{review.author}</p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-3)]">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
            {review.author_details?.rating && (
              <>
                <span className="text-[var(--border-md)]">•</span>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] text-[var(--text-3)]">
                    {review.author_details.rating}/10
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-[13px] text-[var(--text-2)] leading-relaxed m-0">
        {long && !isExpanded ? `${content.substring(0, 300)}... ` : content}
      </p>
      {long && (
        <button
          onClick={() => toggleReview(review.id)}
          className="mt-2.5 flex items-center gap-1 bg-transparent border-none cursor-pointer text-[var(--accent)] text-xs p-0 hover:text-[var(--accent-hover)] transition-colors"
        >
          {isExpanded ? "Show less" : "Read more"}
          <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
        </button>
      )}
    </div>
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
  
  const [successMsg, setSuccessMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { isFav, UpdateFavorite } = useFavorite();

  const reviewMutation = useMutation({
    mutationFn: (reviewData) => writeReview(reviewData),
    onSuccess: () => {
      setRating(0);
      setContent("");
      setErrorMsg("");
      setSuccessMsg("Review posted successfully!!");
      getMovieReviews(id).then(setReviews).catch(console.error);
    },
    onError: (err) => {
      setErrorMsg(err.message || "Failed to post review");
    },
  });

  useEffect(() => {
    setLoading(true);
    setDetails(null);

    Promise.allSettled([
      fetchMovieDetails(id),
      fetchMovieCredits(id),
      getMovieReviews(id),
      fetchMovieRecommendations(id),
    ])
      .then(([det, cred, rev, rec]) => {
        if (det.status === "fulfilled") setDetails(det.value);
        else return setDetails(null);
        
        setCredits(cred.status === "fulfilled" ? cred.value : { cast: [] });
        setReviews(rev.status === "fulfilled" ? rev.value : { local: { results: [] }, tmdb: { results: [] } });
        setRecommendations(rec.status === "fulfilled" ? rec.value : { results: [] });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!rating) return setErrorMsg("Please select a rating");
    if (!content.trim()) return setErrorMsg("Please write a review");

    reviewMutation.mutate({ movieId: Number(id), rating, content: content.trim() });
  };

  const toggleReview = (rid) =>
    setExpandedReviews((prev) => prev.includes(rid) ? prev.filter((r) => r !== rid) : [...prev, rid]);

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

  if (loading) return <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center"><div className="spinner" /></div>;
  if (!details) return <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center text-[var(--text-3)]">Movie not found.</div>;

  const favActive = isFav(Number(details.id));
  const sortedRecs = recommendations?.results
    ?.sort((a, b) => (b.popularity * 0.7 + b.vote_average * 0.3) - (a.popularity * 0.7 + a.vote_average * 0.3))
    ?.slice(0, 6) || [];

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-[var(--bg-base)]">
        {details.backdrop_path && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 1.2 }}
            className="fixed inset-0 z-0 bg-cover bg-center blur-sm"
            style={{ backgroundImage: `url(${IMG}/original${details.backdrop_path})` }}
          />
        )}
        
        <div className="relative z-10 pt-14">
          <div className="max-w-[1100px] mx-auto px-8 py-10 pb-20">
            
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[var(--text-3)] text-[13px] mb-10 p-0 transition-colors hover:text-[var(--text-1)]"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {/* Hero Section */}
            <div className="flex gap-12 flex-wrap mb-16">
              <div className="shrink-0 w-[220px]">
                <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] shadow-2xl">
                  {details.poster_path ? (
                    <img src={`${IMG}/w500${details.poster_path}`} alt={details.title} className="w-full block" />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[var(--bg-elevated)] flex items-center justify-center">
                      <Film size={32} className="text-[var(--text-3)]" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleFavorite}
                  className={`mt-4 w-full py-2.5 rounded-[var(--radius-sm)] border text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    favActive 
                      ? "border-red-500/40 bg-red-500/10 text-red-500" 
                      : "border-[var(--border-md)] bg-transparent text-[var(--text-2)] hover:border-red-500/40 hover:text-red-500"
                  }`}
                >
                  <Heart size={14} className={favActive ? "fill-red-500 text-red-500" : ""} />
                  {favActive ? "In Favourites" : "Add to Favourites"}
                </button>

                <div className="mt-4 p-5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-md)] flex flex-col gap-4">
                  <InfoRow icon={Calendar} label="Release" value={formatDate(details.release_date)} />
                  <InfoRow icon={Clock} label="Runtime" value={formatRuntime(details.runtime)} />
                  <InfoRow icon={Globe} label="Language" value={details.original_language?.toUpperCase() || "N/A"} />
                  <InfoRow icon={Star} label="Rating" value={details.vote_average ? `${details.vote_average.toFixed(1)} / 10 (${details.vote_count?.toLocaleString()} votes)` : "Not rated"} />
                </div>
              </div>

              {/* Details Text */}
              <div className="flex-1 min-w-[280px]">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[clamp(28px,4vw,48px)] font-light tracking-tight text-[var(--text-1)] m-0 mb-2 leading-tight"
                >
                  {details.title}
                </motion.h1>
                {details.tagline && <p className="text-[14px] text-[var(--accent)] italic mb-5">"{details.tagline}"</p>}
                
                {details.genres?.length > 0 && (
                  <div className="mb-6">
                    {details.genres.map((g) => <GenreBadge key={g.id} name={g.name} />)}
                  </div>
                )}
                <div className="mb-8">
                  <p className="text-[11px] text-[var(--text-3)] tracking-widest uppercase mb-2.5">Overview</p>
                  <p className="text-[14px] text-[var(--text-2)] leading-relaxed">{details.overview || "No overview available."}</p>
                </div>
              </div>
            </div>

            {/* Cast Section */}
            {credits?.cast?.length > 0 && (
              <section className="mb-14">
                <SectionHeading icon={Users} label="Top Cast" />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
                  {credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
                      {actor.profile_path ? (
                        <img src={`${IMG}/w185${actor.profile_path}`} alt={actor.name} className="w-full h-[140px] object-cover block" />
                      ) : (
                        <div className="w-full h-[140px] bg-[var(--bg-elevated)] flex items-center justify-center">
                          <User size={28} className="text-[var(--text-3)]" />
                        </div>
                      )}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-[var(--text-1)] m-0 mb-0.5 truncate">{actor.name}</p>
                        <p className="text-[11px] text-[var(--text-3)] m-0 truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recommendations Section */}
            {sortedRecs.length > 0 && (
              <section className="mb-14">
                <SectionHeading icon={Film} label="You Might Also Like" />
                <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
                  {sortedRecs.map((movie) => (
                    <Link key={movie.id} to={`/MovieDetail/${movie.id}`} className="block bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden transition-all hover:border-[var(--accent)] hover:-translate-y-1">
                      {movie.poster_path ? (
                        <img src={`${IMG}/w500${movie.poster_path}`} alt={movie.title} className="w-full aspect-[2/3] object-cover block" />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-[var(--bg-elevated)] flex items-center justify-center">
                          <Film size={24} className="text-[var(--text-3)]" />
                        </div>
                      )}
                      <div className="p-2.5">
                        <p className="text-xs font-medium text-[var(--text-1)] m-0 truncate">{movie.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Write Review Section */}
            <section className="mb-14">
              <SectionHeading icon={MessageSquare} label="Write a Review" />
              <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--border)]">
                <div className="mb-5">
                  <p className="text-xs text-[var(--text-3)] mb-3 uppercase tracking-widest">Your Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="bg-transparent border-none cursor-pointer p-0.5">
                        <Star size={24} className={`transition-all ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-[var(--text-3)]"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-3)] mb-2 uppercase tracking-widest">Your Review</p>
                  <textarea
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="What did you think of the movie?"
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-1)] p-3 text-[13px] font-sans outline-none min-h-[120px] resize-y box-border transition-colors focus:border-[var(--accent)]"
                  />
                </div>
                {errorMsg && <p className="text-red-500 text-xs mb-3">{errorMsg}</p>}
                {successMsg && <p className="text-emerald-400 text-sm mb-3">{successMsg}</p>}
                <button type="submit" disabled={reviewMutation.isPending} className="bg-[var(--accent)] text-white px-5 py-2.5 rounded-[var(--radius-sm)] border-none text-[13px] font-medium cursor-pointer transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-70 disabled:cursor-not-allowed">
                  {reviewMutation.isPending ? "Posting..." : "Post Review"}
                </button>
              </form>
            </section>

            {/* Local Reviews */}
            {reviews?.local?.results?.length > 0 && (
              <section className="mb-8">
                <SectionHeading icon={MessageSquare} label="MovieMate Reviews" />
                <div className="flex flex-col gap-3">
                  {reviews.local.results.map((review) => (
                    <ReviewItem key={`local-${review.id}`} review={review} isExpanded={expandedReviews.includes(review.id)} toggleReview={toggleReview} />
                  ))}
                </div>
              </section>
            )}

            {/* TMDB Reviews */}
            {reviews?.tmdb?.results?.length > 0 && (
              <section className="mb-14">
                <SectionHeading icon={Globe} label="TMDB Reviews" />
                <div className="flex flex-col gap-3">
                  {reviews.tmdb.results.slice(0, 5).map((review) => (
                    <ReviewItem key={`tmdb-${review.id}`} review={review} isExpanded={expandedReviews.includes(review.id)} toggleReview={toggleReview} />
                  ))}
                </div>
              </section>
            )}

            {/* No Reviews Fallback */}
            {(!reviews?.local?.results?.length && !reviews?.tmdb?.results?.length) && (
               <section className="mb-14">
                  <SectionHeading icon={MessageSquare} label="Reviews" />
                  <p className="text-[var(--text-3)] text-sm">No reviews available for this movie yet. Be the first to share your thoughts!</p>
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