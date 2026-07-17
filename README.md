# FIFA Nexus AI – Stadium Intelligence Copilot
### FIFA World Cup 2026 Venue Intelligence Cockpit

FIFA Nexus AI is an enterprise-grade, real-time command dashboard designed to optimize stadium operations, volunteer tasks, crowd safety, and the fan experience for the FIFA World Cup 2026. Built with a responsive glassmorphic design and modular multi-agent structure, this platform provides real-time telemetry analytics, "What-If" crisis simulations, and automated action checklists.

---

## Technical Stack

* **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend**: FastAPI (Python), WebSockets, Pydantic, Uvicorn, OpenAI API
* **Deployment & Environments**: Docker, Docker Compose

---

## Directory Structure

```text
FIFA nexus ai/
├── README.md
├── docker-compose.yml
├── backend/
│   ├── main.py              # Application entrypoint
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── config.py        # Settings and credentials
│       ├── models.py        # Pydantic schema declarations
│       ├── api/
│       │   ├── endpoints.py # REST endpoints
│       │   └── websocket.py # Live WebSocket broadcasting
│       └── core/
│           ├── agent_engine.py  # AI Multi-agent router (7 roles)
│           ├── telemetry.py     # Live sensor data walk simulator
│           └── simulator.py     # What-If scenario logic
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    ├── Dockerfile
    └── src/
        ├── app/             # Next.js App Router (Landing, Dashboard, Portals)
        ├── components/      # UI Shell and Live SVG Heatmap Map
        ├── hooks/           # useTelemetry WS listener hook
        └── styles/          # custom glassmorphic globals
```

---

## System Features

### 1. Multi-Agent AI
The platform orchestrates **7 AI Agents** cooperating in parallel:
1. **Fan AI Assistant**: Coordinates seating routing, restroom capacity estimates, and concession queues.
2. **Volunteer Copilot**: SOP lookup library and interactive missing child lockdown alerts.
3. **Security AI**: Monitoring spectator densities and executing backup dispatches.
4. **Operations AI**: Writing venue summaries.
5. **Accessibility AI**: Dynamic step-free routing coordinates overlay.
6. **Sustainability AI**: Carbon offset and renewable grid metrics tracking.
7. **Transportation AI**: Metro delays and shuttle bus queue estimates.

### 2. What-If Simulator
Allows coordinators to stress-test stadium metrics:
* *What if Gate C closes?*
* *What if a sudden storm starts?*
* *What if Metro Line 2 suspends operations?*
* *What if visitor density surges by 30%?*
* *What if a cardiac incident occurs in Section 112?*

---

## Setup & Installation Guide

### Option A: Using Docker (Recommended)
Build and spin up both modules in unified containers:

1. Create a `.env` in the root (Optional - if skipped, high-fidelity mock engines are used instead):
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
2. Run Docker Compose:
   ```bash
   docker compose up --build
   ```
3. Open:
   * Frontend Command Console: [http://localhost:3000](http://localhost:3000)
   * Swagger REST API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option B: Local Manual Run

#### 1. Running the FastAPI Backend
```bash
cd backend
python -m venv venv
# Windows powershell:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

#### 2. Running the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/telemetry` | Fetches the current live stadium telemetry state |
| `POST` | `/api/v1/simulate` | Applies a What-If scenario (e.g. `gate_closure`, `rain`, `metro_shutdown`) |
| `POST` | `/api/v1/simulate/clear` | Removes active simulator modifiers, restoring baseline |
| `POST` | `/api/v1/chat` | Queries one of the 7 AI Agent personas (includes context body) |
| `GET` | `/api/v1/incidents` | Lists active security/medical incidents |
| `POST` | `/api/v1/incidents` | Log a new security incident (triggers AI recommendation) |
| `POST` | `/api/v1/reports/daily` | Compiles daily ops summary logs |
| `POST` | `/api/v1/reports/announcement` | Compiles speech-ready PA scripts |
| `WS` | `/ws/telemetry` | Subscribes to telemetry update stream (every 2s) |
