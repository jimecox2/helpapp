// Ported verbatim from the Cloudflare Worker `timebars-help-assistant` (tbrunp, deploy/workers).
// Same request and response JSON; only the entry point, key source and CORS changed.
import { corsHeaders, optionsResponse, guard } from '@/lib/ai/guard'

export const dynamic = 'force-dynamic'

const GEMINI_BASE = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * API endpoint version
 * v1: Standard API (limited features)
 * v1beta: Beta API (has JSON mode, context caching)
 */
const API_VERSION = 'v1beta';

/**
 * Response temperature (0.0 to 1.0)
 * Lower = more consistent, factual
 * Higher = more creative, varied
 */
const TEMPERATURE = 0.3;

/**
 * Maximum response tokens
 * Limits how long the AI response can be
 */
const MAX_OUTPUT_TOKENS = 2048;

export async function OPTIONS(request) {
  return optionsResponse(request)
}

// The worker answered every non-POST method with this 405 body.
export async function GET(request) {
  return jsonResponseFor(request, { error: 'Method not allowed. Use POST.' }, 405)
}

export async function POST(request) {
  const denied = await guard(request)
  if (denied) return denied

  const jsonResponse = (data, status = 200) => jsonResponseFor(request, data, status)

  try {
    // Validate API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return jsonResponse({
        error: 'GEMINI_API_KEY environment variable not set on the server.',
        instructions: 'Add GEMINI_API_KEY to the .env.local file next to the compose file and restart the container.',
      }, 500);
    }

    // Parse request body
    const body = await request.json();
    const {
      userQuestion = '',
      productCode = 'CB',
      docsContext = '', // The consolidated markdown documentation
      includeDebugInfo = false,
    } = body;

    // Validate required fields
    if (!userQuestion || !userQuestion.trim()) {
      return jsonResponse({
        error: 'Missing required field: userQuestion',
      }, 400);
    }

    if (!docsContext || !docsContext.trim()) {
      return jsonResponse({
        error: 'Missing required field: docsContext. The frontend must send the consolidated documentation.',
      }, 400);
    }

    // Build the complete prompt
    const prompt = buildHelpPrompt(userQuestion, productCode, docsContext);

    // Call Gemini API
    const startTime = Date.now();
    const geminiResponse = await callGeminiAPI(process.env.GEMINI_API_KEY, prompt);
    const endTime = Date.now();

    // Extract the answer
    const answer = extractAnswer(geminiResponse);

    // Build response
    const response = {
      success: true,
      answer,
      metadata: {
        model: GEMINI_MODEL,
        productCode,
        responseTimeMs: endTime - startTime,
        timestamp: new Date().toISOString(),
      },
    };

    // Include debug info if requested
    if (includeDebugInfo) {
      response.debug = {
        prompt,
        rawResponse: geminiResponse,
        docsContextLength: docsContext.length,
        estimatedTokens: Math.ceil(docsContext.length / 4),
      };
    }

    return jsonResponse(response, 200);

  } catch (error) {
    console.error('Help route error:', error);

    // Handle rate limit errors specially
    if (error.message && error.message.includes('429')) {
      return jsonResponse({
        error: 'API rate limit exceeded',
        message: 'You have hit the free tier rate limit (15 requests/minute or 1500/day).',
        upgrade: 'To continue using the help assistant, upgrade to the paid API tier. See the Gemini billing settings.',
        details: error.message,
      }, 429);
    }

    return jsonResponse({
      error: 'Internal server error',
      message: error.message || String(error),
    }, 500);
  }
}

/**
 * Build the complete prompt with documentation context
 */
function buildHelpPrompt(userQuestion, productCode, docsContext) {
  const productNames = {
    'AB': 'Agilebars',
    'TB': 'Timebars',
    'CB': 'Costbars',
  };

  const productName = productNames[productCode] || 'Timebars';

  return `You are a helpful AI assistant for ${productName}, a project portfolio management and scheduling application.

Your role is to help users understand how to use ${productName} by answering their questions based on the official documentation provided below.

IMPORTANT GUIDELINES:
1. Answer based on the documentation provided - do not make up features or functionality
2. Be concise and practical - focus on actionable steps
3. If the answer requires multiple steps, use numbered lists
4. If you mention a specific field name (like tbID, tbName, tbType), explain what it means in simple terms
5. **Use your knowledge of the app's patterns to provide helpful guidance:**
   - If asked about accessing/editing forms and docs don't have exact steps, suggest common patterns:
     * Right-click menus on items
     * Toolbar buttons (Advanced, Edit, etc.)
     * Context menus
   - If the docs mention related features, connect them to the question
   - Acknowledge when you're providing general guidance vs. specific documented steps
6. If you truly cannot help at all, say: "I don't have specific documentation about that. However, you might try [suggest common UI patterns]. For detailed help, contact support."
7. Use examples when helpful to clarify complex concepts
8. Always maintain a friendly, helpful tone
9. Format your response in markdown for better readability

OFFICIAL DOCUMENTATION:
${docsContext}

═══════════════════════════════════════════════════════════════
USER QUESTION:
${userQuestion}

Please provide a helpful, well-formatted answer based on the documentation above:`;
}


/**
 * Call the Gemini API
 */
async function callGeminiAPI(apiKey, prompt) {
  const url = `${GEMINI_BASE}/${API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      topP: 0.95,
      topK: 40,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Extract the answer text from Gemini API response
 */
function extractAnswer(geminiResponse) {
  try {
    const text = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No text in Gemini response');
    }

    return text.trim();
  } catch (error) {
    console.error('Failed to extract answer:', error);
    throw new Error('Invalid response from AI model');
  }
}

function jsonResponseFor(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json',
    },
  })
}
