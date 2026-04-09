import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import useFavorite from "../hooks/useFavorite";

export function FavoriteButton({ movieId, className = "" }) {
    const { isFav, UpdateFavorite } = useFavorite();
    const isFavorite = isFav(movieId);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const user = localStorage.getItem("movie_mate_user");
        if (!user) {
            alert("Please log in to save favorites!");
            return;
        }

        UpdateFavorite({ id: movieId });
    };
    return (
        <motion.button
            onClick={handleToggle}
            whileTap={{ scale: 0.85 }}
            className={className}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                border: "none",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                background: isFavorite ? "rgba(239,68,68,0.25)" : "rgba(0,0,0,0.5)",
                transition: "background 0.2s ease",
            }}
        >
            <Heart
                size={14}
                style={{
                    fill: isFavorite ? "#ef4444" : "none",
                    color: isFavorite ? "#ef4444" : "#ffffff",
                    transition: "all 0.2s ease",
                }}
            />
        </motion.button>
    );
}