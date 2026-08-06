import React, { useState } from "react";
import { GraduationCap, Lock, Building, User, LogIn, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthGateProps {
  onLoginSuccess?: (user: { name: string; institution: string }) => void;
  onAuthenticated?: (user: { name: string; institution: string }) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess, onAuthenticated }) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true);
  
  // Form fields
  const [fullname, setFullname] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const callback = onLoginSuccess || onAuthenticated;

    if (!isRegisterMode) {
      // In Sign In mode
      let targetName = fullname.trim();
      let targetSchool = institution.trim();

      try {
        const saved = localStorage.getItem("study_partner_auth_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) targetName = parsed.name;
          if (parsed.institution) targetSchool = parsed.institution;
        }
      } catch (err) {}

      if (!targetName) targetName = fullname.trim() || "Student User";
      if (!targetSchool) targetSchool = institution.trim() || "University of Education, Winneba (UEW)";

      if (callback) {
        callback({
          name: targetName,
          institution: targetSchool,
        });
      }
      return;
    }

    if (!fullname.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!institution.trim()) {
      setErrorMsg("Please enter the name of your institution.");
      return;
    }

    // Save registered user info into localStorage
    const authData = {
      name: fullname.trim(),
      institution: institution.trim(),
      password,
      registeredAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("study_partner_auth_user", JSON.stringify(authData));
    } catch (e) {
      console.warn("Failed to persist auth data to localStorage", e);
    }

    if (callback) {
      callback({
        name: fullname.trim(),
        institution: institution.trim(),
      });
    }
  };

  const handleInstantGuestAccess = () => {
    const callback = onLoginSuccess || onAuthenticated;
    if (callback) {
      callback({
        name: "Kofi Ansah",
        institution: "University of Education, Winneba (UEW)",
      });
    }
  };

  const handleQuickDemoFill = (school: string) => {
    setInstitution(school);
    if (!fullname) setFullname("Kofi Ansah");
    if (!password) setPassword("study123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-3 border border-white/20 shadow-inner">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Study Partner</h1>
          <p className="text-xs text-indigo-100 font-medium mt-1">
            Smart Learning Platform & Exam Assistant
          </p>

          <div className="mt-4 flex justify-center gap-1 bg-black/20 p-1 rounded-xl text-xs font-semibold max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setErrorMsg(""); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                isRegisterMode ? "bg-white text-indigo-700 shadow-xs" : "text-indigo-100 hover:text-white"
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => { setIsRegisterMode(false); setErrorMsg(""); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                !isRegisterMode ? "bg-white text-indigo-700 shadow-xs" : "text-indigo-100 hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi Ansah"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name of Institution <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Education, Winneba (UEW)"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>
              {/* Quick Institution Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-slate-500 self-center font-medium">Quick select:</span>
                {[
                  "University of Education, Winneba (UEW)",
                  "KNUST",
                  "University of Ghana (UG)",
                  "UCC",
                  "UPSA"
                ].map((sch) => (
                  <button
                    key={sch}
                    type="button"
                    onClick={() => handleQuickDemoFill(sch)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors"
                  >
                    {sch.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account & Access Site
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to Study Partner
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleInstantGuestAccess}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Instant Demo Guest Access
            </button>
          </form>

          {/* Benefits List */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Included in Study Partner
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>PowerPoint Widescreen Lecture Slides</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Past Questions Solver & Score Tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Gemini AI Tutor Assistant & Working YouTube Links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Document Uploads (PPTX, PDF, Word DOCX)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
