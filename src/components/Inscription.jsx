import { useState } from "react";
import axios from "axios";
import logo from "../assets/images/yallahemsi_logo.png"; // ← mets le logo ici
import emsiPhoto from "../assets/images/background_emsi.webp";

export default function Inscription() {
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "",
    motDePasse: "", telephone: "", cne: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/utilisateurs/inscription", formData
      );
      setMessage(response.data);
      setIsError(response.data.includes("Erreur"));
    } catch {
      setMessage("Mochkil f l'itissal m3a l'serveur!");
      setIsError(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${emsiPhoto})`, // ← photo dyal EMSI
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark green overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/80 via-black/60 to-green-900/50 z-0" />

      {/* Grid lines */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,184,113,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(61,184,113,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-10"
        style={{
          background: "rgba(10, 28, 16, 0.72)",
          backdropFilter: "blur(28px)",
          border: "1px solid rgba(61,184,113,0.22)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 80px rgba(61,184,113,0.08)",
        }}
      >
        {/* Header with logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={logo}
              alt="Yallah EMSI"
              className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(61,184,113,0.6)]"
            />
            <div>
              <h1
                className="text-3xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <span className="text-green-400">Yallah</span> EMSI
              </h1>
              <p className="text-xs text-green-400 tracking-widest uppercase opacity-80 mt-0.5">
                Covoiturage Étudiant
              </p>
            </div>
          </div>
          <p className="text-sm text-white/50 font-light">
            Créez votre compte et rejoignez la communauté 🚗
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mb-7" />

        {/* Message */}
        {message && (
          <div className={`p-3 mb-5 rounded-xl text-center text-sm font-medium border ${
            isError
              ? "bg-red-500/10 text-red-300 border-red-500/20"
              : "bg-green-500/10 text-green-300 border-green-500/20"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input name="nom" placeholder="Nom" onChange={handleChange} />
            <Input name="prenom" placeholder="Prénom" onChange={handleChange} />
          </div>
          <Input name="email" type="email" placeholder="Email (@emsi.ma)" onChange={handleChange} />
          <Input name="motDePasse" type="password" placeholder="Mot de passe" onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <Input name="telephone" placeholder="Téléphone" onChange={handleChange} required={false} />
            <Input name="cne" placeholder="CNE (ex: R123...)" onChange={handleChange} />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #3db871 0%, #2a8a52 100%)",
              boxShadow: "0 4px 24px rgba(61,184,113,0.35)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            N-ssjel Rassi →
          </button>
        </form>

        <p className="text-center mt-5 text-xs text-white/30">
          Déjà un compte ?{" "}
          <a href="/" className="text-green-400 font-medium hover:opacity-70">
            Se connecter
          </a>
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-widest">
          <span className="w-1 h-1 rounded-full bg-green-500 opacity-60" />
          EMSI · École Marocaine des Sciences de l'Ingénieur
          <span className="w-1 h-1 rounded-full bg-green-500 opacity-60" />
        </div>
      </div>
    </div>
  );
}

// Composant input réutilisable
function Input({ name, type = "text", placeholder, onChange, required = true }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "13px 16px",
        color: "white",
        fontSize: "14px",
        outline: "none",
        transition: "all 0.25s",
      }}
      onFocus={e => {
        e.target.style.borderColor = "rgba(61,184,113,0.55)";
        e.target.style.background = "rgba(61,184,113,0.07)";
        e.target.style.boxShadow = "0 0 0 3px rgba(61,184,113,0.12)";
      }}
      onBlur={e => {
        e.target.style.borderColor = "rgba(255,255,255,0.1)";
        e.target.style.background = "rgba(255,255,255,0.05)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}