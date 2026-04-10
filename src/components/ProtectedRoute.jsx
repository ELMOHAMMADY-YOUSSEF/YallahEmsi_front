import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequis }) {
  // Kan-jibou l'utilisateur mn l'Navigateur
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 1. Ila makanch m-connecté ga3 -> N-rj3ouh l' Login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // 2. Ila kan m-connecté, mais bgha y-dkhol l'chi page machi dyalo (Ex: Passager bgha y-publier)
  if (roleRequis && currentUser.role !== roleRequis) {
    return <Navigate to="/trajets" replace />; // Kan-rj3ouh l'page principale dyalo
  }

  // 3. Ila kan kolchi nishan -> Khellih y-doz l'Page li bgha
  return children;
}