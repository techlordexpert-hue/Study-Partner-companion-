import React, { useState, useEffect } from "react";
import { TabType, UserProfile, QuizAttempt, FocusSession, CustomUploadedSlide, CustomUploadedPasco } from "./types";
import { lectureModules } from "./data/slidesData";
import { pastQuestionsData } from "./data/pastQuestionsData";
import { AuthGate } from "./components/AuthGate";
import { Navbar } from "./components/Navbar";
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

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("library");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
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

  const handleAddCustomSlide = (customSlide: CustomUploadedSlide) => {
    setUserProfile((prev) => ({
      ...prev,
      customSlides: [customSlide, ...prev.customSlides],
    }));
  };

  const handleAddCustomPasco = (customPasco: CustomUploadedPasco) => {
    setUserProfile((prev) => ({
      ...prev,
      customPascos: [customPasco, ...prev.customPascos],
    }));
  };

  const handleDeleteCustomSlide = (slideId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      customSlides: prev.customSlides.filter((s) => s.id !== slideId),
    }));
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

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === "library" && (
          <LibraryTab
            modules={lectureModules}
            userProfile={userProfile}
            onToggleCompleteSlide={handleToggleCompleteSlide}
            onAddCustomSlide={handleAddCustomSlide}
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
