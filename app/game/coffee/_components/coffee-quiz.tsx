"use client";

import Image from "next/image";
import { type FormEvent, Fragment, useEffect, useRef, useState } from "react";

import {
  ADDRESS_MODES,
  COFFEE_QUESTIONS,
  COFFEE_QUIZ_VERSION,
  computeCoffeeResult,
  normalizeInstagram,
  profileEvidenceCount,
  questionPrompt,
  type AddressMode,
  type AnswerId,
  type CoffeeAnswers,
  type CoffeeQuestionId,
  type ProfileKey,
  type VerdictKey,
} from "@/lib/coffee-quiz";
import {
  adaptCoffeeAddress,
  COFFEE_PROFILE_TITLES,
  COFFEE_VERDICT_TITLES,
  getCoffeeVerdictSupportKind,
  getCoffeeVisibleProfileKeys,
} from "@/lib/coffee-result-presentation";

import CoffeeCover from "./coffee-cover";

const ADDRESS_LABELS: Record<AddressMode, string> = {
  ban_minh: "Bạn / mình",
  cau_minh: "Cậu / mình",
  anh_em: "Anh / em 👀",
};
const REALITY_CHECK = {
  eyebrow: "Reality check :))",
  title: "Lý thuyết với thực tế đôi khi hơi khác nhau.",
  body: "Có những chuyện lúc chưa yêu nghe rất dễ. Vào đúng tình huống rồi mới biết mình phản ứng thế nào :))",
  cta: "▶ Xem một ví dụ rất đời",
  videoId: "XoLoGpo3psk",
} as const;
const VERDICTS: Record<VerdictKey, { title: string; paragraphs: string[] }> = {
  uncertain: {
    title: COFFEE_VERDICT_TITLES.uncertain,
    paragraphs: [
      "Có vài điểm khiến Kai thấy tò mò, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không.",
      "Phần còn lại nên để ngoài đời trả lời.",
    ],
  },
  promising: {
    title: COFFEE_VERDICT_TITLES.promising,
    paragraphs: [
      "Có vài điểm khá hợp nhau: cách gần gũi, cách nhìn vào thực tế hoặc cách hai người có thể kéo nhau vào những trải nghiệm mới.",
      "Nhưng đừng tin web quá. Gặp nhau vẫn quan trọng hơn.",
    ],
  },
  friend_like: {
    title: COFFEE_VERDICT_TITLES.friend_like,
    paragraphs: [
      "Có thể nói chuyện, chơi hoặc làm vài thứ cùng nhau vẫn rất vui.",
      "Còn có bật sang “mode người yêu” không thì web chịu.",
    ],
  },
  different_system: {
    title: COFFEE_VERDICT_TITLES.different_system,
    paragraphs: [
      "Không phải ai sai cả.",
      "Chỉ là có vài chỗ nếu bước vào một mối quan hệ thật thì hai người có thể phải tốn khá nhiều công để khớp với nhau.",
    ],
  },
};

type ProfileCopy = {
  strong: { title: string; body: string };
  weak: { title: string; body: string };
};
type VerdictSupportCopy = { title: string; body: string };

const PROFILES: Record<ProfileKey, ProfileCopy> = {
  closeness: {
    strong: {
      title: "Bạn thích có một người đủ gần để kéo vào cùng.",
      body: "Có vẻ sự gần gũi với bạn không nhất thiết là hai người phải làm mọi thứ cùng nhau. Điều đáng quý hơn là khi có chuyện, cả hai có thể tự nhiên tìm đến nhau để chia sẻ một ý nghĩ, một cảm xúc hoặc đơn giản là ngồi cạnh. Vẫn có khoảng riêng, nhưng không phải hai thế giới đóng kín.",
    },
    weak: {
      title: "Có một chút cảm giác là bạn thích có người ở cạnh khi cần.",
      body: "Ít nhất trong một tình huống vừa rồi, bạn nghiêng về việc kéo người kia lại gần thay vì luôn tự xử lý mọi thứ. Chưa đủ để nói bạn cần gần gũi đến đâu; có lẽ điều quan trọng hơn là người ấy biết lúc nào nên bước vào.",
    },
  },
  practical: {
    strong: {
      title: "Bạn có vẻ khá thực tế.",
      body: "Một ý tưởng nghe hay chưa chắc đã đủ với bạn; bạn còn muốn xem nó chạy ngoài đời thế nào. Nếu thấy một chỗ chưa ổn, bạn có xu hướng cùng người kia bóc ra thay vì chỉ gật đầu cho vui. Với người hơi mơ mộng, đôi lúc cách này có thể làm mất hứng một chút; với đúng người, nó lại giúp cả hai đứng vững hơn.",
    },
    weak: {
      title: "Qua một câu trả lời, bạn có vẻ để ý đến tính thực tế.",
      body: "Có một chút cảm giác là bạn không chỉ nghe xem một điều có hấp dẫn hay không, mà còn nhìn xem nó có làm được thật không. Đây mới là một dấu hiệu nhỏ, nên cũng có thể tùy chuyện bạn mới bật phần này lên.",
    },
  },
  mutual_respect: {
    strong: {
      title: "Bạn có vẻ thích một người vẫn còn điều để mình nể.",
      body: "Việc người kia giỏi hơn ở một vài thứ không nhất thiết làm bạn khó chịu; nó có thể trở thành lý do để hỏi, để học và để tiếp tục tò mò. Về lâu dài, cảm giác tôn trọng phán đoán của nhau có lẽ quan trọng với bạn không kém chuyện hợp sở thích. Không cần ai hơn ai, chỉ cần cả hai vẫn thấy lời của người kia đáng nghe.",
    },
    weak: {
      title: "Có vẻ bạn khá mở với việc nghe phán đoán của người kia.",
      body: "Ít nhất qua một lựa chọn, bạn không xem việc dựa vào góc nhìn của người khác là mất đi phần độc lập của mình. Chưa chắc điều này đúng trong mọi lĩnh vực, nhưng có vẻ bạn vẫn chừa chỗ cho sự nể phục và học hỏi.",
    },
  },
  novelty: {
    strong: {
      title: "Bạn thích một mối quan hệ vẫn có chuyển động.",
      body: "Chuyển động ở đây không nhất thiết là lúc nào cũng phải ra ngoài hay làm điều thật lớn. Hai người ở nhà mà vẫn nghĩ ra trò, kéo nhau vào một câu chuyện mới hoặc luân phiên mang thêm trải nghiệm vào cũng đã đủ vui. Có vẻ bạn muốn cả hai cùng góp phần để mối quan hệ không chỉ chạy bằng quán tính.",
    },
    weak: {
      title: "Có một chút cảm giác là bạn thích mối quan hệ có thêm điều mới.",
      body: "Một lựa chọn của bạn gợi ý rằng đôi lúc bạn muốn có trò mới, góc nhìn mới hoặc một lời rủ bất ngờ. Nhưng đây chưa phải dấu hiệu mạnh; sự quen thuộc và yên ổn có thể vẫn quan trọng với bạn ở những lúc khác.",
    },
  },
  presence: {
    strong: {
      title: "Bạn vẫn cần một sự hiện diện có ý nghĩa.",
      body: "Có đời sống riêng không có nghĩa là người kia có thể gần như biến mất khỏi cuộc sống của bạn. Một người rất thú vị nhưng luôn quá bận có lẽ vẫn để lại cảm giác hơi trống. Không phải đếm số giờ ở cạnh nhau; có vẻ điều bạn cần là cảm giác họ thật sự có mặt khi hai người đang ở bên nhau.",
    },
    weak: {
      title:
        "Ít nhất qua mấy câu vừa rồi, sự có mặt của người kia có vẻ vẫn quan trọng với bạn.",
      body: "Có một lựa chọn cho thấy độc lập chưa chắc thay thế được cảm giác được ở cạnh nhau khi cần. Chưa đủ để biết bạn muốn gặp nhau nhiều hay ít; có lẽ chất lượng của sự hiện diện mới là phần đáng để ý.",
    },
  },
  limits: {
    strong: {
      title: "Bạn có vẻ sẵn sàng nói chuyện rõ ràng về giới hạn.",
      body: "Bạn không nhất thiết chờ hai người tự hiểu nhau hoàn hảo, cũng không coi mọi giới hạn là thứ khỏi cần bàn. Có vẻ cách hợp với bạn hơn là cùng nói xem điều gì hợp lý, rồi tôn trọng những gì đã được làm rõ. Khi gần một người khác, kiểu trao đổi này có thể giúp cả hai điều chỉnh mà không phải đoán ý nhau mãi.",
    },
    weak: {
      title: "Có vẻ bạn muốn những giới hạn được nói ra thay vì đoán mò.",
      body: "Một câu trả lời cho thấy bạn nghiêng về việc dừng lại, trao đổi hoặc điều chỉnh khi có chỗ khiến người kia không ổn. Đây chỉ là một lát cắt nhỏ; ít nhất nó cho thấy bạn không mặc định rằng yêu nhau thì phải tự động đồng ý mọi thứ.",
    },
  },
};

type Stage = "intro" | "address" | "questions" | "identity" | "result";
type SendState = "idle" | "sending" | "sent" | "failed";

const paperPattern =
  "bg-[#f4efe5] [background-image:radial-gradient(circle,rgba(49,40,31,0.13)_0.65px,transparent_0.75px)] [background-size:5px_5px]";
const eyebrow =
  "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#766e63]";
const focus =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#b72c24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe5]";
const answerClass =
  "coffee-answer flex min-h-14 w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left text-[0.95rem] leading-6 transition-colors duration-150 motion-reduce:transition-none";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-[#ded5c5] text-[#171411] selection:bg-[#b72c24] selection:text-white">
      <div
        className={`relative mx-auto min-h-svh w-full max-w-md overflow-hidden shadow-[0_0_55px_rgba(45,36,28,0.13)] ${paperPattern}`}
      >
        {children}
      </div>
    </main>
  );
}

export default function CoffeeQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [addressMode, setAddressMode] = useState<AddressMode | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<CoffeeAnswers>>({});
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [formError, setFormError] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [realityCheckOpen, setRealityCheckOpen] = useState(false);
  const realityCheckDialogRef = useRef<HTMLDialogElement>(null);
  const realityCheckTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = realityCheckDialogRef.current;
    if (!dialog || !realityCheckOpen) return;
    const trigger = realityCheckTriggerRef.current;
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

  useEffect(() => {
    if (stage === "intro") return;
    const animationFrame = window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, [questionIndex, stage]);

  function chooseAnswer(id: CoffeeQuestionId, answer: AnswerId) {
    setAnswers((current) => ({ ...current, [id]: answer }));
    if (questionIndex < COFFEE_QUESTIONS.length - 1) {
      setQuestionIndex((value) => value + 1);
    } else {
      setStage("identity");
    }
  }

  function goBack() {
    if (stage === "address") setStage("intro");
    else if (stage === "questions" && questionIndex === 0) setStage("address");
    else if (stage === "questions") setQuestionIndex((value) => value - 1);
    else if (stage === "identity") {
      setStage("questions");
      setQuestionIndex(COFFEE_QUESTIONS.length - 1);
    }
  }

  function restart() {
    setStage("intro");
    setAddressMode(null);
    setQuestionIndex(0);
    setAnswers({});
    setName("");
    setInstagram("");
    setFormError("");
    setSendState("idle");
    setRealityCheckOpen(false);
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!addressMode || Object.keys(answers).length !== COFFEE_QUESTIONS.length)
      return;
    const normalizedName = name.trim().replace(/\s+/g, " ");
    const normalizedInstagram = normalizeInstagram(instagram);
    if (!normalizedName) {
      setFormError("Kai nên gọi bạn là gì nhỉ?");
      return;
    }
    if (normalizedName.length > 80) {
      setFormError("Tên này hơi dài rồi. Rút gọn một chút nhé.");
      return;
    }
    if (normalizedInstagram === undefined) {
      setFormError("Instagram này có vẻ chưa đúng.");
      return;
    }
    setFormError("");
    setStage("result");
    setSendState("sending");
    try {
      const response = await fetch("/api/coffee-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizVersion: COFFEE_QUIZ_VERSION,
          name: normalizedName,
          instagram,
          addressMode,
          answers,
        }),
      });
      setSendState(response.ok ? "sent" : "failed");
    } catch {
      setSendState("failed");
    }
  }

  if (stage === "intro") {
    return (
      <Frame>
        <div className="coffee-stage-enter pb-[max(2rem,env(safe-area-inset-bottom))]">
          <header className="relative h-[14.5rem] overflow-hidden">
            <CoffeeCover />
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-6 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/90">
              <span>
                <a href="https://auryes.vn">Auryes</a>
              </span>
              <span>Coffee / 01</span>
            </div>
            <div
              className={`absolute -bottom-7 left-1/2 h-14 w-[116%] -translate-x-1/2 rounded-[50%_50%_0_0/100%_100%_0_0] [background-position:0_calc(-14.5rem+1.75rem)] ${paperPattern}`}
              aria-hidden="true"
            />
          </header>

          <section className="relative z-10 -mt-[6.35rem] overflow-hidden px-5 text-center">
            <div className="relative z-10 mx-auto aspect-[1203/1416] w-[13.35rem] max-w-[66vw]">
              <div
                className="absolute left-[calc(6.82%-7px)] top-[calc(6.50%-7px)] aspect-square w-[calc(85.12%+14px)] rounded-full bg-white shadow-[0_10px_24px_rgba(38,29,21,0.22)]"
                aria-hidden="true"
              />
              <Image
                src="/kai/kai-playful.png"
                alt="Kai đưa tay về phía máy ảnh với vẻ mặt vui vẻ"
                fill
                priority
                sizes="214px"
                className="relative z-10 object-contain"
              />
            </div>

            <div className="relative z-10 -mt-5">
              <p className={`${eyebrow} text-[#9f3029]`}>
                Auryes / một trò chơi nhỏ của Kai
              </p>
              <h1 className="mx-auto mt-3 max-w-sm [font-family:var(--font-coffee-serif)] text-[2.65rem] font-medium leading-[0.94] tracking-[-0.045em]">
                Có vẻ chúng ta hợp kiểu nào nhỉ?
              </h1>
              <p className="mx-auto mt-4 max-w-[20rem] text-sm leading-5 text-[#756d62]">
                Một trò chơi nhỏ để xem cách bạn suy nghĩ và phản ứng khi ở gần
                một người khác.
              </p>
              <button
                type="button"
                onClick={() => setStage("address")}
                className={`${focus} coffee-primary mt-6 min-h-14 w-full rounded-xl bg-[#171411] px-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#fff9ed] transition-colors motion-reduce:transition-none`}
              >
                Chơi thử xem 👀
              </button>
              <p className="mt-3 text-xs text-[#857b6e]">
                12 câu · khoảng 2 phút
              </p>
            </div>
          </section>

          <aside className="mx-5 mt-8 rounded-2xl border border-[#d8cdbc] bg-[#faf6ee] px-5 py-6 [background-image:none]">
            <p className={eyebrow}>Trước khi chơi</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[#756d62]">
              <p>
                Không có đáp án chuẩn. Không có “hợp 96%”. Cũng không có người
                hoàn hảo.
              </p>
              <p>
                Mình chỉ biết những gì bạn chọn ở đây. Còn cách nói chuyện, cách
                đùa, năng lượng khi gặp nhau và cả một chút duyên số thì... chắc
                phải gặp mới biết.
              </p>
            </div>
          </aside>
        </div>
      </Frame>
    );
  }

  if (stage === "address") {
    return (
      <Frame>
        <div className="coffee-stage-enter flex min-h-svh flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className={`${focus} ${eyebrow} min-h-11 py-2`}
            >
              ← Quay lại
            </button>
            <span className={eyebrow}>Auryes / Coffee</span>
          </header>
          <section className="my-auto py-12">
            <p className={`${eyebrow} text-[#9f3029]`}>Trước khi bắt đầu</p>
            <h1 className="mt-5 [font-family:var(--font-coffee-serif)] text-[2.55rem] font-medium leading-[1.02] tracking-[-0.035em]">
              Mình xưng hô thế nào nhỉ?
            </h1>
            <div
              className="mt-9 space-y-3"
              role="group"
              aria-label="Chọn cách xưng hô"
            >
              {ADDRESS_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode}
                  aria-pressed={addressMode === mode}
                  className={`${focus} ${answerClass} ${addressMode === mode ? "border-[#171411] bg-[#171411] text-[#fff9ed]" : "border-[#d1c6b6] bg-[#faf6ee] text-[#332e29]"}`}
                  onClick={() => {
                    setAddressMode(mode);
                    setStage("questions");
                  }}
                >
                  {ADDRESS_LABELS[mode]}
                </button>
              ))}
            </div>
          </section>
        </div>
      </Frame>
    );
  }

  if (stage === "questions" && addressMode) {
    const question = COFFEE_QUESTIONS[questionIndex];
    const progress = questionIndex + 1;
    return (
      <Frame>
        <div
          key={question.id}
          className="coffee-stage-enter min-h-svh px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6"
        >
          <header>
            <div className="flex min-h-11 items-center justify-between gap-4">
              <button
                type="button"
                onClick={goBack}
                className={`${focus} ${eyebrow} min-h-11 py-2`}
              >
                ← Quay lại
              </button>
              <span className={eyebrow}>
                Câu {String(progress).padStart(2, "0")} /{" "}
                {COFFEE_QUESTIONS.length}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`Tiến độ câu hỏi: câu ${progress} trên ${COFFEE_QUESTIONS.length}`}
              aria-valuemin={1}
              aria-valuemax={COFFEE_QUESTIONS.length}
              aria-valuenow={progress}
              className="mt-4 h-1 overflow-hidden rounded-full bg-[#d8cdbc]"
            >
              <div
                className="h-full rounded-full bg-[#171411] transition-[width] duration-200 motion-reduce:transition-none"
                style={{
                  width: `${(progress / COFFEE_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>
          </header>
          <section className="py-10">
            <p className={`${eyebrow} text-[#9f3029]`}>Auryes / Coffee</p>
            <h1 className="mt-5 [font-family:var(--font-coffee-serif)] text-[clamp(2rem,8.6vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              {questionPrompt(question, addressMode)}
            </h1>
            <div
              className="mt-8 space-y-3"
              role="radiogroup"
              aria-label={`Câu ${progress}`}
            >
              {Object.entries(question.answers).map(([id, label]) => {
                const selected = answers[question.id] === id;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    key={id}
                    onClick={() => chooseAnswer(question.id, id as AnswerId)}
                    className={`${focus} ${answerClass} ${selected ? "border-[#171411] bg-[#171411] text-[#fff9ed]" : "border-[#d1c6b6] bg-[#faf6ee] text-[#332e29]"}`}
                  >
                    <span
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-[0.63rem] font-semibold"
                      aria-hidden="true"
                    >
                      {id}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </Frame>
    );
  }

  if (stage === "identity") {
    return (
      <Frame>
        <div className="coffee-stage-enter flex min-h-svh flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
          <header className="flex min-h-11 items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className={`${focus} ${eyebrow} min-h-11 py-2`}
            >
              ← Quay lại
            </button>
            <span className={eyebrow}>Câu 12 / 12</span>
          </header>
          <form onSubmit={submit} className="my-auto py-10">
            <p className={`${eyebrow} text-[#9f3029]`}>Xong 12 câu rồi</p>
            <h1 className="mt-5 [font-family:var(--font-coffee-serif)] text-[2.55rem] font-medium leading-[1.04] tracking-[-0.035em]">
              Kai nên gọi bạn là gì?
            </h1>
            <div className="mt-9 rounded-2xl border border-[#d8cdbc] bg-[#faf6ee] p-5 [background-image:none]">
              <label className="block text-sm font-medium text-[#514a42]">
                Tên
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  className={`${focus} mt-2 min-h-14 w-full rounded-xl border border-[#cbbfaf] bg-[#fffdf8] px-4 text-base text-[#171411] placeholder:text-[#91877a]`}
                />
              </label>
              <label className="mt-6 block text-sm font-medium text-[#514a42]">
                Instagram{" "}
                <span className="font-normal text-[#857b6e]">
                  (không bắt buộc)
                </span>
                <input
                  value={instagram}
                  onChange={(event) => setInstagram(event.target.value)}
                  maxLength={120}
                  autoCapitalize="none"
                  autoComplete="off"
                  placeholder="@username"
                  className={`${focus} mt-2 min-h-14 w-full rounded-xl border border-[#cbbfaf] bg-[#fffdf8] px-4 text-base text-[#171411] placeholder:text-[#91877a]`}
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-[#857b6e]">
                  Nếu muốn Kai biết ai vừa chơi trò này.
                </span>
              </label>
            </div>
            {formError && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-[#b72c24]/25 bg-[#fff7f3] px-4 py-3 text-sm text-[#8d2923]"
              >
                {formError}
              </p>
            )}
            <button
              type="submit"
              className={`${focus} coffee-primary mt-7 min-h-14 w-full rounded-xl bg-[#171411] px-6 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#fff9ed] transition-colors motion-reduce:transition-none`}
            >
              Xem kết quả
            </button>
          </form>
        </div>
      </Frame>
    );
  }

  if (
    stage === "result" &&
    addressMode &&
    Object.keys(answers).length === COFFEE_QUESTIONS.length
  ) {
    const completeAnswers = answers as CoffeeAnswers;
    const result = computeCoffeeResult(completeAnswers);
    const verdict = VERDICTS[result.verdictKey];
    const uncertainFirst =
      addressMode === "anh_em" && result.verdictKey === "uncertain"
        ? "Có vài điểm khiến anh thấy tò mò về em, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không."
        : verdict.paragraphs[0];
    const adapt = (text: string) => adaptCoffeeAddress(text, addressMode);
    const observationCopy = (key: ProfileKey) => {
      const confidence =
        profileEvidenceCount(completeAnswers, key) >= 2 ? "strong" : "weak";
      return {
        ...PROFILES[key][confidence],
        title: COFFEE_PROFILE_TITLES[key][confidence],
      };
    };
    const verdictSupportKind = getCoffeeVerdictSupportKind(
      completeAnswers,
      result.verdictKey,
    );
    const verdictSupport = ((): VerdictSupportCopy | null => {
      if (verdictSupportKind === "friend_like")
        return {
          title: "Chưa thấy quá nhiều chất ‘người yêu’ trong mấy câu này.",
          body: "Bạn vẫn có vẻ là kiểu người có thể nói chuyện, chơi và tìm thấy thứ để nể ở người kia. Nhưng qua mấy câu vừa rồi, chưa có nhiều dấu hiệu cho thấy bạn đặc biệt cần kiểu gần gũi mang màu sắc người yêu. Cái này web cũng khó đoán; đôi khi gặp đúng người thì nó mới bật.",
        };
      if (!verdictSupportKind) return null;
      if (verdictSupportKind === "conflict_vulnerability")
        return {
          title: "Có một chỗ Kai hơi để ý.",
          body: "Một câu trả lời của bạn gợi ý rằng khi cãi nhau, bạn có thể dùng đúng điểm yếu đã biết để làm người kia đau vì cảm giác đó giúp mình thắng hoặc thấy đã hơn. Kai không ngại bất đồng, nói thẳng, phản biện hay chỉ ra một điểm yếu khi nó thật sự liên quan. Chỗ hơi khác hệ nằm ở việc dùng điều dễ tổn thương của người kia với mục đích làm đau họ.",
        };
      if (verdictSupportKind === "jealousy_boundary")
        return {
          title: "Có một chỗ Kai hơi để ý.",
          body: "Ghen một chút không phải điều Kai thấy lạ. Nhưng trong tình huống vừa rồi, người kia đã nói rõ rằng họ cảm thấy bị kiểm soát, còn câu trả lời của bạn vẫn xem việc chấp nhận cách đó là điều tình yêu nên đòi hỏi. Chỗ hơi khác hệ không nằm ở cảm giác ghen, mà ở điều xảy ra sau khi một giới hạn đã được nói rõ.",
        };
      return {
        title: "Có vài chỗ Kai chưa chắc hai người sẽ vận hành giống nhau.",
        body: "Qua mấy câu vừa rồi, bạn có vẻ khá thoải mái với việc một lời hứa nhỏ có thể trôi qua, đồng thời cần người thân đồng ý mới thấy yên tâm với quyết định lớn của hai người. Từng chuyện riêng lẻ chưa nói lên quá nhiều. Nhưng khi đặt cạnh nhau, chúng làm Kai hơi băn khoăn về việc hai người sẽ giữ lời với nhau và tự quyết chuyện của mối quan hệ đến đâu.",
      };
    })();
    const visibleProfileKeys = getCoffeeVisibleProfileKeys(
      result,
      verdictSupportKind,
    );

    return (
      <Frame>
        <div className="coffee-stage-enter px-5 pb-[max(3rem,env(safe-area-inset-bottom))] pt-8">
          <header>
            <p className={`${eyebrow} text-[#9f3029]`}>
              Auryes / kết quả của bạn
            </p>
            <p className="mt-2 text-sm text-[#857b6e]">{name.trim()}</p>
          </header>
          <section className="mt-8">
            <h1 className="[font-family:var(--font-coffee-serif)] text-[clamp(3rem,13vw,4.3rem)] font-medium leading-[0.94] tracking-[-0.05em]">
              {verdict.title}
            </h1>
            <div className="mt-7 space-y-3 text-[0.95rem] leading-7 text-[#655d54]">
              <p>{uncertainFirst}</p>
              {verdict.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <p className={eyebrow}>Qua mấy câu vừa rồi</p>
            <div className="mt-5 space-y-4">
              {verdictSupport && (
                <article className="rounded-2xl border border-[#cfc3b3] bg-[#faf6ee] p-5 [background-image:none]">
                  <h2 className="[font-family:var(--font-coffee-serif)] text-[1.6rem] font-medium leading-tight tracking-[-0.025em]">
                    {adapt(verdictSupport.title)}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#756d62]">
                    {adapt(verdictSupport.body)}
                  </p>
                </article>
              )}
              {visibleProfileKeys.map((key) => {
                const copy = observationCopy(key);
                const showRealityCheck =
                  key === "limits" &&
                  ["A", "B", "D"].includes(completeAnswers.jealousy_boundary);
                return (
                  <Fragment key={key}>
                    <article className="rounded-2xl border border-[#d8cdbc] bg-[#faf6ee] p-5 [background-image:none]">
                      <h2 className="[font-family:var(--font-coffee-serif)] text-[1.55rem] font-medium leading-tight tracking-[-0.025em]">
                        {adapt(copy.title)}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#756d62]">
                        {adapt(copy.body)}
                      </p>
                    </article>
                    {showRealityCheck && (
                      <aside className="rounded-2xl border border-[#d8cdbc] bg-[#efe6d9] p-5 [background-image:none]">
                        <p className={`${eyebrow} text-[#9f3029]`}>
                          {REALITY_CHECK.eyebrow}
                        </p>
                        <h3
                          id="reality-check-title"
                          className="mt-3 [font-family:var(--font-coffee-serif)] text-xl font-medium leading-snug"
                        >
                          {REALITY_CHECK.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[#756d62]">
                          {REALITY_CHECK.body}
                        </p>
                        <button
                          ref={realityCheckTriggerRef}
                          type="button"
                          onClick={() => setRealityCheckOpen(true)}
                          className={`${focus} mt-4 min-h-11 border-b border-[#786a5a] py-2 text-left text-sm font-medium`}
                        >
                          {REALITY_CHECK.cta}
                        </button>
                      </aside>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </section>

          <aside
            aria-live="polite"
            className="mt-6 rounded-2xl border border-[#d8cdbc] bg-[#faf6ee] px-5 py-4 text-sm text-[#756d62] [background-image:none]"
          >
            {sendState === "sending" && <p>Đang gửi cho Kai…</p>}
            {sendState === "sent" && (
              <p className="text-[#52634b]">Kai nhận được rồi :)</p>
            )}
            {sendState === "failed" && (
              <div>
                <p>Chưa gửi được, nhưng kết quả của bạn vẫn ở đây.</p>
                <button
                  type="button"
                  onClick={() => submit()}
                  className={`${focus} coffee-secondary mt-3 min-h-11 rounded-xl border border-[#b9ad9e] px-4 font-medium`}
                >
                  Thử gửi lại
                </button>
              </div>
            )}
          </aside>

          <section className="mt-8 rounded-2xl border border-[#cfc3b3] bg-[#efe6d9] px-5 py-6 text-center [background-image:none]">
            <p className="text-sm leading-6 text-[#655d54]">
              Bạn đã để lại một chút về mình.
              <br />
              Đến lượt mình nhé.
            </p>
            <a
              href="https://auryes.vn/kai?context=coffee"
              className={`${focus} coffee-primary mt-5 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#171411] px-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#fff9ed] transition-colors motion-reduce:transition-none`}
            >
              Làm quen với Kai →
            </a>
          </section>

          <div className="mt-4">
            <button
              type="button"
              onClick={restart}
              className={`${focus} coffee-secondary min-h-12 w-full rounded-xl border border-transparent bg-transparent px-5 text-sm font-medium text-[#655d54] underline decoration-[#a99c8c] underline-offset-4`}
            >
              Chơi lại
            </button>
          </div>
        </div>
        {realityCheckOpen && (
          <dialog
            ref={realityCheckDialogRef}
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
      </Frame>
    );
  }

  return (
    <Frame>
      <section className="flex min-h-svh flex-col items-start justify-center px-5 py-12">
        <div className="w-full rounded-2xl border border-[#d8cdbc] bg-[#faf6ee] p-6 [background-image:none]">
          <p className={`${eyebrow} text-[#9f3029]`}>Auryes / Coffee</p>
          <h1 className="mt-4 [font-family:var(--font-coffee-serif)] text-3xl font-medium">
            Có gì đó chưa khớp.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#756d62]">
            Trò chơi chưa thể hiển thị trạng thái này. Bạn có thể bắt đầu lại mà
            không cần tải lại trang.
          </p>
          <button
            type="button"
            onClick={restart}
            className={`${focus} coffee-primary mt-6 min-h-14 w-full rounded-xl bg-[#171411] px-5 text-sm font-semibold text-[#fff9ed]`}
          >
            Chơi lại
          </button>
        </div>
      </section>
    </Frame>
  );
}
