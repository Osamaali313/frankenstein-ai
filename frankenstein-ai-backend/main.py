"""
Frankenstein.AI - FastAPI Backend Server

Horror-themed multi-agent AI coding assistant.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph.agent_graph import create_agent_graph
from learning.agent_memory import agent_memory
from execution.code_executor import code_executor
from project.file_manager import file_manager
from project.project_analyzer import project_analyzer
from dotenv import load_dotenv
import json
import logging
import os

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Frankenstein.AI Backend",
    description="Horror-themed multi-agent AI coding assistant",
    version="1.0.0"
)

# CORS for Next.js frontend (and testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent graph
try:
    agent_graph = create_agent_graph()
    logger.info("Agent graph initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize agent graph: {e}")
    agent_graph = None


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🧟 Frankenstein.AI Backend",
        "status": "alive",
        "endpoints": {
            "health": "/api/health",
            "agents": "/api/agents",
            "execute": "/api/execute",
            "projects": {
                "create": "/api/projects/create",
                "analyze": "/api/projects/analyze/{project_id}",
                "structure": "/api/projects/structure/{project_id}",
                "context": "/api/projects/context/{project_id}"
            },
            "files": {
                "create": "/api/files/create",
                "read": "/api/files/read/{project_id}/{file_path}",
                "update": "/api/files/update",
                "delete": "/api/files/delete",
                "list": "/api/files/list/{project_id}"
            },
            "directories": {
                "create": "/api/directories/create"
            },
            "websocket": "/ws/chat"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "alive",
        "agents": ["annabelle", "chucky", "freddy", "jason", "pennywise", "ghostface", "valak", "pinhead"],
        "graph_initialized": agent_graph is not None
    }


@app.get("/api/agents")
async def get_agents():
    """Get list of available agents"""
    return {
        "agents": [
            {
                "id": "annabelle",
                "name": "Annabelle",
                "icon": "👻",
                "specialty": "Frontend & UI/UX",
                "description": "The possessed doll obsessed with perfect design",
                "expertise": ["React", "Next.js", "CSS", "Tailwind", "UI/UX", "Animations"]
            },
            {
                "id": "chucky",
                "name": "Chucky",
                "icon": "🔪",
                "specialty": "Backend & Performance",
                "description": "The killer who destroys bugs and optimizes code",
                "expertise": ["FastAPI", "Databases", "Performance", "APIs", "Security"]
            },
            {
                "id": "freddy",
                "name": "Freddy Krueger",
                "icon": "😈",
                "specialty": "Fullstack & Complex Features",
                "description": "The nightmare developer who builds while you sleep",
                "expertise": ["Fullstack", "Integrations", "Real-time", "Auth", "Payments"]
            },
            {
                "id": "jason",
                "name": "Jason",
                "icon": "🪓",
                "specialty": "DevOps & Infrastructure",
                "description": "The silent slasher who cuts through deployment issues",
                "expertise": ["Docker", "CI/CD", "AWS", "Kubernetes", "Infrastructure"]
            },
            {
                "id": "pennywise",
                "name": "Pennywise",
                "icon": "🤡",
                "specialty": "Testing & QA",
                "description": "The playful clown who finds bugs in the sewers",
                "expertise": ["Testing", "Jest", "Cypress", "Debugging", "TDD"]
            },
            {
                "id": "ghostface",
                "name": "Ghostface",
                "icon": "👤",
                "specialty": "Security & Pentesting",
                "description": "The paranoid hunter who stalks vulnerabilities",
                "expertise": ["Security", "Auth", "Encryption", "OWASP", "Pentesting"]
            },
            {
                "id": "valak",
                "name": "Valak",
                "icon": "📿",
                "specialty": "Project Manager",
                "description": "The demonic PM who asks the hard questions",
                "expertise": ["Project Planning", "Requirements", "Risk Management", "Clarification"]
            },
            {
                "id": "pinhead",
                "name": "Pinhead",
                "icon": "⛓️",
                "specialty": "CTO/Reviewer",
                "description": "The Cenobite who reviews code with precision",
                "expertise": ["Code Review", "Architecture", "Best Practices", "Quality Assurance"]
            }
        ]
    }


@app.get("/api/metrics")
async def get_agent_metrics():
    """Get learning metrics for all agents"""
    try:
        metrics = agent_memory.get_all_metrics()
        return {
            "status": "success",
            "metrics": metrics
        }
    except Exception as e:
        logger.error(f"Error getting metrics: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


# Request Models
class ExecuteCodeRequest(BaseModel):
    code: str
    language: str
    filename: str = None


class CreateProjectRequest(BaseModel):
    project_id: str
    name: str


class CreateFileRequest(BaseModel):
    project_id: str
    file_path: str
    content: str = ""


class UpdateFileRequest(BaseModel):
    project_id: str
    file_path: str
    content: str


class DeleteFileRequest(BaseModel):
    project_id: str
    file_path: str


class CreateDirectoryRequest(BaseModel):
    project_id: str
    dir_path: str


@app.post("/api/execute")
async def execute_code(request: ExecuteCodeRequest):
    """
    Execute code in a sandboxed environment

    Supports: Python, JavaScript/Node.js, TypeScript
    Returns execution output or error messages
    """
    try:
        logger.info(f"Executing {request.language} code...")

        result = await code_executor.execute(
            code=request.code,
            language=request.language,
            filename=request.filename
        )

        logger.info(f"Execution completed. Success: {result['success']}")
        return result

    except Exception as e:
        logger.error(f"Execution error: {e}")
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }


# Project Management Endpoints

@app.post("/api/projects/create")
async def create_project(request: CreateProjectRequest):
    """Create a new project workspace"""
    return await file_manager.create_project(request.project_id, request.name)


@app.post("/api/files/create")
async def create_file(request: CreateFileRequest):
    """Create a new file in project"""
    return await file_manager.create_file(
        request.project_id,
        request.file_path,
        request.content
    )


@app.get("/api/files/read/{project_id}/{file_path:path}")
async def read_file(project_id: str, file_path: str):
    """Read file content"""
    return await file_manager.read_file(project_id, file_path)


@app.post("/api/files/update")
async def update_file(request: UpdateFileRequest):
    """Update file content"""
    return await file_manager.update_file(
        request.project_id,
        request.file_path,
        request.content
    )


@app.post("/api/files/delete")
async def delete_file(request: DeleteFileRequest):
    """Delete a file"""
    return await file_manager.delete_file(request.project_id, request.file_path)


@app.post("/api/directories/create")
async def create_directory(request: CreateDirectoryRequest):
    """Create a new directory"""
    return await file_manager.create_directory(request.project_id, request.dir_path)


@app.get("/api/files/list/{project_id}")
async def list_files(project_id: str, dir_path: str = "."):
    """List files and directories"""
    return await file_manager.list_files(project_id, dir_path)


@app.get("/api/projects/structure/{project_id}")
async def get_project_structure(project_id: str):
    """Get entire project file structure"""
    return await file_manager.get_project_structure(project_id)


@app.get("/api/projects/analyze/{project_id}")
async def analyze_project(project_id: str):
    """Analyze project and return insights"""
    return await project_analyzer.analyze_project(project_id)


@app.get("/api/projects/context/{project_id}")
async def get_project_context(project_id: str, current_file: str = None):
    """Get AI context for project"""
    return await project_analyzer.get_context_for_ai(project_id, current_file)


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """WebSocket endpoint for agent chat"""
    await websocket.accept()
    logger.info("WebSocket connection established")

    if agent_graph is None:
        await websocket.send_json({
            "type": "error",
            "message": "Agent system not initialized. Check ANTHROPIC_API_KEY."
        })
        await websocket.close()
        return

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            logger.info(f"Received message: {message.get('content', '')[:50]}...")

            # Get the explicitly selected agent from the message
            selected_agent = message.get("agent", "").lower()

            # Get orchestration mode flag (Phase 6B feature)
            orchestration_enabled = message.get("orchestration_enabled", False)

            # Prepare state for agent graph
            # If user selected an agent explicitly, use it; otherwise let supervisor decide
            state = {
                "messages": [],
                "current_agent": selected_agent if selected_agent else "",
                "user_request": message.get("content", ""),
                "final_response": "",
                "orchestration_enabled": orchestration_enabled,
                "iteration_count": 0,
                "workflow_phase": ""
            }

            # Send thinking status
            agent_name = selected_agent if selected_agent else "supervisor"
            await websocket.send_json({
                "type": "thinking",
                "agent": agent_name,
                "message": f"{agent_name.title()} is analyzing your request..."
            })

            try:
                # Stream through agent graph using node-based streaming
                current_agent = selected_agent if selected_agent else None
                final_response = ""
                workflow_phase = ""
                iteration_count = 0
                review_status = "pending"

                logger.info(f"🔄 Starting agent graph stream with selected agent: {selected_agent or 'supervisor decides'}")

                async for chunk in agent_graph.astream(state):
                    logger.info(f"📦 Node chunk received: {list(chunk.keys())}")

                    # Each chunk is {node_name: state_update}
                    for node_name, node_state in chunk.items():
                        logger.info(f"🔹 Node: {node_name}")

                        # Extract current agent
                        if 'current_agent' in node_state and node_state['current_agent']:
                            current_agent = node_state['current_agent']
                            logger.info(f"👤 Agent: {current_agent}")

                        # Extract workflow metadata
                        if 'workflow_phase' in node_state:
                            workflow_phase = node_state['workflow_phase']
                        if 'iteration_count' in node_state:
                            iteration_count = node_state['iteration_count']
                        if 'review_status' in node_state:
                            review_status = node_state['review_status']

                        # Extract and stream final response
                        if 'final_response' in node_state and node_state['final_response']:
                            final_response = node_state['final_response']
                            logger.info(f"📝 Response: {final_response[:100]}...")

                            # Send as stream to show progress with workflow metadata
                            await websocket.send_json({
                                "type": "stream",
                                "agent": current_agent,
                                "content": final_response,
                                "workflow_phase": workflow_phase,
                                "iteration_count": iteration_count,
                                "review_status": review_status,
                                "current_agent": current_agent
                            })

                logger.info(f"✅ Stream complete. Agent: {current_agent}")

                # Send final complete response with workflow metadata
                await websocket.send_json({
                    "type": "response",
                    "agent": current_agent,
                    "content": final_response,
                    "workflow_phase": workflow_phase,
                    "iteration_count": iteration_count,
                    "review_status": review_status,
                    "current_agent": current_agent
                })

                logger.info(f"Sent final response from {current_agent}")

                # Record interaction for learning (only for worker agents)
                worker_agents = ["annabelle", "chucky", "freddy", "pennywise", "ghostface"]
                if current_agent in worker_agents:
                    try:
                        # Extract rating from review if available
                        rating = None
                        if review_status == "approved":
                            rating = 5.0
                        elif review_status == "needs_work":
                            rating = 3.0
                        elif review_status == "rejected":
                            rating = 1.0

                        agent_memory.record_interaction(
                            agent=current_agent,
                            user_request=message.get("content", ""),
                            agent_response=final_response,
                            review_status=review_status if orchestration_enabled else "approved",
                            review_feedback=state.get('review_feedback') if orchestration_enabled else None,
                            rating=rating
                        )
                        logger.info(f"📚 Recorded learning for {current_agent}")
                    except Exception as e:
                        logger.error(f"Error recording learning: {e}")

            except Exception as e:
                logger.error(f"Error processing request: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": f"Error processing request: {str(e)}"
                })

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": str(e)
            })
        except:
            pass


if __name__ == "__main__":
    import uvicorn

    # Check for API key
    if not os.getenv("ANTHROPIC_API_KEY"):
        logger.error("ANTHROPIC_API_KEY not found in environment variables!")
        logger.error("Please create a .env file with your API key.")
        exit(1)

    logger.info("Starting Frankenstein.AI Backend Server...")
    logger.info("Server will be available at: http://localhost:8000")
    logger.info("WebSocket endpoint: ws://localhost:8000/ws/chat")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
