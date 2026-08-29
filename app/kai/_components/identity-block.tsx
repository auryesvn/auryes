"use client";

import { useReducer, useRef } from "react";

import {
  kaiIdentities,
  type IdentityIcon,
  type IdentityId,
} from "../_data/identities";
import styles from "./identity-block.module.css";
import { initialIdentityState, reduceIdentityState } from "./identity-state.mjs";

const focus =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#b72c24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe5]";

function IdentityIconGraphic({ icon }: { icon: IdentityIcon }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0" {...common}>
      {icon === "briefcase" && <><path d="M4 7.5h16v11H4z" /><path d="M9 7.5V5h6v2.5M4 11h16M10 11v2h4v-2" /></>}
      {icon === "lightbulb" && <><path d="M9 18h6M10 21h4M8.5 14.5A6 6 0 1 1 15.5 14.5C14.4 15.3 14 16 14 17h-4c0-1-.4-1.7-1.5-2.5Z" /><path d="M12 1V0M4.2 4.2 3 3M19.8 4.2 21 3" /></>}
      {icon === "code" && <><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></>}
      {icon === "music" && <><path d="M9 18V5l10-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></>}
      {icon === "workflow" && <><rect x="9" y="2" width="6" height="5" /><rect x="2" y="17" width="6" height="5" /><rect x="16" y="17" width="6" height="5" /><rect x="9" y="17" width="6" height="5" /><path d="M12 7v5M5 17v-5h14v5" /></>}
      {icon === "trainer" && <><circle cx="12" cy="7" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></>}
    </svg>
  );
}

function CloseIcon() {
  return <span aria-hidden="true" className="text-2xl font-light leading-none">×</span>;
}

export default function IdentityBlock() {
  const [state, dispatch] = useReducer(reduceIdentityState, initialIdentityState);
  const identityButtonRefs = useRef(new Map<IdentityId, HTMLButtonElement>());
  const whyTriggerRef = useRef<HTMLButtonElement>(null);
  const selected = kaiIdentities.find(({ id }) => id === state.selectedIdentity);

  const closeIdentityDetail = (identityId: IdentityId) => {
    dispatch({ type: "close-detail" });
    requestAnimationFrame(() => identityButtonRefs.current.get(identityId)?.focus());
  };

  const closeWhy = () => {
    dispatch({ type: "close-why" });
    requestAnimationFrame(() => whyTriggerRef.current?.focus());
  };

  const scrollToProjects = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("kai-projects")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section aria-labelledby="kai-identities-title">
      <button
        type="button"
        aria-expanded={state.rolesOpen}
        aria-controls="kai-identities-content"
        onClick={() => dispatch({ type: "toggle-roles" })}
        className={`${focus} group flex w-full items-center justify-between gap-5 border-b border-[#d8cdbc] pb-5 text-left`}
      >
        <span>
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#766e63]">MỘT CÁCH GỌI KHÁC:</span>
          <span id="kai-identities-title" className="mt-2 block [font-family:var(--font-kai-serif)] text-[1.45rem] font-semibold leading-tight">Có thể gọi Kai là…</span>
        </span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#171411]" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`size-5 transition-transform duration-[240ms] motion-reduce:transition-none ${state.rolesOpen ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </button>

      {state.rolesOpen && (
        <div id="kai-identities-content" className={`${styles.reveal} pt-5`}>
          <p className="text-sm leading-6 text-[#756d62]">Những vai trò cụ thể của cùng một kiểu làm việc.</p>

          {selected && (
            <article key={selected.id} aria-labelledby={`identity-detail-${selected.id}`} className={`${styles.reveal} mt-5 rounded-2xl border border-[#cbbfae] p-4`}>
              <div className="flex items-start gap-3">
                <IdentityIconGraphic icon={selected.icon} />
                <h3 id={`identity-detail-${selected.id}`} className="flex-1 text-sm font-semibold leading-6">{selected.label}</h3>
                <button type="button" onClick={() => closeIdentityDetail(selected.id)} aria-label={`Đóng thông tin ${selected.label}`} className={`${focus} -mr-1 -mt-1 flex size-8 items-center justify-center`}><CloseIcon /></button>
              </div>
              <p className="mt-4 text-sm leading-[1.65] text-[#665f56]">{selected.description}</p>
              {selected.cta?.kind === "link" && <a href={selected.cta.href} className={`${focus} mt-4 inline-flex min-h-11 items-center text-sm underline decoration-1 underline-offset-4`}>{selected.cta.label}</a>}
              {selected.cta?.kind === "projects" && <button type="button" onClick={scrollToProjects} className={`${focus} mt-4 flex min-h-11 items-center text-left text-sm underline decoration-1 underline-offset-4`}>{selected.cta.label}</button>}
            </article>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2.5 max-[360px]:grid-cols-1">
            {kaiIdentities.map((identity) => {
              const active = identity.id === state.selectedIdentity;
              return (
                <button
                  key={identity.id}
                  ref={(node) => {
                    if (node) identityButtonRefs.current.set(identity.id, node);
                    else identityButtonRefs.current.delete(identity.id);
                  }}
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch({ type: "toggle-identity", identityId: identity.id })}
                  className={`${focus} flex min-h-[3.25rem] items-center gap-3 rounded-xl border px-3 text-left text-[0.8rem] font-medium leading-5 transition-colors duration-200 motion-reduce:transition-none ${active ? "border-[#171411] bg-[#171411] text-[#fff9ed]" : "border-[#cbbfae] bg-transparent text-[#171411]"}`}
                >
                  <IdentityIconGraphic icon={identity.icon} />
                  <span>{identity.label}</span>
                </button>
              );
            })}
          </div>

          {state.whyOpen ? (
            <article aria-labelledby="kai-why-title" className={`${styles.reveal} mt-5 rounded-2xl border border-[#171411] p-4`}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#766e63]">VÌ SAO LẠI LÀ</p>
                  <h3 id="kai-why-title" className="mt-1 [font-family:var(--font-kai-serif)] text-lg font-semibold leading-tight">Nhà thiết kế hệ thống &amp; trải nghiệm</h3>
                </div>
                <button type="button" onClick={closeWhy} aria-label="Đóng phần giải thích" className={`${focus} -mr-1 -mt-1 flex size-8 items-center justify-center`}><CloseIcon /></button>
              </div>
              <p className="mt-4 text-sm leading-[1.65] text-[#4f4942]">Đây không phải một chức danh nghề nghiệp cố định. Đó là cách Kai làm việc: quan sát một hệ thống, tìm điểm vướng, thiết kế lại và biến nó thành thứ người khác có thể dùng, chơi hoặc học.</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] font-medium"><span>Quan sát</span><span aria-hidden="true">→</span><span>Thiết kế</span><span aria-hidden="true">→</span><span>Xây dựng</span><span aria-hidden="true">→</span><span>Chia sẻ</span></p>
            </article>
          ) : (
            <button ref={whyTriggerRef} type="button" onClick={() => dispatch({ type: "open-why" })} className={`${focus} mt-5 flex min-h-11 items-center text-left text-sm underline decoration-1 underline-offset-4`}>Vì sao lại là nhà thiết kế hệ thống &amp; trải nghiệm? →</button>
          )}
        </div>
      )}
    </section>
  );
}
