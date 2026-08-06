import React from "react";
import { TabType } from "../types";
import { Timer, Play, Pause, Square, ExternalLink, Flame } from "lucide-react";

interface FocusTimerTopBarProps {
  isRunning: boolean;
  secondsElapsed: number;
  timerMode: "stopwatch" | "pomodoro";
  pomodoroTargetSeconds: number;
  onToggleTimer: () => void;
  onStopTimer: () => void;
  onNavigateToFocus: () => void;
  activeTab: TabType;
}

export const FocusTimerTopBar: React.FC<FocusTimerTopBarProps> = ({
  isRunning,
  secondsElapsed,
  timerMode,
  pomodoroTargetSeconds,
  onToggleTimer,
  onStopTimer,
  onNavigateToFocus,
  activeTab,
}) => {
  // Only render if timer is actively running OR has accumulated seconds > 0
  if (!isRunning && secondsElapsed === 0) {
    return null;
  }

  // Calculate formatted time
  let displaySeconds = secondsElapsed;
  if (timerMode === "pomodoro") {
    displaySeconds = Math.max(0, pomodoroTargetSeconds - secondsElapsed);
  }

  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const secs = displaySeconds % 60;

  const formattedTime =
    hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="bg-slate-900 text-white border-b border-indigo-500/30 px-4 py-2.5 shadow-md sticky top-16 z-30 font-sans animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Timer Indicator & Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 px-3 py-1 rounded-xl">
            <span className="relative flex h-2.5 w-2.5">
              {isRunning && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isRunning ? "bg-emerald-500" : "bg-amber-400"
                }`}
              ></span>
            </span>
            <Timer className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-sm font-bold tracking-wider text-emerald-400">
              {formattedTime}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              {timerMode === "pomodoro" ? "Pomodoro Countdown" : "Focus Stopwatch"}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              {isRunning ? "Session in Progress" : "Timer Paused"}
            </span>
          </div>
        </div>

        {/* Right: Actions (Pause/Resume, Stop Timer, Go to Focus Tab) */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={onToggleTimer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold shadow-xs transition-all cursor-pointer ${
              isRunning
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            )}
          </button>

          {/* Stop & Log Session Button */}
          <button
            onClick={onStopTimer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs transition-all cursor-pointer"
            title="Stop timer and log study session"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop & Save Session</span>
          </button>

          {/* Navigate to Focus Tab */}
          {activeTab !== "focus" && (
            <button
              onClick={onNavigateToFocus}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors cursor-pointer ml-1"
            >
              <span>Focus Tab</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
