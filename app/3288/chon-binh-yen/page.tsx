import { getNamespaceBasePath } from "../_lib/host";
import ChonBinhYenExperience from "./_components/chon-binh-yen-experience";

export default async function ChonBinhYenPage() {
  return <ChonBinhYenExperience basePath={await getNamespaceBasePath()} />;
}
