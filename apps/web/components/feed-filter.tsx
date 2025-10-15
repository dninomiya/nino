"use client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FeedItem,
  typeLabels,
  getAvailableTypes,
  getAvailableTechnologies,
  getTechnologiesByCategory,
  categoryOrder,
  getCollectionByName,
  TAG_LABELS,
} from "@/lib/feed";
import { useMemo } from "react";
import { SiGithub, SiYoutube } from "@icons-pack/react-simple-icons";
import { Newspaper } from "lucide-react";

interface FeedFilterProps {
  feedItems: FeedItem[];
}

// タイプに応じたアイコンを取得する関数
const getTypeIcon = (type: string) => {
  switch (type) {
    case "リリース":
      return <SiGithub className="w-4 h-4" />;
    case "ニュース":
    case "変更履歴":
      return <Newspaper className="w-4 h-4" />;
    case "動画":
      return <SiYoutube className="w-4 h-4" />;
    default:
      return null;
  }
};

// 技術に応じたアイコンを取得する関数
const getTechnologyIcon = (technology: string) => {
  const collection = getCollectionByName(technology);
  if (collection) {
    const IconComponent = collection.icon;
    return <IconComponent className="w-4 h-4" />;
  }
  return null;
};

export function FeedFilter({ feedItems }: FeedFilterProps) {
  const [types, setTypes] = useQueryState(
    "type",
    parseAsArrayOf(parseAsString)
  );
  const [sources, setSources] = useQueryState(
    "source",
    parseAsArrayOf(parseAsString)
  );
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsString));

  // 定義済みのタイプを取得（0件のものも含む）
  const availableTypes = getAvailableTypes();

  // 定義済みのソースを取得（0件のものも含む）
  const availableTechnologies = getAvailableTechnologies();

  // 利用可能なタグを取得（実際に使用されているタグのみ）
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    feedItems.forEach((item) => {
      if (item.tags) {
        item.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [feedItems]);

  // カテゴリごとに技術をグループ化
  const technologiesByCategory = getTechnologiesByCategory();

  // 各タイプの件数を計算（現在のソース・タグフィルターを考慮）
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTypes.forEach((type) => {
      counts[type] = feedItems.filter((item) => {
        // タイプが一致するかチェック（英語→日本語マッピングを考慮）
        const itemTypeInJapanese = typeLabels[item.type];
        if (!itemTypeInJapanese || itemTypeInJapanese !== type) return false;

        // ソースフィルターが設定されている場合、それも考慮
        if (sources && sources.length > 0) {
          if (!sources.includes(item.source)) return false;
        }

        // タグフィルターが設定されている場合、それも考慮
        if (tags && tags.length > 0 && item.tags) {
          const hasMatchingTag = item.tags.some((tag) => tags.includes(tag));
          if (!hasMatchingTag) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTypes, sources, tags]);

  // 各ソースの件数を計算（現在のタイプ・タグフィルターを考慮）
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTechnologies.forEach((source) => {
      counts[source] = feedItems.filter((item) => {
        // ソースが一致するかチェック
        if (item.source !== source) return false;

        // タイプフィルターが設定されている場合、それも考慮
        if (types && types.length > 0) {
          const itemTypeInJapanese = typeLabels[item.type];
          if (!itemTypeInJapanese || !types.includes(itemTypeInJapanese))
            return false;
        }

        // タグフィルターが設定されている場合、それも考慮
        if (tags && tags.length > 0 && item.tags) {
          const hasMatchingTag = item.tags.some((tag) => tags.includes(tag));
          if (!hasMatchingTag) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTechnologies, types, tags]);

  // 各タグの件数を計算（現在のタイプ・ソースフィルターを考慮）
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTags.forEach((tag) => {
      counts[tag] = feedItems.filter((item) => {
        // タグが含まれているかチェック
        if (!item.tags || !item.tags.includes(tag)) return false;

        // タイプフィルターが設定されている場合、それも考慮
        if (types && types.length > 0) {
          const itemTypeInJapanese = typeLabels[item.type];
          if (!itemTypeInJapanese || !types.includes(itemTypeInJapanese))
            return false;
        }

        // ソースフィルターが設定されている場合、それも考慮
        if (sources && sources.length > 0) {
          if (!sources.includes(item.source)) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTags, types, sources]);

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

  const toggleTag = (tag: string, checked: boolean) => {
    if (checked) {
      setTags([...(tags || []), tag]);
    } else {
      setTags(tags?.filter((t) => t !== tag) || []);
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
                <div className="flex items-center gap-2">
                  {getTypeIcon(type)}
                  <span>{typeLabels[type] || type}</span>
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {typeCounts[type] || 0}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3>技術</h3>
        <div className="space-y-4">
          {categoryOrder.map((category) => {
            const technologies = technologiesByCategory[category];
            if (!technologies || technologies.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {category}
                </h4>
                <div className="space-y-2 ml-2">
                  {technologies.map((technology) => (
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
                        <div className="flex items-center gap-2">
                          {getTechnologyIcon(technology)}
                          <span>{technology}</span>
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          {sourceCounts[technology] || 0}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="space-y-3">
          <h3>タグ</h3>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center gap-3">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={tags?.includes(tag)}
                  onCheckedChange={(checked) => {
                    toggleTag(tag, checked as boolean);
                  }}
                />
                <Label
                  htmlFor={`tag-${tag}`}
                  className="flex items-center justify-between w-full"
                >
                  <span>{TAG_LABELS[tag] || tag}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {tagCounts[tag] || 0}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
