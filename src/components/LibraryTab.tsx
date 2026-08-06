import React, { useState } from "react";
import { LectureModule, Slide, UserProfile, CustomUploadedSlide } from "../types";
import { PowerPointSlideRenderer } from "./PowerPointSlideRenderer";
import {
  BookOpen,
  Search,
  Sparkles,
  Upload,
  CheckCircle2,
  Circle,
  Plus,
  Loader2,
  X,
  Send,
  FileText,
  FileUp,
  Presentation
} from "lucide-react";

interface LibraryTabProps {
  modules: LectureModule[];
  userProfile: UserProfile;
  onToggleCompleteSlide: (slideId: string) => void;
  onAddCustomSlide: (customSlide: CustomUploadedSlide) => void;
  onSaveNote: (slideId: string, noteText: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  modules,
  userProfile,
  onToggleCompleteSlide,
  onAddCustomSlide,
  onSaveNote,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  
  // Research Assistant Modal state
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);
  const [researchTopic, setResearchTopic] = useState<string>("");
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  // Custom Document Upload Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadText, setUploadText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Select Current Module or Custom Module
  const allModulesList = [
    ...modules,
    ...userProfile.customSlides.map((cs) => ({
      id: cs.id,
      code: "Custom Upload",
      title: cs.title,
      subtitle: `Uploaded on ${cs.uploadedAt}`,
      description: "User uploaded study material",
      iconName: "Upload",
      slides: cs.slides,
    })),
  ];

  const currentModule = allModulesList.find((m) => m.id === selectedModuleId) || allModulesList[0];

  // Filter slides by search query if any
  const filteredSlides = currentModule.slides.filter((slide) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      slide.title.toLowerCase().includes(q) ||
      slide.textContent.toLowerCase().includes(q) ||
      slide.briefExplanation.toLowerCase().includes(q)
    );
  });

  const activeSlide: Slide | undefined = filteredSlides[currentSlideIndex] || filteredSlides[0];

  // Handle Research Call
  const handleRunResearch = async (topicToResearch?: string, contextText?: string) => {
    const topic = topicToResearch || researchTopic || activeSlide?.title || "Database Management System";
    setResearchTopic(topic);
    setIsResearchModalOpen(true);
    setIsResearching(true);
    setResearchResult(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          context: contextText || activeSlide?.textContent,
        }),
      });
      const data = await response.json();
      setResearchResult(data.result || "Research returned no data.");
    } catch (err) {
      console.error(err);
      setResearchResult("Failed to fetch research from AI assistant.");
    } finally {
      setIsResearching(false);
    }
  };

  // Handle Document File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        // Strip extension for title
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setUploadTitle(cleanName);
      }

      // Read text content directly if .txt or .md
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

  // Handle Custom Slide Upload from File or Text
  const handleUploadCustomSlide = async () => {
    if (!uploadTitle.trim()) return;
    setIsUploading(true);

    try {
      let rawContentToParse = uploadText;

      // If a file was selected and text wasn't extracted yet, read it
      if (selectedFile && !rawContentToParse) {
        const reader = new FileReader();
        rawContentToParse = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const res = e.target?.result;
            if (typeof res === "string") {
              resolve(res);
            } else if (res instanceof ArrayBuffer) {
              // Convert binary buffer to text string approximation
              const dec = new TextDecoder("utf-8", { fatal: false });
              resolve(dec.decode(res));
            } else {
              resolve(`Document uploaded: ${selectedFile.name}`);
            }
          };
          reader.readAsText(selectedFile);
        });
      }

      if (!rawContentToParse.trim()) {
        rawContentToParse = `Uploaded Document: ${uploadTitle}\nKey concepts from lecture file ${selectedFile?.name || "slides"}.`;
      }

      const response = await fetch("/api/parse-slide-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle,
          rawText: rawContentToParse,
        }),
      });

      const data = await response.json();
      const parsedSlides: Slide[] = (data.slides || []).map((s: any, idx: number) => ({
        id: `custom-${Date.now()}-${idx}`,
        slideNumber: idx + 1,
        title: s.title || `Slide ${idx + 1}`,
        textContent: s.text || rawContentToParse,
        briefExplanation: s.explanation || "User uploaded slide notes.",
        youtubeTutorialUrl: `https://www.youtube-nocookie.com/embed/cz3WRR21vK4`,
        youtubeQuery: s.youtubeQuery || `${uploadTitle} database tutorial`,
        researchTopics: [uploadTitle],
      }));

      const newCustomSlide: CustomUploadedSlide = {
        id: `custom-mod-${Date.now()}`,
        title: uploadTitle,
        uploadedAt: new Date().toLocaleDateString(),
        slides: parsedSlides,
      };

      onAddCustomSlide(newCustomSlide);
      setSelectedModuleId(newCustomSlide.id);
      setIsUploadModalOpen(false);
      setUploadTitle("");
      setUploadText("");
      setSelectedFile(null);
      setCurrentSlideIndex(0);
    } catch (err) {
      console.error("Custom slide upload error:", err);
      alert("Error parsing uploaded document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isCompleted = activeSlide ? userProfile.completedSlideIds.includes(activeSlide.id) : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Banner & Module Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            PowerPoint Lecture Slides & AI Research
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">PowerPoint Deck Repository</h1>
          <p className="text-slate-600 text-sm mt-1">
            Browse formatted PowerPoint slides with real tables, bolding, video tutorials, and Gemini AI research tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload PPT, PDF or Word Document
          </button>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {allModulesList.map((m) => {
          const isSelected = m.id === selectedModuleId;
          const completedCount = m.slides.filter((s) => userProfile.completedSlideIds.includes(s.id)).length;
          return (
            <button
              key={m.id}
              onClick={() => {
                setSelectedModuleId(m.id);
                setCurrentSlideIndex(0);
              }}
              className={`flex flex-col text-left px-4 py-3 rounded-xl border transition-all min-w-[220px] cursor-pointer ${
                isSelected
                  ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 text-slate-900 shadow-md"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 mb-0.5">
                {m.code}
              </span>
              <span className="text-sm font-bold truncate text-slate-900">{m.title}</span>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                <span>{m.slides.length} Slides</span>
                <span className="text-emerald-600 font-semibold">{completedCount}/{m.slides.length} done</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Left Slide Index & Right Full Slide Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Slide Navigation List & Search */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs h-fit">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search slide topics or keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentSlideIndex(0);
              }}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>SLIDES DECK ({filteredSlides.length})</span>
            <span className="text-[10px] text-indigo-600">Click to Present</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredSlides.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">No slides matched your search.</div>
            ) : (
              filteredSlides.map((slide, idx) => {
                const isCurrent = idx === currentSlideIndex;
                const isDone = userProfile.completedSlideIds.includes(slide.id);

                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? "bg-indigo-50 border-indigo-500 text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompleteSlide(slide.id);
                      }}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title={isDone ? "Mark as incomplete" : "Mark as completed"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">
                          Slide {slide.slideNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">
                            Presenting
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold truncate text-slate-900 mt-0.5">{slide.title.replace(/[*#]/g, "")}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Panel: PowerPoint Slide Renderer */}
        <div className="lg:col-span-8 space-y-6">
          {activeSlide ? (
            <PowerPointSlideRenderer
              slide={activeSlide}
              currentSlideIndex={currentSlideIndex}
              totalSlides={filteredSlides.length}
              moduleCode={currentModule.code}
              moduleTitle={currentModule.title}
              onPrevSlide={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              onNextSlide={() => setCurrentSlideIndex((prev) => Math.min(filteredSlides.length - 1, prev + 1))}
              isCompleted={isCompleted}
              onToggleComplete={() => onToggleCompleteSlide(activeSlide.id)}
              onAskGeminiAI={(topic, context) => handleRunResearch(topic, context)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              Select a slide from the list to start PowerPoint presentation.
            </div>
          )}
        </div>
      </div>

      {/* Google / Gemini AI Research Assistant Modal */}
      {isResearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Gemini AI Tutor Assistant</h3>
              </div>
              <button
                onClick={() => setIsResearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="Enter topic to research (e.g. 3NF Normalization, Foreign Key rules)..."
                  className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleRunResearch()}
                  disabled={isResearching}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Research
                    </>
                  )}
                </button>
              </div>

              {isResearching ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-medium">Synthesizing textbook insights & exam tips for "{researchTopic}"...</p>
                </div>
              ) : researchResult ? (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                  {researchResult}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Type a topic above to query the Gemini AI Research Assistant.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Custom Document (PPTX, PDF, Word DOCX) Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Upload className="w-5 h-5" />
                Upload Slides or Documents (PPT, PDF, Word)
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
                  Lecture / Slide Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Databases - Chapter 5"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* File Upload Drop Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Document File (PPTX, PDF, Word DOCX, TXT)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <FileUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium mb-1">
                    {selectedFile ? (
                      <span className="font-bold text-indigo-700">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    ) : (
                      "Click to choose a PowerPoint, PDF, Word or Text document"
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">Supports .pptx, .ppt, .pdf, .docx, .doc, .txt, .md</p>
                  <input
                    type="file"
                    accept=".pdf,.pptx,.ppt,.docx,.doc,.txt,.md"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Paste Lecture Text Content
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste slide text or lecture notes here..."
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
                onClick={handleUploadCustomSlide}
                disabled={isUploading || !uploadTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PowerPoint Slides...
                  </>
                ) : (
                  <>
                    <Presentation className="w-4 h-4" />
                    Process & Create Slides
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
