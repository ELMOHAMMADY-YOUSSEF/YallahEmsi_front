import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Ila makanch m-connecté awla kan conducteur (Conducteur ma-kay-reservich)
    if (!currentUser || currentUser.role === "conducteur") {
      navigate("/trajets");
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/reservations/mes-reservations/${currentUser.id}`);
        // N-rttbouhom (L'jdad homa l'wala)
        const sortedData = res.data.sort((a, b) => b.id - a.id);
        setReservations(sortedData);
      } catch (error) {
        console.error("Mochkil bach n-jibou les réservations", error);
      }
      setLoading(false);
    };

    fetchReservations();
  }, [currentUser, navigate]);

  // Fonction bach n-jibou l'koulour dyal l'Statut
  const getStatusStyle = (statut) => {
    switch (statut) {
      case "confirmee":
        return { bg: "rgba(34,197,94,.15)", text: "#4ade80", border: "rgba(34,197,94,.3)", label: "✅ ACCEPTÉE" };
      case "annulee":
        return { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)", label: "❌ REFUSÉE" };
      default: // en_attente
        return { bg: "rgba(249,115,22,.15)", text: "#f97316", border: "rgba(249,115,22,.3)", label: "⏳ EN ATTENTE" };
    }
  };

  const cardStyle = {
    background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)",
    borderRadius: 24, padding: "24px", backdropFilter: "blur(24px)",
    display: "flex", flexDirection: "column", gap: "16px",
    transition: "transform .2s, box-shadow .2s"
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a1a0f", display: "flex", justifyContent: "center", alignItems: "center", color: "#4ade80", fontSize: 20 }}>Kay-chargi...</div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px", borderBottom: "0.5px solid rgba(255,255,255,.1)", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
              Mes <span style={{ color: "#4ade80" }}>Réservations</span> 🎟️
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Tbe3 l'état dyal t-talabat dyalk a {currentUser.prenom}</p>
          </div>

          <Link to="/trajets" style={{ padding: "10px 20px", background: "rgba(255,255,255,.05)", border: "0.5px solid rgba(255,255,255,.1)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, borderRadius: 12 }}>
            🔍 Qleb 3la trajet akhor
          </Link>
        </div>

        {/* LISTE DES RÉSERVATIONS */}
        {reservations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(255,255,255,.02)", borderRadius: 24, border: "0.5px dashed rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16, marginBottom: 16 }}>Ba9i ma-reserviyti f 7ta trajet.</p>
            <Link to="/trajets" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 700 }}>Bda l'qssim daba →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {reservations.map(res => {
              const statusInfo = getStatusStyle(res.statutReservation);
              
              return (
                <div key={res.id} style={cardStyle}>
                  
                  {/* BADGE STATUT W PRIX */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ background: statusInfo.bg, color: statusInfo.text, border: `0.5px solid ${statusInfo.border}`, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.5px" }}>
                      {statusInfo.label}
                    </span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0 }}>{res.montantTotal} <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)" }}>MAD</span></p>
                    </div>
                  </div>

                  {/* ITINÉRAIRE */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>📍</span> Mn: <span style={{ color: "#fff", fontWeight: 600 }}>{res.trajet?.hay?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🏫</span> L': <span style={{ color: "#fff", fontWeight: 600 }}>{res.trajet?.campus?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🕒</span> {new Date(res.trajet?.dateHeureDepart).toLocaleString('fr-FR')}</div>
                  </div>

                  <div style={{ height: "0.5px", background: "rgba(255,255,255,.1)", margin: "8px 0" }} />

                  {/* CONDUCTEUR W PLACES */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>
                        {res.trajet?.conducteur?.nom?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{res.trajet?.conducteur?.nom}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,.4)" }}>Conducteur</p>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px 0" }}>Places</p>
                      <p style={{ color: "#4ade80", fontSize: 18, fontWeight: 800, margin: 0 }}>{res.placesReservees}</p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}