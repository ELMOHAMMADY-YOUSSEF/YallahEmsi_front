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
      
      <div style={{ background: "rgba(255,255,255,0.98)", border: "1px solid rgba(0,132,61,.26)", borderRadius: "24px", width: "100%", maxWidth: "450px", height: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden", position: "relative" }}>
        
        {/* HEADER DYAL L-CHAT */}
        <div style={{ padding: "16px 20px", background: "rgba(0,132,61,.06)", borderBottom: "1px solid rgba(0,132,61,.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #009846, #007a33)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: 900, fontSize: 18 }}>
              {destinataire?.nom?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#12351f" }}>{destinataire?.nom} {destinataire?.prenom}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#00843d" }}>En ligne</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(239,68,68,.1)", border: "none", color: "#ef4444", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background="rgba(239,68,68,.3)"} onMouseOut={e => e.currentTarget.style.background="rgba(239,68,68,.1)"}>
            ✖
          </button>
        </div>

        {/* L-BLASSA DYAL L-MESSAGES */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.length === 0 ? (
             <p style={{ textAlign: "center", color: "rgba(18,53,31,.35)", fontSize: 14, marginTop: "auto", marginBottom: "auto" }}>Envoyez le premier message ! 👋</p>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.expediteur?.id === currentUser.id;
              return (
                <div key={index} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                  <div style={{ background: isMe ? "linear-gradient(135deg, #009846, #007a33)" : "rgba(0,132,61,.08)", color: isMe ? "#ffffff" : "#12351f", padding: "10px 16px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 14, lineHeight: "1.4", border: isMe ? "none" : "1px solid rgba(0,132,61,.06)" }}>
                    {msg.contenu}
                  </div>
                  <p style={{ margin: "4px 4px 0 4px", fontSize: 10, color: "rgba(18,53,31,.45)", textAlign: isMe ? "right" : "left" }}>
                    {new Date(msg.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* L-INPUT BACH N-KTEB */}
        <form onSubmit={envoyerMessage} style={{ padding: "16px", background: "rgba(0,132,61,.035)", borderTop: "1px solid rgba(0,132,61,.06)", display: "flex", gap: "12px" }}>
          <input 
            type="text" 
            placeholder="Écrivez un message..." 
            value={contenu} 
            onChange={(e) => setContenu(e.target.value)} 
            style={{ flex: 1, background: "rgba(0,132,61,.06)", border: "1px solid rgba(0,132,61,.12)", borderRadius: "20px", padding: "12px 16px", color: "#12351f", fontSize: 14, outline: "none", fontFamily: "Outfit,sans-serif" }}
          />
          <button type="submit" disabled={!contenu.trim()} style={{ background: contenu.trim() ? "#00843d" : "rgba(0,132,61,.12)", border: "none", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: contenu.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", color: "#ffffff", fontSize: 18 }}>
            ➤
          </button>
        </form>

      </div>
    </div>
  );
}
