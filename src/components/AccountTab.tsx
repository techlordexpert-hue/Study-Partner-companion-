import React, { useState } from "react";
import { UserProfile, CustomUploadedSlide, CustomUploadedPasco } from "../types";
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  HelpCircle,
  Timer,
  Settings,
  Trash2,
  Edit2,
  Save,
  Bell,
  Lock,
  Building,
  KeyRound,
  LogOut
} from "lucide-react";

interface AccountTabProps {
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onDeleteCustomSlide: (slideId: string) => void;
  onDeleteCustomPasco: (pascoId: string) => void;
  onLogout?: () => void;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  userProfile,
  onUpdateProfile,
  onDeleteCustomSlide,
  onDeleteCustomPasco,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [indexNumber, setIndexNumber] = useState<string>(userProfile.indexNumber || "2026/001");
  const [institution, setInstitution] = useState<string>(userProfile.institution);
  const [program, setProgram] = useState<string>(userProfile.program || "B.Sc. Information Technology");
  const [password, setPassword] = useState<string>("••••••••");
  const [targetGrade, setTargetGrade] = useState<string>(userProfile.targetGrade || "A (Grade Point 4.0)");

  const [voiceAlert, setVoiceAlert] = useState<boolean>(userProfile.voiceAlertEnabled);

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      indexNumber,
      institution,
      program,
      targetGrade,
      voiceAlertEnabled: voiceAlert,
    });
    setIsEditing(false);
  };

  const totalAttempted = userProfile.quizHistory.length;
  const correctCount = userProfile.quizHistory.filter((q) => q.isCorrect).length;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Student Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-indigo-500/20">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{userProfile.name}</h1>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {userProfile.institution}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1">
                {userProfile.program || "IT Student"} — Member of Study Partner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isEditing) handleSaveProfile();
                else setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Account Info
                </>
              )}
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Editable Form or Readonly View */}
        {isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name of Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Index / Student ID</label>
              <input
                type="text"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Update Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Institution</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1 truncate">{userProfile.institution}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Completed Slides</div>
              <div className="text-sm font-extrabold text-indigo-600 mt-1">
                {userProfile.completedSlideIds.length} Slides
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Pasco Quiz Accuracy</div>
              <div className="text-sm font-extrabold text-purple-600 mt-1">{accuracy}%</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Focus Learning Hours</div>
              <div className="text-sm font-extrabold text-amber-600 mt-1">
                {Math.round(userProfile.focusTimeMinutesTotal / 60 * 10) / 10} Hours
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences & Voice Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Settings className="w-5 h-5 text-indigo-600" />
            Study Partner Preferences & Voice Settings
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Lady's Voice Focus Alert</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Automatically speaks: "Please turn off Do Not Disturb mode or silence notifications for deep focus!" in a lady's voice.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const updated = !voiceAlert;
              setVoiceAlert(updated);
              onUpdateProfile({ voiceAlertEnabled: updated });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              voiceAlert
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {voiceAlert ? "Lady Voice Enabled" : "Muted"}
          </button>
        </div>
      </div>

      {/* User Custom Uploads Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Custom Uploaded Slides List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              My Uploaded Lecture Slides
            </div>
            <span className="text-xs text-indigo-600 font-semibold">
              {userProfile.customSlides.length} Uploaded
            </span>
          </div>

          <div className="space-y-3">
            {userProfile.customSlides.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No custom slides uploaded yet. You can upload custom slides in the Library tab.
              </div>
            ) : (
              userProfile.customSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{slide.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {slide.slides.length} parsed slides • {slide.uploadedAt}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteCustomSlide(slide.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete custom slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Custom Uploaded Past Questions List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              My Uploaded Past Questions
            </div>
            <span className="text-xs text-indigo-600 font-semibold">
              {userProfile.customPascos.length} Uploaded
            </span>
          </div>

          <div className="space-y-3">
            {userProfile.customPascos.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No custom past questions uploaded yet. You can upload past questions in the Pasco tab.
              </div>
            ) : (
              userProfile.customPascos.map((pasco) => (
                <div
                  key={pasco.id}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">{pasco.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {pasco.questions.length} questions • {pasco.uploadedAt}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteCustomPasco(pasco.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete custom pasco"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
