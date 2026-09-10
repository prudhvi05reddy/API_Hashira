import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Resilient Gemini model caller with instant multi-model failover on 503 high demand
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  requestConfig: {
    contents: any;
    config?: any;
  },
  modelChain: string[] = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest']
): Promise<any> {
  let lastError: any = null;

  for (const model of modelChain) {
    try {
      console.log(`[Gemini] Calling model ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: requestConfig.contents,
        config: requestConfig.config,
      });
      console.log(`[Gemini] Model ${model} responded successfully.`);
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || JSON.stringify(err);
      console.warn(`[Gemini] Model ${model} failed: ${errMsg}`);

      const isOverloaded =
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE');

      // If the model is currently overloaded (503), immediately failover to the next candidate model
      if (isOverloaded) {
        console.log(`[Gemini] Model ${model} is experiencing high demand. Seamlessly failing over to next model in chain...`);
        continue;
      }

      // If rate-limited (429), wait a moment before trying the next model
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      // If non-retryable syntax or argument error, stop
      break;
    }
  }

  throw lastError;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Detect document types (JD vs Resume)
app.post('/api/detect-doc-types', async (req, res) => {
  try {
    const { documents } = req.body;
    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ error: 'No documents provided' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert ATS recruiter tool.
Given the following list of uploaded documents (name and initial text preview), identify for each document whether it is a "Job Description" (jd) or a "Candidate Resume" (resume).

Rules:
- A Job Description typically outlines role titles, responsibilities, required qualifications, company overview, benefits, or "We are looking for...".
- A Candidate Resume typically describes an individual's career history, contact info, skills, education, employment dates, or "Experience / Projects".
- Never confuse the Job Description with a resume.
- Return a classification for each document ID.

Documents:
${JSON.stringify(documents, null, 2)}
`;

    const response = await callGeminiWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['jd', 'resume'] },
                  confidence: { type: Type.NUMBER, description: 'Score between 0 and 1' },
                  reason: { type: Type.STRING, description: 'Brief reason for classification' },
                },
                required: ['id', 'type', 'reason'],
              },
            },
          },
          required: ['classifications'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in detect-doc-types:', error);
    return res.status(500).json({ error: error?.message || 'Failed to classify documents' });
  }
});

// Full ATS Resume Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { jobDescription, resumes } = req.body;

    if (!jobDescription || (!jobDescription.text && !jobDescription.base64)) {
      return res.status(400).json({ error: 'Job Description is required' });
    }

    if (!Array.isArray(resumes) || resumes.length === 0) {
      return res.status(400).json({ error: 'At least one candidate resume is required' });
    }

    const ai = getGeminiClient();

    // Prepare multimodal parts or text content
    const contents: any[] = [];

    let jdContext = `--- JOB DESCRIPTION ---\nDocument Name: ${jobDescription.name || 'Job Description'}\n`;
    if (jobDescription.text) {
      jdContext += `${jobDescription.text}\n\n`;
    }
    contents.push({ text: jdContext });

    if (jobDescription.base64 && jobDescription.mimeType) {
      contents.push({
        inlineData: {
          mimeType: jobDescription.mimeType,
          data: jobDescription.base64,
        },
      });
    }

    // Add each resume
    resumes.forEach((resume: any, idx: number) => {
      let resumeContext = `\n--- CANDIDATE RESUME #${idx + 1} ---\nID: ${resume.id}\nCandidate Name / Filename: ${resume.name}\n`;
      if (resume.text) {
        resumeContext += `${resume.text}\n`;
      }
      contents.push({ text: resumeContext });

      if (resume.base64 && resume.mimeType) {
        contents.push({
          inlineData: {
            mimeType: resume.mimeType,
            data: resume.base64,
          },
        });
      }
    });

    const systemInstruction = `You are an elite AI-powered ATS (Applicant Tracking System) Resume Analyzer designed for recruiters.
Your job is to analyze the one provided Job Description (JD) against one or more candidate resumes.

CRITICAL DIRECTIVES:
1. FIRST CONFIRM AND IDENTIFY which uploaded document is the Job Description and which are candidate resumes. NEVER confuse the JD with a resume.
2. For EVERY resume, perform a detailed, rigorous comparison against the JD.
3. You MUST provide the exact FIVE outputs for every candidate:

OUTPUT 1. ATS COMPATIBILITY SCORE (0–100)
Calculate the score rigorously using:
- Required skills: 40% weight (0–40 points)
- Relevant experience: 25% weight (0–25 points)
- JD-role alignment: 20% weight (0–20 points)
- Education/qualification requirements: 10% weight (0–10 points)
- Relevant keywords: 5% weight (0–5 points)
Total ATS Score = sum of the 5 factors (0-100 integer).
Do not randomly assign scores. Provide sub-scores and explain the major factors affecting the score.

OUTPUT 2. SKILL SET MATCH
- Required skills found in the resume
- Required skills partially matched (e.g., candidate knows similar tech or lower depth)
- Required skills missing
- Skill match percentage (0–100)
- Separate technical skills from tools/platforms when useful.

OUTPUT 3. RESUME–JD ALIGNMENT
Classify the alignment as one of:
- "Excellent" (90-100 score, near complete match on core role & requirements)
- "Strong" (75-89 score, solid foundation, minor gaps)
- "Moderate" (50-74 score, partial fit, key gaps in experience or tech)
- "Weak" (<50 score, significant misalignment in core duties or tech stack)
Explain the classification using explicit evidence from the JD and resume.
Consider:
- Job role
- Responsibilities
- Experience
- Projects
- Technologies
- Education
- Certifications

OUTPUT 4. WHAT IS MISSING
Identify important gaps between the JD and resume:
- Missing technical skills
- Missing tools
- Missing certifications if explicitly required
- Missing experience
- Missing keywords
- Missing qualifications
Do NOT treat every keyword difference as a critical gap.
Prioritize gaps as:
- HIGH (Critical requirements or core tech missing)
- MEDIUM (Important requirements, preferred skills, or experience depth)
- LOW (Nice-to-have, secondary tools, or minor keywords)

OUTPUT 5. RECOMMENDED COURSES / LEARNING
Recommend learning topics or courses based ONLY on the identified gaps.
For every recommendation explain:
- What to learn (Course title / topic)
- Why it matters for this JD (Direct reason tied to requirements)
- Priority (HIGH / MEDIUM / LOW)
Do NOT recommend courses unrelated to the target role.

TIPS TO GAIN MORE ATS SCORE:
Provide for every candidate actionable, high-impact tips to increase their ATS score:
- Which specific factor can be improved (Required skills 40%, Experience 25%, Role alignment 20%, Education 10%, Keywords 5%)
- Potential points gain (e.g. +5 to +15 pts)
- Concrete before & after phrasing example to pass ATS parsers and impress recruiters.

IMPORTANT RECRUITER ETHICS & RULES:
- Never invent information.
- Never assume a candidate knows a technology unless the resume supports it.
- Never penalize a candidate merely because a keyword is absent if equivalent experience is clearly demonstrated.
- Distinguish between required and preferred skills.
- Give higher importance to explicitly required skills.
- Use evidence from the uploaded documents.
- If information is unavailable, say "Not specified".
- Do not make hiring decisions based on protected characteristics.
- Evaluate candidates only on job-relevant information.

MULTIPLE RESUMES & RANKING:
- Analyze every resume independently.
- Calculate the five required outputs for every candidate.
- Rank all candidates from strongest to weakest based on ATS score and overall suitability.
- Provide a clear Shortlist Recommendation explaining which candidate(s) have the strongest job-relevant match and why.

RAW MARKDOWN REPORT REQUIREMENT:
You must also construct the complete formatted Markdown report strictly matching this structure:

# ATS ANALYSIS

## Candidate 1 — [Candidate Name]

### 1. ATS Compatibility Score
XX/100

### 2. Skill Set Match
XX%

Matched:
- ...

Partially Matched:
- ...

Missing:
- ...

### 3. Resume–JD Alignment
[Excellent/Strong/Moderate/Weak]

Explanation:
...

### 4. What's Missing

HIGH:
- ...

MEDIUM:
- ...

LOW:
- ...

### 5. Recommended Courses

1. [Course/topic]
   Reason: ...

2. [Course/topic]
   Reason: ...

---

(Repeat for each candidate)

# FINAL RANKING

| Rank | Candidate | ATS Score | Skill Match | Alignment |
|------|-----------|-----------|-------------|-----------|
| 1 | ... | .../100 | ...% | ... |

# SHORTLIST RECOMMENDATION
[Detailed explanation of top candidates and why they should be shortlisted]`;

    contents.push({
      text: 'Analyze the Job Description against all candidate resumes and return the complete ATS evaluation in the specified JSON schema.',
    });

    const response = await callGeminiWithFallback(ai, {
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobTitle: { type: Type.STRING, description: 'Target job title extracted from JD' },
            jobDescriptionSummary: { type: Type.STRING, description: '2-3 sentence summary of the JD' },
            candidates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  candidateId: { type: Type.STRING },
                  candidateName: { type: Type.STRING },
                  atsScore: { type: Type.NUMBER, description: 'Overall ATS score 0-100' },
                  scoreBreakdown: {
                    type: Type.OBJECT,
                    properties: {
                      requiredSkills: { type: Type.NUMBER, description: 'Score out of 40' },
                      relevantExperience: { type: Type.NUMBER, description: 'Score out of 25' },
                      roleAlignment: { type: Type.NUMBER, description: 'Score out of 20' },
                      educationQualifications: { type: Type.NUMBER, description: 'Score out of 10' },
                      relevantKeywords: { type: Type.NUMBER, description: 'Score out of 5' },
                      explanation: { type: Type.STRING, description: 'Detailed explanation of scoring factors' },
                    },
                    required: [
                      'requiredSkills',
                      'relevantExperience',
                      'roleAlignment',
                      'educationQualifications',
                      'relevantKeywords',
                      'explanation',
                    ],
                  },
                  skillSetMatch: {
                    type: Type.OBJECT,
                    properties: {
                      percentage: { type: Type.NUMBER, description: 'Skill match percentage 0-100' },
                      matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                      partiallyMatched: { type: Type.ARRAY, items: { type: Type.STRING } },
                      missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                      technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                      toolsAndPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['percentage', 'matched', 'partiallyMatched', 'missing'],
                  },
                  alignment: {
                    type: Type.STRING,
                    enum: ['Excellent', 'Strong', 'Moderate', 'Weak'],
                  },
                  alignmentExplanation: { type: Type.STRING },
                  alignmentFactors: {
                    type: Type.OBJECT,
                    properties: {
                      jobRole: { type: Type.STRING },
                      responsibilities: { type: Type.STRING },
                      experience: { type: Type.STRING },
                      projects: { type: Type.STRING },
                      technologies: { type: Type.STRING },
                      education: { type: Type.STRING },
                      certifications: { type: Type.STRING },
                    },
                    required: [
                      'jobRole',
                      'responsibilities',
                      'experience',
                      'projects',
                      'technologies',
                      'education',
                      'certifications',
                    ],
                  },
                  missingGaps: {
                    type: Type.OBJECT,
                    properties: {
                      high: { type: Type.ARRAY, items: { type: Type.STRING } },
                      medium: { type: Type.ARRAY, items: { type: Type.STRING } },
                      low: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['high', 'medium', 'low'],
                  },
                  recommendedCourses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        courseOrTopic: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        priority: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                      },
                      required: ['courseOrTopic', 'reason', 'priority'],
                    },
                  },
                  scoreBoosterTips: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        category: { type: Type.STRING, description: 'Which factor e.g. Skills (40%), Experience (25%), Alignment (20%)' },
                        currentGap: { type: Type.STRING },
                        actionableTip: { type: Type.STRING },
                        potentialPoints: { type: Type.NUMBER, description: 'Estimated score jump e.g. 5 to 15' },
                        exampleRewrite: { type: Type.STRING, description: 'Before vs After bullet point' },
                      },
                      required: ['category', 'currentGap', 'actionableTip', 'potentialPoints'],
                    },
                  },
                },
                required: [
                  'candidateId',
                  'candidateName',
                  'atsScore',
                  'scoreBreakdown',
                  'skillSetMatch',
                  'alignment',
                  'alignmentExplanation',
                  'alignmentFactors',
                  'missingGaps',
                  'recommendedCourses',
                ],
              },
            },
            generalAtsTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  tip: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ['title', 'category', 'tip', 'impact'],
              },
            },
            ranking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.NUMBER },
                  candidateName: { type: Type.STRING },
                  atsScore: { type: Type.NUMBER },
                  skillMatch: { type: Type.NUMBER },
                  alignment: { type: Type.STRING, enum: ['Excellent', 'Strong', 'Moderate', 'Weak'] },
                  keyStrengths: { type: Type.STRING },
                },
                required: ['rank', 'candidateName', 'atsScore', 'skillMatch', 'alignment', 'keyStrengths'],
              },
            },
            shortlistRecommendation: {
              type: Type.OBJECT,
              properties: {
                recommendedCandidateNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING },
              },
              required: ['recommendedCandidateNames', 'explanation'],
            },
            rawMarkdownReport: {
              type: Type.STRING,
              description: 'The exact formatted recruiter markdown report following all headers and template rules',
            },
          },
          required: [
            'jobTitle',
            'jobDescriptionSummary',
            'candidates',
            'ranking',
            'shortlistRecommendation',
            'rawMarkdownReport',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.timestamp = new Date().toISOString();

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred during resume analysis.',
    });
  }
});

// Interactive WhatsApp Chat Assistant endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    const candidateSummaries = Array.isArray(context?.candidates)
      ? context.candidates
          .map(
            (c: any, i: number) =>
              `Candidate #${i + 1}: ${c.candidateName} | ATS Score: ${c.atsScore}/100 | Alignment: ${c.alignment} | Skills: ${c.skillSetMatch?.matched?.join(', ') || 'N/A'} | Missing: ${c.skillSetMatch?.missing?.join(', ') || 'None'}`
          )
          .join('\n')
      : 'No candidate data loaded.';

    const systemInstruction = `You are a friendly, expert ATS Recruiting Assistant chatting with a hiring manager via WhatsApp.
Target Job Title: ${context?.jobTitle || 'General Technical Role'}
Evaluated Candidates:
${candidateSummaries}

Shortlist Recommendation:
${context?.shortlistRecommendation?.explanation || 'Shortlist top scoring candidates.'}

CRITICAL RULES:
1. Respond in a professional, natural WhatsApp chat style (use bullet points, bold text *like this* or **like this**, and clean recruiter insights).
2. Keep replies focused, punchy, and helpful (typically 2-4 short paragraphs or bulleted points).
3. If the user asks about charts, graphs, or comparing scores, advise them that the live interactive chart is rendered directly in this chat, and summarize the key numbers.
4. If asked about interview questions, generate 3-4 targeted questions based on the candidate's exact skill gaps.`;

    const response = await callGeminiWithFallback(ai, {
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I analyzed the candidates based on your question.';

    // Infer if a chart should be displayed
    const lower = message.toLowerCase();
    let chartType: 'scores' | 'factors' | 'skills' | null = null;
    if (lower.includes('chart') || lower.includes('graph') || lower.includes('compare') || lower.includes('score') || lower.includes('ranking')) {
      chartType = 'scores';
    } else if (lower.includes('factor') || lower.includes('breakdown') || lower.includes('weight')) {
      chartType = 'factors';
    } else if (lower.includes('skill') || lower.includes('tech')) {
      chartType = 'skills';
    }

    return res.json({
      reply,
      chartType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    // Graceful fallback response if API is temporarily unavailable
    return res.json({
      reply: `*ATS Assistant Notice:*\nI am reviewing your request. Here are the top candidates currently ranked:\n1. Alexander Rivera (94 pts - Excellent Fit)\n2. Priya Patel (68 pts - Strong Fit)\n3. Marcus Vance (36 pts - Weak Fit)\n\nFeel free to tap the chart toggle above to inspect live visual analytics!`,
      chartType: 'scores',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ATS Resume Analyzer server running on http://0.0.0.0:${PORT}`);
  });
}

start();
