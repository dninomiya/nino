"use client";

import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSound } from "use-sound";
import { Mole, Wall } from "./mole";

const CYCLE_DURATION = 30 * 60; // 30分（1800秒）
const PROGRESS_DURATION = 25 * 60; // 25分（1500秒）
const BREAK_DURATION = 5 * 60; // 5分（300秒）

export function Pomodoro({ soundEnabled = true }: { soundEnabled?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
  const [playSessionSound] = useSound("/sounds/start-session.mp3", {
    volume: soundEnabled ? 0.5 : 0,
  });
  const [playBreakSound] = useSound("/sounds/start-break.mp3", {
    volume: soundEnabled ? 0.5 : 0,
  });
  const prevIsProgressRef = useRef<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsedSeconds());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cyclePosition = elapsedSeconds % CYCLE_DURATION;
  const isProgress = cyclePosition < PROGRESS_DURATION;

  // セッション開始時とブレーク開始時に音を再生
  useEffect(() => {
    if (prevIsProgressRef.current === null) {
      prevIsProgressRef.current = isProgress;
      return;
    }

    if (prevIsProgressRef.current !== isProgress) {
      if (isProgress) {
        // セッション（集中タイム）開始
        playSessionSound();
      } else {
        // ブレーク開始
        playBreakSound();
      }
      prevIsProgressRef.current = isProgress;
    }
  }, [isProgress, playSessionSound, playBreakSound]);

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

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "h-10 relative flex-1 overflow-hidden rounded-full bg-black/30 inset-shadow-[0_0_6px_0_rgba(0,0,0,0.5)]"
      )}
    >
      {!isProgress && (
        <div className="absolute left-0 bottom-0">
          <Mole sleep />
        </div>
      )}
      <div
        className="size-full transition duration-1000 ease-linear flex items-end"
        style={{
          transform: `translateX(${progressScale * 100}%)`,
        }}
      >
        {isProgress && (
          <>
            <div className="height-6">
              <Mole />
            </div>
            <Wall className="text-[#2A2520] w-10 -ml-7 -mr-px" />
            <div className="flex-1 bg-[#2A2520] h-full"></div>
          </>
        )}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex items-center gap-2 font-bold justify-center text-sm text-white"
        )}
      >
        <span className="mr-2 font-bold contents">
          {isProgress ? (
            "がんばりタイム"
          ) : (
            <>
              <Coffee className="size-5" />
              ちょっと一息
            </>
          )}
        </span>
        <span className="tabular-nums">{formatTime(remainingSeconds)}</span>
      </div>
    </div>
  );
}
