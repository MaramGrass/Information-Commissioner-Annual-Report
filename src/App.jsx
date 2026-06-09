import { useState, useEffect, useRef, useCallback } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const C = {
  p:"#7b4fbf",o:"#8a8b3a",t:"#2abfbf",s:"#1ea8d6",b:"#1e7fd6",
  ink:"#0d0d1a",mid:"#4a4a6a",off:"#f7f6f2",paper:"#faf9f6",white:"#ffffff",lite:"#e8e6f0",
};
const GH = `linear-gradient(90deg,${C.p} 0%,${C.o} 35%,${C.t} 68%,${C.s} 100%)`;
const G1 = `linear-gradient(135deg,${C.p} 0%,${C.o} 35%,${C.t} 68%,${C.s} 100%)`;

function GradientText({ children, style = {} }) {
  return <span style={{ background:G1,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",...style }}>{children}</span>;
}

function Counter({ target, plus = false }) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800, t0 = performance.now();
        const run = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(e * target));
          if (p < 1) requestAnimationFrame(run); else setDone(true);
        };
        requestAnimationFrame(run);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{plus && done ? "+" : ""}</span>;
}

function Reveal({ children, direction = "up", delay = 0, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const transforms = { up:"translateY(36px) scale(0.95)",left:"translateX(-36px) scale(0.96)",right:"translateX(36px) scale(0.96)" };
  return (
    <div ref={ref} style={{ opacity:vis?1:0,transform:vis?"none":transforms[direction],transition:`opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,...style }}>
      {children}
    </div>
  );
}

function ChartCanvas({ config, height = 160 }) {
  const ref = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    Chart.defaults.font.family = "Arial, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = C.mid;
    Chart.defaults.plugins.legend.display = false;
    chartRef.current = new Chart(ref.current, config);
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);
  return <div style={{ position:"relative",flex:1,minHeight:height }}><canvas ref={ref} /></div>;
}

function SLabel({ children, light = false }) {
  return (
    <div style={{ fontSize:11,letterSpacing:".15em",textTransform:"uppercase",marginBottom:".35rem",fontWeight:500,background:light?"none":GH,WebkitBackgroundClip:light?"none":"text",WebkitTextFillColor:light?"rgba(255,255,255,.6)":"transparent",backgroundClip:light?"none":"text",color:light?"rgba(255,255,255,.6)":undefined }}>
      {children}
    </div>
  );
}
function SH2({ children, light = false }) {
  return <h2 style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(1.4rem,2.2vw,2rem)",lineHeight:1.08,marginBottom:".4rem",fontWeight:700,color:light?"white":C.ink }}>{children}</h2>;
}
function GradBar() {
  return <div style={{ height:3,background:GH,borderRadius:2,marginBottom:"1rem",width:48 }} />;
}
function CCard({ title, sub, children, dark = false, style: s = {} }) {
  return (
    <div style={{ background:dark?"rgba(255,255,255,.12)":C.white,borderRadius:16,padding:"1.1rem 1.3rem",border:`1px solid ${dark?"rgba(255,255,255,.15)":"rgba(0,0,0,.07)"}`,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",...s }}>
      <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:GH }} />
      <div style={{ fontSize:12,fontWeight:600,color:dark?"white":C.ink,marginBottom:".15rem",marginTop:".15rem",flexShrink:0 }}>{title}</div>
      {sub && <div style={{ fontSize:10,color:dark?"rgba(255,255,255,.6)":C.mid,marginBottom:".75rem",flexShrink:0 }}>{sub}</div>}
      {children}
    </div>
  );
}

function BreachBars() {
  const bars = [
    { lbl:"Art. 5(1)(f) — Integrity & confidentiality",w:80,pct:"80%",op:1 },
    { lbl:"Art. 32 — Security / cyber incidents",w:4,pct:"4%",op:.75 },
    { lbl:"Art. 24 — Controller responsibilities",w:2,pct:"2%",op:.65 },
    { lbl:"Art. 5(1)(d) — Accuracy of records",w:3,pct:"3%",op:.65 },
    { lbl:"Applied LED — Law enforcement",w:1,pct:"1%",op:.55 },
    { lbl:"Determined not to be a breach",w:7,pct:"7%",op:.5 },
  ];
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); },{ threshold:0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display:"flex",flexDirection:"column",gap:".5rem",flex:1,minHeight:0,justifyContent:"space-between" }}>
      {bars.map((b) => (
        <div key={b.lbl} style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:".35rem",minHeight:0 }}>
          <div style={{ display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:"1rem" }}>
            <div style={{ fontSize:"clamp(10px,1.1vw,13px)",color:"rgba(255,255,255,.7)",lineHeight:1.3,flex:1 }}>{b.lbl}</div>
            <div style={{ fontSize:"clamp(1.4rem,2.5vw,2.8rem)",fontWeight:900,color:"white",opacity:b.op,lineHeight:1,flexShrink:0 }}>{b.pct}</div>
          </div>
          <div style={{ height:"clamp(8px,1.2vh,14px)",background:"rgba(255,255,255,.12)",borderRadius:4,overflow:"hidden" }}>
            <div style={{ height:"100%",borderRadius:4,background:`rgba(255,255,255,${b.op})`,width:vis?`${b.w}%`:"0%",transition:"width 1.4s cubic-bezier(.25,1,.5,1)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HScrollTrack({ children }) {
  const ref = useRef(null);
  const drag = useRef({ down:false,sx:0,sl:0 });
  const scroll = (amt) => ref.current?.scrollBy({ left:amt,behavior:"smooth" });
  const arrowStyle = {
    position:"absolute",top:"50%",width:40,height:40,borderRadius:"50%",
    border:"none",background:C.white,cursor:"pointer",fontSize:16,zIndex:10,
    boxShadow:"0 4px 16px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center",
    transform:"translateY(-50%)",
  };
  useEffect(() => {
    const el = ref.current;
    const onMove = (e) => {
      if (!drag.current.down) return;
      e.preventDefault();
      el.scrollLeft = drag.current.sl - (e.pageX - drag.current.sx);
    };
    const onUp = () => { if (!drag.current.down) return; drag.current.down = false; el.style.cursor = "grab"; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, []);
  return (
    <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column", minHeight:0 }}>
      <div ref={ref}
        onMouseDown={(e) => { drag.current = { down:true,sx:e.pageX,sl:ref.current.scrollLeft }; ref.current.style.cursor = "grabbing"; ref.current.style.userSelect = "none"; }}
        onMouseUp={() => { drag.current.down = false; ref.current.style.cursor = "grab"; ref.current.style.userSelect = ""; }}
        style={{ display:"flex",gap:"1.25rem",padding:"0.75rem 5vw",overflowX:"auto",scrollSnapType:"x mandatory",scrollPaddingLeft:"5vw",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",cursor:"grab",flex:1,alignItems:"stretch",minHeight:0 }}
      >{children}</div>
    </div>
  );
}

function NavOverlay({ open, onClose, onNavigate }) {
  const sections = [
    { id:"foreword",label:"Commissioner's foreword" },
    { id:"numbers",label:"Year in numbers" },
    { id:"foi",label:"Freedom of information" },
    { id:"casestudies",label:"Case studies" },
    { id:"complaints",label:"Data protection & complaints" },
    { id:"breaches",label:"Personal data breaches" },
    { id:"regulatory",label:"Regulatory action" },
    { id:"priorities",label:"Strategy 2026/27" },
    { id:"finance",label:"Finance" },
  ];
  const handleClick = (id) => { onNavigate(id); onClose(); };
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:C.white,display:"flex",alignItems:"center",justifyContent:"flex-start",clipPath:open?"circle(150% at calc(100% - 54px) 50px)":"circle(0% at calc(100% - 54px) 50px)",transition:"clip-path 0.65s cubic-bezier(.77,0,.18,1)",pointerEvents:open?"all":"none" }} onClick={onClose}>
      <div style={{ position:"absolute",inset:0,background:GH,opacity:.04 }} onClick={(e) => e.stopPropagation()} />
      <ul style={{ listStyle:"none",padding:0,paddingLeft:"10vw" }} onClick={(e) => e.stopPropagation()}>
        {sections.map((s, i) => (
          <li key={s.id} style={{ opacity:open?1:0,transform:open?"none":"translateX(-24px)",transition:`opacity 0.4s ${0.1+i*0.05}s, transform 0.4s ${0.1+i*0.05}s` }}>
            <button onClick={() => handleClick(s.id)} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"Arial,sans-serif",fontSize:"clamp(1.5rem,2.8vw,2.8rem)",color:"rgba(13,13,26,.2)",textAlign:"left",lineHeight:1.6,display:"flex",alignItems:"center",gap:"1.2rem",padding:0,transition:"color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(13,13,26,.2)"; }}
            >
              <span style={{ fontSize:11,letterSpacing:".15em",background:GH,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",opacity:.5 }}>{String(i+1).padStart(2,"0")} —</span>
              {s.label}
            </button>
          </li>
        ))}
      </ul>
      <p style={{ position:"absolute",bottom:"2.5rem",left:"10vw",fontSize:11,color:"rgba(13,13,26,.3)",letterSpacing:".1em" }}>ESC or click outside to close</p>
    </div>
  );
}

const tagStyle = (color, bg) => ({ fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,display:"inline-block",marginBottom:".6rem",fontWeight:500,background:bg,color });

export default function App() {
  const containerRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cooldown = false;
    const onWheel = (e) => {
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      setTimeout(() => { cooldown = false; }, 750);
      const dir = e.deltaY > 0 ? 1 : -1;
      const panelW = el.clientWidth;
      const cur = Math.round(el.scrollLeft / panelW);
      const total = Math.round(el.scrollWidth / panelW);
      const next = Math.max(0, Math.min(total - 1, cur + dir));
      el.scrollTo({ left: next * panelW, behavior: "smooth" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrollPct((el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => { if (navOpen) document.body.style.overflow = "hidden"; }, [navOpen]);

  const scrollToPanel = useCallback((id) => {
    const el = document.getElementById(id);
    const container = containerRef.current;
    if (!el || !container) return;
    const rect = el.getBoundingClientRect();
    const target = container.scrollLeft + rect.left;
    const start = container.scrollLeft;
    const diff = target - start;
    const dur = 900;
    let t0 = null;
    const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts-t0)/dur, 1);
      container.scrollLeft = start + diff * ease(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const gl = { color:"#eceaf4" };
  const charts = {
    FOI:{ type:"bar",data:{ labels:["23/24 Q1","Q2","Q3","Q4","24/25 Q1","Q2","Q3","Q4","25/26 Q1","Q2","Q3","Q4"],datasets:[{ label:"New requests",data:[6,3,7,5,5,9,6,2,3,8,4,9],backgroundColor:C.p+"99",borderRadius:4 },{ label:"Decision notices",data:[2,1,0,1,1,0,4,0,0,1,5,11],backgroundColor:C.t,borderRadius:4 }] },options:{ responsive:true,maintainAspectRatio:false,plugins:{ legend:{ display:true,position:"top",labels:{ padding:12,usePointStyle:true,pointStyleWidth:10,font:{size:10} } } },scales:{ y:{ grid:gl,ticks:{stepSize:2} },x:{ grid:{display:false},ticks:{maxRotation:45,font:{size:9}} } } } },
    Comp:{ type:"bar",data:{ labels:["2023/24","2024/25","2025/26"],datasets:[{ data:[20,14,36],backgroundColor:[C.t+"55",C.t+"88",C.t],borderRadius:6,borderSkipped:false }] },options:{ responsive:true,maintainAspectRatio:false,scales:{ y:{ grid:gl },x:{ grid:{display:false} } } } },
    Sect:{ type:"doughnut",data:{ labels:["Public sector","Private sector","Domestic CCTV"],datasets:[{ data:[38,30,32],backgroundColor:[C.p,C.t,C.s],borderWidth:0,hoverOffset:6 }] },options:{ responsive:true,maintainAspectRatio:false,cutout:"66%",plugins:{ legend:{ display:true,position:"bottom",labels:{ padding:12,usePointStyle:true,pointStyleWidth:10,font:{size:10} } } } } },
    Nature:{ type:"bar",data:{ labels:["SAR","Disclosure","Transparency","Security","Lawfulness","Other"],datasets:[{ data:[21,8,3,2,1,1],backgroundColor:[C.p,C.t,C.s,C.o,C.b,C.p+"88"],borderRadius:5,borderSkipped:false }] },options:{ responsive:true,maintainAspectRatio:false,indexAxis:"y",scales:{ x:{ grid:gl },y:{ grid:{display:false} } } } },
    Speed:{ type:"bar",data:{ labels:["2023/24","2024/25","2025/26"],datasets:[{ label:"< 3 months",data:[9,3,21],backgroundColor:C.t,borderRadius:4 },{ label:"3–6 months",data:[6,1,3],backgroundColor:C.s,borderRadius:4 },{ label:"6–12 months",data:[3,4,0],backgroundColor:C.p+"99",borderRadius:4 },{ label:"12+ months",data:[2,0,0],backgroundColor:C.p+"44",borderRadius:4 }] },options:{ responsive:true,maintainAspectRatio:false,plugins:{ legend:{ display:true,position:"top",labels:{ padding:10,usePointStyle:true,pointStyleWidth:10,font:{size:10} } } },scales:{ x:{ stacked:true,grid:{display:false} },y:{ stacked:true,grid:gl } } } },
    BrY:{ type:"bar",data:{ labels:["2022/23","2023/24","2024/25","2025/26"],datasets:[{ data:[264,250,152,200],backgroundColor:[C.t+"44",C.t+"66",C.t+"99",C.t],borderRadius:6,borderSkipped:false }] },options:{ responsive:true,maintainAspectRatio:false,scales:{ y:{ grid:gl },x:{ grid:{display:false} } } } },
    BrS:{ type:"doughnut",data:{ labels:["Public sector","Private sector"],datasets:[{ data:[52,48],backgroundColor:[C.p,C.t],borderWidth:0,hoverOffset:6 }] },options:{ responsive:true,maintainAspectRatio:false,cutout:"66%",plugins:{ legend:{ display:true,position:"bottom",labels:{ padding:12,usePointStyle:true,pointStyleWidth:10,font:{size:10} } } } } },
    Spec:{ type:"line",data:{ labels:["2023/24","2024/25","2025/26"],datasets:[{ data:[46,27,29],borderColor:"white",backgroundColor:"rgba(255,255,255,.15)",borderWidth:2.5,fill:true,tension:.4,pointBackgroundColor:"white",pointRadius:6 }] },options:{ responsive:true,maintainAspectRatio:false,scales:{ y:{ grid:{ color:"rgba(255,255,255,.12)" },ticks:{ color:"rgba(255,255,255,.65)",callback:(v)=>v+"%" },min:0,max:55 },x:{ grid:{display:false},ticks:{ color:"rgba(255,255,255,.65)" } } } } },
    BrQ:{ type:"bar",data:{ labels:["Q1","Q2","Q3","Q4"],datasets:[{ data:[62,52,39,47],backgroundColor:["rgba(255,255,255,.5)","rgba(255,255,255,.6)","rgba(255,255,255,.4)","rgba(255,255,255,.7)"],borderRadius:6,borderSkipped:false }] },options:{ responsive:true,maintainAspectRatio:false,scales:{ y:{ grid:{ color:"rgba(255,255,255,.12)" },ticks:{ color:"rgba(255,255,255,.65)" } },x:{ grid:{display:false},ticks:{ color:"rgba(255,255,255,.65)" } } } } },
    Reg:{ type:"bar",data:{ labels:["2023/24","2024/25","2025/26"],datasets:[{ data:[31,14,5],backgroundColor:[C.p+"55",C.p+"99",C.p],borderRadius:6,borderSkipped:false }] },options:{ responsive:true,maintainAspectRatio:false,scales:{ y:{ grid:gl },x:{ grid:{display:false} } } } },
    Dpia:{ type:"bar",data:{ labels:["2023/24","2024/25","2025/26"],datasets:[{ label:"Public sector",data:[6,4,4],backgroundColor:C.t,borderRadius:4 },{ label:"Private sector",data:[0,0,1],backgroundColor:C.p,borderRadius:4 }] },options:{ responsive:true,maintainAspectRatio:false,plugins:{ legend:{ display:true,position:"top",labels:{ padding:12,usePointStyle:true,pointStyleWidth:10,font:{size:10} } } },scales:{ y:{ grid:gl },x:{ grid:{display:false} } } } },
  };

  const P = (bg, extra = {}) => ({
    minWidth:"100vw", width:"100vw", height:"100vh", flexShrink:0,
    scrollSnapAlign:"start", background:bg, overflow:"hidden",
    display:"flex", flexDirection:"column", padding:"7vh 6vw 4vh",
    position:"relative", boxSizing:"border-box", ...extra,
  });

  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:Arial,sans-serif; background:${C.off}; color:${C.ink}; overflow:hidden; }
        @keyframes float { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-20px) scale(1.05)} }
        @keyframes float-logo { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin-slow { to{transform:rotate(360deg)} }
        @keyframes marquee { to{transform:translateX(-50%)} }
        @keyframes pulse-right { 0%{transform:scaleX(0);transform-origin:left} 50%{transform:scaleX(1);transform-origin:left} 51%{transform:scaleX(1);transform-origin:right} 100%{transform:scaleX(0);transform-origin:right} }
        @keyframes pop-in { 0%{opacity:0;transform:scale(.88) translateY(22px)} 60%{opacity:1} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes slide-up { 0%{opacity:0;transform:translateY(18px)} 100%{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { display:none }
        .val-card:hover { transform:translateY(-5px) !important; box-shadow:0 20px 56px rgba(0,0,0,.11) !important }
        .cc-card:hover { transform:translateY(-6px) !important; box-shadow:0 24px 60px rgba(0,0,0,.13) !important }
        .ins-item:hover { transform:translateX(5px) !important; box-shadow:0 4px 24px rgba(0,0,0,.1) !important }
        .stat-card:hover .stat-bar { transform:scaleX(1) !important }
        .stat-card:hover { transform:translateY(-4px) !important; box-shadow:0 16px 44px rgba(0,0,0,.09) !important; transition:transform .25s, box-shadow .25s !important }
        .pri-card { transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s !important }
        .pri-card:hover { transform:translateY(-6px) scale(1.015) !important; box-shadow:0 24px 60px rgba(0,0,0,.12) !important }
        .fin-card { transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s !important }
        .fin-card:hover { transform:translateY(-5px) !important; box-shadow:0 20px 56px rgba(0,0,0,.1) !important }
      `}</style>

      {/* Progress */}
      <div style={{ position:"fixed",top:0,left:0,height:4,background:GH,width:`${scrollPct}%`,zIndex:998,boxShadow:"0 0 12px rgba(42,191,191,.5)",transition:"width 0.1s" }} />

      {/* Hamburger */}
      <button onClick={() => setNavOpen(v => !v)} style={{ position:"fixed",top:24,right:28,zIndex:1001,width:52,height:52,borderRadius:"50%",background:C.white,border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,boxShadow:"0 4px 24px rgba(123,79,191,.18)" }}>
        {[C.p,C.t,C.b].map((col, i) => (
          <span key={i} style={{ display:"block",width:22,height:1.5,background:col,transition:"transform .35s ease, opacity .2s, width .3s",transformOrigin:"center",...(navOpen&&i===0?{transform:"translateY(6.5px) rotate(45deg)"}:{}),...(navOpen&&i===1?{opacity:0,width:0}:{}),...(navOpen&&i===2?{transform:"translateY(-6.5px) rotate(-45deg)"}:{}) }} />
        ))}
      </button>

      <NavOverlay open={navOpen} onClose={() => setNavOpen(false)} onNavigate={scrollToPanel} />

      {/* ═══ HORIZONTAL SCROLL CONTAINER ════════════════════════════════════ */}
      <div ref={containerRef} style={{ display:"flex",height:"100vh",overflowX:"scroll",overflowY:"hidden",scrollSnapType:"x mandatory",scrollbarWidth:"none",WebkitOverflowScrolling:"touch" }}>

        {/* ── PANEL 1: HERO ────────────────────────────────────────────────── */}
        <section id="top" style={{ minWidth:"100vw",width:"100vw",height:"100vh",flexShrink:0,scrollSnapAlign:"start",background:C.white,display:"grid",gridTemplateColumns:"1.1fr .9fr",alignItems:"center",padding:"0 6vw",position:"relative",overflow:"hidden" }}>
          {[{ w:500,h:500,bg:C.p,top:"-10%",left:"-5%",d:0 },{ w:400,h:400,bg:C.t,top:"30%",right:"-5%",d:2.5 },{ w:350,h:350,bg:C.s,bottom:"-5%",left:"30%",d:5 }].map((b,i) => (
            <div key={i} style={{ position:"absolute",borderRadius:"50%",filter:"blur(80px)",opacity:.15,width:b.w,height:b.h,background:b.bg,top:b.top,left:b.left,right:b.right,bottom:b.bottom,animation:`float 8s ease-in-out ${b.d}s infinite` }} />
          ))}
          <div style={{ padding:"4rem 0",position:"relative",zIndex:2 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:12,marginBottom:"2rem" }}>
              <div style={{ background:GH,padding:"6px 18px",borderRadius:40,fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:"white",fontWeight:500 }}>Annual Report · June 2026</div>
            </div>
            <h1 style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(2.8rem,5vw,5rem)",lineHeight:1.05,marginBottom:"1.25rem",fontWeight:900 }}>
              <GradientText>Information</GradientText>
              <span style={{ display:"block" }}>Commissioner's</span>
              <span style={{ display:"block",fontStyle:"italic",fontWeight:300,fontSize:".85em" }}>Annual Report 2025/26</span>
            </h1>
            <p style={{ fontSize:"1rem",color:C.mid,lineHeight:1.75,maxWidth:400,marginBottom:"2.5rem",fontWeight:300 }}>Compliance through collaboration. A year of growth, modernisation, and deepening our impact across the Isle of Man and beyond.</p>
            <div style={{ display:"flex",gap:"1rem",alignItems:"center",flexWrap:"wrap" }}>
              <button onClick={() => scrollToPanel("foreword")} style={{ display:"inline-flex",alignItems:"center",gap:10,background:G1,color:"white",border:"none",cursor:"pointer",padding:"14px 28px",borderRadius:50,fontSize:13,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",boxShadow:"0 8px 32px rgba(42,191,191,.3)" }}>Explore the report →</button>
              <a href="https://www.inforights.im" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:8,color:C.p,fontSize:13,fontWeight:500,textDecoration:"none",borderBottom:`1.5px solid ${C.p}`,paddingBottom:2 }}>Visit inforights.im →</a>
            </div>
          </div>
          <div style={{ position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div style={{ position:"relative",width:340,height:340,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ position:"absolute",inset:-2,borderRadius:"50%",background:GH,opacity:.12,animation:"spin-slow 20s linear infinite" }} />
              <div style={{ position:"absolute",inset:20,borderRadius:"50%",border:"1px solid rgba(42,191,191,.15)",animation:"spin-slow 14s linear infinite reverse" }} />
              <div style={{ width:"72%",position:"relative",zIndex:2,animation:"float-logo 6s ease-in-out infinite" }}>
                <img src="/ICO LOGO Background Removed.png" alt="Information Commissioner's Office Logo" style={{ width:"100%",filter:"drop-shadow(0 8px 32px rgba(123,79,191,.3))" }} />
              </div>
            </div>
          </div>
          {/* Stats ticker */}
          <div style={{ position:"absolute",bottom:"2rem",left:"6vw",right:"7rem",display:"flex",alignItems:"center",gap:"2.5rem",borderTop:"1px solid rgba(0,0,0,.07)",paddingTop:"1.25rem",zIndex:2,flexWrap:"wrap" }}>
            {[{v:200,l:"Breaches reported"},{v:53,l:"Total complaints"},{v:31600,l:"People impacted"},{v:10,l:"Staff members"},{v:81,l:"Fee consultation responses"}].map((t,i) => (
              <div key={i} style={{ display:"flex",flexDirection:"column",gap:".2rem",flexShrink:0 }}>
                <div style={{ fontFamily:"Arial,sans-serif",fontSize:"1.6rem",fontWeight:700,lineHeight:1 }}><GradientText><Counter target={t.v}/></GradientText></div>
                <div style={{ fontSize:11,color:C.mid }}>{t.l}</div>
              </div>
            ))}
          </div>
          {/* Scroll hint */}
          <div style={{ position:"absolute",right:"3rem",bottom:"3rem",display:"flex",alignItems:"center",gap:".5rem",zIndex:2 }}>
            <div style={{ width:48,height:1,background:GH,animation:"pulse-right 1.8s ease-in-out infinite" }} />
            <span style={{ fontSize:10,letterSpacing:".15em",color:C.mid,textTransform:"uppercase" }}>Scroll</span>
          </div>
        </section>

        {/* ── PANEL 2: FOREWORD ────────────────────────────────────────────── */}
        <section id="foreword" style={{ ...P(C.paper) }}>
          <div style={{ display:"grid",gridTemplateColumns:"240px 1fr",gap:"4vw",alignItems:"center",height:"100%" }}>
            <Reveal direction="left">
              <div style={{ width:240,aspectRatio:"3/4",borderRadius:20,overflow:"hidden",background:C.lite,flexShrink:0 }}>
                <img src="/Alex head with background.png" alt="Dr Alexandra Delaney-Bhattacharya" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block" }} />
              </div>
            </Reveal>
            <Reveal direction="right">
              <SLabel>Information Commissioner's foreword</SLabel>
              <SH2>A year of significant change</SH2>
              <GradBar/>
              <p style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(1.1rem,1.8vw,1.45rem)",fontStyle:"italic",fontWeight:300,lineHeight:1.65,color:C.ink,marginBottom:"1.75rem",paddingLeft:"1.25rem",borderLeft:`3px solid ${C.t}` }}>
                "Our strategy for 2026/27, <em>Compliance Through Collaboration</em>, reflects our commitment to listening, learning, and working together to protect the people of the Isle of Man."
              </p>
              <div style={{ fontSize:".9rem",color:C.mid,lineHeight:1.85,fontWeight:300,maxWidth:640 }}>
                <p style={{ marginBottom:".75rem" }}>This has been a year of significant change. As technology advances and the ways data is processed become increasingly complex, the need for trusted, effective regulation has never been greater.</p>
                <p style={{ marginBottom:".75rem" }}>We have grown our team, modernised our systems, delivered our fee consultation, and deepened our engagement both domestically and internationally — including major conferences in Washington, Venice, Seoul, and India. We signed MoUs with Malta and Dubai and participated in joint international investigations for the first time.</p>
                <p>I would like to thank my team for their professionalism and commitment throughout a demanding year.</p>
              </div>
              <div style={{ marginTop:"1.5rem",fontSize:".85rem",color:C.mid }}>
                <strong style={{ color:C.ink,display:"block",fontWeight:600,marginBottom:".2rem" }}>Dr Alexandra Delaney-Bhattacharya</strong>
                Information Commissioner, May 2026
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── PANEL 3: VALUES ──────────────────────────────────────────────── */}
        <section style={{ ...P(C.white) }}>
          <Reveal>
            <SLabel>Our vision & values</SLabel>
            <SH2>How we work</SH2>
            <p style={{ fontSize:".85rem",color:C.mid,lineHeight:1.7,maxWidth:600,marginBottom:"1.5rem",fontWeight:300 }}>Everyone can trust that their personal information is respected, protected and used responsibly, supporting a fair, innovative and thriving society and economy.</p>
          </Reveal>
          <Reveal delay={0.08} style={{ flex:1,display:"flex",flexDirection:"column" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem",flex:1 }}>
              {[
                { title:"Collaborative",body:"We work openly with others, listening carefully to different views. By sharing ideas and solving problems together, we create solutions that truly help people.",color:C.p,
                  svg:<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><circle cx="30" cy="38" r="18" stroke="currentColor" strokeWidth="2.5" opacity=".35"/><circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="2.5" opacity=".35"/><circle cx="30" cy="38" r="8" fill="currentColor" opacity=".08"/><circle cx="50" cy="38" r="8" fill="currentColor" opacity=".08"/></svg> },
                { title:"Confident",body:"We are clear about our role and trusted to make good decisions. We speak up, take action, and are not afraid to use our knowledge with conviction.",color:C.t,
                  svg:<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><path d="M20 60 L60 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".35"/><path d="M42 20 H60 V38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".35"/><circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity=".15"/></svg> },
                { title:"Curious",body:"We seek to understand different viewpoints. We experiment, try new ideas, and make answers as simple and practical as possible for those we serve.",color:C.s,
                  svg:<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><circle cx="33" cy="33" r="18" stroke="currentColor" strokeWidth="2.5" opacity=".35"/><path d="M46 46 L62 62" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity=".35"/><circle cx="33" cy="33" r="10" fill="currentColor" opacity=".08"/></svg> },
                { title:"Committed",body:"We care about our work and the people it affects and try to do the right thing every day. We act responsibly and deliver on what we have promised.",color:C.o,
                  svg:<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}><path d="M40 12 L52 18 L64 14 V52 L40 68 L16 52 V14 L28 18 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" opacity=".25"/><path d="M26 40 L35 50 L54 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/></svg> },
              ].map((v) => (
                <div key={v.title} className="val-card" style={{ background:C.white,borderRadius:20,padding:"1.75rem",border:"1px solid rgba(0,0,0,.07)",position:"relative",overflow:"hidden",transition:"transform .3s, box-shadow .3s",display:"flex",flexDirection:"column",color:v.color }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:GH }}/>
                  {/* Decorative background blob */}
                  <div style={{ position:"absolute",bottom:-30,right:-30,width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle, ${v.color}14, transparent 70%)`,pointerEvents:"none" }}/>
                  {/* SVG illustration */}
                  <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",minHeight:0 }}>
                    <div style={{ width:"55%",aspectRatio:"1",color:v.color }}>{v.svg}</div>
                  </div>
                  <div style={{ fontFamily:"Arial,sans-serif",fontSize:"1.1rem",fontWeight:700,color:C.ink,marginBottom:".4rem" }}>{v.title}</div>
                  <div style={{ fontSize:11.5,color:C.mid,lineHeight:1.65 }}>{v.body}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── PANEL 4: YEAR IN NUMBERS ─────────────────────────────────────── */}
        <section id="numbers" style={{ ...P(C.paper) }}>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:GH }}/>
          <Reveal>
            <SLabel>The year in numbers</SLabel>
            <SH2>2025/26 at a glance</SH2>
          </Reveal>
          <Reveal delay={0.06} style={{ flex:1,display:"flex",flexDirection:"column",gap:"0.5rem",minHeight:0 }}>
            {[
              [{ tag:"People affected",tc:C.t,tb:"rgba(42,191,191,.1)",v:31600,l:"Estimated impacted by personal data breaches" },{ tag:"Breaches reported",tc:C.p,tb:"rgba(123,79,191,.1)",v:200,l:"Personal data breaches — up from 152 in 2024/25" },{ tag:"Total complaints",tc:C.b,tb:"rgba(30,127,214,.1)",v:53,l:"Including domestic CCTV — up from 25 last year" },{ tag:"FOI reviews",tc:C.t,tb:"rgba(42,191,191,.1)",v:24,l:"Applications for a decision received" },{ tag:"Staff",tc:C.o,tb:"rgba(138,139,58,.1)",v:10,l:"Members of staff — doubled from 5" }],
              [{ tag:"Fee consultation",tc:C.p,tb:"rgba(123,79,191,.1)",v:81,l:"Responses to our registration fees consultation" },{ tag:"Survey",tc:C.t,tb:"rgba(42,191,191,.1)",v:300,plus:true,l:"Organisations in our island-wide DP survey" },{ tag:"Events",tc:C.b,tb:"rgba(30,127,214,.1)",v:20,plus:true,l:"Domestic events attended or spoken at" },{ tag:"Decisions",tc:C.o,tb:"rgba(138,139,58,.1)",v:21,l:"FOI requests closed — nearly double prior year" },{ tag:"Regulatory actions",tc:C.p,tb:"rgba(123,79,191,.1)",v:5,l:"Enforcement actions including 4 reprimands" }],
            ].map((row, ri) => (
              <div key={ri} style={{ flex:1,display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2,background:C.lite,borderRadius:16,overflow:"hidden" }}>
                {row.map((s) => (
                  <div key={s.tag} className="stat-card" style={{ background:C.white,padding:"clamp(.6rem,1.8vh,1.5rem) 1.25rem",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
                    <div className="stat-bar" style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:GH,transform:"scaleX(0)",transition:"transform .4s" }}/>
                    <div style={tagStyle(s.tc,s.tb)}>{s.tag}</div>
                    <div style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(2.8rem,9vh,7rem)",fontWeight:900,lineHeight:1,margin:"auto 0",padding:"0.2em 0" }}><GradientText><Counter target={s.v} plus={s.plus}/></GradientText></div>
                    <div style={{ fontSize:"clamp(11px,1.8vh,15px)",color:C.mid,lineHeight:1.4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── PANEL 5: FOI ─────────────────────────────────────────────────── */}
        <section id="foi" style={{ ...P(C.white) }}>
          <Reveal>
            <SLabel>Freedom of information</SLabel>
            <SH2>FOI decision reviews 2025/26</SH2>
            <p style={{ fontSize:".85rem",color:C.mid,lineHeight:1.7,maxWidth:600,marginBottom:"1.25rem",fontWeight:300 }}>24 applications received. With the new FOI Specialist in post from June 2025, closed reviews nearly doubled to 21, with 11 decision notices published in Q4 alone.</p>
          </Reveal>
          <div style={{ display:"grid",gridTemplateColumns:"3fr 2fr",gap:"3vw",flex:1,minHeight:0 }}>
            <Reveal direction="left" style={{ display:"flex",flexDirection:"column" }}>
              <CCard title="New requests vs decision notices published" sub="By quarter across three reporting periods — Q4 2025/26 was a record quarter" style={{ flex:1 }}>
                <ChartCanvas config={charts.FOI} height={80}/>
              </CCard>
            </Reveal>
            <Reveal direction="right" style={{ display:"flex",flexDirection:"column",gap:".6rem",flex:1,minHeight:0 }}>
              {[
                { c:C.p,title:"Backlog peaked at 33",body:"Reached 33 in Q3 2025/26, driven by legacy capacity issues following senior departures in 2023." },
                { c:C.t,title:"FOI Specialist appointed June 2025",body:"Productivity surged immediately — 12 requests closed in Q4, 11 as published decision notices." },
                { c:C.b,title:"Quarterly statistics published",body:"From April 2026 the ICO began publishing rolling 12-month FOI statistics in collaboration with OCSIA." },
                { c:C.o,title:"Practical refusals training",body:"Targeted training for public authorities on practical refusals held December 2025, with further sessions planned." },
              ].map((ins) => (
                <div key={ins.title} className="ins-item" style={{ flex:1,padding:"1rem 1.25rem",borderRadius:12,borderLeft:`4px solid ${ins.c}`,background:C.white,boxShadow:"0 2px 12px rgba(0,0,0,.04)",transition:"transform .25s, box-shadow .25s",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",right:"1rem",top:"50%",transform:"translateY(-50%)",fontFamily:"Arial,sans-serif",fontSize:"4rem",fontWeight:900,color:ins.c,opacity:.04,lineHeight:1,pointerEvents:"none" }}>→</div>
                  <div style={{ fontSize:"clamp(13px,1.1vw,15px)",fontWeight:700,color:C.ink,marginBottom:".3rem" }}>{ins.title}</div>
                  <div style={{ fontSize:"clamp(11px,0.9vw,13px)",color:C.mid,lineHeight:1.6 }}>{ins.body}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── PANEL 6: CASE STUDIES ────────────────────────────────────────── */}
        <section id="casestudies" style={{ ...P(C.off) }}>
          <div style={{ marginBottom:"1rem" }}>
            <Reveal>
              <SLabel>Case studies</SLabel>
              <SH2>Real decisions, real consequences</SH2>
              <p style={{ fontSize:".85rem",color:C.mid,lineHeight:1.7,maxWidth:600,marginBottom:".5rem",fontWeight:300 }}>Every case reflects the human dimension of data protection. Drag to explore highlights from 2025/26.</p>
            </Reveal>
          </div>
          <div style={{ flex:1,display:"flex",flexDirection:"column",minHeight:0,margin:"0 -6vw" }}>
          <HScrollTrack>
            {[
              { num:"01",tag:"CCTV / data breach",title:"Recording CCTV footage to a personal device",body:"A senior staff member recorded live security footage on a personal phone and shared it with an unauthorised party — knowingly contravening data protection law. Seniority was treated as an aggravating factor.",bg:C.p,light:false },
              { num:"02",tag:"FOI — food safety",title:"A proactive pivot: food inspection reports",body:"A public authority applied a blanket exemption to food inspection records without evaluating each document. The ICO ruled reprocessing was required and encouraged a proactive publication scheme.",bg:C.white,light:true },
              { num:"03",tag:"DPIA consultation",title:"Local processing, local context",body:"A controller relied too heavily on UK precedent without addressing Isle of Man context. Missing risk assessment, no DPO evidence, no stakeholder engagement. The ICO paused consultation and required full resubmission.",bg:C.t,light:false },
              { num:"04",tag:"International",title:"Stronger together: deepfakes joint statement",body:"The ICO joined 61 regulators worldwide to raise concerns about AI-generated deepfakes. A joint statement with Jersey and Guernsey also provided practical safety advice for parents and carers.",bg:C.b,light:false },
              { num:"05",tag:"Engagement",title:"Listening to organisations — shaping strategy",body:"Over 300 organisations participated in the Data Protection in Practice survey. Results explored with 100+ professionals, directly informing the 2026/27 strategy.",bg:C.white,light:true },
              { num:"06",tag:"Brand refresh",title:"A brand new look — shaped by local talent",body:"The ICO's new identity was co-created with final year art students from University College Isle of Man, incorporating the triskelion and Manx tartan colour palette.",bg:C.o,light:false },
            ].map((c) => (
              <div key={c.num} className="cc-card" style={{ flex:"0 0 340px",scrollSnapAlign:"start",borderRadius:22,padding:"2.25rem",background:c.bg,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",border:c.light?"1px solid rgba(0,0,0,.07)":"none",transition:"transform .35s, box-shadow .35s" }}>
                {c.light && <div style={{ height:3,background:GH,borderRadius:2,marginBottom:"1.5rem" }}/>}
                <div style={{ position:"absolute",top:"1.5rem",right:"2rem",fontFamily:"Arial,sans-serif",fontSize:"5rem",fontWeight:900,opacity:.1,lineHeight:1,color:c.light?C.ink:"white" }}>{c.num}</div>
                <div style={{ fontSize:10,letterSpacing:".12em",textTransform:"uppercase",marginBottom:".75rem",color:c.light?C.mid:"rgba(255,255,255,.65)",fontWeight:500 }}>{c.tag}</div>
                <div style={{ fontFamily:"Arial,sans-serif",fontSize:"1.2rem",color:c.light?C.ink:"white",lineHeight:1.3,marginBottom:".6rem",fontWeight:700 }}>{c.title}</div>
                <div style={{ fontSize:12,color:c.light?C.mid:"rgba(255,255,255,.65)",lineHeight:1.6 }}>{c.body}</div>
              </div>
            ))}
          </HScrollTrack>
          </div>
        </section>

        {/* ── PANEL 7: COMPLAINTS ──────────────────────────────────────────── */}
        <section id="complaints" style={{ ...P(C.white) }}>
          <Reveal style={{ flexShrink:0 }}>
            <SLabel>Data protection complaints</SLabel>
            <SH2>Complaints in 2025/26</SH2>
          </Reveal>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:"1rem",flex:1,minHeight:0 }}>
            <Reveal direction="left" delay={0.05} style={{ display:"flex",flexDirection:"column",minHeight:0 }}><CCard title="Total complaints by year (excl. domestic CCTV)" sub="Formal and informal investigations" style={{ flex:1 }}><ChartCanvas config={charts.Comp} height={60}/></CCard></Reveal>
            <Reveal direction="right" delay={0.05} style={{ display:"flex",flexDirection:"column",minHeight:0 }}><CCard title="2025/26 complaints by sector" sub="Including domestic CCTV (32% of total)" style={{ flex:1 }}><ChartCanvas config={charts.Sect} height={60}/></CCard></Reveal>
            <Reveal direction="left" delay={0.1} style={{ display:"flex",flexDirection:"column",minHeight:0 }}><CCard title="Nature of complaints 2025/26" sub="Subject access requests were most common" style={{ flex:1 }}><ChartCanvas config={charts.Nature} height={60}/></CCard></Reveal>
            <Reveal direction="right" delay={0.1} style={{ display:"flex",flexDirection:"column",minHeight:0 }}><CCard title="Complaint closure speed (stacked)" sub="Significant improvement — oldest open complaint just 6 months vs 11 months prior year" style={{ flex:1 }}><ChartCanvas config={charts.Speed} height={60}/></CCard></Reveal>
          </div>
        </section>

        {/* ── PANEL 8: BREACHES ────────────────────────────────────────────── */}
        <section id="breaches" style={{ ...P(C.off) }}>
          <Reveal>
            <SLabel>Personal data breaches</SLabel>
            <SH2>200 breaches reported in 2025/26</SH2>
            <p style={{ fontSize:".85rem",color:C.mid,lineHeight:1.7,maxWidth:600,marginBottom:"1.25rem",fontWeight:300 }}>An increase from 152 last year, affecting an estimated 31,600 people. The rise partly reflects greater awareness of reporting obligations and a growth in cyber incidents.</p>
          </Reveal>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",flex:1,minHeight:0 }}>
            <Reveal direction="left" style={{ display:"flex",flexDirection:"column" }}>
              <CCard title="Breaches reported by year" sub="Four-year view: 264 → 250 → 152 → 200" style={{ flex:1 }}><ChartCanvas config={charts.BrY} height={80}/></CCard>
            </Reveal>
            <Reveal direction="right" style={{ display:"flex",flexDirection:"column" }}>
              <CCard title="2025/26 breaches by sector" sub="Public and private broadly even — 52% / 48%" style={{ flex:1 }}><ChartCanvas config={charts.BrS} height={80}/></CCard>
            </Reveal>
          </div>
        </section>

        {/* ── PANEL 9: GDPR ARTICLES ───────────────────────────────────────── */}
        <section style={{ ...P("none"), background:G1, position:"relative" }}>
          <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(255,255,255,.05) 1px, transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none" }}/>
          <Reveal>
            <SLabel light>How breaches infringe the law</SLabel>
            <SH2 light>GDPR articles infringed 2025/26</SH2>
            <p style={{ fontSize:".85rem",color:"rgba(255,255,255,.65)",lineHeight:1.7,maxWidth:550,marginBottom:"1.25rem",fontWeight:300 }}>80% of breaches involved Article 5(1)(f) — the integrity and confidentiality principle. Improved security practices would prevent the majority of incidents.</p>
          </Reveal>
          <div style={{ display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:"3vw",flex:1,minHeight:0 }}>
            <Reveal direction="left" delay={0.06} style={{ display:"flex",alignItems:"center" }}>
              <BreachBars/>
            </Reveal>
            <div style={{ display:"flex",flexDirection:"column",gap:"1rem",minHeight:0 }}>
              <Reveal direction="right" delay={0.08} style={{ flex:1,display:"flex",flexDirection:"column" }}>
                <CCard dark title="Special category data in breaches" sub="% of total breaches involving special category PD" style={{ flex:1 }}><ChartCanvas config={charts.Spec} height={60}/></CCard>
              </Reveal>
              <Reveal direction="right" delay={0.14} style={{ flex:1,display:"flex",flexDirection:"column" }}>
                <CCard dark title="Quarterly breach volumes 2025/26" sub="Q1: 62 · Q2: 52 · Q3: 39 · Q4: 47" style={{ flex:1 }}><ChartCanvas config={charts.BrQ} height={60}/></CCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── PANEL 10: REGULATORY ─────────────────────────────────────────── */}
        <section id="regulatory" style={{ ...P(C.paper) }}>
          <Reveal>
            <SLabel>Regulatory action</SLabel>
            <SH2>Enforcement in 2025/26</SH2>
            <p style={{ fontSize:".85rem",color:C.mid,lineHeight:1.7,maxWidth:600,marginBottom:".75rem",fontWeight:300 }}>5 regulatory actions — a reduction from 14, driven by focus on complex investigations and increased informal resolution.</p>
          </Reveal>
          {/* HScrollTrack takes 55% of remaining, charts take 45% */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",gap:"1rem",minHeight:0 }}>
            <div style={{ flex:"0 0 52%",display:"flex",flexDirection:"column",minHeight:0,margin:"0 -6vw",padding:"0 5vw" }}>
              <HScrollTrack>
                {[
                  { tag:"Warnings",tc:C.t,tb:"rgba(42,191,191,.1)",num:"1",l:"1 warning issued to a public sector organisation in 2025/26" },
                  { tag:"Reprimands",tc:C.p,tb:"rgba(123,79,191,.1)",num:"4",l:"Payroll Partners · Manx Care · QEII High School · Shell Shipping Ltd" },
                  { tag:"Information notices",tc:C.b,tb:"rgba(30,127,214,.1)",num:"0",l:"No information notices issued — focus on complex investigations" },
                  { tag:"Enforcement notices",tc:C.o,tb:"rgba(138,139,58,.1)",num:"0",l:"Earlier informal engagement resolved more cases without formal action" },
                  { tag:"Maximum penalty",tc:C.t,tb:"rgba(42,191,191,.1)",num:"£1m",l:"Maximum monetary penalty available for serious infringements" },
                  { tag:"Tribunal costs",tc:C.p,tb:"rgba(123,79,191,.1)",num:"£97k",l:"Legal costs for ongoing Data Protection Tribunal — £184k reserve retained" },
                ].map((sc) => (
                  <div key={sc.tag} style={{ flex:"0 0 240px",scrollSnapAlign:"start",background:C.white,borderRadius:18,padding:"1.5rem",border:"1px solid rgba(0,0,0,.07)",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end" }}>
                    <div style={{ position:"absolute",top:"-.5rem",right:".75rem",fontFamily:"Arial,sans-serif",fontSize:"5rem",fontWeight:900,lineHeight:1,opacity:.04,color:C.p,pointerEvents:"none" }}>{sc.num}</div>
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:3,background:GH,transform:"scaleX(0)",transition:"transform .4s" }}/>
                    <div style={tagStyle(sc.tc,sc.tb)}>{sc.tag}</div>
                    <div style={{ fontFamily:"Arial,sans-serif",fontSize:"2.8rem",fontWeight:900,lineHeight:1,marginBottom:".35rem" }}><GradientText>{sc.num}</GradientText></div>
                    <div style={{ fontSize:12,color:C.mid,lineHeight:1.5 }}>{sc.l}</div>
                  </div>
                ))}
              </HScrollTrack>
            </div>
            <div style={{ flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",minHeight:0 }}>
              <Reveal direction="left" delay={0.05} style={{ display:"flex",flexDirection:"column" }}><CCard title="Regulatory actions by year" sub="2023/24: 31 · 2024/25: 14 · 2025/26: 5" style={{ flex:1 }}><ChartCanvas config={charts.Reg} height={60}/></CCard></Reveal>
              <Reveal direction="right" delay={0.05} style={{ display:"flex",flexDirection:"column" }}><CCard title="DPIAs submitted for consultation" sub="First private sector submission received in 2025/26" style={{ flex:1 }}><ChartCanvas config={charts.Dpia} height={60}/></CCard></Reveal>
            </div>
          </div>
        </section>

        {/* ── PANEL 11: PRIORITIES ─────────────────────────────────────────── */}
        <section id="priorities" style={{ ...P(C.off) }}>
          <Reveal style={{ flexShrink:0 }}>
            <SLabel>Looking ahead</SLabel>
            <SH2>Strategy 2026/27: Compliance through collaboration</SH2>
          </Reveal>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:"1rem",flex:1,minHeight:0 }}>
            {[
              { num:"Priority 01",title:"Collaboration",body:"Build confidence in how people and organisations use personal information. Help children stay safe online. Improve private sector understanding through simple guidance and practical training.",color:C.p,
                svg:<svg viewBox="0 0 120 120" fill="none" style={{width:"100%",height:"100%"}}><circle cx="45" cy="60" r="28" stroke="currentColor" strokeWidth="3" opacity=".25"/><circle cx="75" cy="60" r="28" stroke="currentColor" strokeWidth="3" opacity=".25"/><circle cx="60" cy="44" r="12" fill="currentColor" opacity=".08"/><circle cx="60" cy="76" r="12" fill="currentColor" opacity=".08"/><path d="M33 50 Q60 30 87 50" stroke="currentColor" strokeWidth="2" opacity=".15" fill="none"/><path d="M33 70 Q60 90 87 70" stroke="currentColor" strokeWidth="2" opacity=".15" fill="none"/></svg> },
              { num:"Priority 02",title:"Responsible innovation",body:"Support responsible adoption of AI and emerging technologies. Work with international partners to anticipate global data trends. Encourage innovation that protects rights.",color:C.t,
                svg:<svg viewBox="0 0 120 120" fill="none" style={{width:"100%",height:"100%"}}><circle cx="60" cy="60" r="36" stroke="currentColor" strokeWidth="3" opacity=".2"/><circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="5 4" opacity=".2"/><path d="M60 24 L60 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".3"/><path d="M60 80 L60 96" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".3"/><path d="M24 60 L40 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".3"/><path d="M80 60 L96 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".3"/><circle cx="60" cy="60" r="8" fill="currentColor" opacity=".15"/></svg> },
              { num:"Priority 03",title:"Strengthening capabilities",body:"Focus regulatory attention on highest-risk areas. Strengthen risk-based regulation. Collaborate internationally on cross-border cases. Introduce the new fee model. Modernise systems and website.",color:C.b,
                svg:<svg viewBox="0 0 120 120" fill="none" style={{width:"100%",height:"100%"}}><rect x="28" y="48" width="16" height="44" rx="4" fill="currentColor" opacity=".15"/><rect x="52" y="32" width="16" height="60" rx="4" fill="currentColor" opacity=".2"/><rect x="76" y="20" width="16" height="72" rx="4" fill="currentColor" opacity=".28"/><path d="M28 48 L44 36 L68 44 L92 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".35"/><circle cx="92" cy="20" r="4" fill="currentColor" opacity=".4"/></svg> },
              { num:"Priority 04",title:"Transparency",body:"Demonstrate openness through increased publication of regulatory work and case studies. Develop an FOI performance dashboard with OCSIA. Ensure our work is clear and accessible to all.",color:C.o,
                svg:<svg viewBox="0 0 120 120" fill="none" style={{width:"100%",height:"100%"}}><circle cx="60" cy="60" r="28" stroke="currentColor" strokeWidth="3" opacity=".22"/><circle cx="60" cy="60" r="10" fill="currentColor" opacity=".15"/><path d="M20 60 Q40 35 60 32 Q80 35 100 60 Q80 85 60 88 Q40 85 20 60Z" stroke="currentColor" strokeWidth="2.5" opacity=".2" fill="none"/><line x1="60" y1="22" x2="60" y2="98" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" opacity=".15"/><line x1="22" y1="60" x2="98" y2="60" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" opacity=".15"/></svg> },
            ].map((pc, i) => (
              <div key={pc.num} className="pri-card" style={{ borderRadius:18,padding:"clamp(1.2rem,2.5vh,2rem) clamp(1.2rem,2vw,2rem)",border:`1.5px solid ${C.lite}`,background:C.white,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",color:pc.color,animation:`pop-in 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1+i*0.1}s both` }}>
                <div style={{ position:"absolute",top:0,left:0,right:0,height:3,background:GH }}/>
                <div style={{ position:"absolute",bottom:"-1.5rem",right:"-1rem",width:"clamp(80px,18vh,140px)",aspectRatio:"1",opacity:.06,color:pc.color }}>{pc.svg}</div>
                <div style={{ fontSize:"clamp(9px,1vh,11px)",letterSpacing:".15em",marginBottom:".5rem",fontWeight:500,background:GH,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>{pc.num}</div>
                <div style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(1.2rem,2.8vh,2rem)",color:C.ink,marginBottom:"clamp(.4rem,1vh,.8rem)",lineHeight:1.15,fontWeight:800 }}>{pc.title}</div>
                <div style={{ fontSize:"clamp(12px,1.6vh,15px)",color:C.mid,lineHeight:1.7,flex:1 }}>{pc.body}</div>
                <div style={{ marginTop:"auto",paddingTop:"1rem",display:"flex",alignItems:"center",gap:".5rem" }}>
                  <div style={{ height:2,flex:1,background:GH,borderRadius:2,opacity:.4 }}/>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PANEL 12: FINANCE + FOOTER ───────────────────────────────────── */}
        <section id="finance" style={{ ...P(C.white) }}>
          <Reveal style={{ flexShrink:0 }}>
            <SLabel>Finance 2025/26</SLabel>
            <SH2>Income and expenditure</SH2>
          </Reveal>
          <div style={{ display:"flex",flexDirection:"column",gap:"1.25rem",flex:1,minHeight:0 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",flex:1,minHeight:0 }}>
              {[
                { num:"£162,927",lbl:"Fee income",sub:"Target was £151,836",note:"↑ £11,091 above target — strongest fee year to date",tag:"Income" },
                { num:"£620,547",lbl:"Total pay costs",sub:"Including temporary staff",note:"Reflects the doubling of the team from 5 to 10 staff during the year, supported by Treasury-approved contingency funding of £285,000",tag:"Expenditure" },
              ].map((fc, i) => (
                <div key={fc.num} className="fin-card" style={{ borderRadius:18,padding:"clamp(1.5rem,3vh,2.8rem) clamp(1.5rem,2.5vw,2.5rem)",position:"relative",overflow:"hidden",border:"1px solid rgba(0,0,0,.07)",background:C.white,display:"flex",flexDirection:"column",justifyContent:"space-between",animation:`pop-in 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1+i*0.15}s both` }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:GH }}/>
                  <div style={{ position:"absolute",bottom:"-2rem",right:"1rem",fontFamily:"Arial,sans-serif",fontSize:"clamp(6rem,18vh,14rem)",fontWeight:900,lineHeight:1,opacity:.04,color:C.p,pointerEvents:"none",userSelect:"none" }}>{fc.num.replace(/[^0-9]/g,"").slice(0,3)}</div>
                  <div>
                    <div style={tagStyle(C.mid,"rgba(0,0,0,.04)")}>{fc.tag}</div>
                    <div style={{ fontSize:"clamp(10px,1.3vh,13px)",letterSpacing:".08em",color:C.mid,marginBottom:"clamp(.4rem,1vh,.8rem)",fontWeight:400 }}>{fc.sub}</div>
                    <div style={{ fontFamily:"Arial,sans-serif",fontSize:"clamp(2.8rem,8vh,6.5rem)",fontWeight:900,lineHeight:1,marginBottom:"clamp(.3rem,.8vh,.6rem)" }}><GradientText>{fc.num}</GradientText></div>
                    <div style={{ fontSize:"clamp(15px,2.2vh,22px)",color:C.ink,fontWeight:700 }}>{fc.lbl}</div>
                  </div>
                  <div style={{ fontSize:"clamp(12px,1.6vh,15px)",color:C.mid,lineHeight:1.75,fontWeight:300,maxWidth:"85%",paddingTop:"clamp(.5rem,1.2vh,1rem)",borderTop:"1px solid rgba(0,0,0,.06)" }}>{fc.note}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.ink,borderRadius:16,padding:"1.75rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem" }}>
              <div style={{ fontFamily:"Arial,sans-serif",fontSize:"1.1rem",fontWeight:700,color:"white" }}>ICO Isle of Man</div>
              <div style={{ display:"flex",gap:"1.5rem" }}>
                <a href="https://www.inforights.im" target="_blank" rel="noopener noreferrer" style={{ fontSize:11,color:"white",textDecoration:"none" }}>inforights.im</a>
                <a href="https://www.inforights.im" target="_blank" rel="noopener noreferrer" style={{ fontSize:11,color:"white",textDecoration:"none" }}>Privacy Policy</a>
                <button onClick={() => scrollToPanel("top")} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:"white" }}>Back to start ←</button>
              </div>
              <span style={{ fontSize:11,color:"rgba(255,255,255,.6)" }}>© 2026 Information Commissioner's Office · Isle of Man · Annual Report 2025/26</span>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
