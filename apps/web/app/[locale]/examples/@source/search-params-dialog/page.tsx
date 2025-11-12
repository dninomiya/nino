import SourceTree from "@/components/source-tree";

const paths = [
  {
    path: "/app/[locale]/examples/search-params-dialog/page.tsx",
    label: "page.tsx",
  },
  {
    path: "/app/[locale]/examples/search-params-dialog/dialog.tsx",
    label: "dialog.tsx",
  },
  {
    path: "/app/[locale]/examples/search-params-dialog/list.tsx",
    label: "list.tsx",
  },
];

export default async function SearchParamsDialogSource({
  searchParams,
}: PageProps<"/[locale]/examples/search-params-dialog">) {
  const currentFile = searchParams.then((params) => params.file as string);
  return <SourceTree paths={paths} currentFile={currentFile} />;
}
