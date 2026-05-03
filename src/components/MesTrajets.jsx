import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import ChatModal from "./Chat"; // 👈 IMPORT DYAL L-CHAT (T2akked blli smit l-fichier hiya hadi 3ndk)

export default function MesTrajets() {
  const [mesTrajets, setMesTrajets] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // --- STATES DYAL L-CHAT W L-CONTACTS ---
  const [chatConfig, setChatConfig] = useState({ isOpen: false, trajetId: null, destinataire: null });
  const [contactsModal, setContactsModal] = useState({ isOpen: false, trajetId: null, contacts: [], loading: false });

  const fetchData = async () => {
    try {
      const [resTrajets, resDemandes] = await Promise.all([
        axios.get(`http://localhost:8081/api/trajets/mes-trajets/${currentUser.id}`),
        axios.get(`http://localhost:8081/api/reservations/demandes/${currentUser.id}`)
      ]);
      setMesTrajets(resTrajets.data);
      setDemandes(resDemandes.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données", error);
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
    } catch (err) { alert("Erreur lors de l'acceptation"); }
  };

  // Fonction bach y-Refuser
  const refuserDemande = async (reservationId) => {
    try {
      await axios.post(`http://localhost:8081/api/reservations/refuser/${reservationId}`);
      fetchData(); // N-jibou data jdida bach l'demande t-ghber
    } catch (err) { alert("Erreur lors du refus"); }
  };

  // --- LOGIQUE DYAL L-MESSAGES ---
  const ouvrirContacts = async (trajetId) => {
    setContactsModal({ isOpen: true, trajetId, contacts: [], loading: true });
    try {
      const res = await axios.get(`http://localhost:8081/api/messages/contacts/${trajetId}/${currentUser.id}`);
      setContactsModal({ isOpen: true, trajetId, contacts: res.data, loading: false });
    } catch (error) {
      console.error("Erreur récupération contacts", error);
      setContactsModal(prev => ({ ...prev, loading: false }));
    }
  };

  const fermerContacts = () => setContactsModal({ isOpen: false, trajetId: null, contacts: [], loading: false });

  const ouvrirChat = (trajetId, destinataire) => {
    setChatConfig({ isOpen: true, trajetId, destinataire });
    fermerContacts(); // Kan-seddou liste dyal contacts mli kay-t7el l-chat
  };

  // --- STYLES INLINE (Dark Glassmorphism) ---
  const cardStyle = {
    background: "rgba(8,22,12,.8)", border: "0.5px solid rgba(74,222,128,.15)",
    borderRadius: 24, padding: "24px", backdropFilter: "blur(24px)",
    display: "flex", flexDirection: "column", gap: "16px",
    transition: "transform .2s, box-shadow .2s"
  };

  const demandeCardStyle = {
    background: "rgba(30,20,10,.8)", border: "1px solid rgba(249,115,22,.3)", 
    borderRadius: 20, padding: "20px", backdropFilter: "blur(24px)",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#0a1a0f", display: "flex", justifyContent: "center", alignItems: "center", color: "#4ade80", fontSize: 20 }}>Chargement...</div>;

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
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 4 }}>Gérez vos annonces et passagers, {currentUser.prenom}</p>
          </div>

          <Link to="/publier" style={{ padding: "10px 20px", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700, borderRadius: 12, boxShadow: "0 4px 20px rgba(34,197,94,.25)", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
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
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "rgba(255,255,255,.6)" }}>
                      A demandé <span style={{ color: "#4ade80", fontWeight: 700 }}>{demande.placesReservees} place(s)</span> pour {demande.trajet?.hay?.nom}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* BOUTON CHAT F DEMANDE */}
                    <button onClick={() => ouvrirChat(demande.trajet?.id, demande.passager)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(59,130,246,.3)", background: "rgba(59,130,246,.15)", color: "#60a5fa", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(59,130,246,.3)"} onMouseOut={e=>e.currentTarget.style.background="rgba(59,130,246,.15)"} title="Contacter">💬</button>
                    {/* BOUTON REFUSER */}
                    <button onClick={() => refuserDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.15)", color: "#ef4444", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.3)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239,68,68,.15)"} title="Refuser">❌</button>
                    {/* BOUTON ACCEPTER */}
                    <button onClick={() => accepterDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.15)", color: "#4ade80", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(34,197,94,.3)"} onMouseOut={e=>e.currentTarget.style.background="rgba(34,197,94,.15)"} title="Accepter">✅</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MES TRAJETS PUBLIÉS */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: "20px" }}>Historique de vos annonces</h2>
        
        {mesTrajets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", background: "rgba(255,255,255,.02)", borderRadius: 24, border: "0.5px dashed rgba(255,255,255,.1)" }}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 16 }}>Vous n'avez encore publié aucun trajet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {mesTrajets.map(trajet => {
              
              const dateTrajet = new Date(trajet.dateHeureDepart);
              const dateDaba = new Date();
              const isTermine = dateTrajet < dateDaba; 

              let badgeStyle = {};
              let badgeText = "";

              if (isTermine) {
                badgeStyle = { bg: "rgba(255,255,255,.1)", text: "rgba(255,255,255,.5)", border: "rgba(255,255,255,.2)" };
                badgeText = "TERMINÉ";
              } else if (trajet.placesDisponibles === 0) {
                badgeStyle = { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)" };
                badgeText = "COMPLET";
              } else {
                badgeStyle = { bg: "rgba(34,197,94,.12)", text: "#4ade80", border: "rgba(34,197,94,.25)" };
                badgeText = "EN COURS";
              }

              return (
                <div key={trajet.id} style={cardStyle} onMouseOver={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ 
                      background: badgeStyle.bg, color: badgeStyle.text, 
                      border: `0.5px solid ${badgeStyle.border}`, 
                      padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "uppercase" 
                    }}>
                      {badgeText}
                    </span>
                    <div style={{ textAlign: "right", opacity: isTermine ? 0.5 : 1 }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: "#4ade80", margin: 0 }}>{trajet.prixParPlace} <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,.3)" }}>MAD</span></p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", opacity: isTermine ? 0.5 : 1 }}>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>📍</span> De : <span style={{ color: "#fff", fontWeight: 600 }}>{trajet.hay?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🏫</span> Vers : <span style={{ color: "#fff", fontWeight: 600 }}>{trajet.campus?.nom}</span></div>
                    <div style={{ color: "rgba(255,255,255,.7)", fontSize: 14 }}><span style={{ color: "#4ade80", marginRight: 8 }}>🕒</span> {new Date(trajet.dateHeureDepart).toLocaleString('fr-FR')}</div>
                  </div>

                  <div style={{ height: "0.5px", background: "rgba(255,255,255,.1)", margin: "8px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isTermine ? 0.5 : 1 }}>
                     <div style={{ textAlign: "center", width: "100%" }}>
                      <p style={{ color: "rgba(255,255,255,.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px 0" }}>Places disponibles</p>
                      <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>{trajet.placesDisponibles}</p>
                     </div>
                  </div>

                  {/* BOUTON MESSAGES JDID F L'CARTE 💬 */}
                  <div style={{ marginTop: 8 }}>
                    <button 
                      onClick={() => ouvrirContacts(trajet.id)} 
                      style={{ width: "100%", padding: "10px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "12px", color: "#60a5fa", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.2s" }} 
                      onMouseOver={e => {e.currentTarget.style.background = "rgba(59,130,246,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"}} 
                      onMouseOut={e => {e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.transform = "translateY(0)"}}
                    >
                      <span style={{ fontSize: 16 }}>💬</span> Boîte de réception
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================
          MODAL: LISTE DES CONTACTS (Boîte de réception)
          ========================================= */}
      {contactsModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "rgba(10,26,15,1)", border: "1px solid rgba(59,130,246,.3)", borderRadius: 24, padding: 24, width: "100%", maxWidth: 400, position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            
            <button onClick={fermerContacts} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.05)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}>✖</button>
            
            <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "rgba(59,130,246,0.15)", padding: "8px", borderRadius: "10px" }}>💬</span> Messages reçus
            </h3>

            {contactsModal.loading ? (
              <p style={{ color: "#60a5fa", textAlign: "center", fontWeight: 600, padding: "20px 0" }}>Chargement... ⏳</p>
            ) : contactsModal.contacts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", background: "rgba(255,255,255,.02)", borderRadius: 16 }}>
                <p style={{ color: "rgba(255,255,255,.4)", margin: 0, fontSize: 14 }}>Aucun étudiant ne vous a contacté pour ce trajet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                {contactsModal.contacts.map(contact => (
                  <div key={contact.id} onClick={() => ouvrirChat(contactsModal.trajetId, contact)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(59,130,246,.15)"} onMouseOut={e => e.currentTarget.style.background="rgba(255,255,255,.03)"}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>
                      {contact.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15 }}>{contact.nom} {contact.prenom}</p>
                      <p style={{ margin: "2px 0 0 0", color: "#60a5fa", fontSize: 12, fontWeight: 600 }}>Cliquez pour répondre ➔</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          MODAL: LA CONVERSATION DE CHAT 💬
          ========================================= */}
      {chatConfig.isOpen && (
        <ChatModal 
          trajetId={chatConfig.trajetId} 
          currentUser={currentUser} 
          destinataire={chatConfig.destinataire} 
          onClose={() => setChatConfig({ isOpen: false, trajetId: null, destinataire: null })} 
        />
      )}

    </div>
  );
}