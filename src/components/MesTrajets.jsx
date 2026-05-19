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
  
  // 🔥 1. ZEDT STATE DYAL PASSAGERS HNA 🔥
  const [passagersModal, setPassagersModal] = useState({ isOpen: false, trajet: null, reservations: [], loading: false });

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

  // Fonction bach n-msse7ou trajet
  const supprimerTrajet = async (trajetId) => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      try {
        const response = await axios.delete(`http://localhost:8081/api/trajets/supprimer/${trajetId}`);
        if (response.data.includes("✅")) {
          alert(response.data);
          window.location.reload(); 
        } else {
          alert(response.data); 
        }
      } catch (error) {
        alert("❌ Erreur de connexion au serveur.");
        console.error(error);
      }
    }
  };

  // Fonction bach y-Accepter
  const accepterDemande = async (reservationId) => {
    try {
      await axios.post(`http://localhost:8081/api/reservations/accepter/${reservationId}`);
      fetchData(); 
    } catch (err) { alert("Erreur lors de l'acceptation"); }
  };

  // Fonction bach y-Refuser
  const refuserDemande = async (reservationId) => {
    try {
      await axios.post(`http://localhost:8081/api/reservations/refuser/${reservationId}`);
      fetchData(); 
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
    fermerContacts(); 
  };

  // 🔥 2. ZEDT FONCTION BACH N-JIBOU PASSAGERS 🔥
  const ouvrirPassagers = async (trajet) => {
    setPassagersModal({ isOpen: true, trajet: trajet, reservations: [], loading: true });
    try {
      const response = await axios.get(`http://localhost:8081/api/reservations/trajet/${trajet.id}`);
      setPassagersModal({ isOpen: true, trajet: trajet, reservations: response.data, loading: false });
    } catch (error) {
      console.error("Erreur lors de la récupération des passagers", error);
      setPassagersModal(prev => ({ ...prev, loading: false }));
    }
  };

  const fermerPassagers = () => setPassagersModal({ isOpen: false, trajet: null, reservations: [], loading: false });

  // --- STYLES INLINE (Dark Glassmorphism) ---
  const cardStyle = {
    background: "rgba(255,255,255,.94)", border: "0.5px solid rgba(0,132,61,.14)",
    borderRadius: 24, padding: "24px", backdropFilter: "blur(24px)",
    display: "flex", flexDirection: "column", gap: "16px",
    transition: "transform .2s, box-shadow .2s"
  };

  const demandeCardStyle = {
    background: "rgba(255,255,255,.96)", border: "1px solid rgba(249,115,22,.3)", 
    borderRadius: 20, padding: "20px", backdropFilter: "blur(24px)",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#f6fbf7", display: "flex", justifyContent: "center", alignItems: "center", color: "#00843d", fontSize: 20 }}>Chargement...</div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#f6fbf7", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "40px", borderBottom: "0.5px solid rgba(0,132,61,.12)", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#12351f", margin: 0, letterSpacing: "-0.5px" }}>
              Mes <span style={{ color: "#00843d" }}>Trajets</span> 
            </h1>
            <p style={{ fontSize: 14, color: "rgba(18,53,31,.45)", marginTop: 4 }}>Gérez vos annonces et passagers, {currentUser.prenom}</p>
          </div>

          <Link to="/publier" style={{ padding: "10px 20px", background: "linear-gradient(135deg,#009846,#007a33)", color: "#ffffff", textDecoration: "none", fontSize: 13, fontWeight: 700, borderRadius: 12, boxShadow: "0 4px 20px rgba(0,132,61,.28)", transition: "transform 0.2s" }} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
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
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#12351f" }}>
                      {demande.passager?.nom} {demande.passager?.prenom}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "rgba(18,53,31,.62)" }}>
                      A demandé <span style={{ color: "#00843d", fontWeight: 700 }}>{demande.placesReservees} place(s)</span> pour {demande.trajet?.hay?.nom}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => ouvrirChat(demande.trajet?.id, demande.passager)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(59,130,246,.3)", background: "rgba(59,130,246,.15)", color: "#60a5fa", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(59,130,246,.3)"} onMouseOut={e=>e.currentTarget.style.background="rgba(59,130,246,.15)"} title="Contacter">💬</button>
                    <button onClick={() => refuserDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.15)", color: "#ef4444", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.3)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239,68,68,.15)"} title="Refuser">❌</button>
                    <button onClick={() => accepterDemande(demande.id)} style={{ width: 40, height: 40, borderRadius: 12, border: "0.5px solid rgba(0,132,61,.28)", background: "rgba(0,132,61,.14)", color: "#00843d", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(0,132,61,.28)"} onMouseOut={e=>e.currentTarget.style.background="rgba(0,132,61,.14)"} title="Accepter">✅</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: MES TRAJETS PUBLIÉS */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#12351f", marginBottom: "20px" }}>Historique de vos annonces</h2>
        
        {mesTrajets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", background: "rgba(0,132,61,.035)", borderRadius: 24, border: "0.5px dashed rgba(0,132,61,.12)" }}>
            <p style={{ color: "rgba(18,53,31,.45)", fontSize: 16 }}>Vous n'avez encore publié aucun trajet.</p>
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
                badgeStyle = { bg: "rgba(0,132,61,.12)", text: "rgba(18,53,31,.55)", border: "rgba(0,132,61,.22)" };
                badgeText = "TERMINÉ";
              } else if (trajet.placesDisponibles === 0) {
                badgeStyle = { bg: "rgba(239,68,68,.15)", text: "#ef4444", border: "rgba(239,68,68,.3)" };
                badgeText = "COMPLET";
              } else {
                badgeStyle = { bg: "rgba(0,132,61,.1)", text: "#00843d", border: "rgba(0,132,61,.28)" };
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
                      <p style={{ fontSize: 24, fontWeight: 900, color: "#00843d", margin: 0 }}>{trajet.prixParPlace} <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(18,53,31,.35)" }}>MAD</span></p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", opacity: isTermine ? 0.5 : 1 }}>
                    <div style={{ color: "rgba(18,53,31,.72)", fontSize: 14 }}><span style={{ color: "#00843d", marginRight: 8 }}>📍</span> De : <span style={{ color: "#12351f", fontWeight: 600 }}>{trajet.hay?.nom}</span></div>
                    <div style={{ color: "rgba(18,53,31,.72)", fontSize: 14 }}><span style={{ color: "#00843d", marginRight: 8 }}>🏫</span> Vers : <span style={{ color: "#12351f", fontWeight: 600 }}>{trajet.campus?.nom}</span></div>
                    <div style={{ color: "rgba(18,53,31,.72)", fontSize: 14 }}><span style={{ color: "#00843d", marginRight: 8 }}>🕒</span> {new Date(trajet.dateHeureDepart).toLocaleString('fr-FR')}</div>
                  </div>

                  <div style={{ height: "0.5px", background: "rgba(0,132,61,.12)", margin: "8px 0" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: isTermine ? 0.5 : 1 }}>
                     <div style={{ textAlign: "center", width: "100%" }}>
                      <p style={{ color: "rgba(18,53,31,.45)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", margin: "0 0 4px 0" }}>Places disponibles</p>
                      <p style={{ color: "#12351f", fontSize: 20, fontWeight: 800, margin: 0 }}>{trajet.placesDisponibles}</p>
                     </div>
                  </div>

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
                  
                  {/* 🔥 3. ZEDT BOUTON PASSAGERS 7DA SUPPRIMER 🔥 */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                    <button 
                      onClick={() => ouvrirPassagers(trajet)}
                      style={{
                        flex: 1,
                        background: "rgba(34, 197, 94, 0.1)",
                        color: "#00843d", 
                        border: "1px solid rgba(34, 197, 94, 0.3)",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontFamily: "Outfit, sans-serif"
                      }}
                    >
                      👥 Passagers
                    </button>

                    <button 
                      onClick={() => supprimerTrajet(trajet.id)} 
                      style={{
                        flex: 1,
                        background: "rgba(239, 68, 68, 0.15)", 
                        color: "#ef4444", 
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        padding: "8px 16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontFamily: "Outfit, sans-serif"
                      }}
                    >
                       Supprimer
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
          <div style={{ background: "rgba(255,255,255,1)", border: "1px solid rgba(59,130,246,.3)", borderRadius: 24, padding: 24, width: "100%", maxWidth: 400, position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            
            <button onClick={fermerContacts} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,132,61,.06)", border: "none", color: "#12351f", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239,68,68,.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(0,132,61,.06)"}>✖</button>
            
            <h3 style={{ color: "#12351f", fontSize: 20, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: "rgba(59,130,246,0.15)", padding: "8px", borderRadius: "10px" }}>💬</span> Messages reçus
            </h3>

            {contactsModal.loading ? (
              <p style={{ color: "#60a5fa", textAlign: "center", fontWeight: 600, padding: "20px 0" }}>Chargement... ⏳</p>
            ) : contactsModal.contacts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", background: "rgba(0,132,61,.035)", borderRadius: 16 }}>
                <p style={{ color: "rgba(18,53,31,.45)", margin: 0, fontSize: 14 }}>Aucun étudiant ne vous a contacté pour ce trajet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                {contactsModal.contacts.map(contact => (
                  <div key={contact.id} onClick={() => ouvrirChat(contactsModal.trajetId, contact)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "rgba(0,132,61,.04)", border: "1px solid rgba(0,132,61,.06)", borderRadius: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(59,130,246,.15)"} onMouseOut={e => e.currentTarget.style.background="rgba(0,132,61,.04)"}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: 800, fontSize: 18 }}>
                      {contact.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#12351f", fontWeight: 700, fontSize: 15 }}>{contact.nom} {contact.prenom}</p>
                      <p style={{ margin: "2px 0 0 0", color: "#60a5fa", fontSize: 12, fontWeight: 600 }}>Cliquez pour répondre ➔</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔥 4. ZEDT L-MODAL DYAL PASSAGERS HNA 🔥 */}
      {passagersModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "rgba(255,255,255,1)", border: "1px solid rgba(0,132,61,.18)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 450, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", maxHeight: "80vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ color: "#12351f", fontSize: 20, fontWeight: 900, margin: 0 }}>👥 Liste des Passagers</h3>
              <button onClick={fermerPassagers} style={{ background: "transparent", border: "none", color: "rgba(18,53,31,.55)", fontSize: 20, cursor: "pointer" }}>✖</button>
            </div>

            <div style={{ background: "rgba(0,132,61,.055)", border: "1px dashed rgba(0,132,61,.28)", padding: "12px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" }}>
              <span style={{ color: "#00843d", fontWeight: 700 }}>{passagersModal.trajet?.placesDisponibles}</span> <span style={{ color: "rgba(18,53,31,.62)", fontSize: 14 }}>places restantes sur ce trajet.</span>
            </div>

            {passagersModal.loading ? (
              <p style={{ color: "#00843d", textAlign: "center" }}>Chargement... ⏳</p>
            ) : passagersModal.reservations.length === 0 ? (
              <p style={{ color: "rgba(18,53,31,.45)", textAlign: "center", fontSize: 14 }}>Aucun passager pour le moment.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {passagersModal.reservations.map(res => (
                  <div key={res.id} style={{ background: "rgba(0,132,61,.04)", border: "1px solid rgba(0,132,61,.06)", padding: "16px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, color: "#12351f", fontWeight: 800, fontSize: 15 }}>{res.passager?.nom} {res.passager?.prenom}</p>
                      <p style={{ margin: "4px 0 0 0", color: "rgba(18,53,31,.45)", fontSize: 12 }}>📞 {res.passager?.telephone || "Non renseigné"}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ 
                        fontSize: 10, fontWeight: 800, padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase",
                        background: res.statutReservation === 'confirmee' ? "rgba(0,132,61,.09)" : res.statutReservation === 'annulee' ? "rgba(239,68,68,.1)" : "rgba(249,115,22,.1)",
                        color: res.statutReservation === 'confirmee' ? "#00843d" : res.statutReservation === 'annulee' ? "#ef4444" : "#f97316"
                      }}>
                        {res.statutReservation}
                      </span>
                      <p style={{ margin: "6px 0 0 0", color: "#12351f", fontSize: 13, fontWeight: 700 }}>{res.placesReservees} place(s)</p>
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
