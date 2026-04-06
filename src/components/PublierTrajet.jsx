import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function PublierTrajet() {
  const navigate = useNavigate();
  
  const [hays, setHays] = useState([]);
  const [campus, setCampus] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    typeTrajet: "aller",
    dateHeureDepart: "",
    prixParPlace: 10,
    placesDisponibles: 1,
    hayId: "",
    campusId: "",
  });
  
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHays, resCampus] = await Promise.all([
          axios.get("http://localhost:8081/api/hays/tous"),
          axios.get("http://localhost:8081/api/campus/tous")
        ]);
        
        setHays(resHays.data);
        setCampus(resCampus.data);
        
        if(resHays.data.length > 0 && resCampus.data.length > 0) {
           setFormData(prev => ({
             ...prev, 
             hayId: resHays.data[0].id, 
             campusId: resCampus.data[0].id
           }));
        }
        setLoadingData(false);
      } catch (error) {
        // HNA KAN-CHEDDOU L'ERREUR DYAL SERVEUR TAYE7
        console.error("Mochkil bach y-jbed les quartiers w les campus", error);
        setMessage("⚠️ Erreur de connexion m3a l'serveur. Ma-qdrnach n-jibou les Quartiers w Campus.");
        setIsError(true);
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ila kant l'liste khawya (Serveur taye7), ma-nkhlliwch y-ssift l'formulaire
    if (hays.length === 0 || campus.length === 0) {
      setMessage("⚠️ Ma-tqderch t-publier trajet 7it serveur taye7!");
      setIsError(true);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) { alert("Khassk t-connecta!"); return; }
    
    const payload = {
      typeTrajet: formData.typeTrajet,
      dateHeureDepart: formData.dateHeureDepart,
      prixParPlace: parseInt(formData.prixParPlace),
      placesDisponibles: parseInt(formData.placesDisponibles),
      conducteur: { id: currentUser.id }, 
      voiture: { id: 1 }, 
      hay: { id: parseInt(formData.hayId) },
      campus: { id: parseInt(formData.campusId) }
    };

    try {
      const res = await axios.post("http://localhost:8081/api/trajets/publier", payload);
      setMessage(res.data);
      setIsError(res.data.includes("Erreur"));
      if (res.data.includes("Mabrouk")) setTimeout(() => navigate("/trajets"), 2000);
    } catch {
      setMessage("Mochkil f l'itissal m3a l'serveur.");
      setIsError(true);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,.04)",
    border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12,
    padding: "11px 14px", color: "#fff", fontFamily: "Outfit,sans-serif",
    fontSize: 13, outline: "none",
  };
  const labelStyle = { fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500, display: "block", marginBottom: 6 };
  const sectionLabel = {
    fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase",
    color: "rgba(74,222,128,.6)", marginBottom: 10, display: "block",
  };

  if (loadingData) return <div style={{ minHeight: "100vh", background: "#0a1a0f", display: "flex", justifyContent: "center", alignItems: "center", color: "#4ade80", fontSize: 20 }}>Kay-chargi l'm3loumat mn l'Base de données...</div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <AnimatedBackground />

      <div style={{
        position: "relative", zIndex: 10, width: "100%", maxWidth: 480,
        background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)",
        borderRadius: 24, padding: "36px 32px", backdropFilter: "blur(24px)",
        animation: "slideUp .6s cubic-bezier(.16,1,.3,1) both",
      }}>
        <style>{`
          @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
          @keyframes iconPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
          input:focus,select:focus{border-color:rgba(74,222,128,.5)!important;background:rgba(74,222,128,.06)!important;box-shadow:0 0 0 3px rgba(74,222,128,.08)!important}
          select option{background:#0d2015;color:#fff}
          select:disabled{opacity: 0.5; cursor: not-allowed;} /* Style mli kaykoun select blocké */
          input[type=datetime-local]::-webkit-calendar-picker-indicator{filter:invert(.4)}
        `}</style>

        {/* Icon */}
        <div style={{ width: 52, height: 52, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.25)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "iconPop .5s .2s cubic-bezier(.34,1.56,.64,1) both" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
            <rect x="9" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-.3px" }}>
          Publier un <span style={{ color: "#4ade80" }}>trajet</span>
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.35)", textAlign: "center", marginTop: 6, fontWeight: 300 }}>
          Wessel m3ak wlad l'école w dber f mssirif
        </p>

        <div style={{ height: "0.5px", background: "linear-gradient(90deg,transparent,rgba(74,222,128,.25),transparent)", margin: "24px 0" }} />

        {/* MESSAGE D'ERREUR */}
        {message && (
          <div style={{
            padding: "12px 16px", borderRadius: 12, textAlign: "center", fontSize: 13, fontWeight: 500, marginBottom: 20,
            background: isError ? "rgba(239,68,68,.1)" : "rgba(34,197,94,.1)",
            color: isError ? "#f87171" : "#4ade80",
            border: `0.5px solid ${isError ? "rgba(239,68,68,.2)" : "rgba(34,197,94,.2)"}`,
          }}>{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Type Toggle */}
          <span style={sectionLabel}>Direction</span>
          <div style={{ display: "flex", background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 16 }}>
            {[["aller","Dar → EMSI"],["retour","EMSI → Dar"]].map(([val,label]) => (
              <button key={val} type="button" onClick={() => setFormData({...formData, typeTrajet: val})}
                style={{
                  flex: 1, padding: "9px", borderRadius: 9, border: formData.typeTrajet === val ? "0.5px solid rgba(74,222,128,.3)" : "none",
                  background: formData.typeTrajet === val ? "rgba(74,222,128,.18)" : "transparent",
                  color: formData.typeTrajet === val ? "#4ade80" : "rgba(255,255,255,.4)",
                  fontFamily: "Outfit,sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                }}>{label}</button>
            ))}
          </div>

          {/* Itinéraire Dynamique (M-sskoub b Les Erreurs) */}
          <span style={sectionLabel}>Itinéraire</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            
            {formData.typeTrajet === "aller" ? (
              <>
                <div>
                  <label style={labelStyle}>Secteur de départ</label>
                  <select name="hayId" value={formData.hayId} onChange={handleChange} style={inputStyle} disabled={hays.length === 0}>
                    {hays.length === 0 ? <option value="">-- Err: Khawi --</option> : hays.map(h => <option key={h.id} value={h.id}>{h.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Campus d'arrivée</label>
                  <select name="campusId" value={formData.campusId} onChange={handleChange} style={inputStyle} disabled={campus.length === 0}>
                    {campus.length === 0 ? <option value="">-- Err: Khawi --</option> : campus.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>Campus de départ</label>
                  <select name="campusId" value={formData.campusId} onChange={handleChange} style={inputStyle} disabled={campus.length === 0}>
                    {campus.length === 0 ? <option value="">-- Err: Khawi --</option> : campus.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Secteur d'arrivée</label>
                  <select name="hayId" value={formData.hayId} onChange={handleChange} style={inputStyle} disabled={hays.length === 0}>
                    {hays.length === 0 ? <option value="">-- Err: Khawi --</option> : hays.map(h => <option key={h.id} value={h.id}>{h.nom}</option>)}
                  </select>
                </div>
              </>
            )}

          </div>

          {/* Date */}
          <span style={sectionLabel}>Horaire</span>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Date & heure de départ</label>
            <input type="datetime-local" name="dateHeureDepart" value={formData.dateHeureDepart} onChange={handleChange} required style={inputStyle}/>
          </div>

          {/* Prix */}
          <span style={sectionLabel}>Tarif par place</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,.04)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>{formData.prixParPlace} <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.3)" }}>MAD</span></span>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.25)", marginTop: 2 }}>par passager</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[[-5,"−"],[5,"+"]].map(([d,lbl]) => (
                <button key={d} type="button"
                  onClick={() => setFormData({...formData, prixParPlace: Math.max(0, +formData.prixParPlace + d)})}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "0.5px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit,sans-serif" }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Places */}
          <span style={sectionLabel}>Places disponibles</span>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[1,2,3,4].map(n => (
              <button key={n} type="button"
                onClick={() => setFormData({...formData, placesDisponibles: n})}
                style={{
                  width: 44, height: 44, borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s", fontFamily: "Outfit,sans-serif",
                  border: formData.placesDisponibles == n ? "0.5px solid rgba(74,222,128,.4)" : "0.5px solid rgba(255,255,255,.12)",
                  background: formData.placesDisponibles == n ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.04)",
                  color: formData.placesDisponibles == n ? "#4ade80" : "rgba(255,255,255,.4)",
                  boxShadow: formData.placesDisponibles == n ? "0 0 12px rgba(74,222,128,.12)" : "none",
                }}>{n}</button>
            ))}
          </div>

          <button type="submit" 
            disabled={hays.length === 0 || campus.length === 0}
            style={{
            width: "100%", padding: 14, background: (hays.length === 0 || campus.length === 0) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#22c55e,#16a34a)",
            color: (hays.length === 0 || campus.length === 0) ? "rgba(255,255,255,0.3)" : "#fff", 
            fontFamily: "Outfit,sans-serif", fontSize: 14, fontWeight: 700,
            border: "none", borderRadius: 14, cursor: (hays.length === 0 || campus.length === 0) ? "not-allowed" : "pointer", letterSpacing: ".2px",
            boxShadow: (hays.length === 0 || campus.length === 0) ? "none" : "0 4px 20px rgba(34,197,94,.25)", transition: "all .25s",
          }}
            onMouseOver={e => { if(hays.length > 0) e.currentTarget.style.transform="translateY(-2px)" }}
            onMouseOut={e => { if(hays.length > 0) e.currentTarget.style.transform="translateY(0)" }}
          >
            Publier daba →
          </button>

          <p onClick={() => navigate("/trajets")} style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "rgba(255,255,255,.3)", cursor: "pointer" }}>
            ← Retour aux trajets
          </p>
        </form>
      </div>
    </div>
  );
}