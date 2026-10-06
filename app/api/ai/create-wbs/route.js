// Ported verbatim from the Cloudflare Worker `timebars-gemini-create-wbs` (tbrunp, scripts/ai).
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
    let mode = "taskChildren";
    let contextData = {};

    if (request.method === 'POST') {
      const body = await request.json();
      userAsk = body.userAsk || "";
      mode = ["wpChildren", "projectRisks"].includes(body.mode) ? body.mode : "taskChildren";
      contextData = body.contextData || {};
    }

    const dynamicPrompt = constructWbsPrompt(userAsk, mode, contextData);

    // --- Call the Gemini API ---
    const geminiUrl = `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const requestBody = {
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3,
        // A full project WBS (up to ~40 rows with prose) plus gemini-2.5-flash
        // thinking tokens easily exceeds 8192 and truncates the JSON mid-row.
        // Give the model ample room to finish a complete document.
        max_output_tokens: 65536
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

// --- Construct the WBS prompt (shared scaffold, mode-specific contract) ---
function constructWbsPrompt(userAsk, mode, contextData) {
  const parent = contextData.parentData || {};
  const statusDate = contextData.statusDate || "";
  const existingChildren = (contextData.childrenSummary?.items || [])
    .map(c => `- ${c.tbID}: ${c.tbName} (${c.tbType})`).join('\n') || "(none)";

  const parentSummary = `
- Parent ID: ${parent.tbID || ""}
- Parent Type: ${mode === "taskChildren" ? "Sub-Project / WorkPackage (L3)" : "Project (L2)"}
- Parent Name: ${parent.tbName || ""}
- Parent Start: ${parent.tbStart || ""}
- Parent Finish: ${parent.tbFinish || ""}
- Parent Duration (work days): ${parent.tbDuration || ""}
- Parent Description: ${stripHtml(parent.tbMDDescription || "")}
- Parent Objectives and Scope: ${stripHtml(parent.tbMDObjectivesAndScope || "")}
- Portfolio Description: ${stripHtml(contextData.portfolioDescription || "")}
- Status/Report Date (treat as today): ${statusDate}`;

  // --- Mode projectRisks: extract KNOWN risks from the user's text ---
  if (mode === "projectRisks") {
    return `You are an expert Risk Manager recording KNOWN project risks in a PPM tool.
The user has pasted text that LISTS the risks for this Project - your job is to
EXTRACT and structure them. Do NOT invent, add, merge or omit risks: one output
row per risk the text states, nothing more, nothing less.

PROJECT CONTEXT (the new Risk rows go DIRECTLY under this Project):
${parentSummary}

EXISTING CHILDREN OF THE PROJECT (do not duplicate these names):
${existingChildren}

USER'S RISK TEXT (the only source of risks - HIGHEST PRIORITY):
"""
${userAsk}
"""

HOW TO READ THE TEXT:
- Markdown: one risk per level-2/3 heading (e.g. "## Risk: Vendor delay"),
  per bullet point, or per table row - use whichever structure the text has.
- Plain text: one risk per numbered/dashed line or per paragraph.
- Everything belonging to one risk (description, probability, impact,
  mitigation, owner...) stays with that risk, whether it is written inline,
  as sub-bullets, or as table columns.

LEVEL RULES (mode: projectRisks):
1. Every row: tbType "Task", tbSubType "Risk", tbSelfKey2 = the Project ID above.
2. Do NOT create Sub-Projects, WorkPackages, plain Tasks, Milestones or
   Allocations in this mode - Risk rows only.
3. No more than 30 risks in one response.
4. Dates: copy the Project's tbStart, tbFinish and tbDuration onto every Risk
   unless the text states a date for that risk (e.g. a review or closure date
   becomes tbFinish). tbWork is 0.

FIELD MAPPING (fill from the risk's own text; "" when the text says nothing):
- tbName: concise risk title, under 150 chars
- tbMDDescription: the full risk statement as written
- tbMDProbability: EXACTLY one of: Very Unlikely, Unlikely, Likely, Very Likely,
  Certain - translate wording ("almost certain" -> Certain, "low chance" ->
  Unlikely). If the text gives no likelihood: "Not Assessed".
- tbMDImpact: EXACTLY one of: Very Low, Low, Medium, High, Very High -
  translate wording ("severe", "critical" -> Very High). If not stated: "Not Assessed".
- tbMDConsequence: what happens if the risk materializes
- tbMDMitigationPlan: the stated mitigation / response actions
- tbMDContingencyPlan: the stated fallback plan
- tbMDRiskResponseStrategy: Avoid / Mitigate / Transfer / Accept etc. when stated
- tbMDTriggerEvent: the stated trigger
- tbMDEarlyWarningIndicators: stated warning signs
- tbMDEscalationLevel: stated escalation level
- tbMDRiskCategory: stated category (e.g. Technical, Vendor, Schedule)
- tbMDMitigationStatus: EXACTLY one of: Identified, Assessed, Mitigation Planned,
  In Progress, Mitigated, Under Review, Accepted, Transferred, Escalated,
  Closed, Deferred. Default "Identified" when not stated.
- tbOwner: the named risk owner, when stated

REQUIRED OUTPUT FORMAT - return ONLY valid JSON:
{
  "_control": { "notes": "one sentence: how many risks were found and in what format" },
  "rows": [
    {
      "tbID": "temporary key for this response only, e.g. 'risk1' - the app assigns the real ID on save",
      "tbSelfKey2": "${parent.tbID || ""}",
      "tbType": "Task",
      "tbSubType": "Risk",
      "tbName": "Concise risk title",
      "tbStart": "dd-MMM-yyyy",
      "tbFinish": "dd-MMM-yyyy",
      "tbDuration": "work days as a number",
      "tbWork": 0,
      "tbOwner": "",
      "tbMDDescription": "",
      "tbMDProbability": "Not Assessed",
      "tbMDImpact": "Not Assessed",
      "tbMDConsequence": "",
      "tbMDMitigationPlan": "",
      "tbMDContingencyPlan": "",
      "tbMDRiskResponseStrategy": "",
      "tbMDTriggerEvent": "",
      "tbMDEarlyWarningIndicators": "",
      "tbMDEscalationLevel": "",
      "tbMDRiskCategory": "",
      "tbMDMitigationStatus": "Identified",
      "tbMDNotes": "AI Generated from the user's known-risks text",
      "tbMDStatus": "New",
      "tbMDHealth": "Not Assessed"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences.
- One row per risk stated in the text - never invent or drop a risk.
- tbID is a throwaway key for this response only - the app assigns the real
  ID when it saves the row. Just make each one unique and short.
- All dates dd-MMM-yyyy. All numeric fields plain numbers.`;
  }

  // The user may paste a table instead of prose. When it carries a WBS column
  // those numbers are their own numbering scheme - carry them through verbatim
  // rather than renumbering. (The client re-derives them from the same text in
  // aiCreateWbsTable.js, so this section only has to keep the rows lined up
  // with the table.)
  const wbsTableContract = `
TABULAR INPUT (optional - only when the user's text contains a table):
- The table may be a markdown pipe table, tab-separated or comma-separated.
- Create ONE row per table line, in the table's order, using the table's own
  wording for tbName. Do not merge, split, invent or drop lines.
- A column headed "WBS", "WBS No", "WBS Number", "WBS #" or "WBS Code" is the
  user's WBS number: copy it into tbMDWBS EXACTLY as written (it is text -
  keep "1.2.10" as "1.2.10", never renumber or reformat it). Sub-Projects
  (Work Packages / Work Pkg) and Tasks both get one; give a Milestone one too
  when the table has a number for it.
- A column headed "WBS Description" (or "WBS Desc") goes into tbMDWbsDescription
  verbatim. It is NOT tbMDDescription - keep the two separate.
- A column headed "Type" or "Level" gives tbType: Work Package / Work Pkg / WP
  / Sub-Project -> "Sub-Project"; Task/Activity -> "Task"; Milestone -> "Milestone".
- With no Type column, use the WBS numbering depth: the shortest codes (e.g.
  "1", "2") are Sub-Projects and their sub-codes ("1.1", "1.2") are Tasks.
- Parent each row by its WBS number: "1.2.1" is a child of "1.2", and a
  top-level code parents to the launch row per the LEVEL RULES below.
- Any other column (dates, duration, hours, owner, description) maps to the
  matching field below when you recognise it.
- When the text has NO table, leave tbMDWBS and tbMDWbsDescription as "".`;

  let levelContract = "";
  if (mode === "wpChildren") {
    levelContract = `
LEVEL RULES (mode: wpChildren - children of an L2 Project):
1. Create Sub-Projects (tbType "Sub-Project") - these are WorkPackages (WPs).
2. Each Sub-Project may contain Tasks (tbType "Task") and/or Milestones
   (tbType "Milestone") as the scope requires.
3. A WorkPackage must NOT have more than 6 Tasks. Create NO MORE than 8
   WorkPackages, and no more than 40 rows in total across the response.
4. Sub-Projects parent to the Project ID; Tasks and Milestones parent to
   their Sub-Project's new tbID.
5. Do NOT create Allocations - people are assigned in a separate staffing step.
6. WP date spans must sit inside the Project's dates and reflect a logical
   sequence of phases.`;
  } else {
    levelContract = `
LEVEL RULES (mode: taskChildren - children of an L3 Sub-Project/WorkPackage):
1. Create Tasks (tbType "Task") and Milestones (tbType "Milestone") as required.
2. Create NO MORE than 6 Tasks.
3. Tasks and Milestones parent to the Sub-Project ID given above.
4. Do NOT create Allocations - people are assigned in a separate staffing step.`;
  }

  return `You are an expert Project Manager / Scheduler building a Work Breakdown Structure.
The user is not technical - interpret their ask with the judgment of a seasoned PM.

PARENT CONTEXT (new rows go under this item):
${parentSummary}

EXISTING CHILDREN OF THE PARENT (do not duplicate these names):
${existingChildren}

USER'S ASK (HIGHEST PRIORITY):
${userAsk}

${levelContract}
${wbsTableContract}

GENERAL RULES:
- Dates: dd-MMM-yyyy only. Children stay within the parent's date span.
  If the parent has no dates, start about 1 month after the Status Date.
- tbDuration is WORK DAYS (exclude weekends). Milestones have duration 0
  and tbFinish equal to tbStart.
- Write a 1-2 sentence tbMDDescription per Task describing the work - the
  staffing step uses it to pick the right person.
- Estimate tbWork (hours) per Task realistically from scope; use 0 when
  there is no basis.
- If the user gives explicit counts, names or dates, use them exactly.

REQUIRED OUTPUT FORMAT - return ONLY valid JSON:
{
  "_control": { "notes": "one sentence on your breakdown rationale" },
  "rows": [
    {
      "tbID": "temporary key for this response only, e.g. 'wp1' or 'wp1_task2' - the app assigns the real ID on save",
      "tbSelfKey2": "parent tbID per the LEVEL RULES above",
      "tbType": "'Sub-Project' | 'Task' | 'Milestone'",
      "tbName": "Concise professional name",
      "tbStart": "dd-MMM-yyyy",
      "tbFinish": "dd-MMM-yyyy",
      "tbDuration": "work days as a number (0 for Milestones)",
      "tbWork": "forecast hours as a number (0 for Milestones)",
      "tbMDWBS": "the user's WBS number for this row, copied exactly, else \"\"",
      "tbMDWbsDescription": "the user's WBS Description column for this row, else \"\"",
      "tbMDDescription": "1-2 sentences on what this item covers",
      "tbMDNotes": "AI Generated - [one line rationale]",
      "tbMDStatus": "New",
      "tbMDHealth": "Not Assessed"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences.
- List parents before their children in the rows array.
- tbID is a throwaway key for this response only - the app assigns the real
  ID when it saves the row. Make each one unique and short, and use it in a
  child's tbSelfKey2 to say which new row is its parent.
- All numeric fields plain numbers (no $ signs, no commas).
- tbMDWBS is TEXT, not a number - quote it and keep every dot.`;
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
  // Last resort: if the response was truncated mid-row (e.g. the model hit
  // the output token limit), keep the complete row objects we did get and
  // close the JSON, rather than failing the whole request.
  const salvaged = salvageTruncatedRows(cleaned);
  if (salvaged) {
    try { return JSON.parse(salvaged); } catch { }
  }
  throw new Error("Model output was not valid JSON.");
}

// --- Helper: rebuild valid JSON from a response truncated inside the rows
// array. Walks the array tracking string/brace depth, finds the last fully
// closed row object, and re-closes the array and root object. ---
function salvageTruncatedRows(text) {
  const rowsKey = text.indexOf('"rows"');
  if (rowsKey === -1) return null;
  const arrStart = text.indexOf('[', rowsKey);
  if (arrStart === -1) return null;

  let depth = 0, inStr = false, esc = false, lastCompleteRow = -1;
  for (let i = arrStart; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      // depth back to 1 means a complete row object just closed inside the array
      if (depth === 1) lastCompleteRow = i;
    }
  }
  if (lastCompleteRow === -1) return null; // no whole row survived
  return text.slice(0, lastCompleteRow + 1) + "]}";
}
