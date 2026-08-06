import JSZip from "jszip";

export interface ExtractedSlideContent {
  slideNumber: number;
  title: string;
  text: string;
}

export interface ExtractionResult {
  fullText: string;
  slides?: ExtractedSlideContent[];
}

/**
 * Extracts plain text and slide structures from PPTX, DOCX, PDF, TXT, MD, CSV, etc.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const result = await extractDocumentData(file);
  return result.fullText;
}

export async function extractDocumentData(file: File): Promise<ExtractionResult> {
  const fileName = file.name.toLowerCase();

  // 1. Text & Markdown files (.txt, .md, .csv, .json, .xml, .html)
  if (
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md") ||
    fileName.endsWith(".csv") ||
    fileName.endsWith(".json") ||
    fileName.endsWith(".xml") ||
    fileName.endsWith(".html") ||
    file.type.startsWith("text/")
  ) {
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });

    return { fullText: text.trim() };
  }

  // 2. PowerPoint (.pptx) extraction using JSZip
  if (fileName.endsWith(".pptx")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      // Find all slide XML files in ppt/slides/slideX.xml
      const slideFiles = Object.keys(zip.files).filter((path) =>
        /^ppt\/slides\/slide\d+\.xml$/i.test(path)
      );

      // Sort slides numerically (slide1, slide2, slide3, ...)
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
        return numA - numB;
      });

      const extractedSlides: ExtractedSlideContent[] = [];
      const fullTextParts: string[] = [];

      for (let i = 0; i < slideFiles.length; i++) {
        const slidePath = slideFiles[i];
        const xmlContent = await zip.files[slidePath].async("string");

        // Extract all <a:t> text elements inside PowerPoint slide XML
        const textMatches: string[] = [];
        const regex = /<a:t[^>]*>(.*?)<\/a:t>/gi;
        let match;
        while ((match = regex.exec(xmlContent)) !== null) {
          if (match[1]) {
            // Unescape XML entities
            const decoded = match[1]
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&amp;/g, "&")
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .trim();
            if (decoded) {
              textMatches.push(decoded);
            }
          }
        }

        if (textMatches.length > 0) {
          const slideTitle = textMatches[0] || `Slide ${i + 1}`;
          const bodyLines = textMatches.slice(1);
          const slideText = bodyLines.length > 0 ? bodyLines.map((l) => `- ${l}`).join("\n") : textMatches.join("\n");

          extractedSlides.push({
            slideNumber: i + 1,
            title: slideTitle,
            text: slideText,
          });

          fullTextParts.push(`### Slide ${i + 1}: ${slideTitle}\n${slideText}`);
        }
      }

      const fullText = fullTextParts.join("\n\n");
      if (fullText.trim()) {
        return { fullText, slides: extractedSlides };
      }
    } catch (err) {
      console.warn("PPTX JSZip parsing fallback:", err);
    }
  }

  // 3. Word Document (.docx) extraction using JSZip
  if (fileName.endsWith(".docx")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      if (zip.files["word/document.xml"]) {
        const xmlContent = await zip.files["word/document.xml"].async("string");

        // Extract paragraphs <w:p> and text <w:t>
        const paragraphs: string[] = [];
        const pRegex = /<w:p[^>]*>(.*?)<\/w:p>/gi;
        let pMatch;
        while ((pMatch = pRegex.exec(xmlContent)) !== null) {
          const pXml = pMatch[1];
          const tMatches: string[] = [];
          const tRegex = /<w:t[^>]*>(.*?)<\/w:t>/gi;
          let tMatch;
          while ((tMatch = tRegex.exec(pXml)) !== null) {
            if (tMatch[1]) {
              tMatches.push(tMatch[1]);
            }
          }
          const pText = tMatches.join("").trim();
          if (pText) {
            paragraphs.push(pText);
          }
        }

        const fullText = paragraphs.join("\n\n");
        if (fullText.trim()) {
          return { fullText };
        }
      }
    } catch (err) {
      console.warn("DOCX JSZip parsing fallback:", err);
    }
  }

  // 4. PDF or Legacy Binary files (.pdf, .ppt, .doc) fallback extraction
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer) {
          resolve({ fullText: "" });
          return;
        }

        const decoder = new TextDecoder("utf-8", { fatal: false });
        const rawString = decoder.decode(buffer);

        let extractedText = "";

        // Extract PDF stream text TJ/Tj operators
        if (fileName.endsWith(".pdf")) {
          const pdfMatches: string[] = [];
          const pdfRegex = /\(([^()]{2,})\)\s*T[jJ]/g;
          let pdfMatch;
          while ((pdfMatch = pdfRegex.exec(rawString)) !== null) {
            if (pdfMatch[1] && pdfMatch[1].trim()) {
              pdfMatches.push(pdfMatch[1].trim());
            }
          }
          if (pdfMatches.length > 0) {
            extractedText = pdfMatches.join("\n");
          }
        }

        // ASCII word regex scanner fallback
        if (!extractedText || extractedText.trim().length < 20) {
          const cleanString = rawString.replace(/<[^>]+>/g, " ");
          const words = cleanString
            .replace(/[^\x20-\x7E\t\n\r]/g, " ")
            .split(/\s+/)
            .filter(
              (w) =>
                w.length >= 3 &&
                !/^[0-9a-f]{8,}$/i.test(w) &&
                !/^(PK|xml|rels|props|theme|docProps|word|ppt)$/i.test(w)
            );
          extractedText = words.join(" ");
        }

        resolve({ fullText: extractedText.trim() });
      } catch (err) {
        console.warn("Binary fallback extractor error:", err);
        resolve({ fullText: "" });
      }
    };
    reader.onerror = () => resolve({ fullText: "" });
    reader.readAsArrayBuffer(file);
  });
}
