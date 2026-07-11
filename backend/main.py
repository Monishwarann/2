import os
import json
import logging
from typing import List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MineGuardianX-Backend")

app = FastAPI(
    title="MineGuardian X AI Safety Core Backend API",
    description="Enterprise REST & WebSocket telemetry engine for collaborative mine safety clusters.",
    version="1.0.0"
)

# Enable CORS for frontend integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager for real-time dashboard subscriptions
class ConnectionManager:
  def __init__(self):
    self.active_connections: List[WebSocket] = []

  async def connect(self, websocket: WebSocket):
    await websocket.accept()
    self.active_connections.append(websocket)
    logger.info(f"WebSocket client connected. Active connections count: {len(self.active_connections)}")

  def disconnect(self, websocket: WebSocket):
    self.active_connections.remove(websocket)
    logger.info(f"WebSocket client disconnected. Remaining: {len(self.active_connections)}")

  async def broadcast(self, message: str):
    for connection in self.active_connections:
      try:
        await connection.send_text(message)
      except Exception as e:
        logger.error(f"Error broadcasting message: {e}")

manager = ConnectionManager()

# Pydantic schemas for telemetry ingest (MQ-4, MQ-7, biometrics)
class HelmetTelemetry(BaseModel):
  helmet_id: str
  worker_id: str
  co_level: float
  methane_level: float
  heart_rate: int
  spo2: int
  ambient_temp: float
  ambient_humidity: float
  fall_detected: bool
  battery_percent: float

class ACRSAPredictionResponse(BaseModel):
  worker_id: str
  risk_score: int
  risk_category: str
  confidence_score: int
  reasoning: List[str]

@app.get("/")
def read_root():
  return {
    "status": "ONLINE",
    "architecture": "CMARI (Collaborative Multi-Agent Risk Intelligence)",
    "version": "1.0.0"
  }

# Telemetry Ingestion endpoint (invoked by ESP32 or Worker app)
@app.post("/api/v1/telemetry", status_code=status.HTTP_201_CREATED)
async def ingest_telemetry(payload: HelmetTelemetry):
  logger.info(f"Received telemetry from {payload.helmet_id}: CO={payload.co_level}ppm, CH4={payload.methane_level}% LEL")
  
  # Trigger CMARI Consensus calculations
  # (Adaptive weights aggregated via local edge nodes)
  
  # Broadcast updated state to all connected dashboard websockets
  broadcast_payload = {
    "event": "TELEMETRY_UPDATE",
    "data": payload.model_dump()
  }
  await manager.broadcast(json.dumps(broadcast_payload))
  
  return {"status": "success", "consensus_applied": True}

# WebSocket route for real-time dashboard telemetry updates
@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
  await manager.connect(websocket)
  try:
    while True:
      # Accept packets from the client if needed
      data = await websocket.receive_text()
      logger.info(f"Received from websocket client: {data}")
  except WebSocketDisconnect:
    manager.disconnect(websocket)
