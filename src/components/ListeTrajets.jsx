import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground"; // Import dyalk l'asli

export default function ListeTrajets() {
  const navigate = useNavigate();
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isConducteur = currentUser?.role === "conducteur";

  const [modal, setModal] = useState({
    isOpen: false,
    trajetId: null,
    status: 'confirm',
    message: ''
  });

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/trajets/tous");
        setTrajets(response.data);
        setLoading(false);
      } catch (error) {
        setErreur("Mochkil f l'itissal m3a l'serveur.");
        setLoading(false);
      }
    };
    fetchTrajets();
  }, []);

  const ouvrirModal = (trajetId) => {
    setModal({ isOpen: true, trajetId: trajetId, status: 'confirm', message: '' });
  };

  const confirmerReservation = async () => {
    setModal({ ...modal, status: 'loading' });
    const passagerId = currentUser.id;
    const places = 1;

    try {
      const response = await axios.post(`http://localhost:8081/api/reservations/nouvelle?passagerId=${passagerId}&trajetId=${modal.trajetId}&places=${places}`);
      
      if(response.data.includes("Mabrouk")) {
        setModal({ ...modal, status: 'success', message: response.data });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setModal({ ...modal, status: 'error', message: response.data });
      }
    } catch (error) {
      setModal({ ...modal, status: 'error', message: "Erreur f l'itissal m3a l'serveur!" });
    }
  };

  const fermerModal = () => setModal({ ...modal, isOpen: false });

  // Filtrage bl barre de recherche
  const trajetsFiltres = trajets.filter(trajet => {
    const motCle = recherche.toLowerCase();
    const hayNom = trajet.hay?.nom?.toLowerCase() || "";
    const campusNom = trajet.campus?.nom?.toLowerCase() || "";
    return hayNom.includes(motCle) || campusNom.includes(motCle);
  });

  // --- STYLES INLINE (Bhal d-design dyalk) ---
  const inputStyle = {
    width: "100%", maxWidth: "300px", background: "rgba(255,255,255,.04)",
    border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12,
    padding: "11px 14px", color: "#fff", fontFamily: "Outfit,sans-serif",
    fontSize: 13, outline: "none", transition: "all .2s"
  };

  const cardStyle = {
    background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)",
    borderRadius: 24, padding: "24px", backdropFilter: "blur(24px)",
    display: "flex", flexDirection: "column", gap: "16px",
    transition: "transform .2s, box-shadow .2s"
  };

  const badgeStyle = {
    background: "rgba(34,197,94,.12)", color: "#4ade80", border: "0.5px solid rgba(34,197,94,.25)",
    padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px"
  };

  const btnPrimary = {
    padding: "10px 20px", background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: 13, fontWeight: 700,
    border: "none", borderRadius: 12, cursor: "pointer", boxShadow: "0 4px 20px rgba(34,197,94,.25)",
    transition: "all .25s"
  };

  const btnDisabled = {
    ...btnPrimary, background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.3)", 
    boxShadow: "none", cursor: "not-allowed", border: "0.5px solid rgba(255,255,255,.1)"
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
              Trajets <span style={{ color: "#4ade80" }}>Disponibles</span> 
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Chof m3amen ghadi t-mchi l'EMSI lyoum</p>
          </div>

          {isConducteur ? (
            <button onClick={() => navigate("/publier")} style={btnPrimary} onMouseOver={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}>
              + Publier Trajet
            </button>
          ) : (
            <input 
              type="text" 
              placeholder="🔍 Qleb 3la Hay awla Campus..." 
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={inputStyle}
              onFocus={e => {e.currentTarget.style.borderColor = "rgba(74,222,128,.5)"; e.currentTarget.style.background = "rgba(74,222,128,.06)";}}
              onBlur={e => {e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.04)";}}
            />
          )}
        </div>

        {/* LOADING & ERROR */}
        {loading && <p style={{ color: "#4ade80", textAlign: "center", fontSize: 16 }}>Kay-jbed les trajets...</p>}
        {erreur && <p style={{ background: "rgba(239,68,68,.1)", color: "#f87171", border: "0.5px solid rgba(239,68,68,.2)", padding: 16, borderRadius: 12, textAlign: "center", fontSize: 14 }}>{erreur}</p>}

        {/* GRID TRAJETS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {trajetsFiltres.length === 0 && !loading && !erreur ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16 }}>Makayn 7ta trajet b had l'mowassafat 😕</p>
            </div>
          ) : (
            trajetsFiltres.map((trajet) => (
              <div key={trajet.id} style={cardStyle} onMouseOver={e => e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e => e.currentTarget.style.transform="translateY(0)"}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={badgeStyle}>{trajet.typeTrajet}</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#4ade80", margin: 0 }}>{trajet.prixParPlace} <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)" }}>MAD</span></p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>📍</span> Mn: <span style={{ color: "#fff", fontWeight: 600 }}>{trajet.hay?.nom}</span></div>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🏫</span> L': <span style={{ color: "#fff", fontWeight: 600 }}>{trajet.campus?.nom}</span></div>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🕒</span> {new Date(trajet.dateHeureDepart).toLocaleString('fr-FR')}</div>
                </div>

                <div style={{ height: "0.5px", background: "rgba(255,255,255,.1)", margin: "8px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(74,222,128,.15)", border: "0.5px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", fontWeight: 800, fontSize: 16 }}>
                      {trajet.conducteur?.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{trajet.conducteur?.nom}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.4)" }}>{trajet.voiture?.marque} {trajet.voiture?.modele}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => ouvrirModal(trajet.id)}
                    disabled={trajet.placesDisponibles === 0 || isConducteur}
                    style={trajet.placesDisponibles === 0 || isConducteur ? btnDisabled : btnPrimary}
                    onMouseOver={e => { if(trajet.placesDisponibles > 0 && !isConducteur) e.currentTarget.style.transform="translateY(-2px)" }}
                    onMouseOut={e => { if(trajet.placesDisponibles > 0 && !isConducteur) e.currentTarget.style.transform="translateY(0)" }}
                  >
                    {trajet.placesDisponibles === 0 ? 'Complet' : (isConducteur ? 'Trajet' : `Réserver (${trajet.placesDisponibles})`)}
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DYAL RÉSERVATION B DESIGN DARK */}
      {modal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "rgba(8,22,12,.95)", border: "0.5px solid rgba(74,222,128,.3)", borderRadius: 24, padding: 30, width: "100%", maxWidth: 360, textAlign: "center" }}>
            
            {modal.status === 'confirm' && (
              <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>❓</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ta2kid l'Réservation</h3>
                <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, marginBottom: 24 }}>Wach m2akked bghiti t-reservi blassa f had l'trajet?</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={fermerModal} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,.05)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", cursor: "pointer" }}>La, 7bess</button>
                  <button onClick={confirmerReservation} style={{ flex: 1, ...btnPrimary }}>Ah, N-reservi</button>
                </div>
              </>
            )}

            {modal.status === 'loading' && (
              <div style={{ padding: "20px 0", color: "#4ade80", fontWeight: 600 }}>Kan-ssjlou l'réservation... ⏳</div>
            )}

            {modal.status === 'success' && (
              <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Nadi!</h3>
                <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 16 }}>{modal.message}</p>
              </>
            )}

            {modal.status === 'error' && (
              <>
                <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Mochkil!</h3>
                <p style={{ color: "#f87171", fontSize: 13, marginBottom: 24 }}>{modal.message}</p>
                <button onClick={fermerModal} style={{ width: "100%", padding: "10px", background: "rgba(255,255,255,.05)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12, color: "#fff", cursor: "pointer" }}>Sedd</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}