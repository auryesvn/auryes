"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type LocalFeedback = {
  box: string | null;
  event: string | null;
  rating: number;
  memorableMoment: string;
  wantsReturn: boolean;
};

const RATINGS = [1, 2, 3, 4, 5] as const;

function normalizeContext(value: string | null) {
  if (!value) return null;

  const normalized = value.trim().slice(0, 80);
  return /^[a-zA-Z0-9_-]+$/.test(normalized) ? normalized : null;
}

function SocialGameExperience() {
  const searchParams = useSearchParams();
  const [rating, setRating] = useState<number | null>(null);
  const [memorableMoment, setMemorableMoment] = useState("");
  const [wantsReturn, setWantsReturn] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const context = useMemo(
    () => ({
      box: normalizeContext(searchParams.get("box")),
      event: normalizeContext(searchParams.get("event")),
    }),
    [searchParams],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === null || wantsReturn === null) {
      setError("Chọn một câu trả lời cho cả hai câu hỏi nhé.");
      return;
    }

    const feedback: LocalFeedback = {
      ...context,
      rating,
      memorableMoment: memorableMoment.trim(),
      wantsReturn,
    };

    // V0 intentionally keeps feedback local. This payload is the future POST boundary.
    void feedback;
    setError("");
    setSubmitted(true);
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
            Có thể cái hộp này sẽ nhớ bạn.
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
              aria-describedby={error ? "form-error" : undefined}
              className="min-h-12 w-full rounded-lg bg-[#ede9df] px-5 py-3 text-sm font-semibold text-stone-950 outline-none transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 active:bg-stone-300 motion-reduce:transition-none"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
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
