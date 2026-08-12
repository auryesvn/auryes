export const COFFEE_QUIZ_VERSION = 1 as const;

export const ADDRESS_MODES = ["ban_minh", "cau_minh", "anh_em"] as const;
export type AddressMode = (typeof ADDRESS_MODES)[number];

export const ANSWER_IDS = ["A", "B", "C", "D"] as const;
export type AnswerId = (typeof ANSWER_IDS)[number];

export const VERDICT_KEYS = [
  "uncertain",
  "promising",
  "friend_like",
  "different_system",
] as const;
export type VerdictKey = (typeof VERDICT_KEYS)[number];

export const PROFILE_KEYS = [
  "closeness",
  "practical",
  "mutual_respect",
  "novelty",
  "presence",
  "limits",
] as const;
export type ProfileKey = (typeof PROFILE_KEYS)[number];

export type CoffeeQuestionId =
  | "tired"
  | "free_evening"
  | "idea_reality"
  | "jealousy_boundary"
  | "small_promise"
  | "separate_lives"
  | "initiative"
  | "partner_better_domain"
  | "conflict_vulnerability"
  | "outside_opinion"
  | "busy_partner"
  | "long_term_interest";

export type CoffeeAnswers = Record<CoffeeQuestionId, AnswerId>;

export const COFFEE_QUESTION_SHORT_TITLES: Record<CoffeeQuestionId, string> = {
  tired: "Khi mệt",
  free_evening: "Một buổi tối trống lịch",
  idea_reality: "Ý tưởng nghe hay nhưng có vẻ không ổn",
  jealousy_boundary: "Ghen và ranh giới",
  small_promise: "Giữ lời",
  separate_lives: "Đời riêng",
  initiative: "Ai là người nghĩ trò?",
  partner_better_domain: "Người ấy giỏi hơn bạn",
  conflict_vulnerability: "Cãi nhau",
  outside_opinion: "Ý kiến của người ngoài",
  busy_partner: "Một người rất bận",
  long_term_interest: "Sau vài năm",
};

type Question = {
  id: CoffeeQuestionId;
  prompt: string;
  anhEmPrompt?: string;
  answers: Record<AnswerId, string>;
};

export const COFFEE_QUESTIONS: readonly Question[] = [
  { id: "tired", prompt: "Một ngày nọ khá mệt. Nếu đang có người yêu, {subject} thường muốn…", answers: { A: "Tự xử lý trước, ổn rồi mới kể.", B: "Được ôm một lúc. Chuyện kia tính sau.", C: "Nếu người ấy nhìn vấn đề tốt hơn mình, mình sẽ kéo họ vào cùng nghĩ.", D: "Tùy hôm. Có hôm cần, có hôm chỉ muốn ở một mình." } },
  { id: "free_evening", prompt: "Tự nhiên có một buổi tối rảnh. Kiểu nào nghe vui nhất?", answers: { A: "Đi đâu đó chưa thử bao giờ, hay dở tính sau.", B: "Ở nhà cũng được, miễn hai đứa có trò để nghịch.", C: "Ai nghĩ ra kế hoạch hay hơn thì người đó kéo.", D: "Mình thích biết trước sẽ làm gì hơn." } },
  { id: "idea_reality", prompt: "Người ấy kể một ý tưởng nghe khá hay ho, nhưng {subject} thấy có gì đó không ổn lắm. {Subject} sẽ…", answers: { A: "Hỏi luôn: “Nghe hay đấy, nhưng chỗ này làm kiểu gì?”", B: "Để họ thử. Sai thì lúc đó tính tiếp.", C: "Ủng hộ trước đã, không cần soi kỹ quá.", D: "Cùng bóc tách thử xem chỗ nào đang giả định hơi quá." } },
  { id: "jealousy_boundary", prompt: "{Subject} hơi ghen. Người ấy nói rõ: “Cách này làm mình cảm thấy bị kiểm soát.” Sau đó {subject} sẽ…", anhEmPrompt: "Em hơi ghen. Người ấy nói rõ: “Em làm anh cảm thấy bị kiểm soát.” Sau đó em sẽ…", answers: { A: "Ok, nói rõ rồi thì mình điều chỉnh.", B: "Mình vẫn khó chịu, nhưng sẽ tìm cách xử lý cảm xúc đó theo cách khác.", C: "Nếu yêu thì phải chấp nhận chuyện đó chứ.", D: "Mình muốn nói thêm xem ranh giới đó có hợp lý không." } },
  { id: "small_promise", prompt: "{Subject} đã hứa một việc nhỏ nhưng đến lúc làm lại không còn muốn làm nữa.", answers: { A: "Vẫn làm. Mình đã nói rồi.", B: "Báo lại sớm và nói thật lý do.", C: "Việc nhỏ thôi, quên cũng là bình thường.", D: "Còn tùy việc và hoàn cảnh." } },
  { id: "separate_lives", prompt: "Trong một mối quan hệ, {subject} thích hai người…", answers: { A: "Có đời sống riêng rõ ràng rồi kéo nhau vào cùng chơi.", B: "Làm khá nhiều thứ cùng nhau.", C: "Mỗi người một thế giới, gặp nhau lúc cần.", D: "Không có công thức. Miễn ở cạnh nhau & không thấy ngột ngạt." } },
  { id: "initiative", prompt: "Nếu mấy tuần gần đây người ấy toàn là người nghĩ chỗ đi chơi, trò chơi hoặc hoạt động cho hai đứa…", answers: { A: "Đến lượt mình nghĩ trò chứ.", B: "Mình hưởng ứng nhiệt tình là được mà.", C: "Mình sẽ hỏi xem họ có thấy mệt vì phải chủ động mãi không.", D: "Ai thích thì người đó rủ, mình không để ý lắm." } },
  { id: "partner_better_domain", prompt: "Có một lĩnh vực người ấy rõ ràng giỏi hơn {subject}.", answers: { A: "Quá tốt. Việc đó hỏi họ cho nhanh.", B: "Mình vẫn muốn tự tìm hiểu một chút rồi mới nghe.", C: "Mình không thích cảm giác phải dựa vào phán đoán của người khác.", D: "Hay mà. Có thêm thứ để mình học." } },
  { id: "conflict_vulnerability", prompt: "{Subject} biết chính xác một điểm yếu có thể làm người ấy đau khi đang cãi nhau.", answers: { A: "Không dùng nó chỉ để thắng.", B: "Nếu điểm đó thật sự liên quan đến vấn đề đang nói thì mình vẫn nói, nhưng không nhằm làm đau.", C: "Lúc nóng quá thì nói trúng chỗ đau mới đã.", D: "Mình thường dừng cuộc nói chuyện trước khi nó đi đến mức đó." } },
  { id: "outside_opinion", prompt: "Một quyết định lớn của hai người nhưng bố mẹ hoặc bạn thân của {subject} phản đối.", answers: { A: "Mình sẽ nghe, nhưng quyết định cuối vẫn là của hai đứa.", B: "Mình cần người thân đồng ý thì mới yên tâm.", C: "Còn tùy chuyện. Có lĩnh vực họ biết nhiều hơn thì lấy ý kiến cũng tốt.", D: "Mình ít khi kể chuyện riêng của hai đứa cho người ngoài." } },
  { id: "busy_partner", prompt: "Một người rất thú vị, rất giỏi, nhưng gần như lúc nào cũng bận. {Subject} thấy…", answers: { A: "Chất lượng thời gian quan trọng hơn số giờ ở cạnh nhau.", B: "Hay đấy, nhưng chắc mình vẫn thấy hơi trống.", C: "Không sao, mình cũng có đời riêng.", D: "Mình muốn người yêu thực sự có mặt trong cuộc sống của mình." } },
  { id: "long_term_interest", prompt: "Sau vài năm, điều gì làm một mối quan hệ vẫn còn thú vị với {subject}?", answers: { A: "Hai người vẫn còn chuyện mới để kéo nhau vào.", B: "Cảm giác an toàn và quen thuộc.", C: "Vẫn còn điều gì đó ở người kia khiến mình nể và tò mò.", D: "Không biết. Chắc sống rồi mới biết." } },
] as const;

export function isAddressMode(value: unknown): value is AddressMode {
  return typeof value === "string" && ADDRESS_MODES.includes(value as AddressMode);
}

export function isCompleteAnswers(value: unknown): value is CoffeeAnswers {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  const ids = COFFEE_QUESTIONS.map((question) => question.id);
  return Object.keys(record).length === ids.length && ids.every((id) => ANSWER_IDS.includes(record[id] as AnswerId));
}

export function normalizeInstagram(value: string): string | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  let handle = trimmed;
  try {
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "instagram.com") handle = url.pathname.split("/").filter(Boolean)[0] ?? "";
    else if (/^https?:\/\//i.test(trimmed)) return undefined;
  } catch {
    if (/[/\\]/.test(trimmed)) return undefined;
  }
  handle = handle.replace(/^@/, "").trim().toLowerCase();
  return handle.length >= 1 && handle.length <= 30 && /^[a-z0-9._]+$/.test(handle) ? handle : undefined;
}

export function questionPrompt(question: Question, mode: AddressMode) {
  if (mode === "anh_em" && question.anhEmPrompt) return question.anhEmPrompt;
  const subject = mode === "anh_em" ? "em" : mode === "cau_minh" ? "cậu" : "bạn";
  return question.prompt.replaceAll("{subject}", subject).replaceAll("{Subject}", subject[0].toUpperCase() + subject.slice(1));
}

const PROFILE_SUPPORT: Record<ProfileKey, readonly [CoffeeQuestionId, readonly AnswerId[]][]> = {
  closeness: [["tired", ["B", "C"]], ["separate_lives", ["B", "D"]]],
  practical: [["idea_reality", ["A", "D"]], ["small_promise", ["A", "B"]]],
  mutual_respect: [["partner_better_domain", ["A", "D"]], ["outside_opinion", ["A", "C"]]],
  novelty: [["free_evening", ["A", "B", "C"]], ["initiative", ["A", "C"]], ["long_term_interest", ["A", "C"]]],
  presence: [["busy_partner", ["B", "D"]], ["tired", ["B", "C"]]],
  limits: [["jealousy_boundary", ["A", "B", "D"]], ["conflict_vulnerability", ["A", "B", "D"]]],
};

export type CoffeeResult = { verdictKey: VerdictKey; profileKeys: ProfileKey[] };

export function computeCoffeeResult(answers: CoffeeAnswers): CoffeeResult {
  const integrityMismatch =
    answers.jealousy_boundary === "C" ||
    answers.conflict_vulnerability === "C";

  const romanticActivation =
    Number(["B", "C"].includes(answers.tired)) +
    Number(["A", "B"].includes(answers.free_evening)) +
    Number(["B", "D"].includes(answers.busy_partner)) +
    Number(["A", "B"].includes(answers.separate_lives));

  const sustainingInterest =
    Number(["A", "D"].includes(answers.idea_reality)) +
    Number(["A", "D"].includes(answers.partner_better_domain)) +
    Number(["A", "C"].includes(answers.initiative)) +
    Number(["A", "C"].includes(answers.long_term_interest));

  const partnershipReliability =
    Number(["A", "B"].includes(answers.small_promise)) +
    Number(["A", "B"].includes(answers.jealousy_boundary)) +
    Number(["A", "C"].includes(answers.outside_opinion)) +
    Number(["A", "B", "D"].includes(answers.conflict_vulnerability));

  const partnershipConcerns =
    Number(answers.small_promise === "C") +
    2 * Number(answers.outside_opinion === "B");

  let verdictKey: VerdictKey = "uncertain";
  if (
    integrityMismatch ||
    (partnershipConcerns >= 3 && partnershipReliability <= 1)
  ) {
    verdictKey = "different_system";
  } else if (
    romanticActivation >= 3 &&
    (sustainingInterest >= 2 || partnershipReliability >= 3) &&
    partnershipConcerns <= 1
  ) {
    verdictKey = "promising";
  } else if (
    romanticActivation <= 1 &&
    sustainingInterest >= 2 &&
    partnershipReliability >= 2 &&
    partnershipConcerns <= 1
  ) {
    verdictKey = "friend_like";
  }

  const ranked = PROFILE_KEYS.map((key, index) => ({
    key,
    index,
    score: PROFILE_SUPPORT[key].reduce((score, [id, ids]) => score + Number(ids.includes(answers[id])), 0),
  })).sort((a, b) => b.score - a.score || a.index - b.index);
  const strong = ranked.filter((item) => item.score >= 2);
  const selected = strong.slice(0, 5);
  if (selected.length < 3) {
    const weakLimit = selected.length === 2 ? 2 : 3 - selected.length;
    selected.push(
      ...ranked
        .filter((item) => item.score === 1)
        .slice(0, weakLimit),
    );
  }
  return { verdictKey, profileKeys: selected.map((item) => item.key) };
}

export function profileEvidenceCount(
  answers: CoffeeAnswers,
  key: ProfileKey,
) {
  return PROFILE_SUPPORT[key].reduce(
    (score, [id, ids]) => score + Number(ids.includes(answers[id])),
    0,
  );
}
