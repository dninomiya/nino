import { Suspense } from "react";
import { SearchParamsDialog } from "./dialog";
import { List } from "./list";

export default function Page() {
  return (
    <div className="space-y-4 container py-10 flex justify-center">
      <Suspense>
        <List />
        <SearchParamsDialog />
      </Suspense>
    </div>
  );
}
