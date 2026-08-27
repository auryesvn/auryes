"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { WorldMenu } from "../../_components/world-menu";
import { audioTimelineProgress, clampAudioTime } from "../../_lib/audio-timeline";
import type { NamespaceBasePath } from "../../_lib/host";
import {
  CHON_BINH_YEN_DURATION,
  activeCueAt,
  activeVisualStateAt,
  chonBinhYenCues,
  chonBinhYenVisualStates,
} from "./chon-binh-yen-cues";

type Mode = "world" | "lyrics" | "meaning" | "archive";
type PlaybackState = "idle" | "loading" | "buffering" | "playing" | "paused" | "error";

const frameSrc = (frame: string) => `/3288/chon-binh-yen/frames/${frame}`;

function formatTime(value: number) {
  return `${Math.floor(value / 60).toString().padStart(2, "0")}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
}

function PlayIcon({ playing }: { playing: boolean }) {
  return <svg aria-hidden="true" className="cby-play-icon" viewBox="0 0 24 24" fill="none">
    {playing ? <><path d="M8 5v14"/><path d="M16 5v14"/></> : <path d="m6 4 13 8-13 8Z"/>}
  </svg>;
}

export default function ChonBinhYenExperience({ basePath }: { basePath: NamespaceBasePath }) {
  const homeHref = basePath || "/";
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAttemptRef = useRef(0);
  const [mode, setMode] = useState<Mode>("world");
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const images = chonBinhYenVisualStates.map(({ asset }) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = frameSrc(asset);
      void image.decode().catch(() => undefined);
      return image;
    });
    return () => images.forEach((image) => { image.src = ""; });
  }, []);

  useEffect(() => () => {
    playAttemptRef.current += 1;
    audioRef.current?.pause();
  }, []);

  function failPlayback(audio: HTMLAudioElement, error?: unknown) {
    setPlaybackState("error");
    if (process.env.NODE_ENV !== "production") console.error("[Chốn Bình Yên audio] Playback failed", {
      error,
      mediaErrorCode: audio.error?.code ?? null,
      currentSrc: audio.currentSrc,
      networkState: audio.networkState,
      readyState: audio.readyState,
    });
  }

  async function play() {
    const audio = audioRef.current;
    if (!audio) return;
    const attempt = ++playAttemptRef.current;
    setPlaybackState("loading");
    if (audio.networkState === HTMLMediaElement.NETWORK_EMPTY || audio.error || !audio.currentSrc) audio.load();
    try {
      await audio.play();
    } catch (error) {
      if (attempt === playAttemptRef.current) failPlayback(audio, error);
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (["playing", "loading", "buffering"].includes(playbackState)) {
      playAttemptRef.current += 1;
      audio.pause();
      setPlaybackState("paused");
    } else void play();
  }

  function seek(next: number, resume = playbackState === "playing") {
    const audio = audioRef.current;
    if (!audio || duration === null) return;
    audio.currentTime = next;
    setTime(next);
    if (resume) void play();
  }

  const actualDuration = duration && Number.isFinite(duration) ? duration : null;
  const visual = activeVisualStateAt(time);
  const cue = activeCueAt(time).cue;
  const playing = playbackState === "playing";
  const loading = playbackState === "loading" || playbackState === "buffering";
  const progress = actualDuration ? audioTimelineProgress(time, actualDuration) : 0;

  return <main data-tinh-ma-world data-chon-binh-yen-world className="experience cby-experience">
    <audio
      ref={audioRef}
      src={`${basePath}/chon-binh-yen/chon-binh-yen.mp3`}
      preload="auto"
      onLoadStart={() => { if (playbackState !== "idle") setPlaybackState("loading"); }}
      onLoadedMetadata={(event) => {
        const value = event.currentTarget.duration;
        setDuration(Number.isFinite(value) && value > 0 ? value : null);
      }}
      onPlaying={() => setPlaybackState("playing")}
      onCanPlay={() => { if (playbackState === "buffering") setPlaybackState("loading"); }}
      onWaiting={() => { if (!audioRef.current?.paused) setPlaybackState("buffering"); }}
      onStalled={() => { if (!audioRef.current?.paused) setPlaybackState("buffering"); }}
      onPause={() => setPlaybackState("paused")}
      onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      onEnded={(event) => { setTime(event.currentTarget.duration); setPlaybackState("paused"); }}
      onError={(event) => failPlayback(event.currentTarget)}
    />

    <div className="cby-scene" aria-live="polite">
      <Image className="cby-scene-blur" src={frameSrc(visual.asset)} alt="" fill priority sizes="100vw" aria-hidden="true" />
      <Image className="cby-scene-image" src={frameSrc(visual.asset)} alt="Khung hình trong thế giới Chốn Bình Yên" fill priority sizes="100vw" />
      <div className="cby-vignette" />
    </div>

    <header className="topbar">
      <Link className="brand" href={homeHref} aria-label="Về bản đồ 3288">3288</Link>
      <Link className="world-back" href={homeHref}>← NHỮNG THẾ GIỚI</Link>
      <button className={`menu ${menuOpen ? "open" : ""}`} aria-label={menuOpen ? "Đóng menu" : "Mở menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span/><span/><span/></button>
    </header>
    <WorldMenu basePath={basePath} open={menuOpen} onClose={() => setMenuOpen(false)} />

    {mode === "world" && <section className={`cby-copy ${time < 34 ? "is-intro" : "is-listening"}`}>
      <p className="eyebrow">{time < 34 ? "3288 · 04:33" : visual.chapter}</p>
      {time < 34 ? <>
        <h1>CHỐN<br/>BÌNH YÊN</h1>
        <p className="cby-deck">Một lời tiễn đưa không biết “em” đã đi đâu—chỉ biết rằng ở nơi ấy, em không còn đau nữa.</p>
        <button className="cby-hero-play" onClick={togglePlay} aria-label={playing ? "Tạm dừng Chốn Bình Yên" : "Phát Chốn Bình Yên"}>
          {loading ? <span>…</span> : <PlayIcon playing={playing}/>}<small>{playbackState === "error" ? "THỬ LẠI" : loading ? "ĐANG TẢI" : playing ? "TẠM DỪNG" : "BẮT ĐẦU"}</small>
        </button>
      </> : <blockquote key={cue?.at ?? visual.at}>{cue?.line ?? "Một khoảng lặng trước khi lời kể bắt đầu."}</blockquote>}
    </section>}

    {mode !== "world" && <div className="cby-panel-backdrop" onClick={() => setMode("world")}>
      <section className="cby-panel" onClick={(event) => event.stopPropagation()}>
        {mode === "lyrics" && <Lyrics time={time}/>}
        {mode === "meaning" && <Meaning/>}
        {mode === "archive" && <Archive/>}
      </section>
    </div>}

    <nav className="cby-state-nav" aria-label="Mười hai chương của Chốn Bình Yên">
      {chonBinhYenVisualStates.map((state, index) => <button key={state.at} className={state === visual ? "active" : ""} onClick={() => seek(state.at, state.at > 0)} aria-label={`${index + 1}. ${state.chapter}`} title={state.chapter}><span>{String(index + 1).padStart(2, "0")}</span></button>)}
    </nav>

    <nav className="song-tabs tm-tabs cby-tabs" aria-label="Nội dung Chốn Bình Yên">
      <button className={mode === "lyrics" ? "active" : ""} onClick={() => setMode("lyrics")}>LỜI BÀI HÁT</button>
      <button className={mode === "world" ? "active" : ""} onClick={() => setMode("world")}>THẾ GIỚI</button>
      <button className={mode === "meaning" ? "active" : ""} onClick={() => setMode("meaning")}>Ý NGHĨA</button>
      <button className={mode === "archive" ? "active" : ""} onClick={() => setMode("archive")}>LƯU TRỮ</button>
    </nav>

    <footer className="player compact tm-player cby-player">
      <div className="player-art"><Image src="/3288/chon-binh-yen/chon-binh-yen-artwork.jpg" alt="" fill sizes="56px"/></div>
      <div className="player-meta"><strong>CHỐN BÌNH YÊN</strong><span aria-live="polite">{playbackState === "error" ? "Không phát được · Thử lại" : loading ? "ĐANG TẢI…" : "3288"}</span></div>
      <button className="player-play" onClick={togglePlay} aria-label={playing ? "Tạm dừng Chốn Bình Yên" : "Phát Chốn Bình Yên"} aria-busy={loading}>{loading ? "…" : <PlayIcon playing={playing}/>}</button>
      <input className="timeline" type="range" min={0} max={actualDuration ?? 0} step="0.01" value={actualDuration ? clampAudioTime(time, actualDuration) ?? 0 : 0} disabled={!actualDuration} aria-label="Tua bài Chốn Bình Yên" onChange={(event) => seek(Number(event.currentTarget.value), false)} style={{ "--progress": `${progress}%` } as React.CSSProperties}/>
      <span className="time">{formatTime(time)} / {actualDuration ? formatTime(actualDuration) : "--:--"}</span>
    </footer>
  </main>;
}

function Lyrics({ time }: { time: number }) {
  const current = activeCueAt(time).cue;
  const index = current ? chonBinhYenCues.indexOf(current) : -1;
  const visible = index < 0 ? chonBinhYenCues.slice(0, 4) : chonBinhYenCues.slice(Math.max(0, index - 2), Math.min(chonBinhYenCues.length, index + 3));
  return <><p className="eyebrow">LỜI HÁT · ĐAU VÀ THANH THẢN</p><div className="cby-lyrics">{visible.map((cue) => <p key={cue.at} className={cue === current ? "active" : ""}><time>{formatTime(cue.at)}</time><span>{cue.line}</span></p>)}</div></>;
}

function Meaning() {
  return <><p className="eyebrow">CANONICAL STORY</p><h2>Một nơi không cần được gọi tên</h2><p>“Em” đã đi đâu được cố ý để mơ hồ. Cảm xúc là thật; biến cố và câu chuyện hình thành sau, được hư cấu từ cảm xúc ấy.</p><p>Chốn bình yên đồng thời là một cõi sau đời sống, sự giải thoát khỏi đau đớn, và lời an ủi mà người ở lại dựng nên để có thể tiễn em đi.</p><blockquote>Khép đôi mi, ngủ ngoan nhé em.</blockquote></>;
}

function Archive() {
  return <><p className="eyebrow">TƯ LIỆU NGUYÊN BẢN</p><div className="cby-archive-grid"><figure><Image src="/3288/chon-binh-yen/chon-binh-yen-artwork.jpg" alt="Artwork gốc Chốn Bình Yên" fill sizes="(max-width: 800px) 65vw, 24vw"/><figcaption>ARTWORK GỐC · “EM” RỜI MẶT ĐẤT</figcaption></figure><figure><Image src="/3288/chon-binh-yen/archive-recording-room.png" alt="3288 hát trước rèm cam trong tư liệu MV" fill sizes="(max-width: 800px) 65vw, 24vw"/><figcaption>TƯ LIỆU HẬU TRƯỜNG CHÂN THẬT</figcaption></figure></div><p className="cby-archive-note">Bài bắt đầu từ cảm xúc, rồi câu chuyện mới tự hình thành. Bản phối đi qua cả ba quỹ đạo: tối xuyên suốt, dần mở sáng, và êm dịu như một lời ru.</p></>;
}

export { CHON_BINH_YEN_DURATION };
