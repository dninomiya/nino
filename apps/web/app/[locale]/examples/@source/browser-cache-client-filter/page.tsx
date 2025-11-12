import SourceTree from "@/components/source-tree";

const paths = [
  {
    path: "/app/[locale]/examples/browser-cache-client-filter/page.tsx",
    label: "page.tsx",
  },
  {
    path: "/app/[locale]/examples/browser-cache-client-filter/search-form.tsx",
    label: "search-form.tsx",
  },
  {
    path: "/app/[locale]/examples/browser-cache-client-filter/todo-list.tsx",
    label: "todo-list.tsx",
  },
  {
    path: "/app/[locale]/examples/browser-cache-client-filter/type.ts",
    label: "type.ts",
  },
  {
    path: "/app/[locale]/examples/browser-cache-client-filter/cache.ts",
    label: "cache.ts",
  },
];

export default async function BrowserCacheClientFilterSource({
  searchParams,
}: PageProps<"/[locale]/examples/browser-cache-client-filter">) {
  return (
    <SourceTree
      currentFile={searchParams.then((params) => params.file as string)}
      paths={paths}
    />
  );
}
