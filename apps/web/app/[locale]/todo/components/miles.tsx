import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCompletedTasksForMiles } from "@/data/task";
import { Suspense } from "react";

export function Miles({ userId }: { userId?: string }) {
  return (
    <div className="h-10 -mx-3 grid grid-cols-30 gap-1 overflow-hidden">
      <Suspense fallback={<MilesSkeleton />}>
        <MilesContent userId={userId} />
      </Suspense>
    </div>
  );
}

async function MilesContent({ userId }: { userId?: string }) {
  const completedTasks = await getCompletedTasksForMiles(userId);
  const tasksByDate = new Map(completedTasks.map((t) => [t.date, t]));

  // 過去30日分の日付を生成
  const dates: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    dates.push(dateKey);
  }

  // 過去30日分の最大SPを計算（ゲージの高さを正規化するため）
  const maxSp = Math.max(
    ...dates.map((date) => tasksByDate.get(date)?.sp ?? 0),
    1 // 0で割らないように最小値を1に
  );

  return (
    <>
      {dates.map((date, index) => {
        const taskData = tasksByDate.get(date);
        const sp = taskData?.sp ?? 0;
        const height = sp > 0 ? Math.max((sp / maxSp) * 100, 10) : 0; // 最小10%の高さを保証

        return (
          <Item
            key={date}
            date={date}
            sp={sp}
            tasks={taskData?.tasks ?? []}
            height={height}
            isWeekend={index % 7 === 0 || index % 7 === 6}
          />
        );
      })}
    </>
  );
}

function MilesSkeleton() {
  return Array.from({ length: 30 }).map((_, i) => (
    <div key={i} className="h-full" />
  ));
}

function Item({
  date,
  sp,
  tasks,
  height,
  isWeekend,
}: {
  date: string;
  sp: number;
  tasks: Array<{ title: string; sp: number | null }>;
  height: number;
  isWeekend: boolean;
}) {
  const dateObj = new Date(date);
  const formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="bg-linear-to-t h-full from-lime-600/80 to-lime-600/40 rounded-t-full w-full transition duration-500 origin-bottom"
          style={{ transform: `translateY(${100 - height}%)` }}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="flex flex-col items-center gap-1 max-w-xs"
      >
        <small className="text-xs">{formattedDate}</small>
        <span className="font-bold relative z-10 leading-none text-sm">
          {sp}
        </span>
        {tasks.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex gap-3 justify-between text-muted-foreground"
              >
                <span className="font-medium max-w-40 truncate">
                  {task.title}
                </span>
                {task.sp !== null && task.sp > 0 && (
                  <span className="tabular-nums">{task.sp}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
