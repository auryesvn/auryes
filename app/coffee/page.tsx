import { permanentRedirect } from "next/navigation";

export default function LegacyCoffeePage() {
  permanentRedirect("/game/coffee");
}
