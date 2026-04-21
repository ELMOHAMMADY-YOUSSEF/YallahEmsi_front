import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let animId, frame = 0;
    let W, H;

    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Routes bezier
    const ROUTES = [
      { segs: [[.0,.38,.18,.22,.42,.08,.72,.06],[.72,.06,.88,.05,1.05,.12,1.05,.1]] },
      { segs: [[-.05,.62,.2,.55,.45,.42,.65,.38],[.65,.38,.82,.35,1.0,.28,1.05,.25]] },
      { segs: [[-.05,.78,.15,.72,.38,.65,.58,.58],[.58,.58,.78,.52,.92,.56,1.05,.54]] },
      { segs: [[.1,.92,.28,.85,.5,.78,.7,.72],[.7,.72,.85,.68,.95,.63,1.05,.6]] },
    ];

    function bezier(p, t) {
      const [x0,y0,x1,y1,x2,y2,x3,y3] = p, mt = 1-t;
      return {
        x: (mt*mt*mt*x0+3*mt*mt*t*x1+3*mt*t*t*x2+t*t*t*x3)*W,
        y: (mt*mt*mt*y0+3*mt*mt*t*y1+3*mt*t*t*y2+t*t*t*y3)*H,
      };
    }
    function bezierAngle(p, t) {
      const a = bezier(p, Math.max(0,t-.005)), b = bezier(p, Math.min(1,t+.005));
      return Math.atan2(b.y-a.y, b.x-a.x);
    }
    function routePos(route, t) {
      const total = route.segs.length;
      const si = Math.min(Math.floor(t*total), total-1);
      const lt = t*total - si;
      return { pos: bezier(route.segs[si], lt), angle: bezierAngle(route.segs[si], lt) };
    }

    const CARS = [
      { ri:0, t:.0,  speed:.0012, len:22, w:10, style:'suv'   },
      { ri:0, t:.55, speed:.0009, len:18, w:8,  style:'sedan' },
      { ri:1, t:.15, speed:.001,  len:20, w:9,  style:'sedan' },
      { ri:1, t:.7,  speed:.0014, len:16, w:7,  style:'mini'  },
      { ri:2, t:.3,  speed:.0008, len:24, w:10, style:'suv'   },
      { ri:2, t:.75, speed:.0011, len:18, w:8,  style:'sedan' },
      { ri:3, t:.1,  speed:.0013, len:16, w:7,  style:'mini'  },
      { ri:3, t:.6,  speed:.0007, len:22, w:9,  style:'suv'   },
    ];

    function drawCar(x, y, angle, car, alpha) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(angle); ctx.globalAlpha = alpha;
      const L = car.len, HW = car.w;

      // Trail
      const tr = ctx.createLinearGradient(-L*1.5,0,0,0);
      tr.addColorStop(0,'rgba(74,222,128,0)'); tr.addColorStop(1,'rgba(74,222,128,0.18)');
      ctx.fillStyle = tr;
      ctx.beginPath(); ctx.ellipse(-L*.8,0,L*.8,HW*.6,0,0,Math.PI*2); ctx.fill();

      ctx.shadowColor = 'rgba(74,222,128,0.6)'; ctx.shadowBlur = 12;
      const bg = ctx.createLinearGradient(-L/2,-HW,L/2,HW);
      bg.addColorStop(0,'rgba(100,240,150,0.95)');
      bg.addColorStop(.5,'rgba(74,222,128,0.9)');
      bg.addColorStop(1,'rgba(30,140,70,0.85)');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.roundRect(-L/2,-HW/2,L,HW,HW*.35); ctx.fill();
      ctx.shadowBlur = 0;

      const roofH = car.style==='suv'?HW*.85:car.style==='mini'?HW*.6:HW*.75;
      const rg = ctx.createLinearGradient(0,-HW,0,0);
      rg.addColorStop(0,'rgba(140,255,180,0.9)'); rg.addColorStop(1,'rgba(74,222,128,0.7)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.roundRect(-L*.28,-HW/2-roofH,L*.58,roofH+1,HW*.25); ctx.fill();

      ctx.fillStyle = 'rgba(200,255,230,0.35)';
      ctx.beginPath(); ctx.roundRect(-L*.24,-HW/2-roofH+2,L*.5,roofH*.55,2); ctx.fill();

      [L*.32,-L*.32].forEach(wx => [-HW/2-1,HW/2+1].forEach(wy => {
        ctx.fillStyle='#050e08'; ctx.beginPath(); ctx.arc(wx,wy,HW*.32,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='rgba(74,222,128,0.5)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(wx,wy,HW*.22,0,Math.PI*2); ctx.stroke();
        ctx.strokeStyle='rgba(74,222,128,0.3)'; ctx.lineWidth=.8;
        for(let s=0;s<3;s++){const a=s*Math.PI*2/3;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+Math.cos(a)*HW*.2,wy+Math.sin(a)*HW*.2);ctx.stroke();}
      }));

      ctx.shadowColor='rgba(200,255,200,0.9)'; ctx.shadowBlur=10;
      ctx.fillStyle='rgba(220,255,220,0.95)';
      [-HW*.28,HW*.28].forEach(hy=>{ctx.beginPath();ctx.ellipse(L/2-1,hy,2.5,1.5,0,0,Math.PI*2);ctx.fill();});
      ctx.shadowColor='rgba(255,50,50,0.8)'; ctx.shadowBlur=8;
      ctx.fillStyle='rgba(255,80,80,0.9)';
      [-HW*.28,HW*.28].forEach(hy=>{ctx.beginPath();ctx.ellipse(-L/2+1,hy,2,1.2,0,0,Math.PI*2);ctx.fill();});
      ctx.shadowBlur=0; ctx.globalAlpha=1; ctx.restore();
    }

    const PINS = [
      {rx:.12,ry:.09,phase:0},{rx:.5,ry:.08,phase:1.2},
      {rx:.8,ry:.29,phase:2.1},{rx:.33,ry:.64,phase:.7},
      {rx:.68,ry:.73,phase:1.8},{rx:.18,ry:.52,phase:3.0},
    ];

    function drawPin(px, py, phase) {
      const pulse = (Math.sin(frame*.04+phase)+1)/2;
      const r = 5 + pulse*1.5;
      ctx.save(); ctx.translate(px, py);
      for(let i=3;i>=1;i--){
        const rr=r+i*14*(0.4+pulse*.6);
        ctx.globalAlpha=Math.max(0,(0.18-i*.04)*(1-pulse*.4));
        ctx.strokeStyle='rgb(74,222,128)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(0,0,rr,0,Math.PI*2); ctx.stroke();
      }
      ctx.globalAlpha=.7; ctx.fillStyle='rgb(74,222,128)';
      ctx.shadowColor='rgba(74,222,128,0.8)'; ctx.shadowBlur=14;
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.fillStyle='#050e08'; ctx.globalAlpha=.9;
      ctx.beginPath(); ctx.arc(0,0,r*.38,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=.6; ctx.fillStyle='rgb(74,222,128)';
      ctx.beginPath(); ctx.moveTo(-r*.55,r*.5); ctx.lineTo(0,r+8+pulse*3); ctx.lineTo(r*.55,r*.5); ctx.fill();
      ctx.globalAlpha=1; ctx.restore();
    }

    function drawRoutes() {
      ROUTES.forEach(route => {
        route.segs.forEach(seg => {
          const [x0,y0,x1,y1,x2,y2,x3,y3] = seg;
          ctx.beginPath(); ctx.moveTo(x0*W,y0*H);
          ctx.bezierCurveTo(x1*W,y1*H,x2*W,y2*H,x3*W,y3*H);
          ctx.setLineDash([6,10]); ctx.strokeStyle='rgba(74,222,128,0.08)'; ctx.lineWidth=1; ctx.stroke();
          ctx.setLineDash([]); ctx.strokeStyle='rgba(74,222,128,0.05)'; ctx.lineWidth=22; ctx.stroke();
        });
      });
    }

    const ORBS = [
      {x:-.1,y:-.15,r:420,speed:.00018,phase:0},
      {x:.9,y:.85,r:320,speed:.00014,phase:2.1},
      {x:.5,y:.4,r:240,speed:.0002,phase:4.2},
    ];
    function drawOrbs() {
      ORBS.forEach(orb => {
        const ox=(orb.x+Math.sin(frame*orb.speed+orb.phase)*.08)*W;
        const oy=(orb.y+Math.cos(frame*orb.speed*1.3+orb.phase)*.06)*H;
        const g=ctx.createRadialGradient(ox,oy,0,ox,oy,orb.r);
        g.addColorStop(0,'rgba(22,163,74,0.14)'); g.addColorStop(1,'rgba(22,163,74,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(ox,oy,orb.r,0,Math.PI*2); ctx.fill();
      });
    }

    function drawGrid() {
      const sz=54, offY=(frame*.6)%sz;
      ctx.strokeStyle='rgba(74,222,128,0.04)'; ctx.lineWidth=.8;
      for(let x=0;x<W+sz;x+=sz){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=-sz+offY;y<H+sz;y+=sz){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    }

    const SPARKS = Array.from({length:18},()=>({
      x:Math.random(),y:Math.random(),
      vx:(Math.random()-.5)*.0003,vy:(Math.random()-.5)*.0003,
      r:Math.random()*1.5+.5,phase:Math.random()*Math.PI*2,
    }));
    function drawSparks() {
      SPARKS.forEach(s=>{
        s.x+=s.vx; s.y+=s.vy;
        if(s.x<0)s.x=1; if(s.x>1)s.x=0; if(s.y<0)s.y=1; if(s.y>1)s.y=0;
        ctx.globalAlpha=.3+Math.sin(frame*.05+s.phase)*.25;
        ctx.fillStyle='rgb(74,222,128)'; ctx.shadowColor='rgba(74,222,128,0.8)'; ctx.shadowBlur=6;
        ctx.beginPath(); ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.globalAlpha=1;
      });
    }

    function draw() {
      ctx.clearRect(0,0,W,H);
      drawOrbs(); drawGrid(); drawRoutes(); drawSparks();
      CARS.forEach(car=>{
        car.t += car.speed; if(car.t>1)car.t=0;
        const {pos,angle} = routePos(ROUTES[car.ri], car.t);
        const fade = Math.min(car.t*8,1)*Math.min((1-car.t)*8,1);
        drawCar(pos.x,pos.y,angle,car,fade*.9);
      });
      PINS.forEach(p=>drawPin(p.rx*W,p.ry*H,p.phase));
      frame++; animId = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, background:"#050e08" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />
    </div>
  );
}