"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type View = "universe" | "song";
type SongId = "hills" | "tinhma";
type Mode = "world" | "lyrics" | "archive";

const nodes = [
  { id: "forest", title: "NHỮNG KHU RỪNG MƠ", x: 17, y: 24, tone: "forest" },
  { id: "tinhma", title: "TÌNH MA", x: 45, y: 19, tone: "tinhma" },
  { id: "city", title: "ĐÈN SAU 3 GIỜ", x: 79, y: 28, tone: "city" },
  { id: "hills", title: "QUA NHỮNG NGỌN ĐỒI", x: 52, y: 58, tone: "hills" },
  { id: "return", title: "ĐI ĐỂ TRỞ VỀ", x: 22, y: 70, tone: "return" },
  { id: "together", title: "CÙNG NHAU", x: 83, y: 69, tone: "together" },
] as const;

const tinhMaSceneAssets = [
  "/3288/tinh-ma/tinh-ma-room-night.png",
  "/3288/tinh-ma/tinh-ma-artwork.png",
  "/3288/tinh-ma/tinh-ma-chorus1-trees.png",
  "/3288/tinh-ma/tinh-ma-chorus1-street-v4.png",
  "/3288/tinh-ma/tinh-ma-duality-v2.png",
  "/3288/tinh-ma/tinh-ma-chorus2-trees-v4.png",
  "/3288/tinh-ma/tinh-ma-chorus-leaves-v2.png",
  "/3288/tinh-ma/tinh-ma-resolution-hands-v2.png",
] as const;

const lyricCues = [
  {at:21,line:"Em xa tôi vào một hôm mưa rơi,",pass:1},
  {at:25,line:"Để lại tôi chơi vơi\nvới nỗi nhớ tràn ngập bầu trời",pass:1},
  {at:29.5,line:"Rồi nhiều khi định buông lơi\nmà niềm đau còn chưa vơi",pass:1},
  {at:34,line:"Ừ thì thôi ta lại quay về phòng tìm cây bút\nviết lên vài dòng căm phẫn",pass:1},
  {at:42.5,line:"Tình em ngang qua lặng lẽ như hồn ma",pass:1},
  {at:46,line:"Chẳng cần phải đi xa\ncũng cứ ám mãi trong tim ta",pass:1},
  {at:50.5,line:"Để mỗi khi chợt nhớ đến\nlòng càng xót thương bao ngày qua",pass:1},
  {at:54.5,line:"Ừ thì thôi ta lại ra ngoài hè liệng cây bút\nhát lên vài câu thương nhớ",pass:1},
  {at:63,line:"Nhớ em,\nmùa hạ sang ngang xa rời hàng cây",pass:1},
  {at:69.5,line:"Kỉ niệm đâu đây\nvẫn lưu trong từng ngòi viết",pass:1},
  {at:74,line:"Anh kiếm tìm, chúng trốn tìm\nvà ta đâu biết rằng",pass:1},
  {at:81,line:"Tình yêu\nđôi khi mang con tim ra làm trò chơi",pass:1},
  {at:89,line:"Thời gian trôi, nhìn lá rơi bên thềm",pass:1},
  {at:95,line:"Lòng càng u mê theo những câu ca\ntrong từng dòng nhật ký",pass:1},
  {at:100,line:"Anh ước rằng, ta không nhớ nàng\nđể mai sau chẳng màng",pass:1},
  {at:106.5,line:"Ừ thì thôi,\nđể ký ức xưa tô đẹp tâm hồn tôi",pass:1},
  {at:149,line:"Tình em ngang qua lặng lẽ như hồn ma",pass:2},
  {at:153,line:"Chẳng cần phải đi xa cũng bám riết mãi không tha",pass:2},
  {at:158,line:"Để mỗi khi chợt nhớ đến\nlòng càng đớn đau riêng mình ta",pass:2},
  {at:162,line:"Ừ thì thôi anh lại quay về phòng\ntìm lối thoát giữa hai vòng dây đã thắt",pass:2},
  {at:192,line:"Nhớ em, mùa hạ sang ngang xa rời hàng cây",pass:2},
  {at:198,line:"Kỉ niệm đâu đây vẫn lưu trong từng ngòi viết",pass:2},
  {at:203,line:"Anh kiếm tìm, chúng trốn tìm và ta đâu biết rằng",pass:2},
  {at:209.5,line:"Tình yêu đôi khi mang con tim ra làm trò chơi",pass:2},
  {at:218,line:"Thời gian trôi,\nnhìn lá rơi bên thềm",pass:2},
  {at:224,line:"Lòng càng u mê theo những câu ca trong từng dòng nhật ký",pass:2},
  {at:228.5,line:"Anh ước rằng, ta không nhớ nàng để mai sau chẳng màng",pass:2},
  {at:235,line:"Ừ thì thôi, để ký ức xưa tô đẹp tâm hồn tôi",pass:2},
];

function lyricAt(time: number) {
  let index = -1;
  for (let i = 0; i < lyricCues.length; i += 1) if (time >= lyricCues[i].at) index = i;
  return {index, cue: index >= 0 ? lyricCues[index] : null};
}

export default function Experience() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [view, setView] = useState<View>("song");
  const [focus, setFocus] = useState<string>("tinhma");
  const [activeSong, setActiveSong] = useState<SongId>("tinhma");
  const [mode, setMode] = useState<Mode>("world");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(282.906);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPanel, setMenuPanel] = useState<"root" | "about" | "upcoming">("root");

  const focused = useMemo(() => nodes.find((node) => node.id === focus) ?? nodes[3], [focus]);
  const isTinhMa = activeSong === "tinhma";

  useEffect(() => {
    if (activeSong !== "tinhma" && audioRef.current) {
      audioRef.current.pause(); setPlaying(false);
    }
  }, [activeSong]);

  useEffect(() => {
    const images = tinhMaSceneAssets.map((src) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
      void image.decode().catch(() => undefined);
      return image;
    });
    return () => images.forEach((image) => { image.src = ""; });
  }, []);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  async function togglePlay() {
    if (!isTinhMa) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { await audio.play(); } else { audio.pause(); }
  }

  function enterWorld(song: SongId) {
    setActiveSong(song); setFocus(song); setMode("world"); setView("song");
  }

  function selectFocus(id: string) {
    setFocus(id);
    if (id === "tinhma") setActiveSong("tinhma");
    if (id === "hills") setActiveSong("hills");
  }

  return (
    <main data-tinh-ma-world className={`experience ${view === "song" ? "is-song" : "is-universe"} ${isTinhMa ? "theme-tinhma" : "theme-hills"}`}>
      <audio ref={audioRef} src="/3288/tinh-ma/tinh-ma.mp3" preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onEnded={() => setPlaying(false)} />
      <header className="topbar">
        <button className="brand" onClick={() => setView("universe")} aria-label="Về bản đồ 3288">3288</button>
        {view === "universe" ? <nav className="lenses"><button className="active">KHÁM PHÁ</button><button>CHỦ ĐỀ</button><button>THỜI GIAN</button></nav> : <button className="world-back" onClick={() => setView("universe")}>← NHỮNG THẾ GIỚI</button>}
        <button className={`menu ${menuOpen ? "open" : ""}`} aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => { setMenuOpen((open) => !open); setMenuPanel("root"); }}><span /><span /><span /></button>
      </header>

      {menuOpen && <aside className="site-menu" aria-label="Danh mục 3288" onClick={() => setMenuOpen(false)}>
        <div className="site-menu-inner" onClick={(event) => event.stopPropagation()}>
        <button className="site-menu-close" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}>×</button>
        <div className="site-menu-index">3288 · MENU</div>
        <nav>
          <button onClick={() => { setView("universe"); setMenuOpen(false); }}><b>01</b><span>TRANG CHỦ<small>Những thế giới</small></span></button>
          <button onClick={() => { setView("universe"); selectFocus("tinhma"); setMenuOpen(false); }}><b>02</b><span>BÀI HÁT<small>Đi vào từng thế giới</small></span></button>
          <button className={menuPanel === "about" ? "active" : ""} onClick={() => setMenuPanel("about")}><b>03</b><span>3288 LÀ GÌ?<small>Một bài hát là một thế giới</small></span></button>
          <button className={menuPanel === "upcoming" ? "active" : ""} onClick={() => setMenuPanel("upcoming")}><b>04</b><span>THỨ GÌ SẮP TỚI?<small>Những thế giới đang hình thành</small></span></button>
        </nav>
        {menuPanel === "about" && <div className="site-menu-note"><p>3288 là một universe để nghe, nhìn và bước vào thế giới riêng của từng bài hát.</p></div>}
        {menuPanel === "upcoming" && <div className="site-menu-note"><p>Qua Những Ngọn Đồi · Những Khu Rừng Mơ · các artifact và bản nháp chưa phát hành.</p></div>}
        </div>
      </aside>}

      {view === "universe" ? <Universe focus={focus} selectFocus={selectFocus} focused={focused} enterWorld={enterWorld} /> : isTinhMa ? <TinhMaWorld mode={mode} setMode={setMode} playing={playing} time={time} duration={duration} togglePlay={togglePlay} jump={(target, shouldPlay) => { const audio = audioRef.current; if (!audio) return; audio.currentTime = target; if (shouldPlay) void audio.play(); else audio.pause(); }} /> : <HillsWorld setMode={setMode} />}

      <Player isTinhMa={isTinhMa} playing={playing} time={time} duration={duration} compact={view === "song"} togglePlay={togglePlay} seek={(value) => { if (audioRef.current) audioRef.current.currentTime = value; }} enterWorld={() => enterWorld(activeSong)} />
    </main>
  );
}

function Universe({ focus, selectFocus, focused, enterWorld }: { focus: string; selectFocus: (id: string) => void; focused: (typeof nodes)[number]; enterWorld: (song: SongId) => void }) {
  const available = focused.id === "hills" || focused.id === "tinhma";
  const ghost = focused.id === "tinhma";
  return <section className="universe" aria-label="Bản đồ những thế giới âm nhạc">
    <div className="universe-copy"><p>MỘT BÀI HÁT</p><p>LÀ MỘT THẾ GIỚI.</p></div>
    <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M17 24 C28 19, 36 18, 45 19"/><path d="M45 19 C60 17, 70 23, 79 28"/><path d="M17 24 C25 43, 38 53, 52 58"/><path className={focus === "tinhma" ? "lit ghost-line" : "lit"} d="M45 19 C48 34, 50 47, 52 58"/><path d="M52 58 C66 52, 70 38, 79 28"/><path d="M22 70 C34 62, 42 59, 52 58"/><path d="M52 58 C64 67, 73 70, 83 69"/></svg>
    {nodes.map((node) => <button key={node.id} className={`node node-${node.tone} ${focus === node.id ? "focused" : ""}`} style={{left:`${node.x}%`,top:`${node.y}%`}} onClick={() => selectFocus(node.id)}><span className="node-art"><i/></span><span className="node-title">{node.title}</span></button>)}
    <aside className={`focus-card ${available ? "visible" : ""} ${ghost ? "ghost-card" : ""}`}>
      <p className="eyebrow">{ghost ? "3288 x TRIPPY S · 04:43" : "2026 · FOLK / CINEMATIC"}</p>
      <h1>{ghost ? <>TÌNH MA</> : <>QUA NHỮNG<br/>NGỌN ĐỒI</>}</h1>
      <p>{ghost ? "Em không còn ở đây. Nhưng tình yêu ấy vẫn biết cách quay về." : "Ba người bạn. Một hành trình không cần đến đích."}</p>
      <button onClick={() => enterWorld(ghost ? "tinhma" : "hills")}>BƯỚC VÀO THẾ GIỚI <span>→</span></button>
    </aside>
    <p className="drag-hint">KÉO · CHẠM · KHÁM PHÁ</p>
  </section>;
}

function TinhMaWorld({ mode, setMode, playing, time, duration, togglePlay, jump }: { mode: Mode; setMode: (m: Mode) => void; playing: boolean; time: number; duration: number; togglePlay: () => void; jump: (target: number, shouldPlay: boolean) => void }) {
  const phase = time < 21 ? "dormant" : time < 63 ? "presence" : time < 89 ? "trees-one" : time < 113 ? "street" : time < 192 ? "duality" : time < 218 ? "trees-two" : time < 242 ? "leaves" : "resolution";
  const currentLyric = lyricAt(time).cue?.line ?? lyricCues[0].line;
  const dualityProgress = Math.max(0, Math.min(1, (time - 113) / 79));
  const balance = 10 + dualityProgress * 80;
  const remaining = Math.max(0, duration - time);
  const settle = phase === "resolution" ? Math.min(1, remaining / 4) : 1;
  const resolutionX = Math.sin(time * .62) * 10 * settle;
  const resolutionY = Math.cos(time * .47) * 6 * settle;
  const resolutionBlur = (1.2 + (Math.sin(time * .9) + 1) * .8) * settle;
  const resolutionRotate = Math.sin(time * .31) * .55 * settle;
  return <section className={`tinhma-world phase-${phase} ${phase === "resolution" && remaining <= 4 ? "resolution-settled" : ""}`} style={{"--balance": `${balance}%`, "--resolution-x": `${resolutionX}px`, "--resolution-y": `${resolutionY}px`, "--resolution-blur": `${resolutionBlur}px`, "--resolution-rotate": `${resolutionRotate}deg`} as React.CSSProperties}>
    <div className="tm-room"><div className="tm-window"/><div className="rain"/><div className="tm-desk"/></div>
    {phase === "duality" && <div className="tm-duality-scene" aria-hidden="true"/>}
    <div className="tm-art-stack"><Image src="/3288/tinh-ma/tinh-ma-artwork.png" alt="Artwork Tình Ma" fill priority sizes="(max-width: 800px) 66vw, 35vw"/><Image aria-hidden="true" alt="" src="/3288/tinh-ma/tinh-ma-artwork.png" fill sizes="(max-width: 800px) 66vw, 35vw"/><Image aria-hidden="true" alt="" src="/3288/tinh-ma/tinh-ma-artwork.png" fill sizes="(max-width: 800px) 66vw, 35vw"/></div>
    {mode === "world" && <>
      {phase === "dormant" && <div className="tm-intro"><p className="eyebrow">3288 x TRIPPY S · 04:43</p><h1>TÌNH MA</h1><p>Em không còn ở đây.<br/>Nhưng tình yêu ấy vẫn biết cách quay về.</p><button className="tm-play" onClick={togglePlay}>▶</button><small>CHƯA PHÁT</small></div>}
      {phase === "presence" && <div className="tm-presence"><span>NHẬT KÝ · LỜI 1</span><p key={currentLyric}>{currentLyric}</p><i key={`${currentLyric}-ghost`}>{currentLyric}</i></div>}
      {phase === "trees-one" && <ChorusScene variant="trees-one" chapter="III — HÀNG CÂY · LỜI 1" lyric={currentLyric}/>}
      {phase === "street" && <ChorusScene variant="street" chapter="IV — KHU PHỐ · LỜI 1" lyric={currentLyric}/>}
      {phase === "duality" && <div className="tm-duality"><div className="pole anger"><h2>CĂM PHẪN</h2><p>quay về phòng tìm cây bút<br/>viết lên vài dòng căm phẫn</p></div><div className="pole longing"><h2>THƯƠNG NHỚ</h2><p>để ký ức xưa<br/>tô đẹp tâm hồn tôi</p></div>{time >= 149 && time < 171 && <p className="tm-duality-lyric" key={currentLyric}>{currentLyric}</p>}<label><span>HAI CỰC CỦA CÙNG MỘT KÝ ỨC</span><input aria-label="Timeline chương Hai cực" type="range" min="113" max="191.9" step="0.1" value={Math.min(time,191.9)} onChange={(e) => jump(Number(e.target.value), playing)}/><span className="tm-duality-times"><b>01:53</b><b>03:12</b></span></label></div>}
      {phase === "trees-two" && <ChorusScene variant="trees-two" chapter="VI — HÀNG CÂY · LỜI 2" lyric={currentLyric}/>}
      {phase === "leaves" && <ChorusScene variant="leaves" chapter="VII — BÊN THỀM · LỜI 2" lyric={currentLyric}/>}
      {phase === "resolution" && <div className="tm-resolution-scene" aria-label="Chấp nhận"/>}
    </>}
    {mode === "lyrics" && <div className="tm-panel-backdrop" onClick={() => setMode("world")}><TinhMaLyrics time={time}/></div>}
    {mode === "archive" && <div className="tm-panel-backdrop" onClick={() => setMode("world")}><Archive/></div>}
    <nav className="tm-state-nav" aria-label="Tám chương của Tình Ma"><button className={phase === "dormant" ? "active" : ""} onClick={() => jump(0, false)}><b>01</b><span>DORMANT</span></button><button className={phase === "presence" ? "active" : ""} onClick={() => jump(21, true)}><b>02</b><span>PRESENCE</span></button><button className={phase === "trees-one" ? "active" : ""} onClick={() => jump(63, true)}><b>03</b><span>HÀNG CÂY I</span></button><button className={phase === "street" ? "active" : ""} onClick={() => jump(89, true)}><b>04</b><span>KHU PHỐ</span></button><button className={phase === "duality" ? "active" : ""} onClick={() => jump(113, true)}><b>05</b><span>HAI CỰC</span></button><button className={phase === "trees-two" ? "active" : ""} onClick={() => jump(192, true)}><b>06</b><span>HÀNG CÂY II</span></button><button className={phase === "leaves" ? "active" : ""} onClick={() => jump(218, true)}><b>07</b><span>BÊN THỀM</span></button><button className={phase === "resolution" ? "active" : ""} onClick={() => jump(242, true)}><b>08</b><span>CHẤP NHẬN</span></button></nav>
    <nav className="song-tabs tm-tabs"><button onClick={() => setMode("lyrics")} className={mode === "lyrics" ? "active" : ""}>LỜI BÀI HÁT</button><button onClick={() => setMode("world")} className={mode === "world" ? "active" : ""}>THẾ GIỚI</button><button onClick={() => setMode("archive")} className={mode === "archive" ? "active" : ""}>LƯU TRỮ</button></nav>
  </section>;
}

function ChorusScene({variant, chapter, lyric}: {variant: "trees-one" | "street" | "trees-two" | "leaves"; chapter: string; lyric: string}) {
  return <div className={`tm-chorus-scene tm-${variant}`}><div className="tm-chorus-copy"><p className="eyebrow">{chapter}</p><p key={lyric}>{lyric}</p><i aria-hidden="true">{lyric}</i></div></div>;
}

function TinhMaLyrics({time}: {time: number}) {
  const {index, cue} = lyricAt(time);
  const visible = index < 0 ? lyricCues.slice(0, 3) : lyricCues.slice(Math.max(0, index - 1), Math.min(lyricCues.length, index + 2));
  return <div className="tm-panel tm-lyrics" onClick={(event) => event.stopPropagation()}><p className="eyebrow">NHỮNG MẢNH NHẬT KÝ · {cue ? `LỜI ${cue.pass}` : "MỞ ĐẦU"}</p><div className="tm-lyric-stream">{visible.map((item) => <p key={`${item.at}-${item.line}`} className={item === cue ? "bright" : ""}><time>{Math.floor(item.at/60).toString().padStart(2,"0")}:{(item.at%60).toString().padStart(2,"0")}</time><span>{item.line}</span></p>)}</div></div>;
}
function Archive() { return <div className="tm-panel tm-archive" onClick={(event) => event.stopPropagation()}><p className="eyebrow">GHI CHÚ NGUYÊN BẢN</p><h2>Một trải nghiệm kép</h2><p>Bài hát kể về một chàng trai sống biệt lập tại căn nhà ngoại ô. Vào những đêm mưa, ký ức tình cũ trở lại lúc như căm phẫn, lúc như thương nhớ.</p><dl><div><dt>PRODUCTION</dt><dd>Trippy S</dd></div><div><dt>ÂM THANH</dt><dd>EDM · E minor · ~112 BPM</dd></div><div><dt>TRẠNG THÁI</dt><dd>Câu chuyện MV từng được hình dung nhưng chưa thực hiện</dd></div></dl><blockquote>“Tình yêu đôi khi mang con tim ra làm trò chơi.”</blockquote></div>; }

function HillsWorld({ setMode }: { setMode: (m: Mode) => void }) { return <section className="song-world"><div className="mountain-bg"/><div className="mist mist-a"/><div className="world-content"><div className="song-title"><p className="eyebrow">THẾ GIỚI 04 · 2026</p><h1>QUA NHỮNG<br/>NGỌN ĐỒI</h1><p>Ba người bạn. Một hành trình không cần đến đích.</p></div></div><nav className="song-tabs"><button onClick={()=>setMode("lyrics")}>LỜI BÀI HÁT</button><button className="active">THẾ GIỚI</button><button>HẬU TRƯỜNG</button></nav></section>; }

function Player({isTinhMa,playing,time,duration,compact,togglePlay,seek,enterWorld}:{isTinhMa:boolean;playing:boolean;time:number;duration:number;compact:boolean;togglePlay:()=>void;seek:(v:number)=>void;enterWorld:()=>void}) {
  const progress = isTinhMa ? Math.min(100,(time/duration)*100 || 0) : 31;
  const format=(n:number)=>`${Math.floor(n/60).toString().padStart(2,"0")}:${Math.floor(n%60).toString().padStart(2,"0")}`;
  return <footer className={`player ${compact?"compact":""} ${isTinhMa?"tm-player":""}`}><div className="player-art"/><div className="player-meta"><strong>{isTinhMa?"TÌNH MA":"QUA NHỮNG NGỌN ĐỒI"}</strong><span>{isTinhMa?"3288 x TRIPPY S":"3288"}</span></div><button className="player-play" onClick={togglePlay} disabled={!isTinhMa}>{playing?"Ⅱ":"▶"}</button><button className="timeline" aria-label="Tua bài hát" onClick={(e)=>{if(isTinhMa){const r=e.currentTarget.getBoundingClientRect();seek(((e.clientX-r.left)/r.width)*duration)}}}><i style={{width:`${progress}%`}}/><b style={{left:`${progress}%`}}/></button><span className="time">{isTinhMa?`${format(time)} / ${format(duration)}`:"01:28 / 04:07"}</span>{!compact&&<button className="enter-mini" onClick={enterWorld}>BƯỚC VÀO →</button>}</footer>;
}
