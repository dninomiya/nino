"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FeedItem,
  typeLabels,
  getAvailableTypes,
  getAvailableTechnologies,
} from "@/lib/feed";
import { useMemo } from "react";

interface FeedFilterProps {
  feedItems: FeedItem[];
}

export function FeedFilter({ feedItems }: FeedFilterProps) {
  const [types, setTypes] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString)
  );
  const [sources, setSources] = useQueryState(
    "source",
    parseAsArrayOf(parseAsString)
  );

  // 定義済みのタイプを取得（0件のものも含む）
  const availableTypes = getAvailableTypes();

  // 定義済みのソースを取得（0件のものも含む）
  const availableTechnologies = getAvailableTechnologies();

  // 各タイプの件数を計算（現在のソースフィルターを考慮）
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTypes.forEach((type) => {
      counts[type] = feedItems.filter((item) => {
        // タイプが一致するかチェック
        if (item.type !== type) return false;

        // ソースフィルターが設定されている場合、それも考慮
        if (sources && sources.length > 0) {
          return sources.includes(item.source);
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTypes, sources]);

  // 各ソースの件数を計算（現在のタイプフィルターを考慮）
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTechnologies.forEach((source) => {
      counts[source] = feedItems.filter((item) => {
        // ソースが一致するかチェック
        if (item.source !== source) return false;

        // タイプフィルターが設定されている場合、それも考慮
        if (types && types.length > 0) {
          return types.includes(item.type);
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTechnologies, types]);

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
              <Label
                htmlFor={`type-${type}`}
                className="flex items-center justify-between w-full"
              >
                <span>{typeLabels[type] || type}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({typeCounts[type] || 0})
                </span>
              </Label>
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
              <Label
                htmlFor={`source-${technology}`}
                className="flex items-center justify-between w-full"
              >
                <span>{technology}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({sourceCounts[technology] || 0})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
