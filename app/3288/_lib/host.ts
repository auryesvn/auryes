import { headers } from "next/headers";

export type NamespaceBasePath = "" | "/3288";

export async function getNamespaceBasePath(): Promise<NamespaceBasePath> {
  const host = (await headers()).get("host")?.split(":", 1)[0].toLowerCase();
  return host === "3288.site" || host === "www.3288.site" ? "" : "/3288";
}
