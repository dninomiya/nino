"use client";

import { useEffect, useState } from "react";

export function Pomodoro() {
  const [time, setTime] = useState(25 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10">
      <div
        style={{ transform: `scale(${time / (25 * 60)})` }}
        className="size-full transition ease-linear duration-1000 bg-lime-600"
      ></div>
    </div>
  );
}
