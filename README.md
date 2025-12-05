# 🧟 Frankenstein.AI

<p align="center">
  <img src="LOGO.webp" alt="Frankenstein.AI Logo" width="200"/>
</p>

> A horror-themed multi-agent AI coding assistant where each specialist is a legendary horror character with unique expertise and personality.

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15-black.svg)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4-orange.svg)

## 🎭 Overview

Frankenstein.AI is an intelligent multi-agent system that combines the power of Claude Sonnet 4 with personality-driven horror character specialists. Each agent brings unique expertise while maintaining an entertaining, horror-themed persona that makes coding assistance both effective and engaging.

### Meet the Team

| Agent | Icon | Specialty | Personality |
|-------|------|-----------|-------------|
| **Annabelle** | 👻 | Frontend & UI/UX | Possessed doll obsessed with pixel-perfect design |
| **Chucky** | 🔪 | Backend & Performance | Killer who destroys bugs and optimizes ruthlessly |
| **Freddy Krueger** | 😈 | Fullstack & Complex Features | Nightmare developer who builds while you sleep |
| **Jason** | 🪓 | Business Analysis | Silent slasher who cuts through requirements |
| **Pennywise** | 🤡 | Testing & QA | Playful clown who finds bugs in the sewers |
| **Ghostface** | 👤 | Security & Pentesting | Paranoid hunter who stalks vulnerabilities |
| **Valak** | 📿 | Project Management | Demonic PM who asks the hard questions |
| **Pinhead** | ⛓️ | CTO/Code Review | Cenobite who reviews with precision |

## ✨ Key Features

- **🎯 Intelligent Routing**: Supervisor agent analyzes requests and routes to the perfect specialist
- **🧠 Learning System**: Agents learn from interactions and improve over time
- **⚡ Real-time Communication**: WebSocket-based streaming responses
- **🎨 Beautiful UI**: Horror-themed Next.js frontend with Monaco code editor
- **🔄 Orchestration Mode**: Multi-agent collaboration with review cycles
- **📊 Performance Metrics**: Track agent performance and learning progress
- **🎭 Personality-Driven**: Each agent responds in character with technical expertise

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRANKENSTEIN.AI SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                            │
│                    (Next.js 15 + TypeScript)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │   Landing   │  │    Studio    │  │   Learning Panel   │     │
│  │    Page     │  │  (Chat + IDE)│  │   (Metrics View)   │     │
│  └─────────────┘  └──────────────┘  └────────────────────┘     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Monaco Code Editor Integration              │   │
│  │  - Syntax highlighting  - Auto-completion             │   │
│  │  - Multi-language       - Code preview                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              WebSocket Client (Zustand)               │   │
│  │  - Real-time streaming  - State management            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ WebSocket (ws://localhost:8000/ws/chat)
                             │ REST API (http://localhost:8000/api/*)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                         BACKEND LAYER                             │
│                   (FastAPI + LangGraph + Claude)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    FastAPI Server                        │   │
│  │  - WebSocket endpoint  - REST endpoints                  │   │
│  │  - CORS middleware     - Health checks                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                     │
│                             ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SUPERVISOR AGENT (Router)                   │   │
│  │  - Analyzes user requests                                │   │
│  │  - Routes to appropriate specialist                      │   │
│  │  - Handles orchestration mode                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                     │
│                             ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  LANGGRAPH WORKFLOW                      │   │
│  │                                                           │   │
│  │   ┌─────────┐   ┌─────────┐   ┌─────────┐              │   │
│  │   │Annabelle│   │ Chucky  │   │ Freddy  │              │   │
│  │   │Frontend │   │Backend  │   │Fullstack│              │   │
│  │   └─────────┘   └─────────┘   └─────────┘              │   │
│  │                                                           │   │
│  │   ┌─────────┐   ┌─────────┐   ┌─────────┐              │   │
│  │   │  Jason  │   │Pennywise│   │Ghostface│              │   │
│  │   │Business │   │ Testing │   │Security │              │   │
│  │   └─────────┘   └─────────┘   └─────────┘              │   │
│  │                                                           │   │
│  │   ┌─────────┐   ┌─────────┐                             │   │
│  │   │  Valak  │   │ Pinhead │                             │   │
│  │   │   PM    │   │   CTO   │                             │   │
│  │   └─────────┘   └─────────┘                             │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                     │
│                             ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              LEARNING & MEMORY SYSTEM                    │   │
│  │  - Agent performance tracking                            │   │
│  │  - Interaction history                                   │   │
│  │  - Context retrieval                                     │   │
│  │  - Metrics & analytics                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Anthropic Claude Sonnet 4                   │   │
│  │  - Natural language understanding                        │   │
│  │  - Code generation                                       │   │
│  │  - Personality simulation                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

```
1. User sends request via WebSocket
   │
   ▼
2. Supervisor analyzes request
   │
   ├─ Direct agent selection? → Route to specific agent
   │
   └─ Auto-routing? → Analyze and select best agent
   │
   ▼
3. Selected agent processes request
   │
   ├─ Retrieves learning context
   ├─ Generates response with personality
   └─ Streams response back
   │
   ▼
4. Orchestration mode enabled?
   │
   ├─ Yes → Pinhead reviews response
   │   │
   │   ├─ Approved → Send to user
   │   ├─ Needs work → Agent revises (max 3 iterations)
   │   └─ Rejected → Agent revises
   │
   └─ No → Send directly to user
   │
   ▼
5. Record interaction for learning
   │
   └─ Update agent metrics and memory
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Backend Setup

```bash
# Navigate to backend
cd frankenstein-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run server
python main.py
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend
cd frankenstein-ai-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
frankenstein-ai/
│
├── frankenstein-ai-backend/          # Python FastAPI backend
│   ├── agents/                       # Agent personality definitions
│   │   ├── __init__.py
│   │   └── personalities.py          # Character prompts & behaviors
│   │
│   ├── graph/                        # LangGraph orchestration
│   │   ├── __init__.py
│   │   ├── agent_graph.py            # Multi-agent workflow
│   │   └── state.py                  # State management
│   │
│   ├── learning/                     # Learning & memory system
│   │   ├── __init__.py
│   │   ├── agent_memory.py           # Interaction tracking
│   │   └── memory/                   # Persistent storage
│   │
│   ├── api/                          # API layer
│   │   └── __init__.py
│   │
│   ├── tests/                        # Testing utilities
│   │   ├── __init__.py
│   │   └── test_cli.py               # CLI test tool
│   │
│   ├── main.py                       # FastAPI server entry point
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── frankenstein-ai-frontend/         # Next.js frontend
│   ├── app/                          # Next.js app router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   └── studio/                   # Main IDE interface
│   │
│   ├── components/                   # React components
│   │   ├── chat/                     # Chat interface
│   │   ├── editor/                   # Monaco editor wrapper
│   │   ├── landing/                  # Landing page components
│   │   ├── learning/                 # Learning metrics UI
│   │   ├── studio/                   # Studio layout
│   │   ├── scene/                    # 3D scene components
│   │   └── ui/                       # Reusable UI components
│   │
│   ├── lib/                          # Utilities & hooks
│   ├── types/                        # TypeScript definitions
│   ├── public/                       # Static assets
│   ├── package.json                  # Node dependencies
│   └── README.md                     # Frontend documentation
│
├── README.md                         # This file
└── ARCHITECTURE.md                   # Detailed architecture docs
```

## 🎯 Usage Examples

### Example 1: Frontend Development
```
User: "Create a responsive navbar with dark mode toggle"

👻 ANNABELLE responds:
"A navbar... how delightful. Let me craft something perfectly responsive..."
[Provides React component with Tailwind CSS]
```

### Example 2: Backend Optimization
```
User: "My API endpoints are slow"

🔪 CHUCKY responds:
"Slow? I'll MURDER that performance problem!"
[Provides optimized code with caching and query improvements]
```

### Example 3: Security Review
```
User: "Review my authentication system"

👤 GHOSTFACE responds:
"Let me stalk your code for vulnerabilities..."
[Provides security analysis and recommendations]
```

### Example 4: Orchestration Mode
```
User: "Build a user dashboard" (with orchestration enabled)

😈 FREDDY creates initial implementation
   ↓
⛓️ PINHEAD reviews: "Needs better error handling"
   ↓
😈 FREDDY revises with improvements
   ↓
⛓️ PINHEAD approves: "Excellent work"
   ↓
✅ Final response delivered to user
```

## 🔌 API Reference

### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root endpoint with API info |
| `/api/health` | GET | Health check & agent status |
| `/api/agents` | GET | List all available agents |
| `/api/metrics` | GET | Agent learning metrics |

### WebSocket

**Endpoint**: `ws://localhost:8000/ws/chat`

**Send Message**:
```json
{
  "content": "Your coding question",
  "agent": "annabelle",  // Optional: specific agent
  "orchestration_enabled": false  // Optional: enable review cycle
}
```

**Receive Messages**:
```json
{
  "type": "thinking",
  "agent": "supervisor",
  "message": "Analyzing your request..."
}
```

```json
{
  "type": "stream",
  "agent": "annabelle",
  "content": "Partial response...",
  "workflow_phase": "implementation",
  "iteration_count": 1
}
```

```json
{
  "type": "response",
  "agent": "annabelle",
  "content": "Complete response with code",
  "review_status": "approved"
}
```

## 🧪 Testing

### Backend Testing

```bash
# CLI test tool
cd frankenstein-ai-backend
python tests/test_cli.py

# Health check
curl http://localhost:8000/api/health

# List agents
curl http://localhost:8000/api/agents
```

### Frontend Testing

```bash
cd frankenstein-ai-frontend
npm run lint
npm run build
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangGraph** - Multi-agent orchestration
- **LangChain** - LLM integration framework
- **Claude Sonnet 4** - AI model by Anthropic
- **WebSockets** - Real-time communication
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Three Fiber** - 3D graphics

## 📊 Learning System

The learning system tracks agent performance and improves responses over time:

- **Interaction Recording**: Every request/response is logged
- **Performance Metrics**: Success rates, response times, user ratings
- **Context Retrieval**: Past interactions inform future responses
- **Review Feedback**: Pinhead's reviews train worker agents

View metrics at: `http://localhost:8000/api/metrics`

## 🔐 Security

- API keys stored in environment variables
- CORS configured for frontend origin
- WebSocket authentication ready
- Input validation on all endpoints
- Secure agent prompt injection prevention

## 🚧 Roadmap

- [x] Phase 1: Backend foundation with multi-agent system
- [x] Phase 2: Frontend with Monaco editor integration
- [x] Phase 3: Learning system and metrics
- [x] Phase 4: Orchestration mode with review cycles
- [x] Phase 5: Code execution sandbox
- [x] Phase 6: Project context and file management ✨ NEW!
- [ ] Phase 7: Deployment and scaling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Backend won't start
- Check `ANTHROPIC_API_KEY` in `.env`
- Verify Python 3.10+ is installed
- Ensure port 8000 is available

### Frontend connection issues
- Verify backend is running on port 8000
- Check CORS settings in `main.py`
- Inspect browser console for errors

### Agents not responding
- Check API key has credits
- Review server logs for errors
- Test with CLI tool first

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with 🧟 by the Frankenstein.AI team**

*"Where horror meets code, and bugs meet their doom."*
