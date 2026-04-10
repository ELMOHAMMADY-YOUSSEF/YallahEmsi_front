import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import emsiback from "../assets/images/background_emsi.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur("");
    try {
      const res = await axios.post(
        `http://localhost:8081/api/utilisateurs/login?email=${email}&motDePasse=${motDePasse}`
      );
      if (typeof res.data === "string" && res.data.includes("Erreur")) {
        setErreur(res.data);
      } else {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/trajets");
      }
    } catch {
      setErreur("Mochkil f l'itissal m3a l'serveur.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,.04)",
    border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 12,
    padding: "12px 14px 12px 40px", color: "#fff",
    fontFamily: "Outfit,sans-serif", fontSize: 13, outline: "none",
    transition: "all .22s",
  };

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "100vh", 
      // HNA NQESNA L'COULEUR (Rdinah 0.3 w 0.4 f blasst 0.75 w 0.85)
      backgroundImage: `linear-gradient(rgba(10, 26, 15, 0.3), rgba(10, 26, 15, 0.4)), url(${emsiback})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "2rem 1rem", 
      overflow: "hidden" 
    }}>

      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes iconPop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        .login-input:focus{border-color:rgba(74,222,128,.5)!important;background:rgba(74,222,128,.15)!important;box-shadow:0 0 0 3px rgba(74,222,128,.08)!important}
      `}</style>

      <div style={{
        position: "relative", zIndex: 10, width: "100%", maxWidth: 420,
        background: "rgba(8,22,12,.7)", // Khalina l'formulaire chwia m-dlem bach t-ban l'ktaba
        border: "0.5px solid rgba(74,222,128,.2)",
        borderRadius: 24, padding: "40px 36px 36px", backdropFilter: "blur(12px)",
        animation: "slideUp .65s cubic-bezier(.16,1,.3,1) both",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{ width: 58, height: 58, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.22)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "iconPop .5s .2s cubic-bezier(.34,1.56,.64,1) both" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }}>
            <span style={{ color: "#4ade80" }}>Yallah</span> EMSI
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 300, marginTop: 4 }}>
            Dkhel l'compte dyalk
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "linear-gradient(90deg,transparent,rgba(74,222,128,.22),transparent)", marginBottom: 24 }} />

        {/* Error */}
        {erreur && (
          <div style={{ background: "rgba(239,68,68,.1)", border: "0.5px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "11px 14px", color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 18, animation: "fadeIn .3s ease" }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          {[
            { label: "Email", type: "email", val: email, set: setEmail, placeholder: "exemple@emsi.ma",
              icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></> },
            { label: "Mot de passe", type: "password", val: motDePasse, set: setMotDePasse, placeholder: "••••••••",
              icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></> },
          ].map(({ label, type, val, set, placeholder, icon }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: "rgba(74,222,128,.8)", marginBottom: 7 }}>
                {label}
              </label>
              <div style={{ position: "relative" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: .5, pointerEvents: "none" }}>
                  {icon}
                </svg>
                <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={placeholder}
                  required className="login-input" style={inputStyle} />
              </div>
            </div>
          ))}

          {/* Forgot */}
          <div style={{ textAlign: "right", marginBottom: 22 }}>
            <a href="#" style={{ fontSize: 12, color: "rgba(74,222,128,.8)", textDecoration: "none" }}>
              Mot de passe oublié ?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", fontFamily: "Outfit,sans-serif", fontSize: 14, fontWeight: 700, border: "none", borderRadius: 14, cursor: "pointer", letterSpacing: ".2px", boxShadow: "0 4px 20px rgba(34,197,94,.25)", transition: "all .25s", marginBottom: 20, opacity: loading ? .7 : 1 }}
            onMouseOver={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
            {loading ? "Connexion..." : "Dkhel →"}
          </button>
        </form>

        {/* OR + signup */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,.15)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>ma-3ndkch compte ?</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,.15)" }} />
        </div>

        <div style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 300 }}>
          <Link to="/inscription" style={{ color: "#4ade80", fontWeight: 600, textDecoration: "none" }}>
            Tsjel hna
          </Link> — inscription gratuite
        </div>

        {/* Security badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20, paddingTop: 18, borderTop: "0.5px solid rgba(255,255,255,.1)", fontSize: 10, color: "rgba(255,255,255,.4)", letterSpacing: ".8px", textTransform: "uppercase" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", opacity: .5 }} />
          Connexion sécurisée · EMSI
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", opacity: .5 }} />
        </div>
      </div>
    </div>
  );
}