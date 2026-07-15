AZEZ LAB AI — V17 FINAL ENGINEERING PROJECT PACKAGE

WINDOWS ONE-CLICK START
1. Extract this ZIP completely.
2. Double-click START-AZEZ-LAB-AI.bat
3. On the first run, keep internet connected while npm installs dependencies.
4. The browser opens automatically.

IF DOCKER ENGINE IS AVAILABLE
The launcher starts PostgreSQL + Redis, prepares Prisma, runs engineering release validation, starts Core + Worker + Product OS, then opens the application.

IF DOCKER ENGINE IS NOT AVAILABLE
The launcher explicitly starts DIRECT LOCAL DEMO MODE. The UI/Core run, but durable PostgreSQL/Redis worker mode is not active.

FILES
START-AZEZ-LAB-AI.bat   Start the project.
STOP-AZEZ-LAB-AI.bat    Stop application services.
BACKUP-AZEZ-LAB-AI.bat  Create PostgreSQL SQL backup in /backups.
RESTORE-AZEZ-LAB-AI.bat Restore a selected SQL backup after explicit confirmation.

LOCAL ADDRESSES
UI     http://127.0.0.1:5173
CORE   http://127.0.0.1:8787/api/health
READY  http://127.0.0.1:8787/api/ready
OPS    http://127.0.0.1:8787/api/ops/status

REAL AI
The project defaults to mock AI mode.
To opt in to the OpenAI adapter, edit .env locally:
AI_PROVIDER=openai
OPENAI_API_KEY=YOUR_KEY
OPENAI_MODEL=YOUR_AVAILABLE_MODEL_ID

Never share or commit the API key.

IMPORTANT CLINICAL BOUNDARY
This package is an engineering deployment candidate for laboratory decision support. It is not a certified medical device, does not establish clinical efficacy, and must not be used for unsupervised diagnosis or patient-care decisions. Real deployment requires clinical validation, privacy/security review, institution-specific configuration, and applicable regulatory assessment.
