import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chat({ trajetId, currentUser, destinataire, onClose }) {
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState("");
  const messagesEndRef = useRef(null);

  // Fonction bach n-jibou l-moussnjat mn Spring Boot
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/messages/historique/${trajetId}/${currentUser.id}/${destinataire.id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    }
  };

  // N-chargiw les messages mli t-t7el l-modal, w n-b9aw n-verifiw kol 3 t-tawani (Auto-refresh)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    return () => clearInterval(interval);
  }, [trajetId, currentUser.id, destinataire.id]);

  // Bach dima l-chat y-hbet l-te7t (Auto-scroll) mli y-wsel message jdid
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fonction bach n-siftou message
  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!contenu.trim()) return;

    try {
      const url = `http://localhost:8081/api/messages/envoyer?expediteurId=${currentUser.id}&destinataireId=${destinataire.id}&trajetId=${trajetId}&contenu=${encodeURIComponent(contenu)}`;
      await axios.post(url);
      setContenu(""); // N-khwiw l-input
      fetchMessages(); // N-affichiw l-message jdid f l-blassa
    } catch (err) {
      console.error("Erreur envoi message", err);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.8)", backdropFilter: "blur(10px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", animation: "fadeIn 0.2s ease" }}>
      
      <div style={{ background: "rgba(10,26,15,0.95)", border: "1px solid rgba(74,222,128,.3)", borderRadius: "24px", width: "100%", maxWidth: "450px", height: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden", position: "relative" }}>
        
        {/* HEADER DYAL L-CHAT */}
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,.05)", borderBottom: "1px solid rgba(255,255,255,.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18 }}>
              {destinataire?.nom?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#fff" }}>{destinataire?.nom} {destinataire?.prenom}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#4ade80" }}>En ligne</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(239,68,68,.1)", border: "none", color: "#ef4444", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(239,68,68,.3)"} onMouseOut={e => e.currentTarget.style.background="rgba(239,68,68,.1)"}>
            ✖
          </button>
        </div>

        {/* L-BLASSA DYAL L-MESSAGES */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.length === 0 ? (
             <p style={{ textAlign: "center", color: "rgba(255,255,255,.3)", fontSize: 14, marginTop: "auto", marginBottom: "auto" }}>Envoyez le premier message ! 👋</p>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.expediteur?.id === currentUser.id;
              return (
                <div key={index} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                  <div style={{ background: isMe ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,.08)", color: "#fff", padding: "10px 16px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 14, lineHeight: "1.4", border: isMe ? "none" : "1px solid rgba(255,255,255,.05)" }}>
                    {msg.contenu}
                  </div>
                  <p style={{ margin: "4px 4px 0 4px", fontSize: 10, color: "rgba(255,255,255,.4)", textAlign: isMe ? "right" : "left" }}>
                    {new Date(msg.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* L-INPUT BACH N-KTEB */}
        <form onSubmit={envoyerMessage} style={{ padding: "16px", background: "rgba(255,255,255,.02)", borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", gap: "12px" }}>
          <input 
            type="text" 
            placeholder="Écrivez un message..." 
            value={contenu} 
            onChange={(e) => setContenu(e.target.value)} 
            style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "20px", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Outfit,sans-serif" }}
          />
          <button type="submit" disabled={!contenu.trim()} style={{ background: contenu.trim() ? "#4ade80" : "rgba(255,255,255,.1)", border: "none", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: contenu.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", color: "#000", fontSize: 18 }}>
            ➤
          </button>
        </form>

      </div>
    </div>
  );
}