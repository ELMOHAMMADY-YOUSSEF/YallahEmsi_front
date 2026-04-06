import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function MesTrajets() {
  const [mesTrajets, setMesTrajets] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    try {
      const [resTrajets, resDemandes] = await Promise.all([
        axios.get(`http://localhost:8081/api/trajets/mes-trajets/${currentUser.id}`),
        axios.get(`http://localhost:8081/api/reservations/demandes/${currentUser.id}`)
      ]);
      setMesTrajets(resTrajets.data);
      setDemandes(resDemandes.data);
    } catch (error) {
      console.error("Mochkil bach n-jibou data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "conducteur") {
      navigate("/");
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  // Fonction bach y-Accepter
  const accepterDemande = async (reservationId) => {
    try {
      await axios.post(`http://localhost:8081/api/reservations/accepter/${reservationId}`);
      fetchData(); // N-jibou data jdida bach l'blays y-tnqssou
    } catch (err) { alert("Erreur f l'acceptation"); }
  };

  // Fonction bach y-Refuser
  const refuserDemande = async (reservationId) => {
    try {
      await axios.post(`http://localhost:8081/api/reservations/refuser/${reservationId}`);
      fetchData(); // N-jibou data jdida bach l'demande t-ghber
    } catch (err) { alert("Erreur f refus"); }
  };

  // --- STYLES INLINE (Dark Glassmorphism) ---
  const cardStyle = {
    background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)",
    borderRadius: 24, padding: "24px", backdropFilter: "blur(24px)",
    display: "flex", flexDirection: "column", gap: "16px",
    transition: "transform .2s, box-shadow .2s"
  };

  const demandeCardStyle = {
    background: "rgba(30,20,10,.8)", border: "1px solid rgba(249,115,22,.3)", // Limouni l'demandes
    borderRadius: 20, padding: "20px", backdropFilter: "blur(24px)",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a1a0f", display: "flex", justifyContent: "center", alignItems: "center", color: "#4ade80", fontSize: 20 }}>Kay-chargi...</div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px", borderBottom: "0.5px solid rgba(255,255,255,.1)", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
              Mes <span style={{ color: "#4ade80" }}>Trajets</span> 🚙
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Gérer les annonces w l'passagers dyalk a {currentUser.prenom}</p>
          </div>

          <Link to="/publier" style={{ padding: "10px 20px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, borderRadius: 12, boxShadow: "0 4px 20px rgba(34,197,94,.25)" }}>
            + Nouveau Trajet
          </Link>
        </div>

        {/* SECTION: DEMANDES EN ATTENTE */}
        {demandes.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f97316", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: "rgba(249,115,22,.15)", padding: "8px", borderRadius: "10px" }}>🔔</span> 
              {demandes.length} Demande(s) en attente
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "16px" }}>
              {demandes.map(demande => (
                <div key={demande.id} style={demandeCardStyle}>
                  <div>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>
                      {demande.passager?.nom} {demande.passager?.prenom}
                    </p>
                    {/* Hna sta3mlna placesReservees kima kayna f l'Entity dyalk */}
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "rgba(255,255,255,.6)" }}>
                      Bgha <span style={{ color: "#4ade80", fontWeight: 700 }}>{demande.placesReservees} blassa</span> f trajet {demande.trajet?.hay?.nom}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => refuserDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.15)", color: "#ef4444", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>❌</button>
                    <button onClick={() => accepterDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.15)", color: "#4ade80", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✅</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MES TRAJETS PUBLIÉS */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: "20px" }}>Historique dyal les annonces</h2>
        
        {mesTrajets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", background: "rgba(255,255,255,.02)", borderRadius: 24, border: "0.5px dashed rgba(255,255,255,.1)" }}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16 }}>Ba9i ma-publiyti 7ta trajet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {mesTrajets.map(trajet => (
              <div key={trajet.id} style={cardStyle}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ background: trajet.placesDisponibles === 0 ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.12)", color: trajet.placesDisponibles === 0 ? "#ef4444" : "#4ade80", border: `0.5px solid ${trajet.placesDisponibles === 0 ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.25)"}`, padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                    {trajet.placesDisponibles === 0 ? 'COMPLET' : 'EN COURS'}
                  </span>
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
                   <div style={{ textAlign: "center", width: "100%" }}>
                    <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px 0" }}>Blays khawyin</p>
                    <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>{trajet.placesDisponibles}</p>
                   </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}