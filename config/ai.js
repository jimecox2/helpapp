// ─── AI Configuration ─────────────────────────────────────────────────────────
//
// OLLAMA_HOST: the address of your Ollama server.
//   Local dev:   'http://localhost:11434'
//   Remote LAN:  'http://10.0.0.152:11434'
//
// GEMINI_API_KEY is never stored here — it is read from .env.local at runtime.
//
// To add or remove a model, edit the MODELS array below.
// All local models share OLLAMA_HOST; each has its own context window and limits.
// ─────────────────────────────────────────────────────────────────────────────

export const OLLAMA_HOST = 'http://10.0.0.152:11434'

// Default model shown on first load (must match an id in MODELS)
export const DEFAULT_MODEL_ID = 'gemini-flash'

// ─── Model Registry ───────────────────────────────────────────────────────────
//
// Fields:
//   id              unique key used in API calls and localStorage
//   label           short display name
//   subtitle        shown in the picker (provider · size · character)
//   provider        'gemini' | 'ollama'
//   requiresKey     true if GEMINI_API_KEY must be set
//
// Gemini-only fields:
//   geminiModel     model name passed to the Generative Language API
//   maxOutputTokens max tokens in the AI response
//   temperature     0–1 (lower = more factual)
//
// Ollama-only fields:
//   ollamaModel     model name passed to Ollama (must match `ollama list`)
//   num_ctx         context window in tokens — MUST be large enough for
//                   system prompt + trimmed docs + question + answer.
//                   Rule of thumb: set this to at least maxDocsChars/4 + 1500
//   maxDocsChars    docs are trimmed to this many characters before sending.
//                   (~4 chars per token, so 8000 chars ≈ 2000 tokens)
//   timeoutMs       abort request after this many ms (local models are slow)
//   temperature     0–1

export const MODELS = [

  // ── Cloud: Google Gemini ──────────────────────────────────────────────────

  {
    id:             'gemini-flash',
    label:          'Gemini 1.5 Flash',
    subtitle:       'Cloud · Fast · No doc limit',
    provider:       'gemini',
    requiresKey:    true,
    geminiModel:    'gemini-1.5-flash',
    maxOutputTokens: 2048,
    temperature:    0.2,
    maxDocsChars:   80000,   // Gemini has a 1M token context — no practical limit
  },

  {
    id:             'gemini-pro',
    label:          'Gemini 1.5 Pro',
    subtitle:       'Cloud · Best quality · No doc limit',
    provider:       'gemini',
    requiresKey:    true,
    geminiModel:    'gemini-1.5-pro',
    maxOutputTokens: 2048,
    temperature:    0.2,
    maxDocsChars:   80000,
  },

  // ── Local: Ollama ─────────────────────────────────────────────────────────
  //
  // Context window sizing guide:
  //   num_ctx should comfortably fit:
  //     (maxDocsChars / 4) tokens  ← docs
  //     + ~300 tokens              ← system prompt + question
  //     + ~1000 tokens             ← answer headroom
  //
  // 3B models: keep num_ctx ≤ 8192 for stability on smaller hardware.
  // 7–8B models: 8192–16384 depending on available VRAM/RAM.
  // 14B+ models: 8192 is safe; raise if you have 32GB+ RAM.

  {
    id:           'llama3.2',
    label:        'Llama 3.2',
    subtitle:     'Local · 3B · Fastest',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'llama3.2',
    num_ctx:      8192,
    maxDocsChars: 6000,    // ≈1500 tokens — small to fit the 3B context budget
    timeoutMs:    120000,
    temperature:  0.2,
  },

  {
    id:           'llama3.1-8b',
    label:        'Llama 3.1 8B',
    subtitle:     'Local · 8B · Balanced',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'llama3.1:8b',
    num_ctx:      8192,
    maxDocsChars: 12000,   // ≈3000 tokens
    timeoutMs:    180000,
    temperature:  0.2,
  },

  {
    id:           'mistral',
    label:        'Mistral 7B',
    subtitle:     'Local · 7B · Precise',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'mistral',
    num_ctx:      8192,
    maxDocsChars: 12000,
    timeoutMs:    180000,
    temperature:  0.2,
  },

  {
    id:           'qwen2.5-7b',
    label:        'Qwen 2.5 7B',
    subtitle:     'Local · 7B · Strong at RAG',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'qwen2.5:7b',
    num_ctx:      8192,
    maxDocsChars: 14000,   // ≈3500 tokens — Qwen handles dense context well
    timeoutMs:    180000,
    temperature:  0.2,
  },

  {
    id:           'deepseek-r1-7b',
    label:        'DeepSeek R1 7B',
    subtitle:     'Local · 7B · Reasoning',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'deepseek-r1:7b',
    num_ctx:      8192,
    maxDocsChars: 10000,   // reasoning tokens can be long — leave extra headroom
    timeoutMs:    240000,  // thinking models are slower
    temperature:  0.1,    // lower temp for more consistent reasoning
  },

  {
    id:           'phi4',
    label:        'Phi-4',
    subtitle:     'Local · 14B · High accuracy',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'phi4',
    num_ctx:      8192,
    maxDocsChars: 12000,
    timeoutMs:    240000,
    temperature:  0.2,
  },

]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getModelById(id) {
  return MODELS.find(m => m.id === id) ?? MODELS[0]
}
