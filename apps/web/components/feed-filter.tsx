"use client";

import { useQueryStates } from "nuqs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  FeedItem,
  FeedType,
  feedTypeMapping,
  techMapping,
  getAvailableTypes,
  getAvailableTechnologies,
  getTechnologiesByCategory,
  categoryOrder,
} from "@/lib/feed";
import { useMessage } from "./i18n-provider";
import { useMemo, ReactNode } from "react";
import { getFeedTypeLabel, getTagLabel } from "@/components/feed/helpers";
import { feedSearchParamParsers } from "@/components/feed/search-params.client";

interface FeedFilterProps {
  feedItems: FeedItem[];
}

// 共通化されたセクションコンポーネント
interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="space-y-3">
      <h3>{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// 共通化されたフィルター項目コンポーネント
interface FilterItemProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: ReactNode;
  label: string;
  count: number;
}

function FilterItem({
  id,
  checked,
  onCheckedChange,
  icon,
  label,
  count,
}: FilterItemProps) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <Label htmlFor={id} className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm text-muted-foreground ml-2 tabular-nums">
          {count}
        </span>
      </Label>
    </div>
  );
}

// カテゴリ別セクションコンポーネント
interface CategorySectionProps {
  title: string;
  children: ReactNode;
}

function CategorySection({ title, children }: CategorySectionProps) {
  return (
    <div className="space-y-3">
      <h3>{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// カテゴリグループコンポーネント
interface CategoryGroupProps {
  category: string;
  children: ReactNode;
}

function CategoryGroup({ category, children }: CategoryGroupProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
      <div className="space-y-2 ml-2">{children}</div>
    </div>
  );
}

// タイプに応じたアイコンを取得する関数
const getTypeIcon = (type: FeedType) => {
  const mapping = feedTypeMapping[type];
  if (mapping) {
    const IconComponent = mapping.icon;
    return <IconComponent className="w-4 h-4" />;
  }
  return null;
};

// 技術に応じたアイコンを取得する関数
const getTechnologyIcon = (technology: string) => {
  const mapping = techMapping[technology];
  if (mapping) {
    const IconComponent = mapping.icon;
    return <IconComponent className="w-4 h-4" />;
  }
  return null;
};

// カテゴリ名を翻訳する関数
const getCategoryLabel = (category: string, tCategories: any) => {
  const categoryMap: Record<string, string> = {
    framework: tCategories.framework,
    saas: tCategories.saas,
    library: tCategories.library,
    tool: tCategories.tool,
    ai: tCategories.ai,
    mobile: tCategories.mobile,
  };
  return categoryMap[category] || category;
};

export function FeedFilter({ feedItems }: FeedFilterProps) {
  const t = useMessage("FeedFilter");
  const tCategories = useMessage("Categories");
  const tTags = useMessage("Tags");
  const tFeedTypes = useMessage("FeedTypes");
  const [filters, setFilters] = useQueryStates(feedSearchParamParsers);

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
    const counts: Partial<Record<FeedType, number>> = {};
    availableTypes.forEach((type) => {
      counts[type] = feedItems.filter((item) => {
        // タイプが一致するかチェック
        if (item.type !== type) return false;

        // ソースフィルターが設定されている場合、それも考慮
        if (filters.source && filters.source.length > 0) {
          if (!filters.source.includes(item.source)) return false;
        }

        // タグフィルターが設定されている場合、それも考慮
        if (filters.tags && filters.tags.length > 0 && item.tags) {
          const hasMatchingTag = item.tags.some((tag) =>
            filters.tags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTypes, filters.source, filters.tags]);

  // 各ソースの件数を計算（現在のタイプ・タグフィルターを考慮）
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTechnologies.forEach((source) => {
      counts[source] = feedItems.filter((item) => {
        // ソースが一致するかチェック
        if (item.source !== source) return false;

        // タイプフィルターが設定されている場合、それも考慮
        if (filters.type && filters.type.length > 0) {
          if (!filters.type.includes(item.type)) return false;
        }

        // タグフィルターが設定されている場合、それも考慮
        if (filters.tags && filters.tags.length > 0 && item.tags) {
          const hasMatchingTag = item.tags.some((tag) =>
            filters.tags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTechnologies, filters.type, filters.tags]);

  // 各タグの件数を計算（現在のタイプ・ソースフィルターを考慮）
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availableTags.forEach((tag) => {
      counts[tag] = feedItems.filter((item) => {
        // タグが含まれているかチェック
        if (!item.tags || !item.tags.includes(tag)) return false;

        // タイプフィルターが設定されている場合、それも考慮
        if (filters.type && filters.type.length > 0) {
          if (!filters.type.includes(item.type)) return false;
        }

        // ソースフィルターが設定されている場合、それも考慮
        if (filters.source && filters.source.length > 0) {
          if (!filters.source.includes(item.source)) return false;
        }

        return true;
      }).length;
    });
    return counts;
  }, [feedItems, availableTags, filters.type, filters.source]);

  const toggleType = (type: FeedType, checked: boolean) => {
    const currentTypes = filters.type;
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);

    setFilters(
      { type: newTypes },
      {
        shallow: false,
      }
    );
  };

  const toggleSource = (source: string, checked: boolean) => {
    const currentSources = filters.source;
    const newSources = checked
      ? [...currentSources, source]
      : currentSources.filter((s) => s !== source);

    setFilters(
      { source: newSources },
      {
        shallow: false,
      }
    );
  };

  const toggleTag = (tag: string, checked: boolean) => {
    const currentTags = filters.tags;
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter((t) => t !== tag);

    setFilters(
      { tags: newTags },
      {
        shallow: false,
      }
    );
  };

  return (
    <div className="space-y-6">
      <FilterSection title={t.typeLabel}>
        {availableTypes.map((type) => (
          <FilterItem
            key={type}
            id={`type-${type}`}
            checked={filters.type?.includes(type)}
            onCheckedChange={(checked) => toggleType(type, checked)}
            icon={getTypeIcon(type)}
            label={getFeedTypeLabel(type, tFeedTypes)}
            count={typeCounts[type] || 0}
          />
        ))}
      </FilterSection>

      <CategorySection title={t.sourceLabel}>
        {categoryOrder.map((category) => {
          const technologies = technologiesByCategory[category];
          if (!technologies || technologies.length === 0) return null;

          return (
            <CategoryGroup
              key={category}
              category={getCategoryLabel(category, tCategories)}
            >
              {technologies.map((technology) => (
                <FilterItem
                  key={technology}
                  id={`source-${technology}`}
                  checked={filters.source?.includes(technology)}
                  onCheckedChange={(checked) =>
                    toggleSource(technology, checked)
                  }
                  icon={getTechnologyIcon(technology)}
                  label={techMapping[technology]?.label || technology}
                  count={sourceCounts[technology] || 0}
                />
              ))}
            </CategoryGroup>
          );
        })}
      </CategorySection>

      {availableTags.length > 0 && (
        <FilterSection title={t.tagsLabel}>
          {availableTags.map((tag) => (
            <FilterItem
              key={tag}
              id={`tag-${tag}`}
              checked={filters.tags?.includes(tag)}
              onCheckedChange={(checked) => toggleTag(tag, checked)}
              label={getTagLabel(tag, tTags)}
              count={tagCounts[tag] || 0}
            />
          ))}
        </FilterSection>
      )}
    </div>
  );
}
