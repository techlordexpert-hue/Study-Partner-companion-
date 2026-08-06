import React from "react";
import { TabType, UserProfile } from "../types";
import { BookOpen, HelpCircle, Timer, User, Sparkles, Database, Flame, LogOut } from "lucide-react";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userProfile: UserProfile;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onLogout,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "library", label: "Library (Slides)", icon: BookOpen },
    { id: "pasco", label: "Pasco (Past Questions)", icon: HelpCircle },
    { id: "focus", label: "Focus Mode", icon: Timer },
    { id: "account", label: "Account & Profile", icon: User },
  ];

  const totalAttempted = userProfile.quizHistory.length;
  const correctCount = userProfile.quizHistory.filter((q) => q.isCorrect).length;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab("library")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Study Partner
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {userProfile.institution ? userProfile.institution.split(" ")[0] : "Student"}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">PowerPoint Slides & Exam Hub</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  {tab.label}
                  {tab.id === "focus" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Quick Stats Header Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-amber-600 font-semibold" title="Focus Time Logged">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>{userProfile.focusTimeMinutesTotal} min</span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div className="flex items-center gap-1 text-indigo-700 font-medium" title="Pasco Accuracy Rate">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{accuracy}% Acc ({correctCount}/{totalAttempted})</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("account")}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                title={`${userProfile.name} (${userProfile.institution})`}
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Tab Nav */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-200 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[75px] flex flex-col items-center gap-1 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
