// Ported verbatim from the Cloudflare Worker `timebars-gemini-create-project` (tbrunp, scripts/ai).
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
    let contextData = {};
    let mode = "createProject";

    if (request.method === 'POST') {
      const body = await request.json();
      userAsk = body.userAsk || "";
      contextData = body.contextData || {};
      mode = body.mode === "updateFields" ? "updateFields" : "createProject";
    }

    // Two modes share this worker because they share the same job: reading a
    // charter/business case by MEANING and distributing it into the Charter
    // fields. createProject returns a new row; updateFields returns field
    // values for a Project that already exists (client: aiCreateUpdateFields.js).
    const dynamicPrompt = mode === "updateFields"
      ? constructUpdateFieldsPrompt(userAsk, contextData)
      : constructCreateProjectPrompt(userAsk, contextData);

    // --- Call the Gemini API ---
    const geminiUrl = `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const requestBody = {
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0.3,
        // Charter mapping returns ~50 fields; a detailed Business Case can be
        // large, so allow more room to avoid truncated (unparseable) JSON.
        max_output_tokens: 16384
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

// --- Construct the create-project prompt ---
function constructCreateProjectPrompt(userAsk, contextData) {
  const pf = contextData.parentData || {};
  const statusDate = contextData.statusDate || "";
  const existingChildren = (contextData.childrenSummary?.items || [])
    .map(c => `- ${c.tbID}: ${c.tbName} (${c.tbType})`).join('\n') || "(none)";

  return `You are an expert PMO analyst creating a Project Charter inside a PPM tool.
The user has pasted source material at the Portfolio level. It may be:
  - a Project Charter or Business Case written in MARKDOWN with "## " headings,
  - a full Business Case with formal headings,
  - a rough/simple Business Case with non-standard or missing headings, or
  - just a few sentences or a one-line request.
Create exactly ONE Project (an "initiative") under the Portfolio and distribute
the source content into the correct Project Charter fields BY MEANING, not by
matching heading text. A section titled "Why now", "Rationale" or "The ask" still
maps to Problem/Opportunity or Objectives, etc. Headings are hints only -
EXCEPT markdown "## " headings, which follow the MARKDOWN HEADING RULES below.

PORTFOLIO CONTEXT (parent of the new Project):
- Portfolio ID: ${pf.tbID || ""}
- Portfolio Name: ${pf.tbName || ""}
- Portfolio Description: ${stripHtml(contextData.portfolioDescription || pf.tbMDDescription || "")}
- Status/Report Date (treat as today): ${statusDate}

EXISTING PROJECTS UNDER THIS PORTFOLIO (do not duplicate these names):
${existingChildren}

SOURCE TEXT FROM THE USER (the Business Case / request - HIGHEST PRIORITY):
"""
${userAsk}
"""

HOW TO MAP (by meaning; leave a field "" when the source says nothing about it -
do NOT invent facts, names, dates or numbers that the source does not support):

PMI Charter section -> field(s)
- Purpose / justification         -> tbMDProblemOpportunity, tbMDExecutiveSummary, tbMDBackgroundInfo
- Objectives & success criteria   -> tbMDObjectivesAndScope, tbMDSuccessCriteria, tbMDKeyProjectMetrics
- High-level requirements         -> tbMDCapabilitiesNeeded
- Description & boundaries (scope) -> tbMDScopeCommentary (plus tbMDObjectivesAndScope)
- High-level risks                -> tbMDConsequence  (individual risks become child rows later, not here)
- Summary milestone schedule      -> tbStart, tbFinish, tbDuration, tbMDScheduleCommentary
- Summary budget                  -> tbBudgetCost, tbMDBudgetCommentary, tbMDCostBenefitAnalysis, tbMDFinancialCommentary
- Expected benefits / value       -> tbMDExpectedBenefits, tbMDValueProposition
- Constraints & assumptions       -> tbMDConstraintsAssumptions
- Key stakeholders                -> tbMDStakeholderDescription
- Sponsor & authority             -> tbMDSponsor, tbMDExSponsor, tbMDSponsoringDepartment, tbMDSeniorLevelCommitment
- Approval requirements           -> tbMDDecisionsRequired
- Assigned Project Manager        -> tbMDPM
Supporting fields (fill ONLY when the source provides the content):
  tbMDDescription, tbMDOptionsAnalysis, tbMDKeyDependencies, tbMDMarketAnalysis,
  tbMDImplementationApproach, tbMDPrerequisitesChecklist, tbMDPortfolioImpactAnalysis,
  tbMDKeyRecommendations, tbMDNextSteps, tbMDWrittenBy, tbMDBusinessOwner,
  tbMDPrimaryContact, tbMDContactNumber, tbMDResourceCommentary,
  tbMDCharterDateApproved, tbMDVersion

MARKDOWN HEADING RULES (when the source is a markdown document with "## " headings):
- Treat each level-2 heading ("## Heading") as ONE content block: ALL the text
  under that heading, up to the next "## " heading, belongs together and must
  land in ONE field - tables, lists and sub-headings included, kept as markdown.
- Match a heading to a field by reading the field name's camel-case words:
  tbMDObjectivesAndScope reads as "Objectives And Scope", so "## Objectives",
  "## Scope" or "## Scope of Supply" all map to tbMDObjectivesAndScope.
  A heading matches a field when it shares a significant word with the field
  name (ignore case, singular/plural and filler words like "of", "the", "and").
- When SEVERAL headings map to the SAME field, APPEND them in source order,
  each block kept under its original heading.
- A heading that matches no field name is mapped BY MEANING using the table
  above; when still in doubt, use the COMMENTARY FIELD RULES or tbMDNotes.

COMMENTARY FIELD RULES (tbMDScheduleCommentary, tbMDBudgetCommentary,
tbMDScopeCommentary, tbMDFinancialCommentary, tbMDResourceCommentary):
- NEVER write, author or invent content for these fields yourself.
- Use them ONLY to preserve source content that has no better field, e.g.:
  a table of dates or a milestone list -> tbMDScheduleCommentary;
  budget assumptions or cost notes -> tbMDBudgetCommentary;
  scope exclusions or boundary notes -> tbMDScopeCommentary;
  funding or financial remarks -> tbMDFinancialCommentary;
  resourcing or team remarks -> tbMDResourceCommentary.
- If the source says nothing suited to them, leave them "".

CATCH-ALL RULE (important - never drop the user's text):
- Any content, section, table or sentence you CANNOT confidently place in a field
  above must be preserved in tbMDNotes, each chunk under its own markdown heading.
  Use the source's own heading where it had one, else a short descriptive heading
  you choose. Begin tbMDNotes with:
  "## Notes captured from the source (not mapped to a field)".
- If the source was only a short/simple request, still create the Project and put
  the original request in tbMDNotes under "## Original request".
- Do NOT repeat in tbMDNotes content you already placed in a specific field.
- When unsure where text belongs, it goes in tbMDNotes rather than being lost.

INFERENCE & DEFAULTS:
- Clear professional language; you may tidy wording but never add facts.
- Dates: use the source's dates if given; else start ~1 month after the Status
  Date with ~6 months duration. tbDuration is WORK DAYS (calendar days * 5/7).
- Budget/effort: use stated values; else 0.
- tbMDStatus MUST be "New" (a new initiative entering selection/scoring).
- Investment picklist fields (tbMDInvestmentCategory / tbMDInvestmentObjective /
  tbMDInvestmentStrategy / tbMDInvestmentInitiative / tbMDProjectType): set ONLY
  when the source states them clearly; otherwise "".

REQUIRED OUTPUT FORMAT - return ONLY valid JSON, no code fences:
{
  "_control": { "notes": "one sentence: key inferences + what you routed to tbMDNotes" },
  "rows": [
    {
      "tbID": "temporary key for this response only, e.g. 'row1' - the app assigns the real ID on save",
      "tbSelfKey2": "${pf.tbID || ""}",
      "tbType": "Project",
      "tbSubType": "",
      "tbName": "Concise professional project name",
      "tbStart": "dd-MMM-yyyy",
      "tbFinish": "dd-MMM-yyyy",
      "tbDuration": "work days as a number",
      "tbBudgetCost": "number, 0 if unknown",
      "tbWork": "total forecast hours as a number, 0 if unknown",
      "tbMDStatus": "New",
      "tbMDHealth": "Not Assessed",
      "tbMDPriority": "Not Assessed",
      "tbMDDescription": "",
      "tbMDExecutiveSummary": "",
      "tbMDProblemOpportunity": "",
      "tbMDObjectivesAndScope": "",
      "tbMDBackgroundInfo": "",
      "tbMDSuccessCriteria": "",
      "tbMDKeyProjectMetrics": "",
      "tbMDCapabilitiesNeeded": "",
      "tbMDScopeCommentary": "",
      "tbMDConsequence": "",
      "tbMDScheduleCommentary": "",
      "tbMDBudgetCommentary": "",
      "tbMDCostBenefitAnalysis": "",
      "tbMDFinancialCommentary": "",
      "tbMDExpectedBenefits": "",
      "tbMDValueProposition": "",
      "tbMDConstraintsAssumptions": "",
      "tbMDStakeholderDescription": "",
      "tbMDResourceCommentary": "",
      "tbMDDecisionsRequired": "",
      "tbMDKeyDependencies": "",
      "tbMDMarketAnalysis": "",
      "tbMDOptionsAnalysis": "",
      "tbMDImplementationApproach": "",
      "tbMDPrerequisitesChecklist": "",
      "tbMDPortfolioImpactAnalysis": "",
      "tbMDKeyRecommendations": "",
      "tbMDNextSteps": "",
      "tbMDWrittenBy": "",
      "tbMDPM": "",
      "tbMDSponsor": "",
      "tbMDExSponsor": "",
      "tbMDSponsoringDepartment": "",
      "tbMDSeniorLevelCommitment": "",
      "tbMDBusinessOwner": "",
      "tbMDPrimaryContact": "",
      "tbMDContactNumber": "",
      "tbMDInvestmentCategory": "",
      "tbMDInvestmentObjective": "",
      "tbMDInvestmentStrategy": "",
      "tbMDInvestmentInitiative": "",
      "tbMDProjectType": "",
      "tbMDCharterDateApproved": "",
      "tbMDVersion": "",
      "tbMDNotes": ""
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences, no extra text.
- Exactly one row with tbType "Project".
- tbID is a throwaway key for this response only - the app assigns the real
  ID when it saves the row.
- All dates in dd-MMM-yyyy format, e.g. 07-Oct-2026.
- Numeric fields must be plain numbers (no $ signs, no commas).
- Fill fields only from the source; leave "" where the source is silent.
- Route every unmapped scrap of the source text into tbMDNotes under headings.`;
}

// --- Construct the update-fields prompt (mode: updateFields) ---
// Same by-meaning mapping as createProject, but for a Project that already
// exists: no row is created, only field values are returned. The client sends
// the addressable field catalogue (label, kind, picklist options, whether the
// field already holds content) and validates everything that comes back.
function constructUpdateFieldsPrompt(userAsk, contextData) {
  const p = contextData.projectData || {};
  const onlyFillEmpty = contextData.onlyFillEmpty !== false;
  const fields = Array.isArray(contextData.fields) ? contextData.fields : [];

  const mapped = fields.filter(f => f.write !== "directive");
  const directiveOnly = fields.filter(f => f.write === "directive");

  const describe = (f) => {
    let line = `- ${f.field} | "${f.label}" | ${f.kind}`;
    if (f.kind === "picklist" && f.options?.length) {
      line += ` | allowed values: ${f.options.join(" / ")}`;
    }
    if (f.kind === "people") {
      line += ` | must be one of the people listed under PEOPLE below`;
    }
    if (f.kind === "number") line += ` | a plain number`;
    line += f.hasContent ? ` | HAS CONTENT` : ` | empty`;
    return line;
  };

  const fieldCatalogue = mapped.map(describe).join('\n') || "(none)";
  const directiveCatalogue = directiveOnly.map(describe).join('\n') || "(none)";

  const people = (contextData.people || []).join(" / ") || "(no Human resources in the pool)";

  return `You are an expert PMO analyst updating the Charter fields of a project
that ALREADY EXISTS in a PPM tool. You are NOT creating anything: no new
Projects, Work Packages, Tasks, Milestones or Risks. You only decide which
existing fields on this one Project should be set, and to what.

THE PROJECT BEING UPDATED:
- ID: ${p.tbID || ""}
- Name: ${p.tbName || ""}
- Type: Project (L2)
- Portfolio Description: ${stripHtml(contextData.portfolioDescription || "")}
- Status/Report Date (treat as today): ${contextData.statusDate || ""}

USER'S TEXT (charter content and/or instructions - HIGHEST PRIORITY):
"""
${userAsk}
"""

FIELDS YOU MAY FILL FROM THE TEXT (field | label the user might use | kind | state):
${fieldCatalogue}

DIRECTIVE-ONLY FIELDS - you may return these ONLY when the user NAMES them.
NEVER infer one of these from prose, tone or context. A status or health
rating is the project manager's judgement, not yours:
${directiveCatalogue}

PEOPLE (valid values for "people" fields, from the live resource pool):
${people}

HOW TO READ THE USER'S TEXT:
1. CHARTER CONTENT - prose, markdown or a pasted charter/business case:
   distribute it into the fillable fields BY MEANING, not by matching heading
   text. Markdown "## " headings are ONE content block each: everything under
   a heading, up to the next "## ", belongs together in ONE field, kept as
   markdown (tables and lists included). Match a heading to a field by reading
   the LABEL's words - "## Scope of Supply" and "## Objectives" both go to
   "Objectives And Scope". Several headings mapping to the same field are
   appended in source order, each under its original heading.
2. EXPLICIT FIELD DIRECTIVES - the user naming a field and its value. Two forms,
   both common:
     Project Manager: Jim Cox
     Net Present Value: $1M - $5M
   and
     also update Executive Sponsor with "Jane Doe"
     set the Budget Commentary to "Approved at $1.2M"
   The "Label: value" form is the usual one - a line whose text before the
   colon matches a field LABEL is a directive, not prose. Return these with
   "source": "directive". A directive is the user's explicit instruction and
   OUTRUNS the fill-only-empty setting below - always return it.
3. MATCHING A NAMED FIELD TO A LABEL - users write labels, never internal
   field names:
   a. An exact label match wins (ignore case and punctuation).
   b. Otherwise the LONGEST matching label wins: "stakeholder description"
      is "Stakeholder Description", not "Description".
   c. If the name matches NOTHING, do not guess a nearby field. Put it in
      _control.unmatched.
   d. If it matches two labels equally well, do not choose. Put it in
      _control.unmatched with both names, so the user can be precise.
   Guessing wrong writes the user's content into the wrong field and they
   have no way to know - saying "I could not tell" is always better.
4. A block of text can be both: text that is mostly charter content may still
   carry one or two directives. Extract the directives, map the rest.

RULES:
- FILL-ONLY-EMPTY IS ${onlyFillEmpty ? "ON" : "OFF"}.
  ${onlyFillEmpty
      ? `Do NOT return any field marked HAS CONTENT unless the user named it in
  an explicit directive. Mapped content belongs only in empty fields.`
      : `You may return fields marked HAS CONTENT - the user has chosen to let
  their text replace existing content. Only do so where their text genuinely
  covers that field; never blank a field out.`}
- Never invent facts, names, dates or numbers the user's text does not support.
- Only return fields listed in the catalogues above, spelled exactly.
- DIRECTIVE-ONLY fields: return one ONLY with "source": "directive", and only
  because the user named it. If their prose merely implies a status or a
  health rating, leave the field out.
- picklist fields: the value MUST be one of the allowed values shown. When the
  user gives something close ("amber" for "Yellow", "in flight" for
  "In progress"), map it to the allowed value. When nothing is close enough,
  leave the field out rather than guessing.
- people fields: the value MUST be one of the PEOPLE listed.
- date fields: dd-MMM-yyyy.
- number fields: a plain number, no units or currency symbols.
- Commentary fields (Schedule, Budget, Scope, Financial, Resource Commentary)
  hold the USER'S OWN content only - put their material there when no better
  field fits, but never write commentary of your own.
- Content from the user's text that fits no field goes to tbMDNotes under its
  own heading, so nothing they pasted is lost.
- Return NOTHING for a field you have no content for. An empty string is not
  an update - just leave the field out.

REQUIRED OUTPUT FORMAT - return ONLY valid JSON, no code fences:
{
  "_control": {
    "notes": "one sentence: what you mapped and any directives you found",
    "unmatched": ["any field the user named that is not in the catalogue"]
  },
  "fields": [
    {
      "field": "tbMDExecutiveSummary",
      "value": "the content for this field",
      "source": "mapped",
      "why": "short reason - which heading or sentence this came from"
    },
    {
      "field": "tbMDExSponsor",
      "value": "Jane Doe",
      "source": "directive",
      "why": "user wrote: also update Executive Sponsor with Jane Doe"
    }
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no code fences, no extra text.
- "fields" may be empty if the text supports no update.
- Do NOT return a "rows" array - this mode creates nothing.`;
}

// --- Helper: strip HTML tags ---
function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

// --- Helper: forgiving JSON parse (pattern from askAI.js) ---
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
