import { useLocation } from "react-router-dom";
import backgroundemsi from "../assets/images/background_emsi.jpg";
// JIB TSWIRA DYAL INSCRIPTION HNA 👇 (T2akked mn s-smiya dyal l-fichier)
import backgroundInscription from "../assets/images/background_emsi.webp";

export default function AnimatedBackground() {
  const location = useLocation();

  // KAN-CHOUFOU WACH 7NA F PAGE INSCRIPTION
  const isInscriptionPage = location.pathname === "/inscription";
  
  // KAN-KHTAROU T-TSWIRA 3LA 7SAB L-PAGE
  const currentBackground = isInscriptionPage ? backgroundInscription : backgroundemsi;

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 0, 
      backgroundColor: "#050e08",
      backgroundImage: `url(${currentBackground})`, 
      backgroundSize: "cover", 
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transition: "background-image 0.5s ease-in-out" // Zedt lik hadi bach t-tswira tbddel b-chwiya w b-anaka ✨
    }} />
  );
}