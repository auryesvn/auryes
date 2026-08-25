"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { universeNodes } from "../_data/songs";
import { WorldMenu } from "./world-menu";

export function UniverseHome() {
  const [focus, setFocus] = useState<string>("hills");
  const [menuOpen, setMenuOpen] = useState(false);
  const focused = useMemo(() => universeNodes.find((node) => node.id === focus) ?? universeNodes[3], [focus]);
  const isHills = focused.id === "hills";

  return <main data-tinh-ma-world className="experience is-universe theme-hills">
    <header className="topbar">
      <Link className="brand" href="/3288" aria-label="Trang chủ 3288">3288</Link>
      <nav className="lenses"><button className="active">KHÁM PHÁ</button><button>CHỦ ĐỀ</button><button>THỜI GIAN</button></nav>
      <button className={`menu ${menuOpen ? "open" : ""}`} aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
    </header>
    <WorldMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    <section className="universe" aria-label="Bản đồ những thế giới âm nhạc">
      <div className="universe-copy"><p>MỘT BÀI HÁT</p><p>LÀ MỘT THẾ GIỚI.</p></div>
      <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M17 24 C28 19, 36 18, 45 19"/><path d="M45 19 C60 17, 70 23, 79 28"/><path d="M17 24 C25 43, 38 53, 52 58"/><path className="lit ghost-line" d="M45 19 C48 34, 50 47, 52 58"/><path d="M52 58 C66 52, 70 38, 79 28"/><path d="M22 70 C34 62, 42 59, 52 58"/><path d="M52 58 C64 67, 73 70, 83 69"/></svg>
      {universeNodes.map((node) => node.id === "tinhma" ? <Link key={node.id} href="/3288/tinh-ma" className={`node node-${node.tone}`} style={{left:`${node.x}%`,top:`${node.y}%`}}><span className="node-art"><i/></span><span className="node-title">{node.title}</span></Link> : <button key={node.id} className={`node node-${node.tone} ${focus === node.id ? "focused" : ""}`} style={{left:`${node.x}%`,top:`${node.y}%`}} onClick={() => setFocus(node.id)}><span className="node-art"><i/></span><span className="node-title">{node.title}</span></button>)}
      <aside className={`focus-card ${isHills ? "visible" : ""}`}>
        <p className="eyebrow">2026 · FOLK / CINEMATIC</p>
        <h1>QUA NHỮNG<br/>NGỌN ĐỒI</h1>
        <p>Ba người bạn. Một hành trình không cần đến đích.</p>
      </aside>
      <p className="drag-hint">KÉO · CHẠM · KHÁM PHÁ</p>
    </section>
    <footer className="player"><div className="player-art"/><div className="player-meta"><strong>QUA NHỮNG NGỌN ĐỒI</strong><span>3288</span></div><button className="player-play" disabled aria-label="Bài hát chưa phát hành">▶</button><div className="timeline" aria-hidden="true"><i style={{width:"31%"}}/><b style={{left:"31%"}}/></div><span className="time">01:28 / 04:07</span></footer>
  </main>;
}
