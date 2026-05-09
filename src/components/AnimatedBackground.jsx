import { useLocation } from "react-router-dom";
import backgroundemsi from "../assets/images/background_emsi.jpg";
// JIB TSWIRA DYAL INSCRIPTION HNA 👇 
import backgroundInscription from "../assets/images/background_emsi.webp";

export default function AnimatedBackground() {
  const location = useLocation();

  // KAN-CHOUFOU WACH 7NA F PAGES DYAL LOGIN AWLA INSCRIPTION
  const isInscriptionPage = location.pathname === "/inscription";
  const isLoginPage = location.pathname === "/" || location.pathname === "/login"; 
  
  // WACH HAD L-PAGE FIHA L-FORMULAIRE DYAL D-DKHOUL?
  const isAuthPage = isInscriptionPage || isLoginPage;

  // KAN-KHTAROU T-TSWIRA 
  const currentBackground = isInscriptionPage ? backgroundInscription : backgroundemsi;

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      zIndex: 0, 
      backgroundColor: "#050e08",
      
      // 🔥 L-KHEDRIYA L-PROFESSIONNELLE (KAT-BAN WA3RA F DATASHOW) 🔥
      backgroundImage: isAuthPage 
        ? `url(${currentBackground})` 
        : "radial-gradient(circle at top, #065f46 0%, #022c22 50%, #050d07 100%)", 
        
      backgroundSize: "cover", 
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      transition: "background 0.5s ease-in-out" 
    }} />
  );
}