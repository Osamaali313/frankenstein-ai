# Frankenstein.AI - Setup Guide

## Prerequisites

✅ Python 3.10+ installed
✅ Claude API key from https://console.anthropic.com/

## Installation Steps

### 1. Navigate to the backend directory
```bash
cd "c:\Users\A-1\Downloads\FRANKENSTEIN AI V1\frankenstein-ai-backend"
```

### 2. Activate virtual environment
The virtual environment is already created. Activate it:

**On Windows:**
```bash
venv\Scripts\activate
```

**On Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Set up environment variables
Create a `.env` file from the example:
```bash
copy .env.example .env
```

Edit `.env` and add your Claude API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### 4. Start the backend server
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process
```

### 5. Test with the CLI tool (in a new terminal)
```bash
# Activate venv first
venv\Scripts\activate

# Run the CLI test tool
python tests/test_cli.py
```

## Testing the Agents

Once the CLI is running, try these test queries:

### Test Frontend Agent (Annabelle 👻)
```
You: Build me a button component in React with Tailwind
```
Expected: Annabelle responds with React code in her creepy doll voice

### Test Backend Agent (Chucky 🔪)
```
You: Optimize this slow database query
```
Expected: Chucky responds with aggressive optimization advice

### Test Fullstack Agent (Freddy 😈)
```
You: Implement real-time notifications with WebSockets
```
Expected: Freddy responds with both frontend and backend code

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Ensure `.env` file exists in the backend directory
- Check the API key starts with `sk-ant-api03-`
- Try restarting the server after adding the key

### "Connection refused" in CLI
- Make sure the backend server is running on port 8000
- Check `http://localhost:8000/api/health` in your browser

### ImportError or ModuleNotFoundError
- Ensure the virtual environment is activated
- Re-run: `pip install -r requirements.txt`

## API Endpoints

- `GET http://localhost:8000/` - API info
- `GET http://localhost:8000/api/health` - Health check
- `GET http://localhost:8000/api/agents` - List all agents
- `WS ws://localhost:8000/ws/chat` - WebSocket chat

## Next Steps

Once Phase 1 is working:
- **Phase 2**: Build Next.js frontend with Monaco Editor
- **Phase 3**: Add code execution and preview
- **Phase 4**: Implement project context and memory
- **Phase 5**: Deploy to production

---

Made with 🧟 by the Frankenstein.AI team
