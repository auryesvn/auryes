import { permanentRedirect } from "next/navigation";

export default function LegacySocialGamePage() {
  permanentRedirect("/game/social-game");
}
