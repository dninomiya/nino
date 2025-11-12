"use client";

import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

export function SearchForm() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  });

  return (
    <Input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
