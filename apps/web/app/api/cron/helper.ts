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

// 時刻指定 or 分間隔指定のどちらにも対応
type FixedWhen = { type?: "fixed"; time: string; day: DayOfWeek };
type IntervalWhen = { type: "interval"; everyMinutes: number; day: DayOfWeek };

export type Schedule = {
  when: FixedWhen | IntervalWhen;
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
  const currentHour = jstDate.getUTCHours();
  const currentMinute = jstDate.getUTCMinutes();
  const currentDayOfWeek = jstDate.getUTCDay();

  // 曜日チェック
  const validDays = resolveDays(schedule.when.day);
  const dayMatch = validDays.includes(currentDayOfWeek);
  if (!dayMatch) return false;

  // 分間隔指定（"every X minutes"）
  if ((schedule.when as IntervalWhen).type === "interval") {
    const { everyMinutes } = schedule.when as IntervalWhen;
    if (
      typeof everyMinutes === "number" &&
      everyMinutes > 0 &&
      Number.isInteger(everyMinutes)
    ) {
      return currentMinute % everyMinutes === 0;
    }
    return false;
  }

  // 時刻指定（デフォルト）
  const fixed = schedule.when as FixedWhen;
  const timeMatchResult = /^(?:[01]?\d|2[0-3]):([0-5]\d)$/.exec(fixed.time);
  // 上の正規表現だと時は 0-23, 分は 00-59 を保証
  if (!timeMatchResult) return false;
  const [hourStr, minuteStr] = fixed.time.split(":");
  const scheduleHour: number = Number(hourStr);
  const scheduleMinute: number = Number(minuteStr);

  // 分単位での一致のみを判定（誤爆を避けるため厳密一致）
  const timeMatch =
    currentHour === scheduleHour && currentMinute === scheduleMinute;
  return timeMatch;
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
