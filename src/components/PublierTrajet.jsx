import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function PublierTrajet() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [villes, setVilles] = useState([]);
  const [hays, setHays] = useState([]);
  const [campusList, setCampusList] = useState([]);

  const [selectedVille, setSelectedVille] = useState("");
  const [selectedHay, setSelectedHay] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  
  const [prix, setPrix] = useState("");
  const [places, setPlaces] = useState(4);
  const [dateDepart, setDateDepart] = useState("");
  const [typeTrajet, setTypeTrajet] = useState("aller");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "conducteur") {
      navigate("/");
      return;
    }
    axios.get("http://localhost:8081/api/villes/tous")
      .then(res => setVilles(res.data))
      .catch(err => console.error(err));
  }, [currentUser, navigate]);

  useEffect(() => {
    if (selectedVille) {
      axios.get(`http://localhost:8081/api/hays/ville/${selectedVille}`).then(res => setHays(res.data));
      axios.get(`http://localhost:8081/api/campus/ville/${selectedVille}`).then(res => setCampusList(res.data));
      setSelectedHay("");
      setSelectedCampus("");
    } else {
      setHays([]);
      setCampusList([]);
    }
  }, [selectedVille]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        conducteur: { id: currentUser.id },
        voiture: { id: 1 }, 
        hay: { id: selectedHay },
        campus: { id: selectedCampus },
        prixParPlace: prix,
        placesDisponibles: places,
        dateHeureDepart: dateDepart,
        typeTrajet: typeTrajet
      };

      await axios.post("http://localhost:8081/api/trajets/publier", payload);
      setMessage("✅ Trajet publié b naja7!");
      setTimeout(() => navigate("/mes-trajets"), 2000);
    } catch (err) {
      setMessage("❌ Erreur f publication dyal trajet.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,.04)",
    border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12,
    padding: "14px 16px", color: "#fff", fontFamily: "Outfit,sans-serif",
    fontSize: 14, outline: "none", transition: "all .2s"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <AnimatedBackground />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 600, background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)", borderRadius: 24, padding: "40px", backdropFilter: "blur(24px)" }}>
        
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Publier un <span style={{ color: "#4ade80" }}>Trajet</span> 🚗</h2>
        <p style={{ color: "rgba(255,255,255,.5)", marginBottom: 30 }}>3emmer l'm3loumat bach l'étudiants y-qelbou 3lik.</p>

        {message && (
          <div style={{ background: message.includes("✅") ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: message.includes("✅") ? "#4ade80" : "#ef4444", padding: 16, borderRadius: 12, marginBottom: 20, textAlign: "center", fontWeight: 700 }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>Type de Trajet</label>
              <select value={typeTrajet} onChange={(e) => setTypeTrajet(e.target.value)} style={inputStyle}>
                <option value="aller" style={{ background: "#0a1a0f" }}>Aller (Hay ➡️ Campus)</option>
                <option value="retour" style={{ background: "#0a1a0f" }}>Retour (Campus ➡️ Hay)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>🌍 Ville</label>
            <select value={selectedVille} onChange={(e) => setSelectedVille(e.target.value)} style={inputStyle} required>
              <option value="" style={{ background: "#0a1a0f" }}>-- Khtar l'Ville --</option>
              {villes.map(v => (
                <option key={v.id} value={v.id} style={{ background: "#0a1a0f" }}>{v.nom}</option>
              ))}
            </select>
          </div>

          {/* L'ASTUCE HIYA HADI: L'FLEX KAY-TGLB M3A L'CHOIX */}
          <div style={{ display: "flex", gap: "20px", flexDirection: typeTrajet === "aller" ? "row" : "row-reverse" }}>
            
            <div style={{ flex: 1 }}>
              {/* L'KTABA KAT-TBDEL */}
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>
                {typeTrajet === "aller" ? "📍 Mn (Hay)" : "📍 L' (Hay)"}
              </label>
              <select value={selectedHay} onChange={(e) => setSelectedHay(e.target.value)} style={inputStyle} required disabled={!selectedVille}>
                <option value="" style={{ background: "#0a1a0f" }}>{selectedVille ? "-- Khtar l'Hay --" : "Khtar Ville 9bel"}</option>
                {hays.map(h => (
                  <option key={h.id} value={h.id} style={{ background: "#0a1a0f" }}>{h.nom}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              {/* L'KTABA KAT-TBDEL */}
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>
                {typeTrajet === "aller" ? "🏫 L' (Campus)" : "🏫 Mn (Campus)"}
              </label>
              <select value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)} style={inputStyle} required disabled={!selectedVille}>
                <option value="" style={{ background: "#0a1a0f" }}>{selectedVille ? "-- Khtar Campus --" : "Khtar Ville 9bel"}</option>
                {campusList.map(c => (
                  <option key={c.id} value={c.id} style={{ background: "#0a1a0f" }}>{c.nom}</option>
                ))}
              </select>
            </div>

          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>💰 Prix (MAD)</label>
              <input type="number" min="0" value={prix} onChange={(e) => setPrix(e.target.value)} placeholder="Ex: 15" style={inputStyle} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>🪑 Places Dispo</label>
              <input type="number" min="1" max="6" value={places} onChange={(e) => setPlaces(e.target.value)} style={inputStyle} required />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(74,222,128,.8)", marginBottom: 8, textTransform: "uppercase" }}>🕒 Date w l'Weqt</label>
            <input type="datetime-local" value={dateDepart} onChange={(e) => setDateDepart(e.target.value)} style={{...inputStyle, colorScheme: "dark"}} required />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontSize: 16, fontWeight: 800, border: "none", borderRadius: 12, cursor: "pointer", marginTop: 10, boxShadow: "0 4px 20px rgba(34,197,94,.25)", transition: "all .2s", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Kan-sajlou l'Annonce..." : "🚀 Publier l'Trajet"}
          </button>

        </form>
      </div>
    </div>
  );
}