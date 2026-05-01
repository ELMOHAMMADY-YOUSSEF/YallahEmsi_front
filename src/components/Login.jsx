import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur("");

    try {
      // Kan-ssiftou l'Email w l'Mot de passe l'Backend
      const response = await axios.post("http://localhost:8081/api/utilisateurs/login", { email, motDePasse: password });
      
      // S-SAROUT 🔑: Kan-ssajlou l'Objet kamel li rjje3 lina Spring Boot (fih id, nom, prenom, role)
      if (response.data && response.data.id) {
        localStorage.setItem("user", JSON.stringify(response.data)); 
        
        // Kan-diwh l'page 3la 7sab r-role dyalo
        if (response.data.role === "conducteur") {
          navigate("/mes-trajets");
        } else {
          navigate("/trajets");
        }
      } else {
        setErreur("Informations incorrectes.");
      }
    } catch (err) {
      setErreur("Email ou mot de passe incorrect !");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.1)", 
    borderRadius: 12, padding: "14px 16px", color: "#fff", fontFamily: "Outfit,sans-serif", 
    fontSize: 14, outline: "none", transition: "all .2s", marginBottom: 15
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <AnimatedBackground />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 400, background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)", borderRadius: 24, padding: "40px", backdropFilter: "blur(24px)" }}>
        
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>Bienvenue sur <span style={{ color: "#4ade80" }}>Yallah</span></h2>
        <p style={{ color: "rgba(255,255,255,.5)", marginBottom: 30, textAlign: "center" }}>Connectez-vous à votre compte.</p>

        {erreur && (
          <div style={{ background: "rgba(239,68,68,.1)", color: "#f87171", padding: 16, borderRadius: 12, marginBottom: 20, textAlign: "center", fontWeight: 700 }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email..." value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Mot de passe..." value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", borderRadius: 12, cursor: "pointer", marginTop: 10, boxShadow: "0 4px 20px rgba(34,197,94,.25)", transition: "all .2s", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,.5)", fontSize: 14 }}>
          Vous n'avez pas de compte ? <Link to="/inscription" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 700 }}>S'inscrire ici</Link>
        </p>
      </div>
    </div>
  );
}