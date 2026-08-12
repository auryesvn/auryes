import "server-only";

import { COFFEE_VERDICT_TITLES, getCoffeeVerdictSupportKind } from "@/lib/coffee-result-presentation";
import { COFFEE_QUESTIONS, COFFEE_QUESTION_SHORT_TITLES, type AddressMode, type CoffeeAnswers, type CoffeeResult } from "@/lib/coffee-quiz";

const ADDRESS_LABELS: Record<AddressMode, string> = { ban_minh: "Bạn / mình", cau_minh: "Cậu / mình", anh_em: "Anh / em 👀" };
const SUPPORT_NOTES = {
  friend_like: "💭 <b>Kai để ý:</b> Các câu trả lời hiện cho thấy khá ít nhu cầu gần gũi mang màu sắc người yêu; gặp đúng người vẫn có thể khác.",
  conflict_vulnerability: "⚠️ <b>Kai để ý:</b> Có một khác biệt đáng chú ý ở việc dùng điểm dễ tổn thương của người kia khi bất đồng.",
  jealousy_boundary: "⚠️ <b>Kai để ý:</b> Có một khác biệt đáng chú ý ở cách phản ứng sau khi người kia đã nói rõ giới hạn.",
  accumulated_concerns: "⚠️ <b>Kai để ý:</b> Có vài băn khoăn mềm về việc giữ lời và tự quyết chuyện của mối quan hệ.",
} as const;

type CoffeeNotification = { name: string; instagram: string | null; addressMode: AddressMode; answers: CoffeeAnswers; result: CoffeeResult; submittedAt: Date };

export function escapeTelegramHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function formatCoffeeSubmissionMessage(input: CoffeeNotification) {
  const supportKind = getCoffeeVerdictSupportKind(input.answers, input.result.verdictKey);
  const answerTranscript = COFFEE_QUESTIONS.map((question, index) => {
    const number = String(index + 1).padStart(2, "0");
    const answer = question.answers[input.answers[question.id]];
    return `<b>${number} · ${escapeTelegramHtml(COFFEE_QUESTION_SHORT_TITLES[question.id])}</b>\n${escapeTelegramHtml(answer)}`;
  }).join("\n\n");
  const instagramLine = input.instagram ? `\nInstagram: <a href="https://instagram.com/${escapeTelegramHtml(input.instagram)}">@${escapeTelegramHtml(input.instagram)}</a>` : "";
  const timestampParts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric", hour12: false }).formatToParts(input.submittedAt);
  const part = (type: Intl.DateTimeFormatPartTypes) => timestampParts.find((item) => item.type === type)?.value ?? "";
  const timestamp = `${part("hour")}:${part("minute")} · ${part("day")}/${part("month")}/${part("year")}`;
  const supportLine = supportKind ? `\n\n${SUPPORT_NOTES[supportKind]}` : "";
  return `☕ <b>Coffee · submission mới</b>\n\n<b>${escapeTelegramHtml(input.name)}</b>${instagramLine}\nXưng hô: ${ADDRESS_LABELS[input.addressMode]}\n\n<b>${COFFEE_VERDICT_TITLES[input.result.verdictKey]}</b>\n\n${answerTranscript}${supportLine}\n\n🕒 ${timestamp}`;
}

export async function sendCoffeeSubmissionNotification(input: CoffeeNotification) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[coffee] Telegram notification skipped: configuration absent");
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: formatCoffeeSubmissionMessage(input), parse_mode: "HTML", disable_web_page_preview: true }), signal: AbortSignal.timeout(5_000) });
    const payload: unknown = await response.json().catch(() => null);
    const telegramOk = typeof payload === "object" && payload !== null && "ok" in payload && payload.ok === true;
    if (!response.ok || !telegramOk) console.warn(`[coffee] Telegram notification failed: response ${response.status}`);
  } catch (error) {
    const category = error instanceof Error && error.name === "TimeoutError" ? "timeout" : "request error";
    console.warn(`[coffee] Telegram notification failed: ${category}`);
  }
}
