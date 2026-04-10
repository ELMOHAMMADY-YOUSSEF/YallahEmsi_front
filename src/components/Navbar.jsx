import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (["/", "/inscription"].includes(location.pathname)) return null;
  if (!currentUser) return null;

  const isConducteur = currentUser.role === "conducteur";
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const linkStyle = (path) => ({
    display: "flex", alignItems: "center", gap: 7,
    padding: "8px 14px", borderRadius: 10, textDecoration: "none",
    fontSize: 13, fontWeight: 500, transition: "all .2s", position: "relative",
    color: isActive(path) ? "#4ade80" : "rgba(255,255,255,.45)",
    background: isActive(path) ? "rgba(74,222,128,.08)" : "transparent",
    border: `0.5px solid ${isActive(path) ? "rgba(74,222,128,.18)" : "transparent"}`,
  });

  const iconBox = (active) => ({
    width: 28, height: 28, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
    background: active ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.06)",
    transition: "background .2s",
  });

  return (
    <>
      <style>{`
        @keyframes navDrop{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes logoPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
        @keyframes avatarRing{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes glowPulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes dotPop{from{opacity:0;transform:translateX(-50%) scale(0)}to{opacity:1;transform:translateX(-50%) scale(1)}}
        .nav-link:hover{color:#fff!important;background:rgba(255,255,255,.06)!important;border-color:rgba(255,255,255,.08)!important}
        .nav-link:hover .icon-box{background:rgba(255,255,255,.1)!important}
        .btn-publish:hover{background:rgba(34,197,94,.2)!important;border-color:rgba(74,222,128,.4)!important;transform:translateY(-1px)}
        .btn-logout:hover{background:rgba(239,68,68,.18)!important;border-color:rgba(239,68,68,.4)!important;transform:translateY(-1px)}
        .profile-chip:hover{background:rgba(255,255,255,.08)!important;border-color:rgba(255,255,255,.18)!important}
      `}</style>

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,22,12,.88)", backdropFilter: "blur(24px)",
        borderBottom: "0.5px solid rgba(74,222,128,.12)",
        padding: "0 28px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 64, fontFamily: "Outfit,sans-serif",
        animation: "navDrop .5s cubic-bezier(.16,1,.3,1) both",
        position: "relative",
      }}>
        {/* Glow bottom line */}
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(74,222,128,.3),transparent)", animation: "glowPulse 3s ease-in-out infinite" }} />

        {/* LOGO */}
        <Link to="/trajets" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "logoPulse 2.5s ease-in-out infinite" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
              <rect x="9" y="11" width="14" height="10" rx="2"/>
              <circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-.4px", lineHeight: 1 }}>
              Yallah<span style={{ color: "#4ade80" }}>Emsi</span>
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", color: "rgba(74,222,128,.5)", marginTop: 2 }}>
              Covoiturage EMSI
            </div>
          </div>
        </Link>

        {/* LINKS */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { to: "/trajets", label: "Trajets", icon: <><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></> },
            isConducteur
              ? { to: "/mes-trajets", label: "Mes annonces", icon: <><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></> }
              : { to: "/mes-reservations", label: "Réservations", icon: <><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></> },
            { to: "/wallet", label: "Wallet", icon: <><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12h.01"/></> },
          ].map(({ to, label, icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className="nav-link" style={linkStyle(to)}>
                <div className="icon-box" style={iconBox(active)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{icon}</svg>
                </div>
                {label}
                {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ade80", position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", animation: "dotPop .3s cubic-bezier(.34,1.56,.64,1) both" }} />}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Publish button (conducteur only) */}
          {isConducteur && (
            <Link to="/publier" style={{ textDecoration: "none" }}>
              <button className="btn-publish" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(34,197,94,.12)", border: "0.5px solid rgba(74,222,128,.25)", borderRadius: 10, padding: "8px 14px", color: "#4ade80", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit,sans-serif", transition: "all .2s", whiteSpace: "nowrap" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
                Publier
              </button>
            </Link>
          )}

          {/* Profile chip */}
          <div className="profile-chip" style={{ display: "flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.05)", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 100, padding: "5px 14px 5px 5px", cursor: "pointer", transition: "all .2s" }}>
            <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4ade80,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#0a1a0f" }}>
                {currentUser.nom.charAt(0).toUpperCase()}
              </div>
              <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1.5px solid rgba(74,222,128,.3)", animation: "avatarRing 2s ease-in-out infinite" }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{currentUser.prenom}</div>
              <div style={{ fontSize: 10, color: "rgba(74,222,128,.6)", fontWeight: 500 }}>
                {isConducteur ? "Conducteur" : "Passager"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button className="btn-logout" onClick={handleLogout}
            style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,.08)", border: "0.5px solid rgba(239,68,68,.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .2s" }}
            title="Déconnexion">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}