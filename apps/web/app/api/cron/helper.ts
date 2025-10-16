// 型定義
export type DayOfWeek =
  | "月"
  | "火"
  | "水"
  | "木"
  | "金"
  | "土"
  | "日"
  | "workingday"
  | "everyday";

export type Schedule = {
  when: { time: string; day: DayOfWeek };
  action: () => Promise<void>;
};

// 曜日エイリアスを解決する関数
export function resolveDays(day: string): number[] {
  const dayMap: Record<string, number> = {
    日: 0,
    月: 1,
    火: 2,
    水: 3,
    木: 4,
    金: 5,
    土: 6,
  };

  if (day === "workingday") {
    return [1, 2, 3, 4, 5]; // 月-金
  }
  if (day === "everyday") {
    return [0, 1, 2, 3, 4, 5, 6]; // 全日
  }

  const dayNumber = dayMap[day];
  if (dayNumber === undefined) {
    throw new Error(`Invalid day: ${day}`);
  }

  return [dayNumber];
}

// スケジュールが現在時刻にマッチするかチェック
export function isScheduleMatch(schedule: Schedule, jstDate: Date): boolean {
  const [scheduleHour, scheduleMinute] = schedule.when.time
    .split(":")
    .map(Number);
  const currentHour = jstDate.getUTCHours();
  const currentMinute = jstDate.getUTCMinutes();
  const currentDayOfWeek = jstDate.getUTCDay();

  // 時刻チェック（0-1分の範囲内）
  const timeMatch = currentHour === scheduleHour && currentMinute <= 1;

  // 曜日チェック
  const validDays = resolveDays(schedule.when.day);
  const dayMatch = validDays.includes(currentDayOfWeek);

  return timeMatch && dayMatch;
}

// スケジュールを実行する関数
export async function executeSchedules(
  schedules: Schedule[],
  jstDate: Date
): Promise<{
  executed: number;
  results: Array<{ success: boolean; error?: any }>;
}> {
  const matchingSchedules = schedules.filter((schedule) =>
    isScheduleMatch(schedule, jstDate)
  );

  if (matchingSchedules.length === 0) {
    return { executed: 0, results: [] };
  }

  console.log(`Found ${matchingSchedules.length} matching schedules`);

  // 各スケジュールのアクションを並列実行
  const results = await Promise.allSettled(
    matchingSchedules.map((schedule) => schedule.action())
  );

  const processedResults = results.map((result) => ({
    success: result.status === "fulfilled",
    error: result.status === "rejected" ? result.reason : undefined,
  }));

  return { executed: matchingSchedules.length, results: processedResults };
}
