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

export const OLLAMA_HOST = 'http://192.168.1.195:11434'

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
    id:              'gemini-flash',
    label:           'Gemini 2.5 Flash',
    subtitle:        'Cloud · Fast · No doc limit',
    provider:        'gemini',
    requiresKey:     true,
    geminiModel:     'gemini-2.5-flash',
    maxOutputTokens: 8192,
    temperature:     0.2,
    maxDocsChars:    200000,  // Gemini 2.5 has a 1M token context — no practical limit
  },

  // ── Local: Ollama ─────────────────────────────────────────────────────────
  //
  // Context window sizing guide:
  //   num_ctx should comfortably fit:
  //     (maxDocsChars / 4) tokens  ← docs
  //     + ~300 tokens              ← system prompt + question
  //     + ~1500 tokens             ← answer headroom
  //
  // phi3:mini  (3.8B, 2.2 GB)  — fast, small context budget
  // gemma4 4B  (9.6 GB)        — Google Gemma 4, strong instruction following
  // gemma4 26B (17 GB)         — larger Gemma 4, best local quality, slower

  {
    id:           'phi3-mini',
    label:        'Phi-3 Mini',
    subtitle:     'Local · 3.8B · 2.2 GB · Fastest',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'phi3:mini',
    num_ctx:      8192,
    maxDocsChars: 6000,    // ≈1500 tokens — small model, tight context budget
    timeoutMs:    120000,
    temperature:  0.2,
  },

  {
    id:           'gemma4',
    label:        'Gemma 4 (4B)',
    subtitle:     'Local · 4B · 9.6 GB · Balanced',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'gemma4:latest',
    num_ctx:      8192,
    maxDocsChars: 14000,   // ≈3500 tokens — Gemma 4 handles dense context well
    timeoutMs:    180000,
    temperature:  0.2,
  },

  {
    id:           'mistral',
    label:        'Mistral 7B',
    subtitle:     'Local · 7B · 4.4 GB · Precise',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'mistral:latest',
    num_ctx:      4096,        // Mistral v0.3 native default in Ollama — safe and stable
    maxDocsChars: 8000,        // ≈2000 tokens — leaves headroom for answer within 4096 ctx
    timeoutMs:    180000,
    temperature:  0.2,
  },

  {
    id:           'qwen2.5-7b',
    label:        'Qwen 2.5 7B',
    subtitle:     'Local · 7B · 4.7 GB · Best at RAG',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'qwen2.5:7b',
    num_ctx:      16384,   // Qwen 2.5 supports 128K natively; 16K is safe and fast
    maxDocsChars: 20000,   // ≈5000 tokens — Qwen 2.5 excels at long-context retrieval
    timeoutMs:    180000,
    temperature:  0.15,   // slightly lower — Qwen 2.5 is very accurate, less randomness needed
  },

  {
    id:           'gemma4-26b',
    label:        'Gemma 4 (26B)',
    subtitle:     'Local · 26B · 17 GB · Best quality',
    provider:     'ollama',
    requiresKey:  false,
    ollamaModel:  'gemma4:26b',
    num_ctx:      8192,
    maxDocsChars: 12000,   // conservative — leave headroom for the larger output
    timeoutMs:    300000,  // 5 min — 26B is significantly slower
    temperature:  0.2,
  },

]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getModelById(id) {
  return MODELS.find(m => m.id === id) ?? MODELS[0]
}
