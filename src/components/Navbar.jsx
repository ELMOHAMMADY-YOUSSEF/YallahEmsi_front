import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Ma-bghinach l'Navbar t-ban f l'page dyal Login awla Inscription
  if (["/", "/inscription"].includes(location.pathname)) {
    return null;
  }

  // Ila makanch m-connecté, ma-n-biyenou walo
  if (!currentUser) return null;

  const isConducteur = currentUser.role === "conducteur";

  const handleLogout = () => {
    // Kan-ms7ou l'utilisateur mn l'navigateur (Déconnexion)
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(8,22,12,.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(74,222,128,.15)",
      padding: "16px 32px", fontFamily: "Outfit,sans-serif",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      
      {/* L'LOGO W SMIT L'APP */}
      <Link to="/trajets" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontWeight: 900, boxShadow: "0 4px 15px rgba(34,197,94,.3)" }}>
          Y
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Yallah<span style={{ color: "#4ade80" }}>Emsi</span>
        </span>
      </Link>

      {/* LES LIENS DYAL L'PAGES */}
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <Link to="/trajets" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "color .2s" }} onMouseOver={e => e.currentTarget.style.color="#fff"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}>
          🚗 Trajets
        </Link>
        
        {/* Affichage Dynamique 3la 7sab l'Role */}
        {isConducteur ? (
          <Link to="/mes-trajets" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "color .2s" }} onMouseOver={e => e.currentTarget.style.color="#fff"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}>
            📋 Mes Annonces
          </Link>
        ) : (
          <Link to="/mes-reservations" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "color .2s" }} onMouseOver={e => e.currentTarget.style.color="#fff"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}>
            🎟️ Mes Réservations
          </Link>
        )}

        <Link to="/wallet" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 15, fontWeight: 600, transition: "color .2s" }} onMouseOver={e => e.currentTarget.style.color="#4ade80"} onMouseOut={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}>
          💰 Wallet
        </Link>
      </div>

      {/* PROFIL W LOGOUT */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,.05)", padding: "6px 16px 6px 6px", borderRadius: "30px", border: "0.5px solid rgba(255,255,255,.1)" }}>
          <div style={{ width: 32, height: 32, background: "#4ade80", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a1a0f", fontWeight: 800, fontSize: 14 }}>
            {currentUser.nom.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{currentUser.prenom}</span>
        </div>

        {/* Bouton Déconnexion */}
        <button 
          onClick={handleLogout}
          style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#ef4444", padding: "8px 16px", borderRadius: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,.2)"; e.currentTarget.style.transform = "translateY(-2px)" }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(239,68,68,.1)"; e.currentTarget.style.transform = "translateY(0)" }}
        >
          Déconnexion 🚪
        </button>
      </div>

    </nav>
  );
}