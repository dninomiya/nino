import { Suspense } from "react";
import { currentSession } from "../session";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <Suspense>
        <Content />
      </Suspense>
    </div>
  );
}

async function Content() {
  const session = await currentSession();

  return <p>ようこそ、{session.user.name}さん</p>;
}
