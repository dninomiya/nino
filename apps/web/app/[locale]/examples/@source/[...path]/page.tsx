import SourceTree from "@/components/source-tree";
import { examplesSourceMap } from "../../examples-source-map";

export default async function SearchParamsDialogSource({
  params,
  searchParams,
}: PageProps<"/[locale]/examples/[...path]">) {
  const path = (await params).path.join("/");
  const currentFile = searchParams.then((params) => params.file as string);
  const paths = examplesSourceMap[path];

  if (!paths) {
    return null;
  }

  return <SourceTree paths={paths} currentFile={currentFile} />;
}
