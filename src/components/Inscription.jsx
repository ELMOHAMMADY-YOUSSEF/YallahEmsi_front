import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function Inscription() {
  const navigate = useNavigate();
  
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cne, setCne] = useState(""); 
  const [telephone, setTelephone] = useState(""); 
  const [role, setRole] = useState("etudiant");

  // ZEDNA MATRICULE W PLACES HNA 👇
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [matricule, setMatricule] = useState(""); 
  const [places, setPlaces] = useState(4); 

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      nom: nom,
      prenom: prenom,
      email: email,
      motDePasse: password,
      cne: cne, 
      telephone: telephone, 
      role: role,
      // Siftna l'm3loumat dyal l'Voiture kamlin!
      voiture: role === "conducteur" ? { marque: marque, modele: modele, matricule: matricule, placesTotales: places } : null
    };

    try {
      await axios.post("http://localhost:8081/api/utilisateurs/inscription", payload);
      setMessage("✅ Compte créé avec succès !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("❌ Erreur lors de l'inscription. Veuillez vérifier vos informations.");
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

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 450, background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)", borderRadius: 24, padding: "40px", backdropFilter: "blur(24px)" }}>
        
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>Rejoindre <span style={{ color: "#4ade80" }}>Yallah EMSI</span></h2>

        {message && (
          <div style={{ background: message.includes("✅") ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: message.includes("✅") ? "#4ade80" : "#ef4444", padding: 16, borderRadius: 12, marginBottom: 20, textAlign: "center", fontWeight: 700 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="text" placeholder="Nom..." value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} required />
            <input type="text" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle} required />
          </div>
          
          <input type="email" placeholder="Email (@emsi.ma)..." value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Mot de passe..." value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <input type="text" placeholder="CNE (Code Massar)..." value={cne} onChange={(e) => setCne(e.target.value)} style={inputStyle} required />

          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>Qui êtes-vous ?</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="etudiant" style={{ background: "#0a1a0f" }}>🎓 Passager (Étudiant)</option>
            <option value="conducteur" style={{ background: "#0a1a0f" }}>🚗 Conducteur (Propriétaire du véhicule)</option>
          </select>

          {role === "conducteur" && (
            <div style={{ background: "rgba(74,222,128,.05)", padding: "20px", borderRadius: "16px", border: "0.5px dashed rgba(74,222,128,.3)", marginBottom: 15 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 10, textTransform: "uppercase" }}>📞 Numéro et Véhicule</label>
              <input type="tel" placeholder="Numéro de Téléphone (ex: 06...)" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={inputStyle} required={role === "conducteur"} />
              
              <div style={{ display: "flex", gap: 10 }}>
                <input type="text" placeholder="Marque (ex: Dacia)" value={marque} onChange={(e) => setMarque(e.target.value)} style={inputStyle} required={role === "conducteur"} />
                <input type="text" placeholder="Modèle (ex: Logan)" value={modele} onChange={(e) => setModele(e.target.value)} style={inputStyle} required={role === "conducteur"} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="text" placeholder="Matricule (ex: 12345-A-1)" value={matricule} onChange={(e) => setMatricule(e.target.value)} style={{...inputStyle, marginBottom: 0}} required={role === "conducteur"} />
                <input type="number" placeholder="Places (ex: 4)" value={places} onChange={(e) => setPlaces(e.target.value)} style={{...inputStyle, marginBottom: 0}} required={role === "conducteur"} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", borderRadius: 12, cursor: "pointer", marginTop: 10 }}>
            {loading ? "Création du compte en cours..." : "S'inscrire"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,.5)", fontSize: 14 }}>
          Vous avez déjà un compte ? <Link to="/" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 700 }}>Se connecter</Link>
        </p>
      </div>
      //
    </div>
  );
}

//