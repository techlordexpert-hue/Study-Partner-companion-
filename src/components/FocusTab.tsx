import React, { useState, useEffect, useRef } from "react";
import { UserProfile, FocusSession } from "../types";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Flame,
  CheckCircle2,
  Headphones,
  Award,
  Zap,
  Info
} from "lucide-react";

interface FocusTabProps {
  userProfile: UserProfile;
  onLogFocusSession: (session: FocusSession) => void;
  isRunning: boolean;
  secondsElapsed: number;
  timerMode: "stopwatch" | "pomodoro";
  pomodoroTargetSeconds: number;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onStopTimer: () => void;
  onSetTimerMode: (mode: "stopwatch" | "pomodoro") => void;
  onSetPomodoroTargetSeconds: (secs: number) => void;
}

export const FocusTab: React.FC<FocusTabProps> = ({
  userProfile,
  onLogFocusSession,
  isRunning,
  secondsElapsed,
  timerMode,
  pomodoroTargetSeconds,
  onStartTimer,
  onPauseTimer,
  onStopTimer,
  onSetTimerMode,
  onSetPomodoroTargetSeconds,
}) => {
  // Voice Alert state
  const [voiceSpoken, setVoiceSpoken] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<"none" | "rain" | "lofi" | "whitenoise">("none");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Recent focus session log history
  const [sessionLogs, setSessionLogs] = useState<FocusSession[]>([
    {
      id: "fs-1",
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      durationMinutes: 45,
      mode: "stopwatch",
      notes: "Reviewed Lesson 1 & 2 slides",
    },
    {
      id: "fs-2",
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
      durationMinutes: 30,
      mode: "pomodoro",
      notes: "Solved 2025 Normalization Pasco",
    },
  ]);

  // Web Audio Synth Ref for Ambient Noise
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Voice Speech Synthesis Trigger Function with explicit Female Voice selection
  const speakVoiceAlert = () => {
    if (!userProfile.voiceAlertEnabled) return;

    try {
      if ("speechSynthesis" in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const messageText = "Please turn off Do Not Disturb mode or silence notifications for deep focus!";
        const utterance = new SpeechSynthesisUtterance(messageText);

        // Get available voices and pick a female voice
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          // Look for explicit female voices by name/lang keywords
          const femaleKeywords = ["female", "zira", "samantha", "victoria", "karen", "fiona", "eva", "veena", "google uk english female", "google us english", "siri"];
          const femaleVoice = voices.find((v) =>
            femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
          ) || voices.find((v) => v.name.toLowerCase().includes("en")) || voices[0];

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        }

        utterance.rate = 0.95; // Clear natural rate
        utterance.pitch = 1.25; // Slightly higher pitch to ensure a pleasant female tone
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
        setVoiceSpoken(true);
      }
    } catch (e) {
      console.warn("Speech synthesis error or not allowed:", e);
    }
  };

  // Handle Start Timer Click
  const handleStartTimer = () => {
    if (!isRunning) {
      speakVoiceAlert();
      onStartTimer();
    }
  };

  // Handle Pause Timer
  const handlePauseTimer = () => {
    onPauseTimer();
  };

  // Handle Reset/Stop Timer & Log Session
  const handleResetTimer = () => {
    onStopTimer();
  };

  // Format Time Display (HH:MM:SS or MM:SS)
  const formatTimeDisplay = () => {
    let currentSeconds = secondsElapsed;
    if (timerMode === "pomodoro") {
      currentSeconds = Math.max(0, pomodoroTargetSeconds - secondsElapsed);
    }

    const hours = Math.floor(currentSeconds / 3600);
    const minutes = Math.floor((currentSeconds % 3600) / 60);
    const seconds = currentSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Ambient Web Audio Synthesizer
  useEffect(() => {
    if (ambientSound === "none" || isMuted || !isRunning) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create Rain / White Noise Generator
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Filter for rain sound
      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === "rain" ? "lowpass" : "bandpass";
      filter.frequency.value = ambientSound === "rain" ? 800 : 1200;

      const gain = ctx.createGain();
      gain.gain.value = 0.05; // Gentle background volume

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn("Web audio error:", e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [ambientSound, isMuted, isRunning]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Timer className="w-4 h-4" />
            Focus Study Timer & Female Voice Assistant
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Deep Work & Learning Hours Tracker</h1>
          <p className="text-slate-600 text-sm mt-1">
            Tracks study hours with automatic female voice reminders to turn off Do Not Disturb mode and silence notifications.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500/20" />
          <div>
            <div className="text-lg font-extrabold text-slate-900">{userProfile.focusTimeMinutesTotal} mins</div>
            <div className="text-[11px] text-slate-600 font-medium">Total Focused Learning Time</div>
          </div>
        </div>
      </div>

      {/* Main Stopwatch Timer Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
        {/* Subtle Background Glow Ring */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 z-10">
          <button
            onClick={() => {
              onSetTimerMode("stopwatch");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timerMode === "stopwatch"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Continuous Stopwatch
          </button>

          <button
            onClick={() => {
              onSetTimerMode("pomodoro");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timerMode === "pomodoro"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            25-Min Pomodoro
          </button>
        </div>

        {/* Digital Clock Counter */}
        <div className="space-y-2 z-10">
          <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-slate-900">
            {formatTimeDisplay()}
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            {isRunning ? "Session Active — Learning in Progress" : "Ready to Start Study Session"}
          </p>
        </div>

        {/* Voice Alert Notification Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-md flex items-center gap-3 text-left z-10">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="text-xs text-amber-900">
            <span className="font-bold text-amber-950 block">Female Voice Alert Active:</span>
            When you click <strong className="text-slate-900">Start</strong>, a lady's voice instructs:
            <em className="text-slate-900 block font-medium mt-0.5">"Please turn off Do Not Disturb mode or silence notifications for deep focus!"</em>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 z-10">
          {!isRunning ? (
            <button
              onClick={handleStartTimer}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-extrabold px-8 py-4 rounded-2xl shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              START STUDY SESSION
            </button>
          ) : (
            <button
              onClick={handlePauseTimer}
              className="flex items-center gap-3 bg-amber-600 hover:bg-amber-500 text-white text-base font-extrabold px-8 py-4 rounded-2xl shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Pause className="w-6 h-6 fill-white" />
              PAUSE SESSION
            </button>
          )}

          <button
            onClick={handleResetTimer}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-4 rounded-2xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            title="Reset & Save Session"
          >
            <RotateCcw className="w-4 h-4" />
            Reset & Save
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="pt-4 border-t border-slate-100 w-full max-w-lg z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-indigo-600" />
              Ambient Focus Audio
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span>{isMuted ? "Muted" : "Sound On"}</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "none", label: "Silent" },
              { id: "rain", label: "Soft Rain" },
              { id: "lofi", label: "Lo-Fi Beats" },
              { id: "whitenoise", label: "White Noise" },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  ambientSound === snd.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {snd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Focus History Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Award className="w-5 h-5 text-indigo-600" />
            Focus Session History
          </div>
          <span className="text-xs text-slate-500 font-semibold">{sessionLogs.length} Sessions Logged</span>
        </div>

        <div className="space-y-3">
          {sessionLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{log.durationMinutes} Minutes Focused Learning</div>
                  <div className="text-xs text-slate-600 mt-0.5">{log.notes || "DBMS Course Study Session"}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-indigo-700 uppercase">{log.mode}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{log.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
