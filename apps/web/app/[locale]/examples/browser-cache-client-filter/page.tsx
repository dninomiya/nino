import { Suspense } from "react";
import { SearchForm } from "./search-form";
import { TodoList } from "./todo-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cache API & Client Filter Example",
};

export default function BrowserCacheClientFilterPage() {
  return (
    <div className="space-y-4 container py-10">
      <h1 className="text-2xl font-bold">Todo List</h1>
      <Suspense>
        <SearchForm />
        <TodoList />
      </Suspense>
    </div>
  );
}
