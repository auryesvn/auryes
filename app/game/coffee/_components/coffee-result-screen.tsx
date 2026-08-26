"use client";

import { useEffect, useRef, useState } from "react";

import type { VerdictKey } from "@/lib/coffee-quiz";

import CoffeeFrame from "./coffee-frame";
import {
  COFFEE_RECIPROCITY_URL,
  coffeeSubmissionIsLocked,
  RESULT_SEAL_LABELS,
  type CoffeePresentedInsight,
  type CoffeeSendState,
} from "./coffee-result-model";

const REALITY_CHECK = {
  eyebrow: "Reality check :))",
  title: "Lý thuyết với thực tế đôi khi hơi khác nhau.",
  body: "Có những chuyện lúc chưa yêu nghe rất dễ. Vào đúng tình huống rồi mới biết mình phản ứng thế nào :))",
  cta: "▶ Xem một ví dụ rất đời",
  videoId: "XoLoGpo3psk",
} as const;

const eyebrow =
  "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#766e63]";
const focus =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#b72c24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe5]";

function CoffeeBeanIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M24.8 5.8c4.7 4.7 2.7 13.8-3.1 19.6S7 33.2 2.3 28.5-.4 14.7 5.4 8.9 20.1 1.1 24.8 5.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M23.5 6.9c-7.6 3.6-5.8 12.6-13.9 18.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M16 3c.8 7.9 5.1 12.2 13 13-7.9.8-12.2 5.1-13 13-.8-7.9-5.1-12.2-13-13 7.9-.8 12.2-5.1 13-13Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8 12.2 2.5 2.5L16.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResultSeal({ verdictKey }: { verdictKey: VerdictKey }) {
  const label = RESULT_SEAL_LABELS[verdictKey];
  return (
    <div
      className="mt-0 flex justify-end"
      role="img"
      aria-label={`Kết luận: ${label}`}
    >
      <div className="flex size-[7.25rem] -rotate-[5deg] flex-col items-center justify-center rounded-full border border-[#827464] px-3 text-center text-[#5f554a]">
        <CoffeeBeanIcon className="mb-2 size-7" />
        <span
          aria-hidden="true"
          className="text-[0.56rem] font-semibold uppercase leading-4 tracking-[0.16em]"
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ResultMasthead({
  name,
  verdictKey,
  title,
  summary,
}: {
  name: string;
  verdictKey: VerdictKey;
  title: string;
  summary: readonly string[];
}) {
  return (
    <header>
      <p className={`${eyebrow} text-[#9f3029]`}>Auryes / kết quả của bạn</p>
      <p className="mt-2 text-sm text-[#857b6e]">{name}</p>
      <div className="mt-8">
        <h1 className="max-w-[10ch] text-balance [font-family:var(--font-coffee-serif)] text-[clamp(3.1rem,13.5vw,4.45rem)] font-medium leading-[0.94] tracking-[-0.05em]">
          {title}
        </h1>
        <ResultSeal verdictKey={verdictKey} />
      </div>
      <div className="mt-4 border-t border-[#bfb2a1] pt-6 text-[0.95rem] leading-7 text-[#655d54]">
        <div className="space-y-3">
          {summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </header>
  );
}

function FeaturedInsight({ insight }: { insight: CoffeePresentedInsight }) {
  return (
    <article className="grid grid-cols-[3.25rem_minmax(0,1fr)] rounded-[1.2rem] border border-[#c7b9a7] bg-[#faf6ee] p-5 [background-image:none]">
      <p
        aria-hidden="true"
        className="[font-family:var(--font-coffee-serif)] text-3xl leading-none text-[#776b5e]"
      >
        {String(insight.position).padStart(2, "0")}
      </p>
      <div className="min-w-0 border-l border-[#bfb2a1] pl-5">
        <p className={`${eyebrow} text-[#9f3029]`}>Điểm Kai để ý</p>
        <h2 className="mt-3 text-balance [font-family:var(--font-coffee-serif)] text-[1.7rem] font-medium leading-tight tracking-[-0.025em]">
          {insight.heading}
        </h2>
        <p className="mt-4 text-sm leading-[1.65] text-[#665f56]">
          {insight.body}
        </p>
      </div>
    </article>
  );
}

function StandardInsight({ insight }: { insight: CoffeePresentedInsight }) {
  if (insight.variant === "editorial") {
    return (
      <article className="rounded-[1.2rem] border border-[#d8cdbc] bg-[#faf6ee] p-5 [background-image:none]">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-[#9f3029]" aria-hidden="true" />
          <p className={eyebrow}>
            Điểm {String(insight.position).padStart(2, "0")}
          </p>
        </div>
        <h2 className="mt-4 text-balance [font-family:var(--font-coffee-serif)] text-[1.65rem] font-medium leading-tight tracking-[-0.025em]">
          {insight.heading}
        </h2>
        <p className="mt-3 text-sm leading-[1.65] text-[#665f56]">
          {insight.body}
        </p>
      </article>
    );
  }
  if (insight.variant === "quote") {
    return (
      <article className="relative overflow-hidden rounded-[1.2rem] border border-[#d8cdbc] bg-[#efe6d9] p-5 [background-image:none]">
        <span
          aria-hidden="true"
          className="absolute right-4 top-1 [font-family:var(--font-coffee-serif)] text-7xl leading-none text-[#b9a995]/50"
        >
          “
        </span>
        <p className={eyebrow}>
          Điểm {String(insight.position).padStart(2, "0")}
        </p>
        <h2 className="relative mt-4 max-w-[90%] text-balance [font-family:var(--font-coffee-serif)] text-[1.6rem] font-medium leading-tight tracking-[-0.025em]">
          {insight.heading}
        </h2>
        <p className="relative mt-3 text-sm leading-[1.65] text-[#665f56]">
          {insight.body}
        </p>
      </article>
    );
  }
  return (
    <article className="rounded-[1.2rem] border border-[#d8cdbc] bg-[#faf6ee] p-5 [background-image:none]">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#171411] text-[0.65rem] font-semibold text-[#fff9ed]"
        >
          {String(insight.position).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h2 className="text-balance [font-family:var(--font-coffee-serif)] text-[1.55rem] font-medium leading-tight tracking-[-0.025em]">
            {insight.heading}
          </h2>
          <p className="mt-3 text-sm leading-[1.65] text-[#665f56]">
            {insight.body}
          </p>
        </div>
      </div>
    </article>
  );
}

function RealityCheckCard({
  onOpen,
  triggerRef,
}: {
  onOpen: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <aside className="rounded-[1.2rem] border border-[#cdbfaa] bg-[#f7f0e5] p-5 [background-image:none]">
      <p className={`${eyebrow} text-[#9f3029]`}>{REALITY_CHECK.eyebrow}</p>
      <h3
        id="reality-check-title"
        className="mt-3 text-balance [font-family:var(--font-coffee-serif)] text-xl font-medium leading-snug"
      >
        {REALITY_CHECK.title}
      </h3>
      <p className="mt-3 text-sm leading-[1.65] text-[#665f56]">
        {REALITY_CHECK.body}
      </p>
      <button
        ref={triggerRef}
        type="button"
        onClick={onOpen}
        className={`${focus} mt-4 min-h-11 border-b border-[#786a5a] py-2 text-left text-sm font-medium`}
      >
        {REALITY_CHECK.cta}
      </button>
    </aside>
  );
}

function SubmissionStatus({
  sendState,
  onRetry,
}: {
  sendState: CoffeeSendState;
  onRetry: () => void;
}) {
  const locked = coffeeSubmissionIsLocked(sendState);
  if (sendState === "sending")
    return (
      <aside
        aria-live="polite"
        className="mt-7 overflow-hidden rounded-xl border border-[#d8cdbc] bg-[#faf6ee] px-4 py-3 text-sm text-[#756d62] [background-image:none]"
      >
        <p>Đang gửi cho Kai…</p>
        <span
          aria-hidden="true"
          className="coffee-status-progress mt-3 block h-px w-full bg-[#cfc3b3]"
        />
      </aside>
    );
  if (sendState === "sent")
    return (
      <aside
        aria-live="polite"
        className="mt-7 flex items-center gap-2 rounded-xl border border-[#b9c2b3] bg-[#f7f8f2] px-4 py-3 text-sm text-[#42523f] [background-image:none]"
      >
        <CheckIcon />
        <p>Kai nhận được rồi :)</p>
      </aside>
    );
  if (sendState === "failed")
    return (
      <aside
        aria-live="polite"
        className="mt-7 rounded-[1.2rem] border border-[#cdb9ad] bg-[#fff8f3] p-5 text-sm text-[#6e554a] [background-image:none]"
      >
        <p>Chưa gửi được, nhưng kết quả của bạn vẫn ở đây.</p>
        <button
          type="button"
          disabled={locked}
          onClick={onRetry}
          className={`${focus} coffee-secondary mt-4 min-h-11 rounded-xl border border-[#a99183] px-4 font-medium disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Thử gửi lại
        </button>
      </aside>
    );
  return null;
}

function ReciprocityCta() {
  return (
    <section className="mt-8 rounded-[1.2rem] border border-[#b9aa98] bg-[#efe6d9] px-5 py-7 [background-image:none]">
      <div className="grid grid-cols-[2.5rem_1px_minmax(0,1fr)] items-center gap-4 text-left">
        <SparkIcon className="size-8 justify-self-center text-[#9f3029]" />
        <span className="h-full min-h-16 bg-[#b9aa98]" aria-hidden="true" />
        <p className="text-balance [font-family:var(--font-coffee-serif)] text-[1.4rem] font-medium leading-[1.18] tracking-[-0.02em] text-[#514a42]">
          Bạn đã để lại IG bản thân.
          <br />
          Đến lượt mình nhé.
        </p>
      </div>
      <a
        href={COFFEE_RECIPROCITY_URL}
        className={`${focus} coffee-primary mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#171411] px-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#fff9ed] transition-colors motion-reduce:transition-none`}
      >
        Làm quen với Kai →
      </a>
    </section>
  );
}

export type CoffeeResultScreenProps = {
  name: string;
  verdictKey: VerdictKey;
  title: string;
  summary: readonly string[];
  insights: readonly CoffeePresentedInsight[];
  sendState: CoffeeSendState;
  onRetry: () => void;
  onRestart: () => void;
};

export default function CoffeeResultScreen({
  name,
  verdictKey,
  title,
  summary,
  insights,
  sendState,
  onRetry,
  onRestart,
}: CoffeeResultScreenProps) {
  const [realityCheckOpen, setRealityCheckOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !realityCheckOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.setAttribute("aria-label", REALITY_CHECK.title);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRealityCheckOpen(false);
    };
    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      trigger?.focus();
    };
  }, [realityCheckOpen]);

  return (
    <CoffeeFrame>
      <div className="coffee-stage-enter px-5 pb-[max(3rem,env(safe-area-inset-bottom))] pt-8">
        <ResultMasthead
          name={name}
          verdictKey={verdictKey}
          title={title}
          summary={summary}
        />
        <section className="mt-12">
          <p className={eyebrow}>Qua mấy câu vừa rồi</p>
          <div className="mt-5 space-y-4">
            {insights.map((insight) => (
              <div key={insight.key} className="space-y-4">
                {insight.variant === "featured" ? (
                  <FeaturedInsight insight={insight} />
                ) : (
                  <StandardInsight insight={insight} />
                )}
                {insight.showRealityCheck && (
                  <RealityCheckCard
                    onOpen={() => setRealityCheckOpen(true)}
                    triggerRef={triggerRef}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
        <SubmissionStatus sendState={sendState} onRetry={onRetry} />
        <ReciprocityCta />
        <button
          type="button"
          onClick={onRestart}
          className={`${focus} coffee-secondary mt-4 min-h-14 w-full rounded-xl border border-[#8f8374] bg-transparent px-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em]`}
        >
          Chơi lại
        </button>
      </div>

      {realityCheckOpen && (
        <dialog
          ref={dialogRef}
          aria-labelledby="reality-check-title"
          onCancel={(event) => {
            event.preventDefault();
            setRealityCheckOpen(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget)
              setRealityCheckOpen(false);
          }}
          className="m-auto max-h-none max-w-none bg-transparent p-0 text-[#fff9ed] backdrop:bg-black/85"
        >
          <div className="flex max-h-[calc(100dvh-2rem)] flex-col items-end gap-3">
            <button
              type="button"
              aria-label="Đóng video"
              onClick={() => setRealityCheckOpen(false)}
              className="min-h-11 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#fff9ed]"
            >
              Đóng ×
            </button>
            <div className="aspect-[9/16] w-[min(90vw,22.5rem,calc((100dvh-7rem)*9/16))] overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${REALITY_CHECK.videoId}`}
                title="Reality check: lý thuyết với thực tế đôi khi hơi khác nhau"
                className="size-full border-0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </dialog>
      )}
    </CoffeeFrame>
  );
}
