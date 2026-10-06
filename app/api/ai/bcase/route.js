// Ported verbatim from the Cloudflare Worker `timebars-gemini-bcase` (tbrunp, scripts/ai).
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

  let dynamicPrompt = '';
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set on the server (.env.local).");
    }

    // Parse the incoming request body
    let projectData = {};
    let resultFields = [];

    if (request.method === 'POST') {
      const body = await request.json();
      projectData = body.projectData || {};
      resultFields = body.resultFields || [];

    }

    // --- Construct Dynamic Prompt ---
    dynamicPrompt = constructProjectCharterPrompt(projectData, resultFields);

    console.log({ log: "  xxx dynamicPrompt", dynamicPrompt: dynamicPrompt, })


    // --- Call the Gemini API ---
    const geminiUrl = `${GEMINI_BASE}/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: dynamicPrompt
        }]
      }]
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    // new
    // ... (rest of the Worker code remains unchanged up to the Gemini call)

    const responseData = await geminiResponse.json();
    const text = responseData.candidates[0].content.parts[0].text;

    // Try to parse the response as JSON
    let parsedResult;
    try {
      // Clean the response in case it has markdown formatting
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      parsedResult = JSON.parse(cleanedText);
    } catch (parseError) {
      // If parsing fails, return the raw text
      parsedResult = { error: "Failed to parse JSON", rawResponse: text };
    }

    const headers = corsHeaders(request);
    // Bundle the parsed result and the prompt together
    const bundledResponse = {
      aiResult: parsedResult,
      prompt: dynamicPrompt  // Add this for debugging/logging
    };

    return new Response(JSON.stringify(bundledResponse), {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });

    // In the catch block for errors:
  } catch (error) {
    const headers = corsHeaders(request);
    // Optionally include prompt here too for error debugging
    const errorResponse = { error: error.message, prompt: dynamicPrompt || 'Prompt not generated' };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
  }
}

// --- Function to construct the Project Charter enrichment prompt ---
function constructProjectCharterPrompt(projectData, resultFields) {
  const projectSummary = formatProjectData(projectData);
  const fieldsDescription = getFieldDescriptions();

  return `
You are an expert PMO analyst with technical and organizational knowledge.
The Project below already exists in a PPM tool; its Business Case content has been
mapped into Charter fields. Your job is to ENRICH and COMPLETE the Project Charter
narrative fields - flesh out thin fields and fill blank ones - so the Charter reads
professionally for executive sign-off.


PROJECT DATA:
${projectSummary}

INSTRUCTIONS:
1. Analyze the provided project information thoroughly, including Portfolio Description, Project Description, Background, Executive Summary, Problem/Opportunity, Objectives and Scope, Budget, Work/Hours, and Investment Alignment.
2. Generate detailed, professional content for each Project Charter field, ensuring it is practical, actionable, and aligned with business best practices (include high-level technical needs where relevant).
3. BUILD ON the existing content - preserve facts already stated in PROJECT DATA, do not contradict or discard them; expand thin fields and complete blank ones.
4. Use specific examples and metrics where appropriate.


REQUIRED OUTPUT FORMAT:
Return ONLY a valid JSON object with the following fields:
${resultFields.map(field => `"${field}": "your detailed analysis for ${field}"`).join(',\n')}

EXAMPLE OUTPUTS (FOR GUIDANCE):
For tbMDValueProposition: "This initiative offers a unique value by automating 70% of manual business case drafting, providing a competitive edge through faster proposal cycles and reduced errors, potentially increasing project approval rates by 15% based on industry benchmarks."
For tbMDSuccessCriteria: "Success is defined by reducing business case creation time from 20 hours to under 5 hours per document, achieving 90% accuracy in AI-generated fields as validated by analysts, and integrating seamlessly with the CRM system within the 102-day timeline."


FIELD GUIDANCE:
${fieldsDescription}

IMPORTANT:
- Return ONLY valid JSON.
- Each field should contain detailed, professional content (2-4 sentences minimum, maximum 2-4 paragraphs).
- If incoming fields have no data, continue as best you can.`;
}

// --- Helper function to format project data ---
function formatProjectData(projectData) {
  let summary = "";

  if (projectData.pfDescription) {
    summary += `Portfolio Description: ${projectData.pfDescription}\n`;
  }

  if (projectData.tbMDProduct) {
    summary += `Primary Product: ${projectData.tbMDProduct}\n`;
  }


  if (projectData.tbName) {
    summary += `Project Name: ${projectData.tbName}\n`;
  }

  if (projectData.tbMDDescription) {
    summary += `Project Description: ${stripHtml(projectData.tbMDDescription)}\n`;
  }

  if (projectData.tbMDExecutiveSummary) {
    summary += `Executive Summary: ${stripHtml(projectData.tbMDExecutiveSummary)}\n`;
  }
  if (projectData.tbMDSeniorLevelCommitment) {
    summary += `Sr. level Commitment: ${stripHtml(projectData.tbMDSeniorLevelCommitment)}\n`;
  }

  if (projectData.tbMDProblemOpportunity) {
    summary += `Problem/Opportunity: ${stripHtml(projectData.tbMDProblemOpportunity)}\n`;
  }

  if (projectData.tbMDObjectivesAndScope) {
    summary += `Objectives and Scope: ${stripHtml(projectData.tbMDObjectivesAndScope)}\n`;
  }

  if (projectData.tbMDBackgroundInfo) {
    summary += `Background: ${stripHtml(projectData.tbMDBackgroundInfo)}\n`;
  }
  if (projectData.tbMDOptionsAnalysis) {
    summary += `Options Analysis: ${stripHtml(projectData.tbMDOptionsAnalysis)}\n`;
  }

  if (projectData.tbBudgetCost) {
    summary += `Budget: $${projectData.tbBudgetCost}\n`;
  }
  if (projectData.tbWork) {
    summary += `Work/Hours: $${projectData.tbWork}\n`;
  }

  if (projectData.tbDuration) {
    summary += `Duration: ${projectData.tbDuration} days\n`;
  }
  if (projectData.tbMDInvestmentCategory) {
    summary += `Investment Category: ${projectData.tbMDInvestmentCategory} \n`;
  }
  if (projectData.tbMDInvestmentObjective) {
    summary += `Investment Objective: ${projectData.tbMDInvestmentObjective} \n`;
  }
  if (projectData.tbMDInvestmentStrategy) {
    summary += `Investment Strategy: ${projectData.tbMDInvestmentStrategy} \n`;
  }
  if (projectData.tbMDInvestmentInitiative) {
    summary += `Investment Initiative: ${projectData.tbMDInvestmentInitiative} \n`;
  }
  if (projectData.tbMDProjectType) {
    summary += `Project Type: ${projectData.tbMDProjectType} \n`;
  }
  // Add assessment data
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

  if (projectData.tbPASOverallFeasibilityScore) {
    summary += `Overall Feasibility Score (out of 100): ${projectData.tbPASOverallFeasibilityScore}\n`;
  }
  return summary;
}

// --- Helper function to strip HTML tags ---
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
}

// --- Helper function to provide field descriptions ---
function getFieldDescriptions() {
  return `
- tbMDValueProposition: Clear statement of unique value and competitive advantage
- tbMDPrerequisitesChecklist: What are the prequisites for the organization to begin the initiative and succeed. Use assessmentFields to help determine technical aspects.
- tbMDKeyDependencies: Clear statement of technologies or business elements that ths initiative depends on. Use assessmentFields to help determine technical aspects.
- tbMDSuccessCriteria: Specific, measurable outcomes that define project success
- tbMDDecisionsRequired: Key decisions needed from leadership or stakeholders
- tbMDKeyRecommendations: Primary recommendations for project execution
- tbMDMarketAnalysis: Analysis of market conditions, competition, and timing
- tbMDKeyProjectMetrics: Critical metrics to track project progress and success
- tbMDCapabilitiesNeeded: Resources, skills, and capabilities required
- tbMDConsequence: Risks and consequences of not proceeding with the project
- tbMDExpectedBenefits: Quantified benefits and positive outcomes
- tbMDConstraintsAssumptions: Known limitations and key assumptions
- tbMDCostBenefitAnalysis: Financial analysis comparing costs to benefits
- tbMDStakeholderDescription: Key stakeholders and their roles/interests
- tbMDImplementationApproach: High-level implementation strategy
- tbMDNextSteps: Immediate actions and next phases
- tbMDPortfolioImpactAnalysis: Potential impacts to the portfolio, use pfDescription for helpfull information about the portfolio
- tbMDScopeCommentary: Discussion on scope and how to create WBS and manage it
- tbMDFinancialCommentary: Clear statement of financial needs or impacts
- tbMDResourceCommentary: Clear statement of resource needs or impacts at a high level
- tbMDBudgetCommentary: Clear statement of Budget needs or impacts at a high level
- tbMDScheduleCommentary: Clear statement of scheduling need or potential impacts to portfolio at a high level
- tbMDInvestmentCategory: Classification of project for PPM Analysis Purposes
- tbMDInvestmentObjective: Project goals and intended outcomes e.g. Grow the Business
- tbMDInvestmentStrategy: Strategic fit to business or technical needs
- tbMDInvestmentInitiative: Specific executive or organizational initiative alignment
- tbMDProjectType: Is this an Enhancement, New, Incremental etc.`;
}
