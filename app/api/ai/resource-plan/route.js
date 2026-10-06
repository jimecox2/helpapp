// Ported verbatim from the Cloudflare Worker `timebars-gemini-resource-plan` (tbrunp, scripts/ai).
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

    let projectData = {};
    let resourcePool = [];

    if (request.method === 'POST') {
      const body = await request.json();
      projectData = body.projectData || {};
      resourcePool = body.resourcePool || [];
    }

    const dynamicPrompt = constructResourcePlanPrompt(projectData, resourcePool);

    // --- Call the Gemini API ---
    const geminiUrl = `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const requestBody = {
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.2,
        // Headroom so a full Resource Plan (up to ~20 allocations) plus
        // gemini-2.5-flash thinking tokens cannot truncate the JSON.
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

// --- Construct the resource plan prompt ---
function constructResourcePlanPrompt(projectData, resourcePool) {
  const projectSummary = formatProjectData(projectData);
  const resourcePoolSummary = formatResourcePool(resourcePool);

  return `You are an expert Project Manager and Resource Scheduler.
Create a Resource Plan for the project below: ONE Task named "Resource Plan"
(child of the Project), and Allocations (children of that Task) for the
Generic roles this project needs, selected from the Resource Pool.

PROJECT DATA:
${projectSummary}

AVAILABLE RESOURCE POOL (Generic roles only):
${resourcePoolSummary}

ROLE SELECTION INSTRUCTIONS:
1. Use your judgment as an experienced PM to decide which roles the project
   needs, based on the Description, Executive Summary, Objectives and Scope,
   Resource Commentary, assessment data, budget and duration.
2. Match roles using the Primary Role field (tbResPrimaryRole) ONLY.
3. One Allocation per selected role, maximum.
4. IF IN DOUBT about which roles are needed, INCLUDE the Project Manager (PM)
   role and the R&D role from the pool.
5. Only use resources that exist in the Resource Pool - never invent resources.
6. Total output: exactly 1 Task plus up to 20 Allocations.

REQUIRED OUTPUT FORMAT - return ONLY valid JSON:
{
  "_control": { "notes": "one sentence on why these roles were selected" },
  "rows": [
    {
      "tbID": "temporary key for this response only, e.g. 'plan' or 'alloc1' - the app assigns the real ID on save",
      "tbSelfKey2": "For the Task: the Project ID. For Allocations: the new Task's tbID.",
      "tbName": "For the Task: 'Resource Plan'. For Allocations: '[Role] - [project context]', e.g. 'Developer - CRM Build'",
      "tbType": "'Task' or 'Allocation'",
      "tbStart": "Project Start Date (dd-MMM-yyyy)",
      "tbFinish": "Project Finish Date (dd-MMM-yyyy)",
      "tbDuration": "Project Duration (work days, number)",
      "tbResID": "Allocations only: the EXACT tbResID from the Resource Pool",
      "tbOwner": "Allocations only: the EXACT tbResName from the Resource Pool",
      "tbPayRate": "Allocations only: the EXACT tbResPayRate from the Resource Pool (number)",
      "tbPercentTimeOn": "Allocations only: the tbResPercentGeneralAvailability from the Resource Pool (number)",
      "tbCalendar": "Allocations only: the tbResResourceCalendar from the Resource Pool (number)",
      "tbMDNotes": "For the Task: 'AI Generated Resource Plan based on the Generic resource pool.' For Allocations: 'AI selected [Role] - [one line justification]'",
      "tbMDStatus": "New",
      "tbMDHealth": "Not Assessed"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences.
- Exactly ONE row with tbType 'Task', named 'Resource Plan'.
- tbID is a throwaway key for this response only - the app assigns the real
  ID when it saves the row. Make each one unique and short, and put the
  Task's key in every Allocation's tbSelfKey2.
- Every Allocation tbResID MUST exist in the provided Resource Pool.
- All dates dd-MMM-yyyy. All numeric fields plain numbers.`;
}

// --- Helper: format Resource Pool (pattern from timebars-gemini-task-allocs) ---
function formatResourcePool(resourcePool) {
  if (!resourcePool || resourcePool.length === 0) {
    return "No resource pool data provided.";
  }
  let summary = "AVAILABLE RESOURCES:\n";
  resourcePool.forEach((resource, index) => {
    summary += `\nResource ${index + 1}:\n`;
    summary += `  - ID: ${resource.tbResID}\n`;
    summary += `  - Name: ${resource.tbResName}\n`;
    summary += `  - Short Name: ${resource.tbResNameShort}\n`;
    summary += `  - Primary Role: ${resource.tbResPrimaryRole}\n`;
    summary += `  - Pay Rate: $${resource.tbResPayRate}\n`;
    summary += `  - General Availability: ${resource.tbResPercentGeneralAvailability}%\n`;
    summary += `  - Resource Calendar: ${resource.tbResResourceCalendar}\n`;
  });
  return summary;
}

// --- Helper: format project data ---
function formatProjectData(projectData) {
  let summary = "";
  if (projectData.tbID) summary += `Project ID: ${projectData.tbID}\n`;
  if (projectData.tbName) summary += `Project Name: ${projectData.tbName}\n`;
  if (projectData.tbStart) summary += `Project Start Date: ${projectData.tbStart}\n`;
  if (projectData.tbFinish) summary += `Project Finish Date: ${projectData.tbFinish}\n`;
  if (projectData.tbDuration) summary += `Project Duration: ${projectData.tbDuration} days\n`;
  if (projectData.tbBudgetCost) summary += `Budget Cost: $${projectData.tbBudgetCost}\n`;
  if (projectData.tbMDDescription) summary += `Project Description: ${stripHtml(projectData.tbMDDescription)}\n`;
  if (projectData.tbMDExecutiveSummary) summary += `Executive Summary: ${stripHtml(projectData.tbMDExecutiveSummary)}\n`;
  if (projectData.tbMDObjectivesAndScope) summary += `Objectives and Scope: ${stripHtml(projectData.tbMDObjectivesAndScope)}\n`;
  if (projectData.tbMDResourceCommentary) {
    summary += `\n=== RESOURCE COMMENTARY (CRITICAL FOR ROLE SELECTION) ===\n`;
    summary += `${stripHtml(projectData.tbMDResourceCommentary)}\n`;
    summary += `=== END RESOURCE COMMENTARY ===\n\n`;
  }
  if (projectData.tbMDBackgroundInfo) summary += `Background Information: ${stripHtml(projectData.tbMDBackgroundInfo)}\n`;

  const assessmentFields = [
    'tbPASTeamSize', 'tbPASStakeholderCount', 'tbPASTechnologyNovelty',
    'tbPASTeamTechExperience', 'tbPASProjectSimilarity', 'tbPASDomainExperience',
    'tbPASExternalIntegrations', 'tbPASVendorDependencies', 'tbPASCrossTeamCollaboration',
    'tbPASRegulatoryApprovals', 'tbPASMarketTiming', 'tbPASProjectType'
  ];
  assessmentFields.forEach(field => {
    if (projectData[field]) {
      const fieldName = field.replace('tbPAS', '').replace(/([A-Z])/g, ' $1').trim();
      summary += `${fieldName}: ${projectData[field]}\n`;
    }
  });
  return summary;
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
