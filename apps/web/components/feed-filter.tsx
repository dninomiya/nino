"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getAvailableTechnologies, getAvailableTypes } from "@/lib/feed";

const typeLabels: Record<string, string> = {
  releases: "リリース",
  blog: "ニュース",
  changelog: "変更履歴",
  youtube: "動画",
};

export function FeedFilter() {
  const [types, setTypes] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString)
  );
  const [sources, setSources] = useQueryState(
    "source",
    parseAsArrayOf(parseAsString)
  );

  const availableTypes = getAvailableTypes();
  const availableTechnologies = getAvailableTechnologies();

  const toggleType = (type: string, checked: boolean) => {
    if (checked) {
      setTypes([...(types || []), type]);
    } else {
      setTypes(types?.filter((t) => t !== type) || []);
    }
  };

  const toggleSource = (source: string, checked: boolean) => {
    if (checked) {
      setSources([...(sources || []), source]);
    } else {
      setSources(sources?.filter((s) => s !== source) || []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3>情報タイプ</h3>
        <div className="space-y-2">
          {availableTypes.map((type) => (
            <div key={type} className="flex items-center gap-3">
              <Checkbox
                id={`type-${type}`}
                checked={types?.includes(type)}
                onCheckedChange={(checked) => {
                  toggleType(type, checked as boolean);
                }}
              />
              <Label htmlFor={`type-${type}`}>{typeLabels[type] || type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3>技術</h3>
        <div className="space-y-2">
          {availableTechnologies.map((technology) => (
            <div key={technology} className="flex items-center gap-3">
              <Checkbox
                id={`source-${technology}`}
                checked={sources?.includes(technology)}
                onCheckedChange={(checked) => {
                  toggleSource(technology, checked as boolean);
                }}
              />
              <Label htmlFor={`source-${technology}`}>{technology}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
