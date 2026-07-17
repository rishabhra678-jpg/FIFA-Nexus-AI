import asyncio
import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from app.core import telemetry

logger = logging.getLogger(__name__)
router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Active connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Active connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                # Connection might have died, clean up
                self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Initial push
        initial_data = telemetry.get_current_telemetry().model_dump_json()
        await websocket.send_text(initial_data)
        
        while True:
            # Broadcast state every 2 seconds
            await asyncio.sleep(2.0)
            live_data = telemetry.get_current_telemetry().model_dump_json()
            await websocket.send_text(live_data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
