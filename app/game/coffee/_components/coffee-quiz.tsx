"use client";

import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
const REALITY_CHECK = {
  eyebrow: "Reality check :))",
  title: "Lý thuyết với thực tế đôi khi hơi khác nhau.",
  body: "Có những chuyện lúc chưa yêu nghe rất dễ. Vào đúng tình huống rồi mới biết mình phản ứng thế nào :))",
  cta: "▶ Xem một ví dụ rất đời",
  videoId: "XoLoGpo3psk",
} as const;
const VERDICTS: Record<VerdictKey, { title: string; paragraphs: string[] }> = {
  uncertain: { title: "Khó đoán. Đi cà phê rồi tính.", paragraphs: ["Có vài điểm khiến Kai thấy tò mò, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không.", "Phần còn lại nên để ngoài đời trả lời."] },
  promising: { title: "Ừm… có vẻ chơi được đấy 👀", paragraphs: ["Có vài điểm khá hợp nhau: cách gần gũi, cách nhìn vào thực tế hoặc cách hai người có thể kéo nhau vào những trải nghiệm mới.", "Nhưng đừng tin web quá. Gặp nhau vẫn quan trọng hơn."] },
  friend_like: { title: "Nghe hơi giống đồng bọn hơn.", paragraphs: ["Có thể nói chuyện, chơi hoặc làm vài thứ cùng nhau vẫn rất vui.", "Còn có bật sang “mode người yêu” không thì web chịu."] },
  different_system: { title: "Có vẻ hơi khác hệ.", paragraphs: ["Không phải ai sai cả.", "Chỉ là có vài chỗ nếu bước vào một mối quan hệ thật thì hai người có thể phải tốn khá nhiều công để khớp với nhau."] },
};
type ProfileCopy = {
  strong: { title: string; body: string };
  weak: { title: string; body: string };
};

type VerdictSupportCopy = { title: string; body: string };

const PROFILES: Record<ProfileKey, ProfileCopy> = {
  closeness: {
    strong: { title: "Bạn thích có một người đủ gần để kéo vào cùng.", body: "Có vẻ sự gần gũi với bạn không nhất thiết là hai người phải làm mọi thứ cùng nhau. Điều đáng quý hơn là khi có chuyện, cả hai có thể tự nhiên tìm đến nhau để chia sẻ một ý nghĩ, một cảm xúc hoặc đơn giản là ngồi cạnh. Vẫn có khoảng riêng, nhưng không phải hai thế giới đóng kín." },
    weak: { title: "Có một chút cảm giác là bạn thích có người ở cạnh khi cần.", body: "Ít nhất trong một tình huống vừa rồi, bạn nghiêng về việc kéo người kia lại gần thay vì luôn tự xử lý mọi thứ. Chưa đủ để nói bạn cần gần gũi đến đâu; có lẽ điều quan trọng hơn là người ấy biết lúc nào nên bước vào." },
  },
  practical: {
    strong: { title: "Bạn có vẻ khá thực tế.", body: "Một ý tưởng nghe hay chưa chắc đã đủ với bạn; bạn còn muốn xem nó chạy ngoài đời thế nào. Nếu thấy một chỗ chưa ổn, bạn có xu hướng cùng người kia bóc ra thay vì chỉ gật đầu cho vui. Với người hơi mơ mộng, đôi lúc cách này có thể làm mất hứng một chút; với đúng người, nó lại giúp cả hai đứng vững hơn." },
    weak: { title: "Qua một câu trả lời, bạn có vẻ để ý đến tính thực tế.", body: "Có một chút cảm giác là bạn không chỉ nghe xem một điều có hấp dẫn hay không, mà còn nhìn xem nó có làm được thật không. Đây mới là một dấu hiệu nhỏ, nên cũng có thể tùy chuyện bạn mới bật phần này lên." },
  },
  mutual_respect: {
    strong: { title: "Bạn có vẻ thích một người vẫn còn điều để mình nể.", body: "Việc người kia giỏi hơn ở một vài thứ không nhất thiết làm bạn khó chịu; nó có thể trở thành lý do để hỏi, để học và để tiếp tục tò mò. Về lâu dài, cảm giác tôn trọng phán đoán của nhau có lẽ quan trọng với bạn không kém chuyện hợp sở thích. Không cần ai hơn ai, chỉ cần cả hai vẫn thấy lời của người kia đáng nghe." },
    weak: { title: "Có vẻ bạn khá mở với việc nghe phán đoán của người kia.", body: "Ít nhất qua một lựa chọn, bạn không xem việc dựa vào góc nhìn của người khác là mất đi phần độc lập của mình. Chưa chắc điều này đúng trong mọi lĩnh vực, nhưng có vẻ bạn vẫn chừa chỗ cho sự nể phục và học hỏi." },
  },
  novelty: {
    strong: { title: "Bạn thích một mối quan hệ vẫn có chuyển động.", body: "Chuyển động ở đây không nhất thiết là lúc nào cũng phải ra ngoài hay làm điều thật lớn. Hai người ở nhà mà vẫn nghĩ ra trò, kéo nhau vào một câu chuyện mới hoặc luân phiên mang thêm trải nghiệm vào cũng đã đủ vui. Có vẻ bạn muốn cả hai cùng góp phần để mối quan hệ không chỉ chạy bằng quán tính." },
    weak: { title: "Có một chút cảm giác là bạn thích mối quan hệ có thêm điều mới.", body: "Một lựa chọn của bạn gợi ý rằng đôi lúc bạn muốn có trò mới, góc nhìn mới hoặc một lời rủ bất ngờ. Nhưng đây chưa phải dấu hiệu mạnh; sự quen thuộc và yên ổn có thể vẫn quan trọng với bạn ở những lúc khác." },
  },
  presence: {
    strong: { title: "Bạn vẫn cần một sự hiện diện có ý nghĩa.", body: "Có đời sống riêng không có nghĩa là người kia có thể gần như biến mất khỏi cuộc sống của bạn. Một người rất thú vị nhưng luôn quá bận có lẽ vẫn để lại cảm giác hơi trống. Không phải đếm số giờ ở cạnh nhau; có vẻ điều bạn cần là cảm giác họ thật sự có mặt khi hai người đang ở bên nhau." },
    weak: { title: "Ít nhất qua mấy câu vừa rồi, sự có mặt của người kia có vẻ vẫn quan trọng với bạn.", body: "Có một lựa chọn cho thấy độc lập chưa chắc thay thế được cảm giác được ở cạnh nhau khi cần. Chưa đủ để biết bạn muốn gặp nhau nhiều hay ít; có lẽ chất lượng của sự hiện diện mới là phần đáng để ý." },
  },
  limits: {
    strong: { title: "Bạn có vẻ sẵn sàng nói chuyện rõ ràng về giới hạn.", body: "Bạn không nhất thiết chờ hai người tự hiểu nhau hoàn hảo, cũng không coi mọi giới hạn là thứ khỏi cần bàn. Có vẻ cách hợp với bạn hơn là cùng nói xem điều gì hợp lý, rồi tôn trọng những gì đã được làm rõ. Khi gần một người khác, kiểu trao đổi này có thể giúp cả hai điều chỉnh mà không phải đoán ý nhau mãi." },
    weak: { title: "Có vẻ bạn muốn những giới hạn được nói ra thay vì đoán mò.", body: "Một câu trả lời cho thấy bạn nghiêng về việc dừng lại, trao đổi hoặc điều chỉnh khi có chỗ khiến người kia không ổn. Đây chỉ là một lát cắt nhỏ; ít nhất nó cho thấy bạn không mặc định rằng yêu nhau thì phải tự động đồng ý mọi thứ." },
  },
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
  const [realityCheckOpen, setRealityCheckOpen] = useState(false);
  const realityCheckDialogRef = useRef<HTMLDialogElement>(null);
  const realityCheckTriggerRef = useRef<HTMLButtonElement>(null);

  const shell = "relative mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-7 sm:px-8";
  const eyebrow = "text-[0.65rem] uppercase tracking-[0.28em] text-[#8d7660]";
  const button = "min-h-14 w-full rounded-xl border px-5 py-4 text-left text-base leading-6 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#d9b98e] motion-reduce:transition-none";

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

  if (stage === "intro") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4] selection:bg-[#9a7958]"><div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-[max(2rem,env(safe-area-inset-bottom))] sm:pt-7 lg:px-10 lg:py-10"><p className={eyebrow}>Auryes / một trò chơi nhỏ của Kai</p><div className="flex flex-1 flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-16"><section className="py-5 sm:py-14 lg:col-span-7 lg:py-16"><h1 className="max-w-3xl [font-family:var(--font-coffee-serif)] text-[2.75rem] leading-[0.92] sm:text-[clamp(3rem,10vw,6.5rem)]">Có vẻ chúng ta hợp kiểu nào nhỉ?</h1><p className="mt-4 text-sm leading-5 text-[#b9a994] sm:hidden">Một trò chơi nhỏ để xem cách bạn suy nghĩ và phản ứng khi ở gần một người khác.</p><div className="mt-8 hidden max-w-xl space-y-4 text-base leading-7 text-[#b9a994] sm:mt-10 sm:block sm:space-y-5"><p>Một trò chơi nhỏ để xem cách bạn suy nghĩ và phản ứng khi ở gần một người khác.</p><p>Không có đáp án chuẩn. Không có “hợp 96%”. Cũng không có người hoàn hảo.</p><p>Mình chỉ biết những gì bạn chọn ở đây. Còn cách nói chuyện, cách đùa, năng lượng khi gặp nhau và cả một chút duyên số thì… chắc phải gặp mới biết.</p></div></section><figure className="mx-auto w-[82%] max-w-[17.5rem] sm:w-[78%] sm:max-w-72 lg:col-span-5 lg:row-span-2 lg:mx-0 lg:w-full lg:max-w-md lg:justify-self-end"><div className="relative aspect-square overflow-hidden sm:aspect-[3/4]"><Image src="/coffee/kai-playful.jpg" alt="Kai đưa tay về phía máy ảnh với vẻ mặt vui vẻ" fill priority sizes="(max-width: 639px) 76vw, (max-width: 1023px) 72vw, 38vw" className="object-cover object-[50%_67%] sm:object-center" /></div><figcaption className="mt-3 hidden text-[0.62rem] uppercase tracking-[0.2em] text-[#776654] sm:block">Kai, người nghĩ ra trò này.</figcaption></figure><div className="mt-3 pb-1 text-center sm:mt-9 sm:text-left lg:col-span-7 lg:mt-0 lg:self-start"><button className="min-h-14 w-[76%] rounded-lg bg-[#eee4d4] px-6 py-4 font-semibold text-[#0b0908] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d9b98e] sm:w-full sm:max-w-sm sm:rounded-xl sm:font-medium" onClick={() => setStage("address")}><span className="sm:hidden">Chơi thử xem 👀</span><span className="hidden sm:inline">Chơi thử · khoảng 2 phút</span></button><aside className="mt-7 text-left sm:hidden"><p className="text-xs text-[#776654]">12 câu · khoảng 2 phút</p><div className="mt-4 space-y-3 text-sm leading-6 text-[#8d7d6a]"><p>Không có đáp án chuẩn. Không có “hợp 96%”. Cũng không có người hoàn hảo.</p><p>Mình chỉ biết những gì bạn chọn ở đây. Còn cách nói chuyện, cách đùa, năng lượng khi gặp nhau và cả một chút duyên số thì... chắc phải gặp mới biết.</p></div></aside></div></div></div></main>;

  if (stage === "address") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><button onClick={goBack} className={`${eyebrow} self-start py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><section className="my-auto py-16"><p className={eyebrow}>Trước khi bắt đầu</p><h1 className="mt-6 [font-family:var(--font-coffee-serif)] text-4xl leading-tight">Mình xưng hô thế nào nhỉ?</h1><div className="mt-10 space-y-3">{ADDRESS_MODES.map((mode) => <button key={mode} className={`${button} ${addressMode === mode ? "border-[#eee4d4] bg-[#eee4d4] text-[#0b0908]" : "border-white/15 text-[#d2c6b6] hover:border-white/35"}`} onClick={() => { setAddressMode(mode); setStage("questions"); }}>{ADDRESS_LABELS[mode]}</button>)}</div></section></div></main>;

  if (stage === "questions" && addressMode) {
    const question = COFFEE_QUESTIONS[questionIndex];
    return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><header><div className="flex items-center justify-between"><button onClick={goBack} className={`${eyebrow} py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><span className={eyebrow}>{questionIndex + 1} / {COFFEE_QUESTIONS.length}</span></div><div className="mt-5 h-px bg-white/10"><div className="h-px bg-[#b99972] transition-[width]" style={{ width: `${((questionIndex + 1) / COFFEE_QUESTIONS.length) * 100}%` }} /></div></header><section className="my-auto py-12"><h1 className="[font-family:var(--font-coffee-serif)] text-[clamp(1.85rem,8vw,2.7rem)] leading-[1.16]">{questionPrompt(question, addressMode)}</h1><div className="mt-9 space-y-3">{Object.entries(question.answers).map(([id, label]) => { const selected = answers[question.id] === id; return <button key={id} onClick={() => chooseAnswer(question.id, id as AnswerId)} className={`${button} flex gap-4 ${selected ? "border-[#eee4d4] bg-[#eee4d4] text-[#0b0908]" : "border-white/15 text-[#d2c6b6] hover:border-white/35"}`}><span className="font-mono text-xs opacity-60">{id}</span><span>{label}</span></button>; })}</div></section></div></main>;
  }

  if (stage === "identity") return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={shell}><button onClick={goBack} className={`${eyebrow} self-start py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#d9b98e]`}>← Quay lại</button><form onSubmit={submit} className="my-auto py-14"><p className={eyebrow}>Xong 12 câu rồi</p><h1 className="mt-6 [font-family:var(--font-coffee-serif)] text-4xl">Kai nên gọi bạn là gì?</h1><label className="mt-10 block text-sm text-[#b9a994]">Tên<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoComplete="name" className="mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-transparent px-4 text-lg text-white outline-none focus:border-[#d9b98e] focus:ring-2 focus:ring-[#d9b98e]/30" /></label><label className="mt-7 block text-sm text-[#b9a994]">Instagram <span className="text-[#776654]">(không bắt buộc)</span><input value={instagram} onChange={(event) => setInstagram(event.target.value)} maxLength={120} autoCapitalize="none" autoComplete="off" placeholder="@username" className="mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-transparent px-4 text-lg text-white outline-none placeholder:text-[#5f5144] focus:border-[#d9b98e] focus:ring-2 focus:ring-[#d9b98e]/30" /><span className="mt-2 block text-xs leading-5 text-[#776654]">Nếu muốn Kai biết ai vừa chơi trò này.</span></label>{formError && <p role="alert" className="mt-5 text-sm text-[#e8ad9e]">{formError}</p>}<button type="submit" className="mt-10 min-h-14 w-full rounded-xl bg-[#eee4d4] px-6 font-medium text-[#0b0908] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#d9b98e]">Xem kết quả</button></form></div></main>;

  if (stage === "result" && addressMode) {
    const result = computeCoffeeResult(answers as CoffeeAnswers); const verdict = VERDICTS[result.verdictKey];
    const uncertainFirst = addressMode === "anh_em" && result.verdictKey === "uncertain" ? "Có vài điểm khiến anh thấy tò mò về em, nhưng từng này câu hỏi vẫn chưa đủ để biết hai người có thực sự hợp nhau không." : verdict.paragraphs[0];
    const adapt = (text: string) => addressMode === "cau_minh" ? text.replaceAll("Bạn", "Cậu").replaceAll("bạn", "cậu") : addressMode === "anh_em" ? text.replaceAll("Bạn", "Em").replaceAll("bạn", "em") : text;
    const observationCopy = (key: ProfileKey) => {
      const confidence = profileEvidenceCount(answers as CoffeeAnswers, key) >= 2 ? "strong" : "weak";
      return PROFILES[key][confidence];
    };
    const verdictSupport = (() : VerdictSupportCopy | null => {
      if (result.verdictKey === "friend_like") {
        return {
          title: "Chưa thấy quá nhiều chất ‘người yêu’ trong mấy câu này.",
          body: "Bạn vẫn có vẻ là kiểu người có thể nói chuyện, chơi và tìm thấy thứ để nể ở người kia. Nhưng qua mấy câu vừa rồi, chưa có nhiều dấu hiệu cho thấy bạn đặc biệt cần kiểu gần gũi mang màu sắc người yêu. Cái này web cũng khó đoán; đôi khi gặp đúng người thì nó mới bật.",
        };
      }
      if (result.verdictKey !== "different_system") return null;
      if (answers.conflict_vulnerability === "C") {
        return {
          title: "Có một chỗ Kai hơi để ý.",
          body: "Một câu trả lời của bạn gợi ý rằng khi cãi nhau, bạn có thể dùng đúng điểm yếu đã biết để làm người kia đau vì cảm giác đó giúp mình thắng hoặc thấy đã hơn. Kai không ngại bất đồng, nói thẳng, phản biện hay chỉ ra một điểm yếu khi nó thật sự liên quan. Chỗ hơi khác hệ nằm ở việc dùng điều dễ tổn thương của người kia với mục đích làm đau họ.",
        };
      }
      if (answers.jealousy_boundary === "C") {
        return {
          title: "Có một chỗ Kai hơi để ý.",
          body: "Ghen một chút không phải điều Kai thấy lạ. Nhưng trong tình huống vừa rồi, người kia đã nói rõ rằng họ cảm thấy bị kiểm soát, còn câu trả lời của bạn vẫn xem việc chấp nhận cách đó là điều tình yêu nên đòi hỏi. Chỗ hơi khác hệ không nằm ở cảm giác ghen, mà ở điều xảy ra sau khi một giới hạn đã được nói rõ.",
        };
      }
      return {
        title: "Có vài chỗ Kai chưa chắc hai người sẽ vận hành giống nhau.",
        body: "Qua mấy câu vừa rồi, bạn có vẻ khá thoải mái với việc một lời hứa nhỏ có thể trôi qua, đồng thời cần người thân đồng ý mới thấy yên tâm với quyết định lớn của hai người. Từng chuyện riêng lẻ chưa nói lên quá nhiều. Nhưng khi đặt cạnh nhau, chúng làm Kai hơi băn khoăn về việc hai người sẽ giữ lời với nhau và tự quyết chuyện của mối quan hệ đến đâu.",
      };
    })();
    const visibleProfileKeys = verdictSupport ? result.profileKeys.slice(0, 4) : result.profileKeys;
    return <main className="min-h-svh bg-[#0b0908] text-[#eee4d4]"><div className={`${shell} py-12`}><p className={eyebrow}>Kết quả / {name.trim()}</p><section className="mt-12"><h1 className="[font-family:var(--font-coffee-serif)] text-[clamp(2.8rem,12vw,5rem)] leading-[0.95]">{verdict.title}</h1><div className="mt-9 space-y-4 text-base leading-7 text-[#b9a994]"><p>{uncertainFirst}</p>{verdict.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section><section className="mt-16 border-t border-white/10 pt-10"><p className={eyebrow}>Qua mấy câu vừa rồi</p><div className="mt-7 space-y-10">{verdictSupport && <article><h2 className="[font-family:var(--font-coffee-serif)] text-2xl leading-tight">{adapt(verdictSupport.title)}</h2><p className="mt-3 leading-7 text-[#998875]">{adapt(verdictSupport.body)}</p></article>}{visibleProfileKeys.map((key) => { const copy = observationCopy(key); const showRealityCheck = key === "limits" && ["A", "B", "D"].includes(answers.jealousy_boundary ?? ""); return <Fragment key={key}><article><h2 className="[font-family:var(--font-coffee-serif)] text-2xl leading-tight">{adapt(copy.title)}</h2><p className="mt-3 leading-7 text-[#998875]">{adapt(copy.body)}</p></article>{showRealityCheck && <aside className="border-y border-[#574637]/55 py-7"><p className="text-[0.6rem] uppercase tracking-[0.25em] text-[#8d7660]">{REALITY_CHECK.eyebrow}</p><h3 className="mt-4 [font-family:var(--font-coffee-serif)] text-xl leading-snug text-[#d8cbb8]">{REALITY_CHECK.title}</h3><p className="mt-3 text-sm leading-6 text-[#8f7d69]">{REALITY_CHECK.body}</p><button ref={realityCheckTriggerRef} type="button" onClick={() => setRealityCheckOpen(true)} className="mt-5 min-h-11 border-b border-[#8c7054] py-2 text-left text-sm text-[#d5c3aa] outline-none hover:border-[#f0e6d5] hover:text-[#f0e6d5] focus-visible:ring-2 focus-visible:ring-[#b99972]">{REALITY_CHECK.cta}</button></aside>}</Fragment>; })}</div></section><aside aria-live="polite" className="mt-16 border-t border-white/10 pt-7 text-sm text-[#8d7660]">{sendState === "sending" && <p>Đang gửi cho Kai…</p>}{sendState === "sent" && <p className="text-[#bda88d]">Kai nhận được rồi :)</p>}{sendState === "failed" && <div><p>Chưa gửi được, nhưng kết quả của bạn vẫn ở đây.</p><button onClick={() => submit()} className="mt-4 min-h-11 rounded-lg border border-white/20 px-4 text-[#d2c6b6] outline-none hover:border-white/40 focus-visible:ring-2 focus-visible:ring-[#d9b98e]">Thử gửi lại</button></div>}</aside></div>{realityCheckOpen && <dialog ref={realityCheckDialogRef} aria-labelledby="reality-check-title" onCancel={(event) => { event.preventDefault(); setRealityCheckOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setRealityCheckOpen(false); }} className="m-auto max-h-none max-w-none bg-transparent p-0 text-[#eee4d4] backdrop:bg-black/85"><div className="flex max-h-[calc(100dvh-2rem)] flex-col items-end gap-3"><button type="button" aria-label="Đóng video" onClick={() => setRealityCheckOpen(false)} className="min-h-11 px-3 text-sm text-[#d5c3aa] outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-[#b99972]">Đóng ×</button><div className="aspect-[9/16] w-[min(90vw,22.5rem,calc((100dvh-7rem)*9/16))] overflow-hidden bg-black"><iframe src={`https://www.youtube-nocookie.com/embed/${REALITY_CHECK.videoId}`} title="Reality check: lý thuyết với thực tế đôi khi hơi khác nhau" className="size-full border-0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></div></dialog>}</main>;
  }
  return null;
}
