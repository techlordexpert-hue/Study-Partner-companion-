import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini AI Client (server-side)
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: AI Research Assistant for Slides & Course Material
app.post("/api/research", async (req, res) => {
  try {
    const { topic, context } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        result: `### Research Topic: ${topic}\n\n*Note: Configure GEMINI_API_KEY in Vercel Environment Variables for live AI research.*\n\nHere is a foundational breakdown of **${topic}**:\n- **Definition**: Fundamental concept in this academic discipline.\n- **Core Importance**: Essential principle for understanding higher-level domain applications.\n- **Key Application**: Widely utilized in professional practice and university exam scenarios.`,
      });
    }

    const prompt = `You are a world-class university professor and study partner helping a student research a specific topic from their course materials.
Topic: ${topic}
${context ? `Course / Slide Context: ${context}` : ""}

Please provide a structured, easy-to-understand research guide:
1. **Core Summary & Definition**
2. **Key Technical Principles, Formulas & Rules**
3. **Real-World University / Industry Application Example**
4. **Common Exam Traps & Tips**
5. **3 Quick Self-Test Quiz Questions** to test understanding with answers.

Format nicely using clean Markdown styling.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in research API:", error);
    return res.status(500).json({ error: error.message || "Research request failed" });
  }
});

// API Route: Past Question AI Explainer & Tutor
app.post("/api/explain-question", async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer, topic } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        explanation: `**Correct Answer:** ${correctAnswer}\n\n**Explanation:**\nThis question tests your knowledge of **${topic || "Course Concepts"}**. ${
          userAnswer === correctAnswer
            ? "Great job! Your answer is correct."
            : `You selected (${userAnswer}), but (${correctAnswer}) is correct based on foundational principles.`
        }`,
      });
    }

    const prompt = `You are an expert University Exam Tutor and professor helping students master their course content.
Topic: ${topic || "Course Concept"}
Question: ${question}
User's Answer: ${userAnswer || "Not answered"}
Correct Answer: ${correctAnswer}

Provide an encouraging, clear breakdown:
1. Direct confirmation whether the user is correct or wrong.
2. Step-by-step reasoning why option ${correctAnswer} is the correct answer.
3. Why the other options might be misleading.
4. A 1-sentence mnemonic or key rule to remember this for the final exam.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Error in explain-question API:", error);
    return res.status(500).json({ error: error.message || "Explanation failed" });
  }
});

// API Route: Custom Slide / Document Parser (Supports PDF, PPTX, DOCX, TXT & Images)
app.post("/api/parse-slide-content", async (req, res) => {
  try {
    const { rawText, fileBase64, fileMimeType, title } = req.body;
    if (!rawText && !fileBase64) {
      return res.status(400).json({ error: "Text or document file is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      const textToParse = rawText && rawText.trim().length > 10 ? rawText.trim() : `Overview and lecture material for ${title || "Course Material"}.`;
      const lines = textToParse.split("\n").filter((l: string) => l.trim().length > 0);
      const slides = [];
      let currentSlide = {
        title: title || "Lecture Notes",
        text: "",
        explanation: "Key takeaway from uploaded lecture material.",
        youtubeQuery: `${title || "lecture"} tutorial`,
      };

      for (let i = 0; i < lines.length; i++) {
        if (i > 0 && i % 4 === 0) {
          slides.push(currentSlide);
          currentSlide = {
            title: `${title || "Slide"} - Part ${slides.length + 1}`,
            text: lines[i],
            explanation: "Key takeaway from uploaded lecture material.",
            youtubeQuery: `${lines[i].slice(0, 30)} tutorial`,
          };
        } else {
          currentSlide.text += "\n" + lines[i];
        }
      }
      slides.push(currentSlide);
      return res.json({ slides });
    }

    const parts: any[] = [];
    if (fileBase64 && fileMimeType && (fileMimeType === "application/pdf" || fileMimeType.startsWith("image/"))) {
      parts.push({
        inlineData: {
          mimeType: fileMimeType,
          data: fileBase64,
        },
      });
    }

    const promptText = `You are an expert university professor and PowerPoint presentation designer.
Parse the provided document file or text notes into a clean, structured array of individual PowerPoint slides for student study.

Title / Course Name: ${title || "Uploaded Course Document"}
${rawText ? `Extracted Text Content:\n${rawText.slice(0, 15000)}` : ""}

Instructions:
1. Extract all material into 4 to 12 logically ordered PowerPoint slides covering all key concepts thoroughly without omitting content.
2. Each slide MUST have a clear title in "title".
3. "text": Format cleanly starting with "### SLIDE TITLE" followed by structured paragraphs, bold terms (**Concept:** Explanation), clean markdown tables (| Col 1 | Col 2 |), code blocks, and bullet points ONLY when listing items. Do NOT put a bullet point in front of every paragraph or header.
4. "explanation": A concise 2-3 sentence student note highlighting what is tested on exams.
5. "youtubeQuery": Specific search keywords for YouTube video tutorials on this exact slide topic.
6. "researchTopics": Array of 2-3 key terms for deep research.

Return a valid JSON array matching this schema:
[
  {
    "title": "SLIDE TITLE",
    "text": "### SLIDE TITLE\\n\\n**Key Concept:** Detailed explanation paragraph.\\n\\n* Bullet item 1\\n* Bullet item 2\\n\\n| Column 1 | Column 2 |",
    "explanation": "Key exam note...",
    "youtubeQuery": "topic course name tutorial",
    "researchTopics": ["Topic 1", "Topic 2"]
  }
]`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ slides: parsed });
  } catch (error: any) {
    console.error("Error in parse-slide-content:", error);
    return res.status(500).json({ error: error.message || "Failed to parse slides" });
  }
});

// API Route: Custom Past Question Parser (Supports PDF, PPTX, DOCX, TXT & Images)
app.post("/api/parse-past-questions", async (req, res) => {
  try {
    const { rawText, fileBase64, fileMimeType, title } = req.body;
    if (!rawText && !fileBase64) {
      return res.status(400).json({ error: "Text or document file is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        questions: [
          {
            id: "custom-1",
            question: `Sample Quiz Question for ${title || "Uploaded Material"}: What is the primary function of this concept?`,
            options: ["Primary core function", "Secondary auxiliary process", "Irrelevant variable", "Deprecated method"],
            answer: "Primary core function",
            explanation: "Core concepts are designed to provide the primary functionality.",
            topic: title || "Course Core",
          },
        ],
      });
    }

    const parts: any[] = [];
    if (fileBase64 && fileMimeType && (fileMimeType === "application/pdf" || fileMimeType.startsWith("image/"))) {
      parts.push({
        inlineData: {
          mimeType: fileMimeType,
          data: fileBase64,
        },
      });
    }

    const promptText = `You are an expert university exam question creator and professor.
Parse the provided document or text into structured, high-quality multiple-choice quiz questions for student practice.

Document Title / Subject: ${title || "Course Past Questions"}
${rawText ? `Text Content: ${rawText.slice(0, 15000)}` : ""}

Instructions:
1. Extract existing questions OR create 5 to 12 interactive multiple-choice questions covering all key topics in the material.
2. Every question MUST have exactly 4 plausible options in "options".
3. "answer": Set to the exact string matching the correct option.
4. "explanation": Provide a 2-3 sentence explanation explaining why that option is correct.
5. "topic": Concise topic name within this course.

Return a valid JSON array matching schema:
[
  {
    "id": "q-1",
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Why Option A is correct...",
    "topic": "Topic Name"
  }
]`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ questions: parsed });
  } catch (error: any) {
    console.error("Error in parse-past-questions:", error);
    return res.status(500).json({ error: error.message || "Failed to parse questions" });
  }
});

export default app;
