import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("movie_mate_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
