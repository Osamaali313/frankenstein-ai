# 🧟 Frankenstein.AI - Backend

Horror-themed multi-agent AI coding assistant with personality-driven specialist agents.

## Overview

Frankenstein.AI is a LangGraph-based multi-agent system where each AI agent is a horror character specialist:

- **👻 ANNABELLE**: Frontend specialist - A possessed doll obsessed with perfect UI/UX
- **🔪 CHUCKY**: Backend specialist - A killer who destroys bugs and optimizes code
- **😈 FREDDY KRUEGER**: Fullstack specialist - The nightmare developer who builds while you sleep

A supervisor agent analyzes each request and routes it to the appropriate specialist, who responds in character with actual code and technical advice.

## Features

- 🎭 **Personality-driven agents** with distinct voices and expertise
- 🔀 **Smart routing** via LangGraph supervisor
- ⚡ **Real-time communication** via WebSockets
- 🧠 **Claude Sonnet 4** powered responses
- 🛠️ **Production-ready code generation**
- 🧪 **CLI testing tool** included

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to the backend directory
cd frankenstein-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Claude API key
# Get your API key at: https://console.anthropic.com/
```

Your `.env` file should look like:
```
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 3. Run the Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started reloader process
INFO:     Started server process
```

### 4. Test with CLI Tool

Open a new terminal and run:

```bash
# Activate virtual environment (if not already activated)
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

# Run the CLI test tool
python tests/test_cli.py
```

## Usage Examples

### Example 1: Frontend Request
```
💀 You: Build me a beautiful button component in React

⚡ Analyzing your request...

👻 ANNABELLE:
A button... how delightful. Let me craft something *perfectly* clickable for you...

[React code with creepy commentary]
```

### Example 2: Backend Request
```
💀 You: My database queries are too slow

⚡ Analyzing your request...

🔪 CHUCKY:
Slow queries? I'll MURDER that performance problem!

[Optimized SQL/database code with aggressive tone]
```

### Example 3: Fullstack Request
```
💀 You: I need to implement real-time notifications

⚡ Analyzing your request...

😈 FREDDY:
Real-time notifications... a delicious nightmare. Let me weave this dream for you...

[Full WebSocket implementation - backend + frontend]
```

## API Endpoints

### REST Endpoints

- `GET /` - Root endpoint with API info
- `GET /api/health` - Health check
- `GET /api/agents` - List all available agents

### WebSocket

- `WS /ws/chat` - Real-time chat with agents

#### WebSocket Message Format

**Send:**
```json
{
  "content": "Your coding question or request"
}
```

**Receive:**
```json
{
  "type": "thinking",
  "agent": "supervisor",
  "message": "Analyzing your request..."
}
```

```json
{
  "type": "response",
  "agent": "annabelle",
  "content": "Agent's response with code and advice"
}
```

## Project Structure

```
frankenstein-ai-backend/
├── agents/                 # Agent implementations
│   ├── __init__.py
│   └── personalities.py   # Character personalities & prompts
├── graph/                  # LangGraph system
│   ├── __init__.py
│   ├── agent_graph.py     # Supervisor & routing
│   └── state.py           # State management
├── api/                    # API layer
│   └── __init__.py
├── tests/                  # Testing tools
│   ├── __init__.py
│   └── test_cli.py        # CLI test tool
├── main.py                 # FastAPI server
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── .gitignore
└── README.md
```

## Development

### Running in Development Mode

The server runs with auto-reload enabled by default:

```bash
python main.py
```

Any code changes will automatically restart the server.

### Testing

```bash
# Test with CLI tool
python tests/test_cli.py

# Test API health
curl http://localhost:8000/api/health

# Test agents list
curl http://localhost:8000/api/agents
```

### Adding New Agents

To add a new horror character agent:

1. Add personality prompt in `agents/personalities.py`
2. Create agent function in `graph/agent_graph.py`
3. Add node and routing in `create_agent_graph()`
4. Update API endpoints to include new agent

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Make sure you created `.env` file
- Verify your API key is valid
- Check the key starts with `sk-ant-api03-`

### "Connection refused" in CLI
- Make sure the backend server is running
- Check it's on port 8000: `http://localhost:8000`

### Agent not responding
- Check server logs for errors
- Verify your API key has credits
- Try restarting the server

## Next Steps

This is **Phase 1** - Backend Foundation. Once this is working:

- **Phase 2**: Build Next.js frontend with Monaco Editor
- **Phase 3**: Add code execution and preview
- **Phase 4**: Implement project context and memory
- **Phase 5**: Deploy to production

## Tech Stack

- **FastAPI** - Web framework
- **LangGraph** - Multi-agent orchestration
- **Claude Sonnet 4** - AI model
- **WebSockets** - Real-time communication
- **Python 3.10+** - Language runtime

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Made with 🧟 by the Frankenstein.AI team
