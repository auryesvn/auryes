import {
  profileEvidenceCount,
  type CoffeeAnswers,
  type CoffeeResult,
  type AddressMode,
  type ProfileKey,
  type VerdictKey,
} from "@/lib/coffee-quiz";

export const COFFEE_VERDICT_TITLES: Record<VerdictKey, string> = {
  uncertain: "Khó đoán. Đi cà phê rồi tính.",
  promising: "Ừm… có vẻ chơi được đấy 👀",
  friend_like: "Nghe hơi giống đồng bọn hơn.",
  different_system: "Có vẻ hơi khác hệ.",
};

export const COFFEE_PROFILE_TITLES: Record<ProfileKey, { strong: string; weak: string }> = {
  closeness: { strong: "Bạn thích có một người đủ gần để kéo vào cùng.", weak: "Có một chút cảm giác là bạn thích có người ở cạnh khi cần." },
  practical: { strong: "Bạn có vẻ khá thực tế.", weak: "Qua một câu trả lời, bạn có vẻ để ý đến tính thực tế." },
  mutual_respect: { strong: "Bạn có vẻ thích một người vẫn còn điều để mình nể.", weak: "Có vẻ bạn khá mở với việc nghe phán đoán của người kia." },
  novelty: { strong: "Bạn thích một mối quan hệ vẫn có chuyển động.", weak: "Có một chút cảm giác là bạn thích mối quan hệ có thêm điều mới." },
  presence: { strong: "Bạn vẫn cần một sự hiện diện có ý nghĩa.", weak: "Ít nhất qua mấy câu vừa rồi, sự có mặt của người kia có vẻ vẫn quan trọng với bạn." },
  limits: { strong: "Bạn có vẻ sẵn sàng nói chuyện rõ ràng về giới hạn.", weak: "Có vẻ bạn muốn những giới hạn được nói ra thay vì đoán mò." },
};

export type CoffeeVerdictSupportKind = "friend_like" | "conflict_vulnerability" | "jealousy_boundary" | "accumulated_concerns";

export function getCoffeeVerdictSupportKind(answers: CoffeeAnswers, verdictKey: VerdictKey): CoffeeVerdictSupportKind | null {
  if (verdictKey === "friend_like") return "friend_like";
  if (verdictKey !== "different_system") return null;
  if (answers.conflict_vulnerability === "C") return "conflict_vulnerability";
  if (answers.jealousy_boundary === "C") return "jealousy_boundary";
  return "accumulated_concerns";
}

export function getCoffeeVisibleProfileKeys(result: CoffeeResult, supportKind: CoffeeVerdictSupportKind | null) {
  return supportKind ? result.profileKeys.slice(0, 4) : result.profileKeys;
}

export function getCoffeeProfileTitle(answers: CoffeeAnswers, key: ProfileKey) {
  const confidence = profileEvidenceCount(answers, key) >= 2 ? "strong" : "weak";
  return COFFEE_PROFILE_TITLES[key][confidence];
}

export function adaptCoffeeAddress(text: string, mode: AddressMode) {
  if (mode === "cau_minh") return text.replaceAll("Bạn", "Cậu").replaceAll("bạn", "cậu");
  if (mode === "anh_em") return text.replaceAll("Bạn", "Em").replaceAll("bạn", "em");
  return text;
}
