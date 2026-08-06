import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client (server-side only)
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

  // API Route: AI Research Assistant for Slides
  app.post("/api/research", async (req, res) => {
    try {
      const { topic, context } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          result: `### Research Topic: ${topic}\n\n*Note: Configure GEMINI_API_KEY in Secrets panel for live AI research.*\n\nHere is a foundational breakdown of **${topic}**:\n- **Definition**: Fundamental concept in Database Management Systems (DBMS).\n- **Core Importance**: Ensures data consistency, reduces redundancy, and maintains integrity in enterprise systems.\n- **Key Application**: Widely utilized in relational database architectures (e.g., MySQL, PostgreSQL, Oracle).`,
        });
      }

      const prompt = `You are a world-class Database & Computer Science professor helping a student research a specific topic from their DBMS course slides.
Topic: ${topic}
${context ? `Slide Context: ${context}` : ""}

Please provide a structured, easy-to-understand research guide:
1. **Core Summary & Definition**
2. **Key Technical Principles & Formula/Rules** (if applicable like Normalization 1NF-3NF, Foreign Key rules, Cardinality)
3. **Real-World University/Enterprise Example** (e.g., Banking, UEW Student System, Hospital)
4. **Common Exam Traps & Tips** for ICTE 242 / DBMS exams
5. **3 Quick Quiz Questions** to test understanding with hidden answers.

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
          explanation: `**Correct Answer:** ${correctAnswer}\n\n**Explanation:**\nThis question tests your knowledge of **${topic || "DBMS Concepts"}**. ${
            userAnswer === correctAnswer
              ? "Great job! Your answer is correct."
              : `You selected option (${userAnswer}), but option (${correctAnswer}) is correct because it directly satisfies the relational integrity/database definition rule.`
          }`,
        });
      }

      const prompt = `You are an expert DBMS Exam Tutor for university students (B.Sc. ICT Education).
Topic: ${topic || "DBMS"}
Question: ${question}
User's Answer: ${userAnswer || "Not answered"}
Correct Answer: ${correctAnswer}

Provide a encouraging, clear breakdown:
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

  // API Route: Custom Slide Parser
  app.post("/api/parse-slide-content", async (req, res) => {
    try {
      const { rawText, title } = req.body;
      if (!rawText) {
        return res.status(400).json({ error: "Raw text is required" });
      }

      const ai = getAIClient();
      if (!ai) {
        // Simple fallback parser
        const lines = rawText.split("\n").filter((l: string) => l.trim().length > 0);
        const slides = [];
        let currentSlide = { title: title || "Slide 1", text: "", explanation: "", youtubeQuery: "DBMS tutorial" };
        
        for (let i = 0; i < lines.length; i++) {
          if (i > 0 && i % 4 === 0) {
            slides.push(currentSlide);
            currentSlide = {
              title: `Slide ${slides.length + 1}`,
              text: lines[i],
              explanation: "Key concept extracted from uploaded material.",
              youtubeQuery: `${lines[i].slice(0, 30)} database tutorial`,
            };
          } else {
            currentSlide.text += "\n" + lines[i];
          }
        }
        if (currentSlide.text) slides.push(currentSlide);

        return res.json({ slides });
      }

      const prompt = `You are a curriculum assistant. Parse the provided text notes or lecture materials into an array of individual slides.
Title: ${title || "Uploaded Lecture"}
Text: ${rawText}

Return a valid JSON array of objects with the following schema:
[
  {
    "title": "Slide Title / Header",
    "text": "Extracted text content for this slide (verbatim or cleanly formatted markdown)",
    "explanation": "A 2-3 sentence brief explanation highlighting what students must understand from this slide",
    "youtubeQuery": "Keywords for a targeted YouTube video search (e.g. 'normalization 3nf example database')"
  }
]
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
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

  // API Route: Custom Past Question Parser
  app.post("/api/parse-past-questions", async (req, res) => {
    try {
      const { rawText } = req.body;
      if (!rawText) {
        return res.status(400).json({ error: "Text is required" });
      }

      const ai = getAIClient();
      if (!ai) {
        return res.json({
          questions: [
            {
              id: "custom-1",
              question: "Sample Question generated from upload: What is a Primary Key?",
              options: ["A unique identifier for each row", "A key imported from another table", "A non-prime attribute", "A composite relationship"],
              answer: "A unique identifier for each row",
              explanation: "Primary keys uniquely identify records in a table and cannot contain NULL values.",
              topic: "Relational Model",
            },
          ],
        });
      }

      const prompt = `You are an expert exam question creator and curriculum developer for university Computer Science and DBMS courses.
Parse the following raw uploaded document text into structured, high-quality multiple-choice quiz questions for student practice.

Document Content:
${rawText.slice(0, 8000)}

Instructions:
1. If the text already contains exam questions, extract them and convert them into clean 4-option multiple choice format.
2. If the text contains lecture notes or general document text, generate 5 to 10 relevant multiple-choice quiz questions covering the main concepts in the document.
3. Every question MUST have exactly 4 plausible options in the "options" array.
4. Set "answer" to the exact string of the correct option from the options array.
5. Provide a clear 2-3 sentence "explanation" detailing why that option is correct.
6. Provide a concise "topic" (e.g., DBMS Concepts, Normalization, SQL, Relational Algebra, Data Security).

Return a valid JSON array with schema:
[
  {
    "id": "q-1",
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Explanation of why Option A is correct...",
    "topic": "Topic Name"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
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

  // Vite Middleware or Static Production Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Database Study Partner server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
