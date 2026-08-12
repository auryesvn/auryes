"use client";

import { FormEvent, useState } from "react";
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

const ADDRESS_LABELS: Record<AddressMode, string> = { ban_minh: "Bạn / mình", cau_minh: "Cậu / mình", anh_em: "Anh / em 👀" };
const VERDICTS: Record<VerdictKey, { title: string; paragraphs: string[] }> = {
  uncertain: { title: "Khó đoán. Đi cà phê rồi tính.", paragraphs: ["Có vài điểm khiến Kai thấy tò mò, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không.", "Phần còn lại nên để ngoài đời trả lời."] },
  promising: { title: "Ừm… có vẻ chơi được đấy 👀", paragraphs: ["Có vài điểm khá hợp nhau: cách gần gũi, cách nhìn vào thực tế hoặc cách hai người có thể kéo nhau vào những trải nghiệm mới.", "Nhưng đừng tin web quá. Gặp nhau vẫn quan trọng hơn."] },
  friend_like: { title: "Nghe hơi giống đồng bọn hơn.", paragraphs: ["Có thể nói chuyện, chơi hoặc làm vài thứ cùng nhau vẫn rất vui.", "Còn có bật sang “mode người yêu” không thì web chịu."] },
  different_system: { title: "Có vẻ hơi khác hệ.", paragraphs: ["Không phải ai sai cả.", "Chỉ là có vài chỗ nếu bước vào một mối quan hệ thật thì hai người có thể phải tốn khá nhiều công để khớp với nhau."] },
};
const PROFILES: Record<ProfileKey, { title: string; body: string }> = {
  closeness: { title: "Bạn có vẻ thích sự gần gũi, nhưng không cần hai người dính vào nhau.", body: "Khi mệt hoặc có chuyện, bạn vẫn muốn có một người đủ gần để kéo vào cùng nghĩ hoặc đơn giản là ở cạnh." },
  practical: { title: "Bạn khá thực tế.", body: "Một ý tưởng nghe hay chưa chắc đã đủ. Bạn có xu hướng quan tâm đến việc nó có chạy được ngoài đời không." },
  mutual_respect: { title: "Bạn khá thoải mái với việc người kia giỏi hơn mình ở một vài thứ.", body: "Thậm chí điều đó còn làm mối quan hệ thú vị hơn vì vẫn còn thứ để hỏi, để học và để nể." },
  novelty: { title: "Bạn thích một mối quan hệ có chuyển động.", body: "Không nhất thiết lúc nào cũng phải đi đâu đó, nhưng bạn có vẻ thích việc cả hai đều mang thêm trò mới, góc nhìn mới hoặc trải nghiệm mới vào." },
  presence: { title: "Bạn coi trọng sự hiện diện.", body: "Một người rất giỏi nhưng quá ít có mặt chưa chắc đã làm bạn thấy đủ gần." },
  limits: { title: "Bạn có vẻ khá rõ về ranh giới.", body: "Không cần hai người hiểu nhau hoàn hảo ngay từ đầu, nhưng khi một điều đã được nói rõ thì bạn mong cả hai biết điều chỉnh." },
};

type Stage = "intro" | "address" | "questions" | "identity" | "result";
type SendState = "idle" | "sending" | "sent" | "failed";

export default function CoffeeQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [addressMode, setAddressMode] = useState<AddressMode | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<CoffeeAnswers>>({});
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [formError, setFormError] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");

  const shell = "relative mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7 sm:px-8";
  const eyebrow = "text-[0.65rem] uppercase tracking-[0.28em] text-[#8d7660]";
  const button = "min-h-14 w-full rounded-xl border px-5 py-4 text-left text-base leading-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#d9b98e] motion-reduce:transition-none";

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
    else if (stage === "identity") { setStage("questions"); setQuestionIndex(COFFEE_QUESTIONS.length - 1); }
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!addressMode || Object.keys(answers).length !== COFFEE_QUESTIONS.length) return;
    const normalizedName = name.trim().replace(/\s+/g, " ");
    const normalizedInstagram = normalizeInstagram(instagram);
    if (!normalizedName) { setFormError("Kai nên gọi bạn là gì nhỉ?"); return; }
    if (normalizedName.length > 80) { setFormError("Tên này hơi dài rồi. Rút gọn một chút nhé."); return; }
    if (normalizedInstagram === undefined) { setFormError("Instagram này có vẻ chưa đúng."); return; }
    setFormError(""); setStage("result"); setSendState("sending");
    try {
      const response = await fetch("/api/coffee-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quizVersion: COFFEE_QUIZ_VERSION, name: normalizedName, instagram, addressMode, answers }) });
      setSendState(response.ok ? "sent" : "failed");
    } catch { setSendState("failed"); }
  }

  if (stage === "intro") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4] selection:bg-[#9a7958]"><div className={`${shell} justify-between`}><p className={eyebrow}>Auryes / một trò chơi nhỏ</p><section className="py-16"><h1 className="font-serif text-[clamp(3rem,13vw,5.5rem)] leading-[0.92] tracking-[-0.055em]">Có vẻ chúng ta hợp kiểu nào nhỉ?</h1><div className="mt-10 space-y-5 text-base leading-7 text-[#b9a994]"><p>Một trò chơi nhỏ để xem cách bạn suy nghĩ và phản ứng khi ở gần một người khác.</p><p>Không có đáp án chuẩn. Không có “hợp 96%”. Cũng không có người hoàn hảo.</p><p>Mình chỉ biết những gì bạn chọn ở đây. Còn cách nói chuyện, cách đùa, năng lượng khi gặp nhau và cả một chút duyên số thì… chắc phải gặp mới biết.</p></div></section><button className="min-h-14 rounded-xl bg-[#eee4d4] px-6 py-4 font-medium text-[#0b0908] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d9b98e]" onClick={() => setStage("address")}>Chơi thử · khoảng 2 phút</button></div></main>;

  if (stage === "address") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><button onClick={goBack} className={`${eyebrow} self-start py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><section className="my-auto py-16"><p className={eyebrow}>Trước khi bắt đầu</p><h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em]">Mình xưng hô thế nào nhỉ?</h1><div className="mt-10 space-y-3">{ADDRESS_MODES.map((mode) => <button key={mode} className={`${button} ${addressMode === mode ? "border-[#eee4d4] bg-[#eee4d4] text-[#0b0908]" : "border-white/15 text-[#d2c6b6] hover:border-white/35"}`} onClick={() => { setAddressMode(mode); setStage("questions"); }}>{ADDRESS_LABELS[mode]}</button>)}</div></section></div></main>;

  if (stage === "questions" && addressMode) {
    const question = COFFEE_QUESTIONS[questionIndex];
    return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><header><div className="flex items-center justify-between"><button onClick={goBack} className={`${eyebrow} py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><span className={eyebrow}>{questionIndex + 1} / {COFFEE_QUESTIONS.length}</span></div><div className="mt-5 h-px bg-white/10"><div className="h-px bg-[#b99972] transition-[width]" style={{ width: `${((questionIndex + 1) / COFFEE_QUESTIONS.length) * 100}%` }} /></div></header><section className="my-auto py-12"><h1 className="font-serif text-[clamp(1.85rem,8vw,2.7rem)] leading-[1.16] tracking-[-0.035em]">{questionPrompt(question, addressMode)}</h1><div className="mt-9 space-y-3">{Object.entries(question.answers).map(([id, label]) => { const selected = answers[question.id] === id; return <button key={id} onClick={() => chooseAnswer(question.id, id as AnswerId)} className={`${button} flex gap-4 ${selected ? "border-[#eee4d4] bg-[#eee4d4] text-[#0b0908]" : "border-white/15 text-[#d2c6b6] hover:border-white/35"}`}><span className="font-mono text-xs opacity-60">{id}</span><span>{label}</span></button>; })}</div></section></div></main>;
  }

  if (stage === "identity") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><button onClick={goBack} className={`${eyebrow} self-start py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><form onSubmit={submit} className="my-auto py-14"><p className={eyebrow}>Xong 12 câu rồi</p><h1 className="mt-6 font-serif text-4xl tracking-[-0.04em]">Kai nên gọi bạn là gì?</h1><label className="mt-10 block text-sm text-[#b9a994]">Tên<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoComplete="name" className="mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-transparent px-4 text-lg text-white outline-none focus:border-[#d9b98e] focus:ring-2 focus:ring-[#d9b98e]/30" /></label><label className="mt-7 block text-sm text-[#b9a994]">Instagram <span className="text-[#776654]">(không bắt buộc)</span><input value={instagram} onChange={(event) => setInstagram(event.target.value)} maxLength={120} autoCapitalize="none" autoComplete="off" placeholder="@username" className="mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-transparent px-4 text-lg text-white outline-none placeholder:text-[#5f5144] focus:border-[#d9b98e] focus:ring-2 focus:ring-[#d9b98e]/30" /><span className="mt-2 block text-xs leading-5 text-[#776654]">Nếu muốn Kai biết ai vừa chơi trò này.</span></label>{formError && <p role="alert" className="mt-5 text-sm text-[#e8ad9e]">{formError}</p>}<button type="submit" className="mt-10 min-h-14 w-full rounded-xl bg-[#eee4d4] px-6 font-medium text-[#0b0908] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d9b98e]">Xem kết quả</button></form></div></main>;

  if (stage === "result" && addressMode) {
    const result = computeCoffeeResult(answers as CoffeeAnswers); const verdict = VERDICTS[result.verdictKey];
    const uncertainFirst = addressMode === "anh_em" && result.verdictKey === "uncertain" ? "Có vài điểm khiến anh thấy tò mò về em, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không." : verdict.paragraphs[0];
    const adapt = (text: string) => addressMode === "cau_minh" ? text.replaceAll("Bạn", "Cậu").replaceAll("bạn", "cậu") : addressMode === "anh_em" ? text.replaceAll("Bạn", "Em").replaceAll("bạn", "em") : text;
    const observationTitle = (key: ProfileKey) => {
      const title = adapt(PROFILES[key].title);
      if (profileEvidenceCount(answers as CoffeeAnswers, key) >= 2) return title;
      const lower = title.charAt(0).toLocaleLowerCase("vi") + title.slice(1);
      return `Có vẻ ${lower}`;
    };
    return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={`${shell} py-12`}><p className={eyebrow}>Kết quả / {name.trim()}</p><section className="mt-12"><h1 className="font-serif text-[clamp(2.8rem,12vw,5rem)] leading-[0.95] tracking-[-0.05em]">{verdict.title}</h1><div className="mt-9 space-y-4 text-base leading-7 text-[#b9a994]"><p>{uncertainFirst}</p>{verdict.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section><section className="mt-16 border-t border-white/10 pt-10"><p className={eyebrow}>Một chút về {addressMode === "anh_em" ? "em" : addressMode === "cau_minh" ? "cậu" : "bạn"}</p><div className="mt-7 space-y-10">{result.profileKeys.map((key) => <article key={key}><h2 className="font-serif text-2xl leading-tight">{observationTitle(key)}</h2><p className="mt-3 leading-7 text-[#998875]">{adapt(PROFILES[key].body)}</p></article>)}</div></section><aside aria-live="polite" className="mt-16 border-t border-white/10 pt-7 text-sm text-[#8d7660]">{sendState === "sending" && <p>Đang gửi cho Kai…</p>}{sendState === "sent" && <p className="text-[#bda88d]">Kai nhận được rồi :)</p>}{sendState === "failed" && <div><p>Chưa gửi được, nhưng kết quả của bạn vẫn ở đây.</p><button onClick={() => submit()} className="mt-4 min-h-11 rounded-lg border border-white/20 px-4 text-[#d2c6b6] outline-none hover:border-white/40 focus-visible:ring-2 focus-visible:ring-[#d9b98e]">Thử gửi lại</button></div>}</aside></div></main>;
  }
  return null;
}
