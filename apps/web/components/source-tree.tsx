import { readFile } from "fs/promises";
import path, { join } from "path";
import SearchParamsButton from "./search-params-button";
import { CodeBlock } from "./code-block";

type Path = {
  path: string;
  label: string;
};

export default async function SourceTree({
  paths,
  currentFile,
}: {
  paths: Path[];
  currentFile: Promise<string>;
}) {
  const currentPath = await currentFile;
  const extension = currentPath ? path.extname(currentPath) : "";
  const lang = extension.slice(1);
  const sources = await Promise.all(
    paths.map(async ({ path, label }) => {
      const content = await readFile(join(process.cwd(), path), "utf-8");
      return {
        path,
        label,
        content,
      };
    })
  );

  const currentSource = sources.find((source) => source.path === currentPath);

  return (
    <div className="h-full overflow-hidden divide-x flex">
      <div className="w-56 p-2 h-full overflow-y-auto">
        {sources.map((source) => (
          <SearchParamsButton
            key={source.path}
            queryKey="file"
            value={source.path}
            variant="ghost"
            className="w-full justify-start"
          >
            {source.label}
          </SearchParamsButton>
        ))}
      </div>
      {currentSource && (
        <div className="flex-1 overflow-hidden">
          <CodeBlock
            className="border-none flex-1 h-full **:data-[slot=code-block-display]:h-[calc(100dvh-48px)] overflow-hidden rounded-none"
            codes={[
              {
                code: currentSource.content,
                lang,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
