import React, { useState } from "react";
import pptxgen from "pptxgenjs";
import { Slide } from "../types";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Youtube, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Download
} from "lucide-react";

interface PowerPointSlideRendererProps {
  slide: Slide;
  currentSlideIndex: number;
  totalSlides: number;
  moduleCode: string;
  moduleTitle: string;
  allDeckSlides?: Slide[];
  onPrevSlide: () => void;
  onNextSlide: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onAskGeminiAI: (topic: string, context: string) => void;
}

export const PowerPointSlideRenderer: React.FC<PowerPointSlideRendererProps> = ({
  slide,
  currentSlideIndex,
  totalSlides,
  moduleCode,
  moduleTitle,
  allDeckSlides,
  onPrevSlide,
  onNextSlide,
  isCompleted,
  onToggleComplete,
  onAskGeminiAI,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Download entire slide deck as a genuine .pptx PowerPoint file
  const handleExportPPTX = () => {
    try {
      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";
      pres.author = "Study Partner";
      pres.title = moduleTitle;

      const slidesToExport = allDeckSlides && allDeckSlides.length > 0 ? allDeckSlides : [slide];

      slidesToExport.forEach((s, idx) => {
        const pptSlide = pres.addSlide();

        // Top Banner Accent
        pptSlide.addShape(pres.ShapeType.rect, {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.15,
          fill: { color: "4F46E5" },
        });

        // Header Subtitle
        pptSlide.addText(`${moduleCode} • ${moduleTitle}`, {
          x: 0.5,
          y: 0.3,
          w: 9,
          h: 0.3,
          fontSize: 10,
          color: "64748B",
          bold: true,
        });

        // Slide Title
        pptSlide.addText(s.title.replace(/[*#]/g, ""), {
          x: 0.5,
          y: 0.7,
          w: 9,
          h: 0.8,
          fontSize: 22,
          bold: true,
          color: "0F172A",
        });

        // Content
        const cleanText = s.textContent
          .replace(/```[a-z]*/g, "")
          .replace(/```/g, "")
          .replace(/\*\*/g, "");

        pptSlide.addText(cleanText, {
          x: 0.5,
          y: 1.6,
          w: 9,
          h: 3.5,
          fontSize: 13,
          color: "334155",
          valign: "top",
          bullet: true,
        });

        // Exam Note
        if (s.briefExplanation) {
          pptSlide.addText(`Key Exam Note: ${s.briefExplanation}`, {
            x: 0.5,
            y: 5.3,
            w: 9,
            h: 0.8,
            fontSize: 11,
            color: "4338CA",
            fill: { color: "EEF2FF" },
            margin: 10,
          });
        }

        // Footer
        pptSlide.addText(`Slide ${idx + 1} of ${slidesToExport.length} • Study Partner Platform`, {
          x: 0.5,
          y: 6.8,
          w: 9,
          h: 0.3,
          fontSize: 9,
          color: "94A3B8",
        });
      });

      const filename = `${moduleTitle.replace(/[^a-zA-Z0-9_-]/g, "_")}_Slides.pptx`;
      pres.writeFile({ fileName: filename });
    } catch (err) {
      console.error("Failed to generate PPTX", err);
      alert("Error generating PowerPoint file.");
    }
  };

  // Helper to strip raw markdown symbols and parse content into real PowerPoint elements
  const renderPowerPointContent = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const flushTable = (key: string) => {
      if (tableHeaders.length > 0 || tableRows.length > 0) {
        elements.push(
          <div key={key} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-sm">
              {tableHeaders.length > 0 && (
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    {tableHeaders.map((h, idx) => (
                      <th key={idx} className="p-3 border-r last:border-r-0 border-slate-200">
                        {cleanFormattedInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 border-r last:border-r-0 border-slate-200">
                        {cleanFormattedInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
      }
      inTable = false;
    };

    const flushCode = (key: string) => {
      if (codeBuffer.length > 0) {
        const fullCode = codeBuffer.join("\n");
        elements.push(
          <div key={key} className="my-4 rounded-xl bg-slate-900 text-emerald-400 p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner relative border border-slate-800">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <span>SQL / Code Spec</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>{fullCode}</pre>
          </div>
        );
        codeBuffer = [];
      }
      inCodeBlock = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check Code Blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCode(`code-${index}`);
        } else {
          if (inTable) flushTable(`table-${index}`);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Check Tables
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (!inTable) inTable = true;

        // Skip table separator line | --- | --- |
        if (trimmed.includes("---")) return;

        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);

        if (tableHeaders.length === 0) {
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable(`table-${index}`);
      }

      // Skip blank lines
      if (!trimmed) {
        return;
      }

      // Check Heading (### or # or ##) -> Render clean section header
      if (trimmed.startsWith("#")) {
        const headingText = trimmed.replace(/^#+\s*/, "");
        // Only render if it's not repeating the slide title exactly
        if (headingText.toLowerCase() !== slide.title.toLowerCase()) {
          elements.push(
            <h3 key={`h-${index}`} className="text-lg sm:text-xl font-bold text-slate-900 mt-4 mb-2 tracking-tight border-b border-slate-200 pb-1">
              {cleanFormattedInline(headingText)}
            </h3>
          );
        }
        return;
      }

      // Check Bullet Points (* or - or •)
      if (trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("•")) {
        const bulletText = trimmed.replace(/^[*•-]\s*/, "");
        elements.push(
          <div key={`b-${index}`} className="flex items-start gap-3 my-2 text-slate-800 font-medium text-sm sm:text-base leading-relaxed pl-1">
            <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0 shadow-xs" />
            <div className="flex-1">{cleanFormattedInline(bulletText)}</div>
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${index}`} className="my-2 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
          {cleanFormattedInline(trimmed)}
        </p>
      );
    });

    if (inTable) flushTable("table-end");
    if (inCodeBlock) flushCode("code-end");

    return elements;
  };

  // Inline formatting helper: converts **bold** to <strong>, cleans raw markdown asterisks
  const cleanFormattedInline = (textStr: string): React.ReactNode => {
    if (!textStr) return "";
    
    // Split by ** for bolding
    const parts = textStr.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return <strong key={i} className="font-bold text-slate-900">{boldText}</strong>;
      }
      // Strip leftover solitary asterisks or hash tags
      const cleaned = part.replace(/[*#]/g, "");
      return cleaned;
    });
  };

  // Convert embed YouTube URL or build working YouTube search link
  const youtubeSearchQuery = slide.youtubeQuery || `${slide.title} ${moduleTitle} tutorial`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`;
  const youtubeEmbedUrl = slide.youtubeTutorialUrl || `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(youtubeSearchQuery)}`;

  return (
    <div className={`w-full transition-all ${isFullscreen ? "fixed inset-0 z-50 bg-slate-900 p-4 sm:p-8 overflow-y-auto flex flex-col justify-between" : ""}`}>
      {/* Real PowerPoint Deck Header Toolbar */}
      <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs tracking-wide">
            POWERPOINT SLIDE {slide.slideNumber || currentSlideIndex + 1} / {totalSlides}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {moduleCode} • {moduleTitle}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download PowerPoint (.pptx) File */}
          <button
            onClick={handleExportPPTX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            title="Download presentation as PowerPoint (.pptx) file"
          >
            <Download className="w-3.5 h-3.5" />
            Download PPTX
          </button>

          {/* Complete Slide Toggle */}
          <button
            onClick={onToggleComplete}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isCompleted
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "text-emerald-600 fill-emerald-600/20" : "text-slate-400"}`} />
            {isCompleted ? "Completed" : "Mark as Completed"}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Slide Deck"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main PowerPoint Widescreen Canvas */}
      <div className="bg-white border border-slate-200 shadow-md rounded-b-2xl p-6 sm:p-10 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
        {/* Widescreen PowerPoint Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-t-lg -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-6" />

        {/* Slide Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {slide.title.replace(/[*#]/g, "")}
          </h2>
        </div>

        {/* Formatted Slide Content */}
        <div className="flex-1 font-sans space-y-3 mb-6">
          {renderPowerPointContent(slide.textContent)}
        </div>

        {/* Slide Footer Info */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Study Partner • Presentation Deck</span>
          <span>Slide {currentSlideIndex + 1} of {totalSlides}</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="mt-4 flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onPrevSlide}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-semibold text-xs border border-slate-200 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Slide
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-semibold">
            <span>Progress</span>
            <span>{Math.round(((currentSlideIndex + 1) / totalSlides) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={onNextSlide}
          disabled={currentSlideIndex === totalSlides - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          Next Slide <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Auxiliary Learning Panel (Brief Explanation, YouTube Tutorial & Gemini Assistant) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brief Student Note & Gemini AI Assistant */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm text-slate-900">Key Takeaway & Exam Note</h4>
            </div>
            <button
              onClick={() =>
                onAskGeminiAI(
                  slide.title,
                  `Brief note: ${slide.briefExplanation}\nSlide Text: ${slide.textContent}`
                )
              }
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Ask Gemini AI
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {slide.briefExplanation}
          </p>

          {/* Research Topics */}
          {slide.researchTopics && slide.researchTopics.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Deep Research Topics:</div>
              <div className="flex flex-wrap gap-1.5">
                {slide.researchTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => onAskGeminiAI(topic, `Context: ${slide.title}`)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Working YouTube Tutorial Video Box */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-sm text-slate-900">Video Tutorial (Working YouTube Embed)</h4>
              </div>
              <a
                href={youtubeSearchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Watch on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Video iFrame / Embed */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
              <iframe
                src={youtubeEmbedUrl}
                title={`YouTube Tutorial: ${slide.title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Recommended search: <span className="font-semibold text-slate-700">{slide.youtubeQuery || slide.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
