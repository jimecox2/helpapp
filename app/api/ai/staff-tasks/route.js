// Ported verbatim from the Cloudflare Worker `timebars-gemini-staff-tasks` (tbrunp, scripts/ai).
// Same request and response JSON; only the entry point, key source and CORS changed.
import { corsHeaders, optionsResponse, guard } from '@/lib/ai/guard'

export const dynamic = 'force-dynamic'

const GEMINI_BASE = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'

export async function OPTIONS(request) {
  return optionsResponse(request)
}

export async function POST(request) {
  const denied = await guard(request)
  if (denied) return denied

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set on the server (.env.local).");
    }

    let userAsk = "";
    let tasks = [];
    let candidates = [];
    let rules = { maxAvgPctAllocated: 100, maxPeakPctAllocated: 150 };

    if (request.method === 'POST') {
      const body = await request.json();
      userAsk = body.userAsk || "";
      tasks = body.tasks || [];
      candidates = body.candidates || [];
      rules = body.rules || rules;
    }

    const dynamicPrompt = constructStaffingPrompt(userAsk, tasks, candidates, rules);

    // --- Call the Gemini API ---
    const geminiUrl = `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const requestBody = {
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.2,
        // Headroom so staffing details for many Tasks plus gemini-2.5-flash
        // thinking tokens cannot truncate the JSON.
        max_output_tokens: 32768
      },
      contents: [{ parts: [{ text: dynamicPrompt }] }]
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const responseData = await geminiResponse.json();
    const text = String(responseData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");

    let parsedResult;
    try {
      parsedResult = tryParseJSONLoose(text);
    } catch (parseError) {
      parsedResult = { error: "Failed to parse JSON", rawResponse: text };
    }

    const headers = corsHeaders(request);
    return new Response(JSON.stringify(parsedResult), {
      headers: { ...headers, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const headers = corsHeaders(request);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }
}

// --- Construct the staffing prompt ---
function constructStaffingPrompt(userAsk, tasks, candidates, rules) {
  return `You are an expert Resource Manager staffing project tasks with real people.

TASKS TO STAFF:
${formatTasks(tasks)}

CANDIDATE PEOPLE (Human resources; availability shown per task window):
${formatCandidates(candidates)}

${userAsk ? `USER'S ASK (HIGHEST PRIORITY - may name roles, skills or counts):
${userAsk}
` : `Assign exactly ONE best-fit person per task.
`}
SELECTION RULES:
1. Fit first: match the task's work (name and description) to the person's
   Primary Role AND Primary Skill.
2. Availability second: prefer people at or under ${rules.maxAvgPctAllocated}% average
   allocated in the task's window. NEVER pick someone whose peak in that
   window already exceeds ${rules.maxPeakPctAllocated}%.
3. Your assignments STACK: if you give the same person several tasks with
   overlapping dates, their load adds up - spread work across people.
4. percentTimeOn: use the person's general availability unless the task
   clearly needs less.
5. Always set roleWanted to the role label the task needs (e.g. "Developer").
   If NO suitable person exists for a task, return the assignment with
   tbResID set to null - roleWanted will be used to assign a generic
   placeholder instead.
6. Only use tbResID values from the candidate list - never invent people.

REQUIRED OUTPUT FORMAT - return ONLY valid JSON:
{
  "_control": { "notes": "one or two sentences on your staffing rationale" },
  "assignments": [
    {
      "taskID": "the tbID of the task being staffed",
      "tbResID": "the EXACT tbResID of the chosen person, or null if nobody fits",
      "percentTimeOn": "number 1-100",
      "roleWanted": "role label this task needs",
      "reason": "one line: why this person (fit + availability)"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences.
- One assignment object per allocation to create.
${userAsk ? "- The user's ask decides how many allocations per task." : "- Exactly one assignment per task."}`;
}

// --- Helper: format tasks ---
function formatTasks(tasks) {
  if (!tasks || tasks.length === 0) return "(none)";
  let out = "";
  tasks.forEach((t, i) => {
    out += `\nTask ${i + 1}:\n`;
    out += `  - taskID: ${t.tbID}\n`;
    out += `  - Name: ${t.tbName}\n`;
    if (t.tbMDDescription) out += `  - Description: ${stripHtml(t.tbMDDescription)}\n`;
    out += `  - Window: ${t.tbStart} to ${t.tbFinish} (${t.tbDuration} work days)\n`;
  });
  return out;
}

// --- Helper: format candidates with per-task availability ---
function formatCandidates(candidates) {
  if (!candidates || candidates.length === 0) return "(none)";
  let out = "";
  candidates.forEach((c, i) => {
    out += `\nPerson ${i + 1}:\n`;
    out += `  - tbResID: ${c.tbResID}\n`;
    out += `  - Name: ${c.tbResName}\n`;
    out += `  - Primary Role: ${c.tbResPrimaryRole}\n`;
    out += `  - Primary Skill: ${c.tbResPrimarySkill}\n`;
    out += `  - Pay Rate: $${c.tbResPayRate}\n`;
    out += `  - General Availability: ${c.tbResPercentGeneralAvailability}%\n`;
    if (c.availabilityByTask) {
      for (const [taskID, a] of Object.entries(c.availabilityByTask)) {
        out += `  - Load in window of ${taskID}: avg ${a.avgPctAllocated}% allocated, peak ${a.peakPctAllocated}%\n`;
      }
    }
  });
  return out;
}

// --- Helper: strip HTML tags ---
function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

// --- Helper: forgiving JSON parse ---
function tryParseJSONLoose(text) {
  const cleaned = String(text)
    .replace(/```json\s*([\s\S]*?)```/gi, "$1")
    .replace(/```([\s\S]*?)```/g, "$1")
    .trim();
  try { return JSON.parse(cleaned); } catch { }
  const noTrailingCommas = cleaned.replace(/,\s*([}\]])/g, "$1");
  try { return JSON.parse(noTrailingCommas); } catch { }
  throw new Error("Model output was not valid JSON.");
}
