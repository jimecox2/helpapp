
## Simple steps deploy prod on lser

git pull
docker stop tbhelpapp && docker rm tbhelpapp  
docker rmi jimecox807/tbhelpapp:latest   
./deploy-push-to-hub-secure.sh

## on prod lser for ollama-server
cd /docker/compose/tbhelpapp
./deploy.sh




Why would I use Timebars, what would be the benefits to me as a PM

# helpapp
Standalone help app for Gemini Key or local LLM on Ollama
GEMINI_API_KEY=AIzaSyD81znuwSmQika61ljXKdW_iobdf5yOJZk

To do
Make several config files one for each model i plan to use and make custom paramaters for each, then give user ability to pick from the hardcoded models in the config file. 

# Fast / lightweight
ollama pull llama3.2          # 3B  — 2.0 GB — very fast
ollama pull phi4-mini         # 3.8B — 2.5 GB — strong reasoning for its size

# Balanced (7–9B)
ollama pull llama3.1:8b       # 8B  — 4.7 GB — solid all-rounder
ollama pull mistral            # 7B  — 4.1 GB — very precise instruction following
ollama pull qwen2.5:7b        # 7B  — 4.4 GB — excellent at RAG / doc Q&A
ollama pull mistral-nemo      # 12B — 7.1 GB — Mistral's best mid-size

# Reasoning / high quality
ollama pull deepseek-r1:7b    # 7B  — 4.7 GB — thinks before answering
ollama pull deepseek-r1:14b   # 14B — 9.0 GB — better reasoning, needs ~20 GB RAM

# Large (if you have the RAM)
ollama pull llama3.1:70b      # 70B — 40 GB  — needs 48+ GB RAM
ollama pull qwen2.5:32b       # 32B — 20 GB  — outstanding RAG quality

For a help-assistant use case (doc Q&A / RAG), qwen2.5:7b and mistral tend to give the most accurate answers from provided text. I'd suggest pulling those first if you want more local options beyond what you have.