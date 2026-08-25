"use client";

import Link from "next/link";
import { useState } from "react";

export function WorldMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [panel, setPanel] = useState<"root" | "about" | "upcoming">("root");
  if (!open) return null;

  return <aside className="site-menu" aria-label="Danh mục 3288" onClick={onClose}>
    <div className="site-menu-inner" onClick={(event) => event.stopPropagation()}>
      <button className="site-menu-close" aria-label="Đóng menu" onClick={onClose}>×</button>
      <div className="site-menu-index">3288 · MENU</div>
      <nav>
        <Link href="/3288" onClick={onClose}><b>01</b><span>TRANG CHỦ<small>Những thế giới</small></span></Link>
        <Link href="/3288" onClick={onClose}><b>02</b><span>BÀI HÁT<small>Đi vào từng thế giới</small></span></Link>
        <button className={panel === "about" ? "active" : ""} onClick={() => setPanel("about")}><b>03</b><span>3288 LÀ GÌ?<small>Một bài hát là một thế giới</small></span></button>
        <button className={panel === "upcoming" ? "active" : ""} onClick={() => setPanel("upcoming")}><b>04</b><span>THỨ GÌ SẮP TỚI?<small>Những thế giới đang hình thành</small></span></button>
      </nav>
      {panel === "about" && <div className="site-menu-note"><p>3288 là một universe để nghe, nhìn và bước vào thế giới riêng của từng bài hát.</p></div>}
      {panel === "upcoming" && <div className="site-menu-note"><p>Qua Những Ngọn Đồi · Những Khu Rừng Mơ · các artifact và bản nháp chưa phát hành.</p></div>}
    </div>
  </aside>;
}
