import { ImageResponse } from "next/og";
import { getDocMeta, getDocMetas } from "@/lib/docs";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const generateStaticParams = async () => {
  const docs = await getDocMetas();
  return docs.map((doc) => ({ id: doc.id }));
};

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const doc = await getDocMeta(params.slug);

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {doc.title}
      </div>
    )
  );
}
