"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function FeedFilter() {
  const [categories, setCategories] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString)
  );
  const [sources, setSources] = useQueryState(
    "source",
    parseAsArrayOf(parseAsString)
  );

  return (
    <div>
      <div className="space-y-3">
        <h3>情報ソース</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id="release"
              checked={categories?.includes("リリース")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setCategories([...(categories || []), "リリース"]);
                } else {
                  setCategories(
                    categories?.filter((category) => category !== "リリース") ||
                      []
                  );
                }
              }}
            />
            <Label htmlFor="release">リリース</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="news"
              checked={categories?.includes("ニュース")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setCategories([...(categories || []), "ニュース"]);
                } else {
                  setCategories(
                    categories?.filter((category) => category !== "ニュース") ||
                      []
                  );
                }
              }}
            />
            <Label htmlFor="news">ニュース</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
