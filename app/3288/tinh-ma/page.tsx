import TinhMaExperience from "./_components/tinh-ma-experience";
import { getNamespaceBasePath } from "../_lib/host";

export default async function TinhMaPage() {
  return <TinhMaExperience basePath={await getNamespaceBasePath()} />;
}
