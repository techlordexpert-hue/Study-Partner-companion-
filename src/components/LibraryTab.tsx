import React, { useState } from "react";
import { Course, LectureModule, Slide, UserProfile, CustomUploadedSlide } from "../types";
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
  Presentation,
  Trash2,
  FolderPlus,
  ArrowLeft,
  Layers,
  GraduationCap
} from "lucide-react";

interface LibraryTabProps {
  courses: Course[];
  userProfile: UserProfile;
  onToggleCompleteSlide: (slideId: string) => void;
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddSlideDeckToCourse: (courseId: string, customSlide: CustomUploadedSlide) => void;
  onDeleteSlideDeck: (courseId: string, moduleId: string) => void;
  onSaveNote: (slideId: string, noteText: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  courses,
  userProfile,
  onToggleCompleteSlide,
  onAddCourse,
  onDeleteCourse,
  onAddSlideDeckToCourse,
  onDeleteSlideDeck,
  onSaveNote,
}) => {
  // State for currently presenting slide deck / module
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Research Assistant Modal state
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);
  const [researchTopic, setResearchTopic] = useState<string>("");
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState<boolean>(false);

  // Upload Slide / Doc Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadTargetCourseId, setUploadTargetCourseId] = useState<string>(courses[0]?.id || "new");
  const [uploadTitle, setUploadTitle] = useState<string>("");
  const [uploadText, setUploadText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // New Course Modal state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState<boolean>(false);
  const [newCourseCode, setNewCourseCode] = useState<string>("");
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newCourseDesc, setNewCourseDesc] = useState<string>("");

  // Get active course and active module if studying
  const activeCourse = courses.find((c) => c.id === activeCourseId);
  const activeModule = activeCourse?.modules.find((m) => m.id === activeModuleId);

  // Filter slides for active module search
  const filteredSlides = activeModule
    ? activeModule.slides.filter((slide) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          slide.title.toLowerCase().includes(q) ||
          slide.textContent.toLowerCase().includes(q) ||
          slide.briefExplanation.toLowerCase().includes(q)
        );
      })
    : [];

  const activeSlide: Slide | undefined = filteredSlides[currentSlideIndex] || filteredSlides[0];

  // Handle Research Call
  const handleRunResearch = async (topicToResearch?: string, contextText?: string) => {
    const topic = topicToResearch || researchTopic || activeSlide?.title || "Course Material";
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
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        setUploadTitle(cleanName);
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

  // Handle Creating a New Course
  const handleCreateCourseSubmit = () => {
    if (!newCourseTitle.trim()) return;
    const courseCode = newCourseCode.trim() || `COURSE-${courses.length + 1}`;
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: courseCode,
      title: newCourseTitle.trim(),
      description: newCourseDesc.trim() || `Course materials for ${newCourseTitle.trim()}`,
      isCustom: true,
      modules: [],
    };
    onAddCourse(newCourse);
    setUploadTargetCourseId(newCourse.id);
    setIsNewCourseModalOpen(false);
    setNewCourseCode("");
    setNewCourseTitle("");
    setNewCourseDesc("");
  };

  // Handle Custom Slide Upload from File or Text
  const handleUploadCustomSlide = async () => {
    if (!uploadTitle.trim()) return;
    setIsUploading(true);

    try {
      let targetCourseId = uploadTargetCourseId;

      // If user selected "Create New Course" inside upload modal
      if (targetCourseId === "new") {
        const createdCourse: Course = {
          id: `course-${Date.now()}`,
          code: `GEN-${courses.length + 1}`,
          title: uploadTitle.trim(),
          description: `Course material for ${uploadTitle.trim()}`,
          isCustom: true,
          modules: [],
        };
        onAddCourse(createdCourse);
        targetCourseId = createdCourse.id;
      }

      let fileBase64 = "";
      let fileMimeType = "";

      if (selectedFile) {
        fileMimeType = selectedFile.type || "application/pdf";
        if (selectedFile.name.endsWith(".pptx"))
          fileMimeType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        else if (selectedFile.name.endsWith(".ppt")) fileMimeType = "application/vnd.ms-powerpoint";
        else if (selectedFile.name.endsWith(".pdf")) fileMimeType = "application/pdf";
        else if (selectedFile.name.endsWith(".docx"))
          fileMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        else if (selectedFile.name.endsWith(".txt") || selectedFile.name.endsWith(".md")) fileMimeType = "text/plain";

        fileBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const res = e.target?.result as string;
            if (res && res.includes("base64,")) {
              resolve(res.split("base64,")[1]);
            } else {
              resolve("");
            }
          };
          reader.onerror = () => resolve("");
          reader.readAsDataURL(selectedFile);
        });
      }

      let slidesList: any[] = [];

      try {
        const response = await fetch("/api/parse-slide-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: uploadTitle,
            rawText: uploadText,
            fileBase64,
            fileMimeType,
          }),
        });

        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.slides && data.slides.length > 0) {
            slidesList = data.slides;
          }
        }
      } catch (err) {
        console.warn("API parse endpoint unavailable, using client-side fallback parsing:", err);
      }

      // Fallback client-side slide generation if API returned non-JSON, 404 or failed
      if (slidesList.length === 0) {
        const contentSource = uploadText.trim() || (selectedFile ? `Extracted presentation notes from ${selectedFile.name}` : uploadTitle);
        const textSections = contentSource.split(/\n\s*\n/).filter((s) => s.trim().length > 0);

        if (textSections.length > 0) {
          slidesList = textSections.map((sec, i) => ({
            title: i === 0 ? uploadTitle : `${uploadTitle} - Part ${i + 1}`,
            text: sec,
            explanation: `Key takeaway and exam notes for ${uploadTitle}.`,
            youtubeQuery: `${uploadTitle} tutorial`,
            researchTopics: [uploadTitle],
          }));
        } else {
          slidesList = [
            {
              title: uploadTitle,
              text: `Slide content for ${uploadTitle}.`,
              explanation: `Overview of ${uploadTitle}.`,
              youtubeQuery: `${uploadTitle} tutorial`,
              researchTopics: [uploadTitle],
            },
          ];
        }
      }

      const parsedSlides: Slide[] = slidesList.map((s: any, idx: number) => {
        const query = s.youtubeQuery || `${s.title || "Lecture"} ${uploadTitle} tutorial`;
        return {
          id: `custom-${Date.now()}-${idx}`,
          slideNumber: idx + 1,
          title: s.title || `Slide ${idx + 1}`,
          textContent: s.text || s.textContent || uploadText || "Slide Content",
          briefExplanation: s.explanation || "Key concept extracted from uploaded material.",
          youtubeTutorialUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
            query
          )}`,
          youtubeQuery: query,
          researchTopics:
            s.researchTopics && s.researchTopics.length > 0 ? s.researchTopics : [s.title || uploadTitle, uploadTitle],
        };
      });

      const newCustomSlide: CustomUploadedSlide = {
        id: `custom-mod-${Date.now()}`,
        title: uploadTitle,
        uploadedAt: new Date().toLocaleDateString(),
        slides: parsedSlides,
      };

      onAddSlideDeckToCourse(targetCourseId, newCustomSlide);

      // Open newly uploaded slide deck directly
      setActiveCourseId(targetCourseId);
      setActiveModuleId(newCustomSlide.id);
      setCurrentSlideIndex(0);

      setIsUploadModalOpen(false);
      setUploadTitle("");
      setUploadText("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Custom slide upload error:", err);
      alert("Unable to parse document. Please ensure the file is valid or try pasting the text notes directly.");
    } finally {
      setIsUploading(false);
    }
  };

  const isCompleted = activeSlide ? userProfile.completedSlideIds.includes(activeSlide.id) : false;

  // Filter courses by search query if on main library screen
  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim() || activeModuleId) return true;
    const q = searchQuery.toLowerCase();
    const matchCourse = c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q);
    const matchModules = c.modules.some((m) => m.title.toLowerCase().includes(q));
    return matchCourse || matchModules;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* CASE 1: If studying a specific slide deck, render the full PowerPoint Presentation Mode */}
      {activeCourse && activeModule ? (
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                setActiveCourseId(null);
                setActiveModuleId(null);
                setSearchQuery("");
              }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course Library
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                {activeCourse.code}
              </span>
              <span className="text-sm font-extrabold text-slate-900 truncate max-w-md">
                {activeCourse.title} — {activeModule.title}
              </span>
            </div>
          </div>

          {/* Grid Layout: Left Slide Index & Right PowerPoint Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar: Slide Index */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs h-fit">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search slides in this deck..."
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
                  <div className="text-center py-8 text-slate-400 text-xs">No slides matched search.</div>
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
                          title={isDone ? "Mark incomplete" : "Mark completed"}
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
                          <p className="text-xs font-semibold truncate text-slate-900 mt-0.5">
                            {slide.title.replace(/[*#]/g, "")}
                          </p>
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
                  moduleCode={activeCourse.code}
                  moduleTitle={activeModule.title}
                  allDeckSlides={activeModule.slides}
                  onPrevSlide={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  onNextSlide={() => setCurrentSlideIndex((prev) => Math.min(filteredSlides.length - 1, prev + 1))}
                  isCompleted={isCompleted}
                  onToggleComplete={() => onToggleCompleteSlide(activeSlide.id)}
                  onAskGeminiAI={(topic, context) => handleRunResearch(topic, context)}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  Select a slide from the list to start presentation.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* CASE 2: MAIN COURSE-BY-COURSE LIBRARY LIST SCREEN */
        <div className="space-y-8">
          {/* Header Action Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap className="w-4.5 h-4.5" />
                Course-by-Course Slide & Document Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Academic Courses & Presentations</h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
                Browse resources organized by course. Upload PowerPoint presentations (.pptx), DOCX notes, or PDFs directly to any course, or create new courses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewCourseModalOpen(true)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-indigo-600" />
                Add New Course
              </button>

              <button
                onClick={() => {
                  setUploadTargetCourseId(courses[0]?.id || "new");
                  setIsUploadModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload PPTX, DOCX or PDF
              </button>
            </div>
          </div>

          {/* Search Across Courses */}
          <div className="relative max-w-2xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search courses, slide titles, or PowerPoint topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-2xl pl-11 pr-4 py-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Courses List ("Course by Course") */}
          <div className="space-y-8">
            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No courses matched your search query.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Clear search filter
                </button>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
                >
                  {/* Course Header Banner */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-lg tracking-wider uppercase shadow-xs">
                          {course.code}
                        </span>
                        <h2 className="text-xl font-black text-slate-900">{course.title}</h2>
                      </div>
                      {course.description && (
                        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-3xl">
                          {course.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Upload Slide Deck to this Course */}
                      <button
                        onClick={() => {
                          setUploadTargetCourseId(course.id);
                          setIsUploadModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Slides
                      </button>

                      {/* Delete Course Button */}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to remove the course "${course.title}" and all its slides?`
                            )
                          ) {
                            onDeleteCourse(course.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Slide Decks / Presentations inside this Course */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                      Resource Presentations & Documents ({course.modules.length})
                    </div>

                    {course.modules.length === 0 ? (
                      <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500 space-y-3">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-medium text-slate-600">
                          No PowerPoint slides or documents uploaded in this course yet.
                        </p>
                        <button
                          onClick={() => {
                            setUploadTargetCourseId(course.id);
                            setIsUploadModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload PPTX / DOCX to {course.code}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.modules.map((m) => {
                          const slideCount = m.slides.length;
                          const completedCount = m.slides.filter((s) =>
                            userProfile.completedSlideIds.includes(s.id)
                          ).length;

                          return (
                            <div
                              key={m.id}
                              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group relative"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform">
                                    <Presentation className="w-5 h-5" />
                                  </div>

                                  {/* Delete Individual Slide Deck Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        window.confirm(
                                          `Remove slide deck "${m.title}" from course ${course.code}?`
                                        )
                                      ) {
                                        onDeleteSlideDeck(course.id, m.id);
                                      }
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Delete this presentation / document"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <div>
                                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                                    {m.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                                    {m.subtitle || m.description}
                                  </p>
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>{slideCount} Slides</span>
                                </div>

                                <button
                                  onClick={() => {
                                    setActiveCourseId(course.id);
                                    setActiveModuleId(m.id);
                                    setCurrentSlideIndex(0);
                                  }}
                                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                                >
                                  <span>Study Slides</span>
                                  <Presentation className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Create New Course */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <FolderPlus className="w-5 h-5" />
                Add New Academic Course
              </div>
              <button
                onClick={() => setIsNewCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS 301 or SE 202"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering & System Architecture"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Design patterns, Agile development, testing, and requirements engineering..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsNewCourseModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourseSubmit}
                disabled={!newCourseTitle.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload Custom Document (PPTX, PDF, Word DOCX) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
                <Upload className="w-5 h-5" />
                Upload Presentation / Document (PPT, PDF, Word)
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Select Target Course Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Course <span className="text-rose-500">*</span>
                </label>
                <select
                  value={uploadTargetCourseId}
                  onChange={(e) => setUploadTargetCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                  <option value="new">+ Create New Course Category</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Presentation / Slide Deck Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Databases & Replication - Chapter 5"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* File Upload Drop Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select File (PowerPoint .pptx, Word .docx, PDF, or Text)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <FileUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium mb-1">
                    {selectedFile ? (
                      <span className="font-bold text-indigo-700">
                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Or Paste Lecture Text Notes</label>
                <textarea
                  rows={4}
                  placeholder="Paste raw slide text or lecture notes here..."
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
                    Process & Save to Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google / Gemini AI Research Assistant Modal */}
      {isResearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Gemini AI Research Assistant</h3>
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
                  <p className="text-xs font-medium">
                    Synthesizing textbook insights & exam tips for "{researchTopic}"...
                  </p>
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
    </div>
  );
};
