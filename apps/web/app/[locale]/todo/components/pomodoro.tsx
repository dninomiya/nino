"use client";

import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const CYCLE_DURATION = 30 * 60; // 30分（1800秒）
const PROGRESS_DURATION = 25 * 60; // 25分（1500秒）
const BREAK_DURATION = 5 * 60; // 5分（300秒）

export function Pomodoro() {
  const getCurrentHourStart = () => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.getTime();
  };

  const calculateElapsedSeconds = () => {
    const now = Date.now();
    const hourStart = getCurrentHourStart();
    return Math.floor((now - hourStart) / 1000);
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(calculateElapsedSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsedSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cyclePosition = elapsedSeconds % CYCLE_DURATION;
  const isProgress = cyclePosition < PROGRESS_DURATION;

  const remainingSeconds = useMemo(() => {
    if (isProgress) {
      return PROGRESS_DURATION - cyclePosition;
    } else {
      return BREAK_DURATION - (cyclePosition - PROGRESS_DURATION);
    }
  }, [isProgress, cyclePosition]);

  const progressScale = useMemo(() => {
    if (isProgress) {
      return (PROGRESS_DURATION - remainingSeconds) / PROGRESS_DURATION;
    } else {
      return (BREAK_DURATION - remainingSeconds) / BREAK_DURATION;
    }
  }, [isProgress, remainingSeconds]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "h-10 relative flex-1 overflow-hidden rounded-2xl border",
        isProgress ? "border-lime-500/30" : "border-blue-500/30"
      )}
    >
      <div
        style={{ transform: `scaleX(${progressScale})` }}
        className={`size-full origin-left transition ease-linear duration-1000 ${
          isProgress ? "bg-lime-600/10" : "bg-blue-500/10"
        }`}
      ></div>
      <div
        className={cn(
          "absolute inset-0 flex items-center font-bold justify-center text-white text-sm",
          isProgress ? "text-lime-600" : "text-blue-500"
        )}
      >
        <span className="mr-2 font-bold">
          {isProgress ? "集中タイム" : <Coffee className="size-5" />}
        </span>
        <span className="tabular-nums">{formatTime(remainingSeconds)}</span>
      </div>
    </div>
  );
}
