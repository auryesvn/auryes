"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "auryes:return-context";
const HISTORY_KEY = "__auryesReturnContext";
const RETURN_CONTEXTS = {
  kai: {
    label: "Quay lại thẻ Kai",
    returnUrl: "https://auryes.vn/kai",
  },
} as const;

type ReturnContext = keyof typeof RETURN_CONTEXTS;

function isReturnContext(value: string | null): value is ReturnContext {
  return value !== null && value in RETURN_CONTEXTS;
}

function referrerIsKai() {
  if (!document.referrer) return false;

  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === "https://auryes.vn" && referrer.pathname === "/kai";
  } catch {
    return false;
  }
}

export default function ContextReturnBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryContext = searchParams.get("context");
  const [context, setContext] = useState<ReturnContext | null>(null);
  const isSuppressedRoute =
    pathname === "/kai" || pathname === "/3288" || pathname.startsWith("/3288/");

  useEffect(() => {
    let cancelled = false;
    let nextContext: ReturnContext | null = null;

    if (!isSuppressedRoute) {
      try {
        if (isReturnContext(queryContext)) {
          sessionStorage.setItem(STORAGE_KEY, queryContext);

          if (referrerIsKai()) {
            history.replaceState(
              { ...history.state, [HISTORY_KEY]: queryContext },
              "",
            );
          }

          nextContext = queryContext;
        } else {
          const storedContext = sessionStorage.getItem(STORAGE_KEY);
          nextContext = isReturnContext(storedContext) ? storedContext : null;
        }
      } catch {
        nextContext = isReturnContext(queryContext) ? queryContext : null;
      }
    }

    queueMicrotask(() => {
      if (!cancelled) setContext(nextContext);
    });

    return () => {
      cancelled = true;
    };
  }, [isSuppressedRoute, queryContext]);

  if (!context || isSuppressedRoute) return null;

  const config = RETURN_CONTEXTS[context];

  const clearContext = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
    setContext(null);
  };

  const returnToContext = () => {
    const currentContext = context;
    const arrivedFromKai =
      history.state?.[HISTORY_KEY] === currentContext ||
      (queryContext === currentContext && referrerIsKai());

    clearContext();

    if (arrivedFromKai) {
      history.back();
      return;
    }

    location.assign(config.returnUrl);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="h-[calc(5rem+env(safe-area-inset-bottom))] shrink-0"
      />
      <aside className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#171411] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-[#fff9ed] shadow-[0_-10px_30px_rgba(23,20,17,0.18)] motion-reduce:transition-none">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={returnToContext}
            className="min-h-11 flex-1 rounded-lg px-4 text-left text-sm font-semibold outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#fff9ed] motion-reduce:transition-none"
          >
            {config.label}
          </button>
          <button
            type="button"
            onClick={clearContext}
            aria-label="Đóng thanh quay lại"
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-xl font-light leading-none outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#fff9ed] motion-reduce:transition-none"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </aside>
    </>
  );
}
