import uvicorn
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import endpoints, websocket

# Setup basic logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FIFA World Cup 2026 - Stadium Intelligence Copilot GenAI Platform Backend",
    version="1.0.0",
)

# CORS configuration
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(endpoints.router, prefix=settings.API_V1_STR, tags=["API"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSockets"])

from fastapi.responses import HTMLResponse
import os

@app.get("/", response_class=HTMLResponse)
def read_root():
    template_path = os.path.join(os.path.dirname(__file__), "app", "templates", "index.html")
    try:
        with open(template_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        return HTMLResponse(content=html_content, status_code=200)
    except Exception as e:
        return HTMLResponse(content=f"<h3>Error loading index.html: {str(e)}</h3>", status_code=500)


if __name__ == "__main__":
    # Start the local development server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
