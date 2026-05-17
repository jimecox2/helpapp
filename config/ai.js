// AI provider configuration
// Edit OLLAMA_HOST and OLLAMA_MODEL to match your local setup.
// GEMINI_API_KEY is read from the .env.local file (never hardcode it here).

export const AI_CONFIG = {
  gemini: {
    model: 'gemini-1.5-flash',
  },
  ollama: {
    host:          'http://10.0.0.152:11434',
    model:         'llama3.2',
    num_ctx:       4096,  // safe for most hardware — raise to 8192 if you have 16GB+ RAM
    maxDocsChars:  8000,  // docs are trimmed to this before sending (≈ 2000 tokens)
    timeoutMs:     120000,
  },
}
