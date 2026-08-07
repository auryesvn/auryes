"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import {
  SOCIAL_GAME_CARDS,
  type SocialGameCardId,
} from "@/lib/social-game-cards";

type FeedbackRequest = {
  boxCode: string;
  eventCode: string;
  rating: number;
  favoriteCardId: SocialGameCardId | null;
  favoriteCardReason: string;
  memorableMoment: string;
  playAgain: boolean;
  instagramHandle: string;
  reconnectConsent: boolean;
};

const RATINGS = [1, 2, 3, 4, 5] as const;

function renderCardContent(content: string) {
  return content
    .split("**")
    .map((segment, index) =>
      index % 2 === 1 ? <strong key={index}>{segment}</strong> : segment,
    );
}

function normalizeContext(value: string | null) {
  if (!value) return null;

  if (value.length > 64) return null;

  const normalized = value.trim();
  return /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(normalized) ? normalized : null;
}

function SocialGameExperience() {
  const searchParams = useSearchParams();
  const [rating, setRating] = useState<number | null>(null);
  const [favoriteCardId, setFavoriteCardId] = useState<SocialGameCardId | null>(
    null,
  );
  const [favoriteCardReason, setFavoriteCardReason] = useState("");
  const [cardPickerOpen, setCardPickerOpen] = useState(false);
  const [memorableMoment, setMemorableMoment] = useState("");
  const [wantsReturn, setWantsReturn] = useState<boolean | null>(null);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [reconnectConsent, setReconnectConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWithConsent, setSubmittedWithConsent] = useState(false);
  const cardPickerRef = useRef<HTMLDialogElement>(null);
  const cardPickerCloseRef = useRef<HTMLButtonElement>(null);
  const cardPickerTriggerRef = useRef<HTMLButtonElement>(null);
  const favoriteReasonRef = useRef<HTMLTextAreaElement>(null);

  const context = useMemo(
    () => ({
      box: normalizeContext(searchParams.get("box")),
      event: normalizeContext(searchParams.get("event")),
    }),
    [searchParams],
  );

  const selectedCard = SOCIAL_GAME_CARDS.find(
    (card) => card.id === favoriteCardId,
  );

  useEffect(() => {
    const dialog = cardPickerRef.current;
    if (!dialog || !cardPickerOpen) return;

    const trigger = cardPickerTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      cardPickerCloseRef.current?.focus(),
    );

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      trigger?.focus();
    };
  }, [cardPickerOpen]);

  function clearFavoriteCard() {
    const wasPickerOpen = cardPickerOpen;
    setFavoriteCardId(null);
    setFavoriteCardReason("");
    setCardPickerOpen(false);
    setError("");

    if (wasPickerOpen) {
      setTimeout(() => cardPickerTriggerRef.current?.focus(), 0);
    }
  }

  function selectFavoriteCard(cardId: SocialGameCardId) {
    setFavoriteCardId(cardId);
    setCardPickerOpen(false);
    setError("");
    setTimeout(() => favoriteReasonRef.current?.focus(), 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    if (rating === null || wantsReturn === null) {
      setError("Chọn một câu trả lời cho cả hai câu hỏi nhé.");
      return;
    }

    if (!context.box || !context.event) {
      setError("Không thể xác định hộp hoặc lần chơi này.");
      return;
    }

    if (reconnectConsent && !instagramHandle.trim().replace(/^@/, "")) {
      setError("Thêm Instagram nếu bạn muốn được tìm lại nhé.");
      return;
    }

    const feedback: FeedbackRequest = {
      boxCode: context.box,
      eventCode: context.event,
      rating,
      favoriteCardId,
      favoriteCardReason: favoriteCardReason.trim(),
      memorableMoment: memorableMoment.trim(),
      playAgain: wantsReturn,
      instagramHandle: instagramHandle.trim(),
      reconnectConsent,
    };

    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/social-game-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        setError("Chưa gửi được. Thử lại một lần nữa nhé.");
        return;
      }

      setSubmittedWithConsent(reconnectConsent);
      setSubmitted(true);
    } catch {
      setError("Chưa gửi được. Kiểm tra kết nối rồi thử lại nhé.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#090909] px-5 py-12 text-[#f0eee8]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(104,91,74,0.18),transparent_48%)]"
          aria-hidden="true"
        />
        <section
          className="relative w-full max-w-sm text-center"
          aria-labelledby="success-heading"
        >
          <p className="mb-5 text-[0.65rem] uppercase tracking-[0.32em] text-stone-500">
            Auryes / After Hours
          </p>
          <h1
            id="success-heading"
            className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance"
          >
            SEE YOU IN ANOTHER ROOM.
          </h1>
          <p className="mx-auto mt-5 max-w-xs text-base leading-7 text-stone-400">
            {submittedWithConsent
              ? "Nếu cái hộp có chương tiếp theo, có thể nó sẽ tìm được bạn."
              : "Có thể chúng ta sẽ gặp lại."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#090909] px-5 py-10 text-[#f0eee8] sm:px-8 sm:py-14">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(117,97,73,0.16),transparent_62%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-md">
        <header className="border-b border-white/10 pb-10 pt-4">
          <p className="text-[0.65rem] uppercase tracking-[0.32em] text-stone-500">
            Auryes / After Hours
          </p>
          <h1 className="mt-7 text-4xl font-semibold leading-none tracking-[-0.045em] sm:text-5xl">
            YOU FOUND IT.
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-400">
            Chắc là bạn vừa chơi cái hộp này.
          </p>
        </header>

        <form className="space-y-11 py-10" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend className="text-xl font-medium tracking-[-0.025em]">
              Tối nay thế nào?
            </legend>
            <div className="mt-6 grid grid-cols-5 gap-2" role="radiogroup">
              {RATINGS.map((value) => (
                <label key={value} className="group relative aspect-square">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => {
                      setRating(value);
                      setError("");
                    }}
                    required
                  />
                  <span className="flex size-full cursor-pointer items-center justify-center rounded-full border border-white/15 text-sm text-stone-400 transition-colors duration-150 hover:border-white/35 hover:text-stone-100 peer-checked:border-stone-200 peer-checked:bg-stone-100 peer-checked:text-stone-950 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-amber-200 motion-reduce:transition-none">
                    {value}
                  </span>
                  <span className="sr-only">{value} trên 5</span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[0.68rem] uppercase tracking-[0.18em] text-stone-600">
              <span>không ổn</span>
              <span>rất vui</span>
            </div>
          </fieldset>

          <section aria-labelledby="favorite-card-heading">
            <h2
              id="favorite-card-heading"
              className="text-xl font-medium tracking-[-0.025em]"
            >
              Lá nào mày thích nhất tối nay?
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Không nhớ hoặc không chọn được cũng không sao.
            </p>

            <div className="mt-5 space-y-3">
              {selectedCard ? (
                <div className="rounded-xl border border-stone-300/40 bg-white/[0.06] p-4">
                  <p className="text-sm leading-6 text-stone-200">
                    Đã chọn: {String(selectedCard.id).padStart(2, "0")} —{" "}
                    <span className="font-semibold">{selectedCard.title}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    <button
                      ref={cardPickerTriggerRef}
                      type="button"
                      onClick={() => setCardPickerOpen(true)}
                      className="text-sm font-medium text-stone-200 underline decoration-stone-600 underline-offset-4 outline-none hover:decoration-stone-300 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-amber-200"
                    >
                      Đổi lá
                    </button>
                    <button
                      type="button"
                      onClick={clearFavoriteCard}
                      className="text-sm text-stone-500 underline decoration-stone-700 underline-offset-4 outline-none hover:text-stone-300 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-amber-200"
                    >
                      Không nhớ / không chọn được
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
                  <button
                    type="button"
                    onClick={clearFavoriteCard}
                    aria-pressed="true"
                    className="min-h-12 rounded-lg border border-stone-300/40 bg-white/[0.06] px-3 py-2 text-sm text-stone-200 outline-none hover:border-stone-300/70 focus-visible:ring-2 focus-visible:ring-amber-200"
                  >
                    Không nhớ / không chọn được
                  </button>
                  <button
                    ref={cardPickerTriggerRef}
                    type="button"
                    onClick={() => setCardPickerOpen(true)}
                    className="min-h-12 rounded-lg border border-white/12 px-3 py-2 text-sm text-stone-300 outline-none hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200"
                  >
                    Xem lại 31 lá
                  </button>
                </div>
              )}
            </div>
          </section>

          {favoriteCardId !== null && (
            <div>
              <label
                htmlFor="favorite-card-reason"
                className="block text-base leading-6 text-stone-300"
              >
                Vì sao mày thích lá này?
              </label>
              <textarea
                ref={favoriteReasonRef}
                id="favorite-card-reason"
                name="favoriteCardReason"
                value={favoriteCardReason}
                onChange={(event) => setFavoriteCardReason(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="viết gì cũng được..."
                className="mt-4 block w-full resize-none rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3.5 text-base leading-6 text-stone-100 outline-none placeholder:text-stone-600 focus:border-stone-400 focus:ring-2 focus:ring-stone-300/20"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="memorable-moment"
              className="block text-base leading-6 text-stone-300"
            >
              Có khoảnh khắc / câu hỏi nào bạn nhớ nhất không?
            </label>
            <textarea
              id="memorable-moment"
              name="memorableMoment"
              value={memorableMoment}
              onChange={(event) => setMemorableMoment(event.target.value)}
              maxLength={800}
              rows={4}
              placeholder="viết gì cũng được..."
              className="mt-4 block w-full resize-none rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3.5 text-base leading-6 text-stone-100 outline-none placeholder:text-stone-600 focus:border-stone-400 focus:ring-2 focus:ring-stone-300/20"
            />
          </div>

          <fieldset>
            <legend className="text-base leading-6 text-stone-300">
              Bạn có muốn cái hộp quay lại không?
            </legend>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Có", value: true },
                { label: "Không", value: false },
              ].map((option) => (
                <label key={option.label} className="relative">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="wantsReturn"
                    value={String(option.value)}
                    checked={wantsReturn === option.value}
                    onChange={() => {
                      setWantsReturn(option.value);
                      setError("");
                    }}
                    required
                  />
                  <span className="flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-white/12 px-4 text-sm text-stone-400 transition-colors duration-150 hover:border-white/30 hover:text-stone-100 peer-checked:border-stone-300 peer-checked:bg-white/10 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-amber-200 motion-reduce:transition-none">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-5 border-t border-white/10 pt-10">
            <div>
              <label
                htmlFor="instagram-handle"
                className="block text-base leading-6 text-stone-300"
              >
                Nếu cái hộp có phần tiếp theo, mình có thể tìm bạn ở đâu?
              </label>
              <input
                id="instagram-handle"
                name="instagramHandle"
                type="text"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                maxLength={31}
                value={instagramHandle}
                onChange={(event) => {
                  setInstagramHandle(event.target.value);
                  setError("");
                }}
                placeholder="@instagram"
                className="mt-4 block min-h-12 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3 text-base text-stone-100 outline-none placeholder:text-stone-600 focus:border-stone-400 focus:ring-2 focus:ring-stone-300/20"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-stone-300">
              <input
                type="checkbox"
                name="reconnectConsent"
                checked={reconnectConsent}
                onChange={(event) => {
                  setReconnectConsent(event.target.checked);
                  setError("");
                }}
                className="mt-1 size-4 shrink-0 accent-stone-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
              />
              <span>
                Cho phép mình tìm lại bạn nếu cái hộp có phần tiếp theo.
              </span>
            </label>

            <p className="text-xs leading-5 text-stone-500">
              Không bắt buộc. Chỉ dùng để kết nối lại quanh những lần chơi sau.
            </p>
          </div>

          <div>
            {error && (
              <p
                id="form-error"
                className="mb-4 text-sm leading-5 text-amber-200"
                role="alert"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              aria-describedby={error ? "form-error" : undefined}
              className="min-h-12 w-full rounded-lg bg-[#ede9df] px-5 py-3 text-sm font-semibold text-stone-950 outline-none transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 active:bg-stone-300 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
            >
              {pending ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </form>
      </div>

      <dialog
        ref={cardPickerRef}
        aria-labelledby="card-picker-title"
        onCancel={(event) => {
          event.preventDefault();
          setCardPickerOpen(false);
        }}
        onClose={() => setCardPickerOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-[#090909] p-0 text-[#f0eee8] backdrop:bg-black/75"
      >
        <div className="flex h-full min-h-0 flex-col">
          <header className="shrink-0 border-b border-white/10 bg-[#090909] px-5 py-4">
            <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-500">
                  31 lá
                </p>
                <h2
                  id="card-picker-title"
                  className="mt-1 text-lg font-semibold tracking-[-0.025em]"
                >
                  Chọn lá mày thích nhất
                </h2>
              </div>
              <button
                ref={cardPickerCloseRef}
                type="button"
                onClick={() => setCardPickerOpen(false)}
                className="min-h-11 shrink-0 rounded-lg border border-white/15 px-4 text-sm text-stone-300 outline-none hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                Đóng
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <div className="sticky top-0 z-20 mx-auto w-full max-w-md bg-[#090909] pb-3">
              <button
                type="button"
                onClick={clearFavoriteCard}
                aria-pressed={favoriteCardId === null}
                className={`min-h-12 w-full rounded-lg border px-4 text-center text-sm outline-none hover:border-white/30 hover:text-stone-100 focus-visible:ring-2 focus-visible:ring-amber-200 ${
                  favoriteCardId === null
                    ? "border-stone-200 bg-stone-100 text-stone-950"
                    : "border-white/15 bg-[#090909] text-stone-400"
                }`}
              >
                Không nhớ / không chọn được
              </button>
            </div>

            <fieldset className="mx-auto w-full max-w-md">
              <legend className="sr-only">Chọn lá bài yêu thích</legend>
              <div className="space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {SOCIAL_GAME_CARDS.map((card) => (
                  <label key={card.id} className="relative block min-w-0">
                    <input
                      className="peer sr-only"
                      type="radio"
                      name="favoriteCardPicker"
                      value={card.id}
                      checked={favoriteCardId === card.id}
                      onChange={() => selectFavoriteCard(card.id)}
                    />
                    <span className="flex cursor-pointer flex-col gap-3 rounded-xl border border-white/12 p-4 text-left text-stone-300 outline-none hover:border-white/30 peer-checked:border-stone-200 peer-checked:bg-stone-100 peer-checked:text-stone-950 peer-focus-visible:ring-2 peer-focus-visible:ring-amber-200">
                      <span className="font-mono text-[0.65rem] tracking-[0.18em] text-stone-600">
                        {String(card.id).padStart(2, "0")}
                      </span>
                      <span className="break-words text-sm font-semibold leading-5 tracking-[0.025em]">
                        {card.title}
                      </span>
                      <span className="whitespace-pre-line break-words text-sm leading-6 text-inherit [&_strong]:font-semibold">
                        {renderCardContent(card.fullContent)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </dialog>
    </main>
  );
}

function ExperienceFallback() {
  return <main className="min-h-svh bg-[#090909]" aria-busy="true" />;
}

export default function SocialGamePage() {
  return (
    <Suspense fallback={<ExperienceFallback />}>
      <SocialGameExperience />
    </Suspense>
  );
}
