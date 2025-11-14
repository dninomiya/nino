import { cn } from "@workspace/ui/lib/utils";
import { AlertOctagon, AlertTriangle, Info, Lightbulb } from "lucide-react";
import React from "react";

const defaultTitle = {
  info: "情報",
  tip: "ヒント",
  warning: "注意",
  danger: "重要",
};

export default function Callout({
  children,
  type,
  title,
}: {
  children: React.ReactNode;
  type: "info" | "tip" | "warning" | "danger";
  title?: string;
}) {
  const styles = {
    info: "bg-blue-50 dark:bg-blue-500/5 dark:text-blue-300 dark:border-blue-500/30 border-blue-300 text-blue-700",
    tip: "bg-green-50 dark:bg-green-500/5 dark:text-green-300 dark:border-green-500/30 border-green-300 text-green-700",
    warning:
      "bg-yellow-50 dark:bg-yellow-500/5 dark:text-yellow-300 dark:border-yellow-500/30 border-yellow-300 text-yellow-700",
    danger:
      "bg-red-50 dark:bg-red-500/5 dark:text-red-300 dark:border-red-500/30 border-red-300 text-red-700",
  };
  const icons = {
    info: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
    danger: AlertOctagon,
  };

  const Icon = icons[type];

  return (
    <div className={cn("text-sm border p-4 rounded-md", styles[type])}>
      <div className="not-prose font-bold flex gap-2 items-center mb-3">
        <Icon size={20} />
        {title || defaultTitle[type]}
      </div>
      <div className="*:last:mb-0 leading-relaxed prose-strong:text-current [&>:first-child]:mt-0">
        {children}
      </div>
    </div>
  );
}
