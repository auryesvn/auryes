"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { catalogueSongs } from "../_data/songs";
import { WorldMenu } from "./world-menu";

export function UniverseHome() {
  const [focus, setFocus] = useState<string>("tinh-ma");
  const [menuOpen, setMenuOpen] = useState(false);
  const focused = useMemo(() => catalogueSongs.find((song) => song.slug === focus) ?? catalogueSongs[6], [focus]);

  return <main data-tinh-ma-world className="experience is-universe catalogue-home">
    <header className="topbar">
      <Link className="brand" href="/3288" aria-label="Trang chủ 3288">3288</Link>
      <nav className="lenses"><button className="active">KHÁM PHÁ</button><button>CHỦ ĐỀ</button><button>THỜI GIAN</button></nav>
      <button className={`menu ${menuOpen ? "open" : ""}`} aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button>
    </header>
    <WorldMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    <section id="catalogue" className="universe catalogue" aria-label="Danh mục 18 thế giới âm nhạc">
      <div className="universe-copy"><p>MỘT BÀI HÁT</p><p>LÀ MỘT THẾ GIỚI.</p></div>
      <div className="catalogue-scroll">
        <div className="catalogue-stage">
          {catalogueSongs.map((song, index) => {
            const content = <><span className="node-art"><Image src={song.artwork} alt="" fill sizes="80px" loading={index < 6 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "auto"} onLoad={(event) => event.currentTarget.classList.add("is-loaded")} /></span><span className="node-title">{song.title}</span></>;
            const style = { left: `${song.position.x}%`, top: `${song.position.y}%` };
            return song.route ? <Link key={song.slug} href={song.route} className={`node catalogue-node node-${song.slug} ${focus === song.slug ? "focused" : ""}`} style={style} aria-label={`${song.title} — Đi vào thế giới`}>{content}</Link> : <button key={song.slug} className={`node catalogue-node node-${song.slug} ${focus === song.slug ? "focused" : ""}`} style={style} onClick={() => setFocus(song.slug)} aria-pressed={focus === song.slug}>{content}</button>;
          })}
        </div>
      </div>
      <aside className="focus-card catalogue-focus visible" aria-live="polite">
        <span className="catalogue-focus-art"><Image key={focused.slug} src={focused.artwork} alt={`Artwork ${focused.title}`} fill sizes="180px" priority onLoad={(event) => event.currentTarget.classList.add("is-loaded")} /></span>
        <div><p className="eyebrow">{focused.status === "live" ? "THẾ GIỚI ĐANG MỞ" : "ĐANG HÌNH THÀNH"}</p><h1>{focused.title}</h1>{focused.route ? <Link className="catalogue-enter" href={focused.route}>ĐI VÀO THẾ GIỚI <span>→</span></Link> : <p className="catalogue-forming">Thế giới này đang hình thành.</p>}</div>
      </aside>
      <p className="drag-hint">KÉO · CHẠM · KHÁM PHÁ</p>
    </section>
  </main>;
}
