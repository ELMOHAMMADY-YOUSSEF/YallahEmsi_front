import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import ChatModal from "./Chat"; // L-IMPORT DYAL L-CHAT JDID 💬

export default function ListeTrajets() {
  const navigate = useNavigate();
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  
  const [filtreVille, setFiltreVille] = useState("");
  const [filtreCampus, setFiltreCampus] = useState("");
  const [filtreHay, setFiltreHay] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isConducteur = currentUser?.role === "conducteur";

  // --- LES STATES DYAL LES MODALS ---
  const [modal, setModal] = useState({ isOpen: false, trajetId: null, status: 'confirm', message: '' });
  const [modalDetails, setModalDetails] = useState({ isOpen: false, trajet: null });
  // STATE JDID DYAL L-CHAT 💬
  const [chatConfig, setChatConfig] = useState({ isOpen: false, trajetId: null, destinataire: null });

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/trajets/tous");
        setTrajets(response.data);
        setLoading(false);
      } catch (error) {
        setErreur("Erreur de connexion au serveur.");
        setLoading(false);
      }
    };
    fetchTrajets();
  }, []);

  // --- LOGIQUE DYAL RESERVATION ---
  const ouvrirModal = (trajetId) => setModal({ isOpen: true, trajetId: trajetId, status: 'confirm', message: '' });
  const fermerModal = () => setModal({ ...modal, isOpen: false });

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
      setModal({ ...modal, status: 'error', message: "Erreur de connexion au serveur !" });
    }
  };

  // --- LOGIQUE DYAL DETAILS ---
  const ouvrirDetails = (trajet) => setModalDetails({ isOpen: true, trajet });
  const fermerDetails = () => setModalDetails({ isOpen: false, trajet: null });

  // --- MOTEUR DE RECHERCHE ---
  const trajetsFiltres = trajets.filter(trajet => {
    const hayNom = (trajet.hay?.nom || "").toLowerCase();
    const campusNom = (trajet.campus?.nom || "").toLowerCase();
    const villeNom = (trajet.hay?.ville?.nom || trajet.campus?.ville?.nom || "").toLowerCase();

    return hayNom.includes(filtreHay.toLowerCase()) && 
           campusNom.includes(filtreCampus.toLowerCase()) && 
           villeNom.includes(filtreVille.toLowerCase());
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#f6fbf7", padding: "3rem 2rem", fontFamily: "Outfit,sans-serif" }}>
      <AnimatedBackground />
      
      {/* --- STYLES CSS POUR LES ANIMATIONS W L-HOVER --- */}
      <style>{`
        @keyframes pulseChat {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .btn-chat-direct {
          flex: 1; padding: 10px; background: rgba(59,130,246,0.15); 
          border: 1px solid rgba(59,130,246,0.4); border-radius: 12px; 
          color: #60a5fa; font-weight: 800; font-size: 13px; font-family: 'Outfit', sans-serif;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.2s; animation: pulseChat 2s infinite;
        }
        .btn-chat-direct:hover {
          background: rgba(59,130,246,0.3); transform: translateY(-2px); animation: none;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* --- STYLES JDAD DYAL L-FILTRE (AIRBNB STYLE) --- */
        .search-bar-container {
          display: flex;
          background: rgba(255,255,255,0.96);
          border: 1px solid rgba(74, 222, 128, 0.2);
          border-radius: 100px;
          padding: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease forwards;
          backdrop-filter: blur(20px);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .search-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 50px;
          transition: all 0.3s ease;
          position: relative;
        }
        .search-item:hover, .search-item:focus-within {
          background: rgba(0, 132, 61, 0.06);
          box-shadow: inset 0 0 0 1px rgba(74, 222, 128, 0.1);
        }
        .search-divider {
          width: 1px;
          height: 36px;
          background: rgba(0, 132, 61, 0.12);
          margin: auto 4px;
        }
        .search-icon {
          font-size: 22px;
          opacity: 0.9;
        }
        .search-input-group {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .search-label {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 800;
          color: #00843d;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }
        .search-input {
          background: transparent;
          border: none;
          color: #12351f;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          width: 100%;
        }
        .search-input::placeholder {
          color: rgba(18, 53, 31, 0.35);
        }
        @media (max-width: 768px) {
          .search-bar-container {
            flex-direction: column;
            border-radius: 24px;
            padding: 12px;
          }
          .search-divider {
            width: 100%;
            height: 1px;
            margin: 8px 0;
          }
          .search-item {
            border-radius: 16px;
          }
        }

        /* --- STYLES DYAL TRAJETS CARDS --- */
        .trajet-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.96) 100%);
          border: 1.5px solid rgba(0,132,61,0.22);
          border-radius: 24px;
          padding: 24px;
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .trajet-card::before {
          content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, #009846, transparent); opacity: 0; transition: opacity 0.3s ease;
        }
        .trajet-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(34,197,94,0.15);
          border-color: rgba(0,132,61,0.42);
        }
        .trajet-card:hover::before { opacity: 1; }

        .btn-primary {
          padding: 10px 18px; background: linear-gradient(135deg,#009846,#007a33);
          color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
          border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,132,61,.28);
          transition: all 0.2s ease; flex: 1; text-align: center;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,132,61,.38); }
        .btn-primary:disabled {
          background: rgba(0,132,61,.06);
          color: #00843d;
          box-shadow: none;
          cursor: not-allowed;
          border: 1.5px solid rgba(0,132,61,.32);
          opacity: 1;
        }

        .btn-secondary {
          padding: 10px 18px; background: rgba(0,132,61,.045);
          color: #00843d; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800;
          border: 1.5px solid rgba(0,132,61,.32); border-radius: 12px; cursor: pointer;
          transition: all 0.2s ease; flex: 1; text-align: center;
        }
        .btn-secondary:hover { background: rgba(0,132,61,.1); border-color: rgba(0,132,61,.46); transform: translateY(-2px); }
      `}</style>
      
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
          <div style={{ animation: "fadeIn 0.6s ease forwards" }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: "#12351f", margin: 0, letterSpacing: "-1px", display: "flex", alignItems: "center", gap: 12 }}>
              Trajets <span style={{ color: "#00843d" }}>Disponibles</span> 
              <div style={{ padding: "8px", background: "rgba(74,222,128,0.1)", borderRadius: "12px", fontSize: 24 }}></div>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(18,53,31,.55)", marginTop: 8, fontWeight: 500 }}>Trouvez votre covoiturage pour l'EMSI aujourd'hui.</p>
          </div>

          {isConducteur && (
            <button onClick={() => navigate("/publier")} className="btn-primary" style={{ flex: "none", padding: "14px 24px", fontSize: 14, animation: "fadeIn 0.6s ease forwards" }}>
              <span style={{ fontSize: 18, marginRight: 6 }}>+</span> Publier Trajet
            </button>
          )}
        </div>

        {/* FILTRES (Passager uniquement) - DESIGN JDID AIRBNB STYLE 🔥 */}
        {!isConducteur && (
          <div className="search-bar-container">
            
            <div className="search-item">
              <span className="search-icon"></span>
              <div className="search-input-group">
                <span className="search-label">Ville</span>
                <input type="text" placeholder="Où allez-vous ?" value={filtreVille} onChange={(e) => setFiltreVille(e.target.value)} className="search-input" />
              </div>
            </div>

            <div className="search-divider"></div>

            <div className="search-item">
              <span className="search-icon"></span>
              <div className="search-input-group">
                <span className="search-label">Quartier</span>
                <input type="text" placeholder="Ex: Maarif..." value={filtreHay} onChange={(e) => setFiltreHay(e.target.value)} className="search-input" />
              </div>
            </div>

            <div className="search-divider"></div>

            <div className="search-item">
              <span className="search-icon"></span>
              <div className="search-input-group">
                <span className="search-label">Campus</span>
                <input type="text" placeholder="Ex: Centre..." value={filtreCampus} onChange={(e) => setFiltreCampus(e.target.value)} className="search-input" />
              </div>
            </div>

          </div>
        )}

        {/* LOADING & ERROR */}
        {loading && <p style={{ color: "#00843d", textAlign: "center", fontSize: 18, fontWeight: 700, animation: "fadeIn 1s infinite alternate" }}>Chargement des trajets... </p>}
        {erreur && <p style={{ background: "rgba(239,68,68,.1)", color: "#f87171", border: "1px solid rgba(239,68,68,.3)", padding: 16, borderRadius: 12, textAlign: "center", fontWeight: 600 }}>{erreur}</p>}

        {/* GRID TRAJETS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {trajetsFiltres.length === 0 && !loading && !erreur ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", background: "rgba(0,132,61,.035)", borderRadius: 30, border: "1px dashed rgba(0,132,61,.12)", animation: "fadeIn 0.6s ease forwards" }}>
              <div style={{ fontSize: 50, marginBottom: 16, opacity: 0.5 }}></div>
              <p style={{ color: "rgba(18,53,31,.55)", fontSize: 18, fontWeight: 500 }}>Aucun trajet trouvé avec ces critères </p>
            </div>
          ) : (
            trajetsFiltres.map((trajet, index) => {
              const dateTrajet = new Date(trajet.dateHeureDepart);
              return (
                <div key={trajet.id} className="trajet-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  
                  {/* TOP: Badge & Prix */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: "rgba(0,132,61,.1)", color: "#00843d", border: "1px solid rgba(0,132,61,.28)", padding: "6px 12px", borderRadius: "10px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                      {trajet.typeTrajet}
                    </span>
                    <div style={{ background: "rgba(0,132,61,.04)", padding: "6px 14px", borderRadius: 12, border: "1px solid rgba(0,132,61,.06)" }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: "#00843d", margin: 0 }}>
                        {trajet.prixParPlace} <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(18,53,31,.35)" }}>MAD</span>
                      </p>
                    </div>
                  </div>

                  {/* MIDDLE: Itinéraire avec design moderne (Lignes w noqat) */}
                  <div style={{ position: "relative", paddingLeft: "30px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
                    <div style={{ position: "absolute", left: "9px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(to bottom, #00843d 50%, rgba(0,132,61,0.2) 50%)", backgroundSize: "100% 10px", borderRadius: "2px" }}></div>
                    
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-31px", top: "2px", width: "18px", height: "18px", borderRadius: "50%", background: "#ffffff", border: "4px solid #00843d", zIndex: 2 }}></div>
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(18,53,31,.45)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Départ</p>
                      <p style={{ margin: "2px 0 0 0", fontSize: 16, color: "#12351f", fontWeight: 700 }}>{trajet.typeTrajet.toLowerCase() === 'aller' ? trajet.hay?.nom : trajet.campus?.nom}</p>
                    </div>
                    
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: "-31px", top: "2px", width: "18px", height: "18px", borderRadius: "50%", background: "#ffffff", border: "4px solid rgba(0,132,61,0.2)", zIndex: 2 }}></div>
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(18,53,31,.45)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Arrivée</p>
                      <p style={{ margin: "2px 0 0 0", fontSize: 16, color: "#12351f", fontWeight: 700 }}>{trajet.typeTrajet.toLowerCase() === 'aller' ? trajet.campus?.nom : trajet.hay?.nom}</p>
                    </div>
                  </div>

                  <div style={{ height: "1px", background: "rgba(0,132,61,.06)", margin: "4px 0" }} />

                  {/* BOTTOM: Conducteur */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(0,132,61,.14)", border: "1px solid rgba(0,132,61,.26)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00843d", fontWeight: 900, fontSize: 18 }}>
                      {trajet.conducteur?.nom?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#12351f" }}>
                        {trajet.conducteur?.nom} {trajet.conducteur?.prenom}
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "rgba(18,53,31,.55)", fontWeight: 500 }}>
                        📅 {dateTrajet.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} à {dateTrajet.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* BOUTONS D'ACTION (Mzianin w mstfin b 3) */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    
                    {/* 1. BOUTON CHAT DIRECT */}
                    {!isConducteur && (
                      <button 
                        onClick={() => setChatConfig({ isOpen: true, trajetId: trajet.id, destinataire: trajet.conducteur })}
                        className="btn-chat-direct"
                        title="Discuter avec le conducteur"
                      >
                        <span style={{ fontSize: 16 }}>💬</span> Chat
                      </button>
                    )}

                    {/* 2. BOUTON DÉTAILS */}
                    <button onClick={() => ouvrirDetails(trajet)} className="btn-secondary" style={{ flex: 1, padding: "10px", fontSize: 13 }}>
                      👁️ Détails
                    </button>

                    {/* 3. BOUTON RÉSERVER */}
                    <button 
                      onClick={() => ouvrirModal(trajet.id)}
                      disabled={trajet.placesDisponibles === 0 || isConducteur}
                      className="btn-primary" style={{ flex: 1.2, padding: "10px", fontSize: 13 }}
                    >
                      {trajet.placesDisponibles === 0 ? 'Complet' : (isConducteur ? 'Ton Trajet' : `Réserver`)}
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================
          MODAL DYAL RÉSERVATION 
          ========================================= */}
      {modal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "rgba(255,255,255,1)", border: "1px solid rgba(0,132,61,.26)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            
            {modal.status === 'confirm' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❓</div>
                <h3 style={{ color: "#12351f", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Confirmation</h3>
                <p style={{ color: "rgba(18,53,31,.62)", fontSize: 14, marginBottom: 24, lineHeight: "1.5" }}>Êtes-vous sûr de vouloir réserver une place pour ce trajet ?</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={fermerModal} className="btn-secondary">Annuler</button>
                  <button onClick={confirmerReservation} className="btn-primary">Confirmer</button>
                </div>
              </>
            )}

            {modal.status === 'loading' && (
              <div style={{ padding: "30px 0", color: "#00843d", fontWeight: 700, fontSize: 16, animation: "fadeIn 1s infinite alternate" }}>Enregistrement... ⏳</div>
            )}

            {modal.status === 'success' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ color: "#12351f", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Succès !</h3>
                <p style={{ color: "#00843d", fontSize: 14, marginBottom: 16 }}>{modal.message}</p>
              </>
            )}

            {modal.status === 'error' && (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
                <h3 style={{ color: "#12351f", fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Erreur !</h3>
                <p style={{ color: "#f87171", fontSize: 14, marginBottom: 24 }}>{modal.message}</p>
                <button onClick={fermerModal} className="btn-secondary" style={{ width: "100%" }}>Fermer</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DYAL DÉTAILS
          ========================================= */}
      {modalDetails.isOpen && modalDetails.trajet && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ background: "rgba(255,255,255,1)", border: "1px solid rgba(0,132,61,.12)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 400, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", position: "relative" }}>
            
            <button onClick={fermerDetails} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,132,61,.06)", border: "none", color: "#12351f", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(239,68,68,.2)"} onMouseOut={e => e.currentTarget.style.background = "rgba(0,132,61,.06)"}>✖</button>

            <h3 style={{ color: "#12351f", fontSize: 22, fontWeight: 900, marginBottom: 24, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ color: "#00843d" }}>ℹ️</span> Détails du Trajet
            </h3>

            {/* Info Conducteur */}
            <div style={{ background: "rgba(0,132,61,.035)", border: "1px solid rgba(0,132,61,.06)", padding: 16, borderRadius: 16, marginBottom: 16 }}>
              <p style={{ color: "rgba(18,53,31,.45)", fontSize: 11, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px 0" }}>Conducteur</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #009846, #007a33)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: 900, fontSize: 20 }}>
                  {modalDetails.trajet.conducteur?.nom?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#12351f" }}>{modalDetails.trajet.conducteur?.nom} {modalDetails.trajet.conducteur?.prenom}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 13, color: "#00843d", fontWeight: 600 }}>📞 {modalDetails.trajet.conducteur?.telephone || "Non renseigné"}</p>
                </div>
              </div>
            </div>

            {/* Info Voiture */}
            <div style={{ background: "rgba(0,132,61,.035)", border: "1px solid rgba(0,132,61,.06)", padding: 16, borderRadius: 16, marginBottom: 16 }}>
              <p style={{ color: "rgba(18,53,31,.45)", fontSize: 11, textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px 0" }}>Véhicule</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#12351f", display: "flex", alignItems: "center", gap: 8 }}>
                🚗 {modalDetails.trajet.voiture?.marque} {modalDetails.trajet.voiture?.modele}
              </p>
            </div>

            {/* Info Trajet (Résumé) */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, background: "rgba(0,132,61,.055)", border: "1px solid rgba(34,197,94,.2)", padding: 12, borderRadius: 16, textAlign: "center" }}>
                <p style={{ color: "#00843d", fontSize: 11, textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px 0" }}>Places Dispo</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#12351f" }}>{modalDetails.trajet.placesDisponibles}</p>
              </div>
              <div style={{ flex: 1, background: "rgba(0,132,61,.055)", border: "1px solid rgba(34,197,94,.2)", padding: 12, borderRadius: 16, textAlign: "center" }}>
                <p style={{ color: "#00843d", fontSize: 11, textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px 0" }}>Prix / Place</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#12351f" }}>{modalDetails.trajet.prixParPlace}<span style={{ fontSize: 12, marginLeft: 4 }}>MAD</span></p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* BOUTON RÉSERVER */}
              <button 
                onClick={() => { fermerDetails(); ouvrirModal(modalDetails.trajet.id); }}
                disabled={modalDetails.trajet.placesDisponibles === 0 || isConducteur}
                className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }}
              >
                {modalDetails.trajet.placesDisponibles === 0 ? 'Trajet Complet' : (isConducteur ? 'C\'est ton trajet' : `Réserver maintenant`)}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================
          MODAL DYAL CHAT 💬
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
