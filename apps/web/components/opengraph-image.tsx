import { loadDefaultJapaneseParser } from "budoux";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export const size = {
  width: 1200,
  height: 630,
};

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]!);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function generateOpenGraphImage({ title }: { title: string }) {
  const parser = loadDefaultJapaneseParser();
  const parsedTitle = parser.parse(title);
  const author = "dninomiya.com";

  // Load logo image
  const logoPath = join(
    process.cwd(),
    "../../packages/ui/src/blocks/logo/logo.jpg"
  );
  const logoData = await readFile(logoPath);
  const logoSrc = Uint8Array.from(logoData).buffer;

  return new ImageResponse(
    (
      <div tw="flex flex-col h-full w-full items-center justify-center px-18 py-14 text-base tracking-tight bg-neutral-900">
        <div tw="flex flex-wrap justify-center leading-relaxed text-[64px] text-neutral-50 font-black tracking-wider">
          {parsedTitle.map((line, index) => (
            <div className="flex" key={index}>
              {line}
            </div>
          ))}
        </div>
        <div tw="flex items-center mt-14">
          <img
            // @ts-expect-error Satori accepts ArrayBuffer/typed arrays for <img src> at runtime
            src={logoSrc}
            width={36}
            height={36}
            tw="rounded-lg"
            alt="Logo"
          />
          <span tw="ml-3 text-3xl -mt-1.5 text-neutral-500 font-medium">
            {author}
          </span>
        </div>
      </div>
    ),
    {
      fonts: [
        {
          name: "Noto Sans JP",
          data: await loadGoogleFont("Noto+Sans+JP:wght@900", title),
          style: "normal",
          weight: 900,
        },
        {
          name: "Noto Sans JP",
          data: await loadGoogleFont("Noto+Sans+JP:wght@500", author),
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
