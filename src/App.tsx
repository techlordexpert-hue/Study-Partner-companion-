import React, { useState, useEffect } from "react";
import {
  TabType,
  UserProfile,
  QuizAttempt,
  FocusSession,
  CustomUploadedSlide,
  CustomUploadedPasco,
  Course,
  LectureModule
} from "./types";
import { lectureModules } from "./data/slidesData";
import { pastQuestionsData } from "./data/pastQuestionsData";
import { AuthGate } from "./components/AuthGate";
import { Navbar } from "./components/Navbar";
import { FocusTimerTopBar } from "./components/FocusTimerTopBar";
import { LibraryTab } from "./components/LibraryTab";
import { PascoTab } from "./components/PascoTab";
import { FocusTab } from "./components/FocusTab";
import { AccountTab } from "./components/AccountTab";

const INITIAL_USER_PROFILE: UserProfile = {
  name: "",
  indexNumber: "",
  institution: "",
  program: "B.Sc. Information Technology",
  targetGrade: "First Class (A)",
  avatarSeed: "student",
  completedSlideIds: ["l1-s1", "l1-s2"],
  focusTimeMinutesTotal: 60,
  soundEnabled: true,
  voiceAlertEnabled: true,
  customSlides: [],
  customPascos: [],
  savedNotes: {},
  quizHistory: [],
};

const DEFAULT_COURSES: Course[] = [
  {
    id: "course-dbms",
    code: "ICTE 242",
    title: "Database Management Systems (DBMS)",
    description: "Complete lecture slides covering database architecture, relational models, ERD, SQL, and normalization.",
    isCustom: false,
    modules: lectureModules,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("library");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Global Focus Timer State
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [timerSecondsElapsed, setTimerSecondsElapsed] = useState<number>(0);
  const [timerMode, setTimerMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [pomodoroTargetSeconds, setPomodoroTargetSeconds] = useState<number>(25 * 60);

  // Global Timer Ticking Interval
  useEffect(() => {
    let interval: any = null;
    if (timerIsRunning) {
      interval = setInterval(() => {
        setTimerSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsRunning]);

  // Load user profile & session from localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("study_partner_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setIsAuthenticated(true);
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load user profile from localStorage", e);
    }
    return INITIAL_USER_PROFILE;
  });

  // Courses state (Course-by-Course structure)
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem("study_partner_courses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load courses from localStorage", e);
    }
    return DEFAULT_COURSES;
  });

  // Save profile to localStorage on change
  useEffect(() => {
    try {
      if (userProfile.name) {
        localStorage.setItem("study_partner_user_profile", JSON.stringify(userProfile));
      }
    } catch (e) {
      console.warn("Could not save user profile to localStorage", e);
    }
  }, [userProfile]);

  // Save courses to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("study_partner_courses", JSON.stringify(courses));
    } catch (e) {
      console.warn("Could not save courses to localStorage", e);
    }
  }, [courses]);

  const handleAuthenticated = (profileData: { name: string; institution: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      name: profileData.name,
      institution: profileData.institution,
    }));
    setIsAuthenticated(true);
  };

  const handleToggleCompleteSlide = (slideId: string) => {
    setUserProfile((prev) => {
      const exists = prev.completedSlideIds.includes(slideId);
      const updatedIds = exists
        ? prev.completedSlideIds.filter((id) => id !== slideId)
        : [...prev.completedSlideIds, slideId];
      return { ...prev, completedSlideIds: updatedIds };
    });
  };

  const handleRecordQuizAttempt = (attempt: QuizAttempt) => {
    setUserProfile((prev) => ({
      ...prev,
      quizHistory: [attempt, ...prev.quizHistory],
    }));
  };

  const handleLogFocusSession = (session: FocusSession) => {
    setUserProfile((prev) => ({
      ...prev,
      focusTimeMinutesTotal: prev.focusTimeMinutesTotal + session.durationMinutes,
    }));
  };

  // Timer Control Handlers
  const handleStartTimer = () => setTimerIsRunning(true);
  const handlePauseTimer = () => setTimerIsRunning(false);
  const handleStopTimer = () => {
    if (timerSecondsElapsed >= 60) {
      const minutesSpent = Math.round(timerSecondsElapsed / 60);
      handleLogFocusSession({
        id: `fs-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        durationMinutes: minutesSpent,
        mode: timerMode,
        notes: `Studied for ${minutesSpent} minutes in Focus Mode`,
      });
    }
    setTimerIsRunning(false);
    setTimerSecondsElapsed(0);
  };

  // Course Management Handlers
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleAddSlideDeckToCourse = (courseId: string, customSlide: CustomUploadedSlide) => {
    const newModule: LectureModule = {
      id: customSlide.id,
      code: "Uploaded Presentation",
      title: customSlide.title,
      subtitle: `Uploaded on ${customSlide.uploadedAt}`,
      description: `User uploaded PowerPoint slides / lecture notes`,
      iconName: "Presentation",
      slides: customSlide.slides,
    };

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            modules: [newModule, ...c.modules],
          };
        }
        return c;
      })
    );
  };

  const handleDeleteSlideDeck = (courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            modules: c.modules.filter((m) => m.id !== moduleId),
          };
        }
        return c;
      })
    );
  };

  const handleAddCustomPasco = (customPasco: CustomUploadedPasco) => {
    setUserProfile((prev) => ({
      ...prev,
      customPascos: [customPasco, ...prev.customPascos],
    }));
  };

  const handleDeleteCustomSlide = (slideId: string) => {
    // Search across all courses to remove
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        modules: c.modules.filter((m) => m.id !== slideId),
      }))
    );
  };

  const handleDeleteCustomPasco = (pascoId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      customPascos: prev.customPascos.filter((p) => p.id !== pascoId),
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveNote = (slideId: string, noteText: string) => {
    setUserProfile((prev) => ({
      ...prev,
      savedNotes: { ...prev.savedNotes, [slideId]: noteText },
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("study_partner_user_profile");
  };

  // Require Account Creation / Login Gate if not authenticated
  if (!isAuthenticated) {
    return <AuthGate onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Sticky Top Focus Timer Bar (Visible across ALL tabs when active/paused) */}
      <FocusTimerTopBar
        isRunning={timerIsRunning}
        secondsElapsed={timerSecondsElapsed}
        timerMode={timerMode}
        pomodoroTargetSeconds={pomodoroTargetSeconds}
        onToggleTimer={timerIsRunning ? handlePauseTimer : handleStartTimer}
        onStopTimer={handleStopTimer}
        onNavigateToFocus={() => setActiveTab("focus")}
        activeTab={activeTab}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === "library" && (
          <LibraryTab
            courses={courses}
            userProfile={userProfile}
            onToggleCompleteSlide={handleToggleCompleteSlide}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddSlideDeckToCourse={handleAddSlideDeckToCourse}
            onDeleteSlideDeck={handleDeleteSlideDeck}
            onSaveNote={handleSaveNote}
          />
        )}

        {activeTab === "pasco" && (
          <PascoTab
            pastQuestions={pastQuestionsData}
            userProfile={userProfile}
            onRecordQuizAttempt={handleRecordQuizAttempt}
            onAddCustomPasco={handleAddCustomPasco}
          />
        )}

        {activeTab === "focus" && (
          <FocusTab
            userProfile={userProfile}
            onLogFocusSession={handleLogFocusSession}
            isRunning={timerIsRunning}
            secondsElapsed={timerSecondsElapsed}
            timerMode={timerMode}
            pomodoroTargetSeconds={pomodoroTargetSeconds}
            onStartTimer={handleStartTimer}
            onPauseTimer={handlePauseTimer}
            onStopTimer={handleStopTimer}
            onSetTimerMode={setTimerMode}
            onSetPomodoroTargetSeconds={setPomodoroTargetSeconds}
          />
        )}

        {activeTab === "account" && (
          <AccountTab
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteCustomSlide={handleDeleteCustomSlide}
            onDeleteCustomPasco={handleDeleteCustomPasco}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-800">Study Partner</span> — Prepared for Course Learning
          </div>
          <div>
            Powered by Gemini AI Research & Interactive Learning Tools
          </div>
        </div>
      </footer>
    </div>
  );
}
