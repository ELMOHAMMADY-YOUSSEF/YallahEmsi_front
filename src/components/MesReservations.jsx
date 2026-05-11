import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🔥 STATE JDID DYAL L-MODAL DYAL L-ANNULATION 🔥
  const [cancelModal, setCancelModal] = useState({ isOpen: false, status: '', reservationId: null, message: '' });

  useEffect(() => {
    if (!currentUser || currentUser.role === "conducteur") {
      navigate("/trajets");
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/reservations/mes-reservations/${currentUser.id}`);
        const sortedData = res.data.sort((a, b) => b.id - a.id);
        setReservations(sortedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
      setLoading(false);
    };

    fetchReservations();
  }, [currentUser, navigate]);

  // --- LOGIQUE DYAL L-MODAL DYAL ANNULATION ---
  const demanderAnnulation = (id) => {
    setCancelModal({ isOpen: true, status: 'confirm', reservationId: id, message: '' });
  };

  const fermerModal = () => {
    setCancelModal({ isOpen: false, status: '', reservationId: null, message: '' });
  };

  const confirmerAnnulation = async () => {
    setCancelModal(prev => ({ ...prev, status: 'loading' }));
    try {
      const response = await axios.post(`http://localhost:8081/api/reservations/annuler/${cancelModal.reservationId}`);
      
      if (response.data.includes("✅")) {
        setCancelModal({ isOpen: true, status: 'success', message: response.data, reservationId: null });
        setTimeout(() => window.location.reload(), 2000); // Kan-tsnaw 2 tawanin w n-actualisiw
      } else {
        setCancelModal({ isOpen: true, status: 'error', message: response.data, reservationId: null });
      }
    } catch (error) {
      setCancelModal({ isOpen: true, status: 'error', message: "❌ Erreur de connexion au serveur.", reservationId: null });
      console.error(error);
    }
  };

  // Fonction bach n-jibou l'koulour dyal l'Statut
  const getStatusStyle = (statut) => {
    switch (statut) {
      case "confirmee":
        return { bg: "rgba(34,197,94,.15)", text: "#4ade80", border: "rgba(34,197,94,.3)", label: "✅ ACCEPTÉE" };
      case "annulee":
        return { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)", label: "❌ ANNULÉE" };
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

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a1a0f", display: "flex", justifyContent: "center", alignItems: "center", color: "#4ade80", fontSize: 20 }}>Chargement...</div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#0a1a0f", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      {/* STYLE DYAL BOUTONS DYAL MODAL */}
      <style>{`
        .btn-modal-cancel {
          padding: 12px 20px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
          color: #fff; border-radius: 12px; cursor: pointer; font-weight: 700; font-family: 'Outfit', sans-serif;
          transition: all 0.2s; flex: 1;
        }
        .btn-modal-cancel:hover { background: rgba(255,255,255,.1); }

        .btn-modal-confirm {
          padding: 12px 20px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444; border-radius: 12px; cursor: pointer; font-weight: 700; font-family: 'Outfit', sans-serif;
          transition: all 0.2s; flex: 1;
        }
        .btn-modal-confirm:hover { background: rgba(239, 68, 68, 0.9); color: #fff; }
      `}</style>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px", borderBottom: "0.5px solid rgba(255,255,255,.1)", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
              Mes <span style={{ color: "#4ade80" }}>Réservations</span> 🎟️
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Suivez l'état de vos demandes, {currentUser.prenom}</p>
          </div>

          <Link to="/trajets" style={{ padding: "10px 20px", background: "rgba(255,255,255,.05)", border: "0.5px solid rgba(255,255,255,.1)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, borderRadius: 12 }}>
            🔍 Chercher un autre trajet
          </Link>
        </div>

        {/* LISTE DES RÉSERVATIONS */}
        {reservations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "rgba(255,255,255,.02)", borderRadius: 24, border: "0.5px dashed rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16, marginBottom: 16 }}>Vous n'avez encore réservé aucun trajet.</p>
            <Link to="/trajets" style={{ color: "#4ade80", textDecoration: "none", fontWeight: 700 }}>Réserver un trajet →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {reservations.map(res => {
              const statusInfo = getStatusStyle(res.statutReservation);
              
              return (
                <div key={res.id} style={cardStyle} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
                  
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
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>📍</span> De : <span style={{ color: "#fff", fontWeight: 600 }}>{res.trajet?.typeTrajet?.toLowerCase() === 'aller' ? res.trajet?.hay?.nom : res.trajet?.campus?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🏫</span> Vers : <span style={{ color: "#fff", fontWeight: 600 }}>{res.trajet?.typeTrajet?.toLowerCase() === 'aller' ? res.trajet?.campus?.nom : res.trajet?.hay?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🕒</span> {new Date(res.trajet?.dateHeureDepart).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
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

                  {/* 🔥 BOUTON D'ANNULATION MODERNISÉ 🔥 */}
                  {res.statutReservation !== "annulee" && (
                    <button 
                      onClick={() => demanderAnnulation(res.id)}
                      style={{
                        marginTop: "8px", width: "100%", background: "transparent",
                        color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                        padding: "10px", borderRadius: "12px", cursor: "pointer",
                        fontWeight: "600", fontSize: "13px", fontFamily: "Outfit, sans-serif",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                    >
                      Annuler la réservation
                    </button>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================
          MODAL DYAL ANNULATION (Design Nadi 🔥)
          ========================================= */}
      {cancelModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "rgba(10,26,15,1)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            
            {cancelModal.status === 'confirm' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Annuler la réservation ?</h3>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, marginBottom: 24, lineHeight: "1.5" }}>
                  Êtes-vous sûr de vouloir annuler ? Si le trajet était déjà payé, le montant sera remboursé sur votre Wallet.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={fermerModal} className="btn-modal-cancel">Retour</button>
                  <button onClick={confirmerAnnulation} className="btn-modal-confirm">Oui, annuler</button>
                </div>
              </>
            )}

            {cancelModal.status === 'loading' && (
              <div style={{ padding: "30px 0", color: "#ef4444", fontWeight: 700, fontSize: 16 }}>Annulation en cours... ⏳</div>
            )}

            {cancelModal.status === 'success' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Succès !</h3>
                <p style={{ color: "#4ade80", fontSize: 14, marginBottom: 16 }}>{cancelModal.message}</p>
              </>
            )}

            {cancelModal.status === 'error' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Erreur !</h3>
                <p style={{ color: "#f87171", fontSize: 14, marginBottom: 24 }}>{cancelModal.message}</p>
                <button onClick={fermerModal} className="btn-modal-cancel" style={{ width: "100%" }}>Fermer</button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}