
The proof of concept for the tbgenerator using files in: public/customers, will not be moving forward and that folder and sub folders and files can be deleted after we are done.
The tbgenerator route will continue to exist and much of the AI stuff will be used and likely repurposed to use an input box where a user will paste in text to generate timebars files instead of using these public/customers files.

Make a new folder in public to host some markdown, excel and csv files among other formats.
The folder can be called projectArtifacts
Put these into it:

Left Side Box title: Project Management
public/customers/FortFrances/Business_Case_FortFrances_Wireless.md
public/customers/FortFrances/Contract_FortFrances_Wireless.md
public/customers/FortFrances/Proposal_FortFrances_Wireless.md
public/customers/Rankin/ProjectCharter-Rankin.md
public/customers/Rankin/Risk Register.md

Right Side Box title: Business Management
public/customers/Rankin/RankinMockCostEstimate.xlsx
public/customers/Rankin/ScopeOfSupplySummary-nwi-last-mile-system.md
public/customers/Rankin/RankinMockCostEstimateSchedule.csv
public/customers/Rankin/EquipmentDescription-nwi-last-mile-system.md

Now 
Remove the word: FortFrances_Wireless and RankinMock and -nwi-last-mile-system from the filenames and put underscores and caps between words e.g. Equipment_Description
We will expose the documents on the tbgenerator page as links so user can download them. 
The two existing boxes on the generator page (FortFrances and Rankin) to be changed to contain lists of links per above and titled as described above FortFrances becomes Project Management and Rankin becomes Business Management

This would give customer a good idea as to how documents can look that the AI model can take in and produce results. 
Remove the text and link: Back to Help Assistant
the text buttons: Select all and Clear all to be removed.
Change this title: TB Generator — Customer Data Generation to this: TB Generator — Timebars Data Generation

Change this note: Select customer documents, add a prompt, and generate Timebars data, to be more descriptive as to what the user can do based on what I said above in this context.
The balance of the page is done but please make the input box height double current size.

## Simple steps deploy prod on lser

git pull
docker stop tbhelpapp && docker rm tbhelpapp  
docker rmi jimecox807/tbhelpapp:latest   
./deploy-push-to-hub-secure.sh

## on prod lser for ollama-server
cd /docker/compose/tbhelpapp
./deploy.sh

cp helpappGitHub/docker-compose.yml helpappGitHub/deploy.sh helpappGitHub/.env.example ~/Docker/tbhelp/
cd ~/Docker/tbhelp && chmod +x deploy.sh


Why would I use Timebars, what would be the benefits to me as a PM

# helpapp
Standalone help app for Gemini Key or local LLM on Ollama


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