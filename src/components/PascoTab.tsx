import React, { useState } from "react";
import { PastQuestion, UserProfile, QuizAttempt, CustomUploadedPasco } from "../types";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  BarChart3,
  Sparkles,
  Upload,
  ChevronRight,
  BookOpen,
  Loader2,
  X,
  Zap,
  Filter,
  CheckCircle2,
  Plus,
  FileUp
} from "lucide-react";

interface PascoTabProps {
  pastQuestions: PastQuestion[];
  userProfile: UserProfile;
  onRecordQuizAttempt: (attempt: QuizAttempt) => void;
  onAddCustomPasco: (customPasco: CustomUploadedPasco) => void;
}

export const PascoTab: React.FC<PascoTabProps> = ({
  pastQuestions,
  userProfile,
  onRecordQuizAttempt,
  onAddCustomPasco,
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("All");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("All");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  // AI Tutor Explanation Modal state
  const [aiExplanationModal, setAiExplanationModal] = useState<string | null>(null);
  const [isFetchingAiExplanation, setIsFetchingAiExplanation] = useState<boolean>(false);

  // Custom Pasco Upload Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadText, setUploadText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Combine static past questions with user uploaded questions
  const allQuestions = [
    ...pastQuestions,
    ...userProfile.customPascos.flatMap((cp) => cp.questions),
  ];

  // Filter Questions
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesYear = selectedYearFilter === "All" || q.year === selectedYearFilter;
    const matchesTopic = selectedTopicFilter === "All" || q.topic === selectedTopicFilter;
    return matchesYear && matchesTopic;
  });

  const activeQuestion: PastQuestion | undefined = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Calculate Quiz Score Stats
  const totalAttempted = userProfile.quizHistory.length;
  const correctCount = userProfile.quizHistory.filter((q) => q.isCorrect).length;
  const scorePercentage = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  // Handle MCQ Answer Submission
  const handleSubmitAnswer = (option: string) => {
    if (isAnswerSubmitted || !activeQuestion) return;
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    const isCorrect = option === activeQuestion.correctAnswer;
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      questionId: activeQuestion.id,
      userAnswer: option,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    onRecordQuizAttempt(attempt);
  };

  // Handle AI Explanation Fetching
  const handleFetchAiExplanation = async () => {
    if (!activeQuestion) return;
    setIsFetchingAiExplanation(true);
    setAiExplanationModal(null);

    try {
      const response = await fetch("/api/explain-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion.questionText,
          userAnswer: selectedOption || "Not answered",
          correctAnswer: activeQuestion.correctAnswer || "See explanation below",
          topic: activeQuestion.topic,
        }),
      });

      const data = await response.json();
      setAiExplanationModal(data.explanation || "No explanation returned.");
    } catch (err) {
      console.error(err);
      setAiExplanationModal("Failed to fetch AI tutor explanation.");
    } finally {
      setIsFetchingAiExplanation(false);
    }
  };

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadText(event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  // Handle Custom Pasco Upload
  const handleUploadCustomPasco = async () => {
    if (!uploadTitle.trim()) return;
    setIsUploading(true);

    try {
      let fileBase64 = "";
      let fileMimeType = "";

      if (selectedFile) {
        fileMimeType = selectedFile.type || "application/pdf";
        if (selectedFile.name.endsWith(".pptx")) fileMimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        else if (selectedFile.name.endsWith(".ppt")) fileMimeType = "application/vnd.ms-powerpoint";
        else if (selectedFile.name.endsWith(".pdf")) fileMimeType = "application/pdf";
        else if (selectedFile.name.endsWith(".docx")) fileMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (selectedFile.name.endsWith(".txt") || selectedFile.name.endsWith(".md")) fileMimeType = "text/plain";

        fileBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const res = e.target?.result as string;
            if (res && res.includes("base64,")) resolve(res.split("base64,")[1]);
            else resolve("");
          };
          reader.onerror = () => resolve("");
          reader.readAsDataURL(selectedFile);
        });
      }

      const response = await fetch("/api/parse-past-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle,
          rawText: uploadText,
          fileBase64,
          fileMimeType,
        }),
      });

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions generated");
      }

      const parsedQuestions: PastQuestion[] = (data.questions || []).map((q: any, idx: number) => ({
        id: `custom-q-${Date.now()}-${idx}`,
        year: "Uploaded Quiz",
        courseCode: "Course Material",
        courseTitle: uploadTitle,
        section: "Section A (MCQ)",
        questionNumber: idx + 1,
        questionText: q.question || q.questionText,
        options: q.options && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: q.answer || q.correctAnswer || (q.options ? q.options[0] : "Option A"),
        explanation: q.explanation || `Key rule for ${uploadTitle}`,
        topic: q.topic || uploadTitle,
      }));

      const newCustomPasco: CustomUploadedPasco = {
        id: `custom-pasco-${Date.now()}`,
        title: uploadTitle,
        uploadedAt: new Date().toLocaleDateString(),
        questions: parsedQuestions,
      };

      onAddCustomPasco(newCustomPasco);
      setSelectedYearFilter("Uploaded Quiz");
      setIsUploadModalOpen(false);
      setUploadTitle("");
      setUploadText("");
      setSelectedFile(null);
      setCurrentQuestionIndex(0);
      setIsAnswerSubmitted(false);
      setSelectedOption(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Unable to parse document into quiz questions. Please ensure the file is valid or paste text directly.");
    } finally {
      setIsUploading(false);
    }
  };

  const nextQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setCurrentQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const prevQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setCurrentQuestionIndex((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner & Score Analytics Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              Interactive Past Questions (Pasco) Hub
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Solve Past Questions & Track Your Score</h1>
            <p className="text-slate-600 text-sm mt-1">
              Test your mastery on real UEW ICTE 242 / ICTW 242 final exam questions with instant feedback and AI tutoring.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Your Own Past Questions
          </button>
        </div>

        {/* Live Score Tracker Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{scorePercentage}%</div>
              <div className="text-[11px] text-slate-600 font-medium">Overall Accuracy</div>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-700">{correctCount}</div>
              <div className="text-[11px] text-slate-600 font-medium">Correct Answers</div>
            </div>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">{totalAttempted}</div>
              <div className="text-[11px] text-slate-600 font-medium">Questions Attempted</div>
            </div>
          </div>

          <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-purple-900">{allQuestions.length}</div>
              <div className="text-[11px] text-slate-600 font-medium">Questions Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filter Exam Year:
          </div>
          {["All", "Uploaded Quiz", "2025 (Sir John)", "2023/2024", "2021/2022", "2020/2021"].map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYearFilter(year);
                setCurrentQuestionIndex(0);
                setIsAnswerSubmitted(false);
                setSelectedOption(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedYearFilter === year
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
        </div>
      </div>

      {/* Main Interactive Question Viewer */}
      {activeQuestion ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {activeQuestion.year}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                {activeQuestion.section}
              </span>
              <span className="text-xs text-indigo-600 font-semibold">{activeQuestion.topic}</span>
            </div>

            <button
              onClick={handleFetchAiExplanation}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Ask AI Tutor Explanation
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
              Q{activeQuestion.questionNumber}: {activeQuestion.questionText}
            </h2>

            {/* If Question includes a Table Context */}
            {activeQuestion.tableContext && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 my-4 shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-slate-100 text-indigo-900 uppercase font-bold text-[11px]">
                    <tr>
                      {activeQuestion.tableContext.headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 border-b border-slate-200">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-mono">
                    {activeQuestion.tableContext.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Options List (for MCQs) */}
          {activeQuestion.options && activeQuestion.options.length > 0 && (
            <div className="space-y-3 pt-2">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === activeQuestion.correctAnswer;
                
                let optionStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100";
                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = "bg-rose-50 border-rose-500 text-rose-900 font-medium";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSubmitAnswer(option)}
                    className={`w-full text-left p-4 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && (
                      <div>
                        {isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                        {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Post-Answer Explanation Card */}
          {isAnswerSubmitted && (
            <div className="bg-indigo-50/80 p-5 rounded-xl border border-indigo-100 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Explanation & Key Concept
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Sample Solution Markdown for Section C Problem Questions */}
          {activeQuestion.sampleSolutionMarkdown && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 mt-4">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Complete Problem Solution & MySQL Query Code
              </div>
              <div className="font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {activeQuestion.sampleSolutionMarkdown}
              </div>
            </div>
          )}

          {/* Question Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={prevQuestion}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
          No past questions found for the selected filter.
        </div>
      )}

      {/* AI Tutor Explanation Modal */}
      {isFetchingAiExplanation || aiExplanationModal ? (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                AI Pasco Tutor Breakdown
              </div>
              <button
                onClick={() => setAiExplanationModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isFetchingAiExplanation ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs font-medium">Analyzing question logic & generating exam tips...</p>
              </div>
            ) : (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {aiExplanationModal}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Upload Custom Pasco Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Upload className="w-5 h-5" />
                Upload Your Own Past Questions
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exam Title / Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026 Midterm Past Questions"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Document File (PDF, Word, PPT, Text)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-5 text-center bg-slate-50">
                  <FileUp className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                  <p className="text-xs text-slate-600 font-medium mb-1">
                    {selectedFile ? (
                      <span className="font-bold text-indigo-700">{selectedFile.name}</span>
                    ) : (
                      "Choose document file containing past questions"
                    )}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Paste Past Questions Text
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste past questions text here..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadCustomPasco}
                disabled={isUploading || !uploadTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing Questions...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Convert to Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
