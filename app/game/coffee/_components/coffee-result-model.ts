import type { AnswerId, ProfileKey, VerdictKey } from "@/lib/coffee-quiz";

export type CoffeeSendState = "idle" | "sending" | "sent" | "failed";
export type CoffeeInsightVariant =
  "featured" | "numbered" | "editorial" | "quote";

export type CoffeeInsightInput = {
  key: string;
  heading: string;
  body: string;
  profileKey?: ProfileKey;
  showRealityCheck?: boolean;
};

export type CoffeePresentedInsight = CoffeeInsightInput & {
  position: number;
  variant: CoffeeInsightVariant;
};

export const RESULT_SEAL_LABELS: Record<VerdictKey, string> = {
  uncertain: "CHƯA KẾT LUẬN VỘI",
  promising: "ĐÁNG ĐỂ GẶP THỬ",
  friend_like: "HỢP LÀM ĐỒNG BỌN",
  different_system: "KHÁC HỆ MỘT CHÚT",
};

export const COFFEE_RECIPROCITY_URL = "https://auryes.vn/kai?context=coffee";

export const COFFEE_INITIAL_UI_STATE = {
  stage: "intro",
  addressMode: null,
  questionIndex: 0,
  answers: {},
  name: "",
  instagram: "",
  formError: "",
  sendState: "idle",
} as const;

const STANDARD_VARIANTS: readonly CoffeeInsightVariant[] = [
  "numbered",
  "editorial",
  "quote",
];

export function buildCoffeeInsightPresentation(
  support: CoffeeInsightInput | null,
  profiles: readonly CoffeeInsightInput[],
): CoffeePresentedInsight[] {
  const ordered = support ? [support, ...profiles] : [...profiles];
  return ordered.map((insight, index) => ({
    ...insight,
    position: index + 1,
    variant: index === 0 ? "featured" : STANDARD_VARIANTS[(index - 1) % 3],
  }));
}

export function isCoffeeRealityCheckEligible(
  key: ProfileKey,
  jealousyBoundary: AnswerId,
) {
  return key === "limits" && ["A", "B", "D"].includes(jealousyBoundary);
}

export function coffeeSubmissionIsLocked(sendState: CoffeeSendState) {
  return sendState === "sending";
}
