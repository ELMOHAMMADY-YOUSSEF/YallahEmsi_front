export default function AnimatedBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "#0a1a0f" }}>

      {/* Orb 1 */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "#16a34a", top: -100, left: -100,
        filter: "blur(80px)", opacity: 0.18,
        animation: "orbFloat 18s linear infinite"
      }} />

      {/* Orb 2 */}
      <div style={{
        position: "absolute", width: 350, height: 350, borderRadius: "50%",
        background: "#15803d", bottom: -80, right: -80,
        filter: "blur(80px)", opacity: 0.18,
        animation: "orbFloat 22s linear -8s infinite"
      }} />

      {/* Orb 3 */}
      <div style={{
        position: "absolute", width: 250, height: 250, borderRadius: "50%",
        background: "#22c55e", top: "40%", left: "60%",
        filter: "blur(80px)", opacity: 0.18,
        animation: "orbFloat 15s linear -4s infinite"
      }} />

      {/* Grille */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(34,197,94,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.07) 1px,transparent 1px)",
        backgroundSize: "56px 56px",
        animation: "gridScroll 25s linear infinite"
      }} />

      {/* Routes SVG */}
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}>
        <defs>
          <style>{`
            .road{fill:none;stroke:rgba(74,222,128,1);stroke-width:1.5}
            .r1{stroke-dasharray:900;stroke-dashoffset:900;animation:drawRoad 4s ease forwards .3s}
            .r2{stroke-dasharray:700;stroke-dashoffset:700;animation:drawRoad 3.5s ease forwards .8s}
            .r3{stroke-dasharray:600;stroke-dashoffset:600;animation:drawRoad 3s ease forwards 1.2s}
            @keyframes drawRoad{to{stroke-dashoffset:0}}
            .c1{animation:moveC1 8s linear 4.5s infinite}
            .c2{animation:moveC2 10s linear 5s infinite}
            @keyframes moveC1{0%{transform:translate(50px,320px)}100%{transform:translate(950px,90px)}}
            @keyframes moveC2{0%{transform:translate(900px,500px)}50%{transform:translate(400px,300px)}100%{transform:translate(100px,600px)}}
            .pp{animation:pinPulse 2s ease-in-out infinite}
            @keyframes pinPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
          `}</style>
        </defs>
        <path className="road r1" d="M50,320 C200,280 350,150 600,90 C800,40 950,80 1150,60"/>
        <path className="road r2" d="M0,500 C150,480 300,420 500,380 C700,340 900,400 1200,280"/>
        <path className="road r3" d="M100,650 C300,600 500,560 750,490 C950,430 1100,480 1200,460"/>
        <rect className="c1" width="12" height="6" rx="2" fill="rgba(74,222,128,1)" style={{ transform: "translate(50px,320px)" }}/>
        <rect className="c2" width="10" height="5" rx="2" fill="rgba(74,222,128,1)" style={{ transform: "translate(900px,500px)" }}/>
        {[[180,90,0],[600,90,0.5],[950,350,1],[400,520,1.5]].map(([cx,cy,d],i) => (
          <g key={i} className="pp" style={{ transformOrigin: `${cx}px ${cy}px`, animationDelay: `${d}s` }}>
            <circle cx={cx} cy={cy} r="5" fill="rgba(74,222,128,.8)"/>
            <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(74,222,128,.3)" strokeWidth="1"/>
          </g>
        ))}
      </svg>

      {/* Keyframes injectés */}
      <style>{`
        @keyframes orbFloat {
          0%   { transform: translate(0,0) scale(1); }
          25%  { transform: translate(40px,-30px) scale(1.05); }
          50%  { transform: translate(-20px,40px) scale(.95); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes gridScroll { to { transform: translateY(56px); } }
      `}</style>
    </div>
  );
}