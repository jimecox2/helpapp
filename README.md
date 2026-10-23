
# new deploy 
./deploy-push-to-hub-secure.sh
Then go to new prod
ssh jcox@gmk1 
cd /home/jcox/docker/tbhelp
./deploy.sh

#   build tbrun, tbwww and tbhelp containers in one go calling: ./deploy-push-to-hub-secure.sh
D=~/Documents/SitesGithub; read -rp "Tag (Enter for $(date +%Y.%m.%d)): " T; T=${T:-$(date +%Y.%m.%d)}; read -rp "tbrun APP_VERSION (Enter keeps .env): " V; for r in helpappGitHub tbwwwGithubApr20 tbrunpGitHubMar27; do echo "== $r $T"; (cd $D/$r && if [ $r = tbrunpGitHubMar27 ]; then printf '%s\n%s\n' "$T" "$V"; else printf '%s\n' "$T"; fi | ./deploy-push-to-hub-secure.sh) || break; done

#  deploy tbrun, tbwww and tbhelp containers in one go
read -rp "Tag for tbwww, tbhelp, tbrun: " T && for s in tbwww tbhelp tbrun; do echo "== $s"; (cd $TB/$s && echo "$T" | ./deploy.sh) || break; done

# Recreate complete ref guides - ask and I’ll run it
tools/makeCompleteGuidePdfs.mjs


# Lecal help models specs, do this later with better hardware.

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