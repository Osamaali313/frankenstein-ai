---
inclusion: always
---

# Frankenstein.AI Project Overview

## System Architecture

This is **Frankenstein.AI** - a horror-themed multi-agent AI coding assistant built with:
- **Backend**: Python FastAPI + LangGraph + Claude Sonnet 4
- **Frontend**: Next.js 16 + TypeScript + Monaco Editor
- **Communication**: WebSocket for real-time streaming

## Core Concept

Each AI agent is a horror character specialist with unique personality and expertise:
- 👻 **Annabelle**: Frontend & UI/UX specialist (possessed doll obsessed with perfect design)
- 🔪 **Chucky**: Backend & Performance specialist (killer who destroys bugs)
- 😈 **Freddy Krueger**: Fullstack specialist (nightmare developer)
- 🪓 **Jason**: Business Analyst (silent slasher who cuts through requirements)
- 🤡 **Pennywise**: Testing & QA specialist (playful clown who finds bugs)
- 👤 **Ghostface**: Security specialist (paranoid hunter who stalks vulnerabilities)
- 📿 **Valak**: Project Manager (demonic PM who asks hard questions)
- ⛓️ **Pinhead**: CTO/Reviewer (Cenobite who reviews with precision)

## Key Features

1. **Intelligent Routing**: Supervisor agent analyzes requests and routes to appropriate specialist
2. **Learning System**: Agents learn from interactions and improve over time
3. **Orchestration Mode**: Multi-agent collaboration with review cycles (Pinhead reviews worker agents)
4. **Real-time Streaming**: WebSocket-based communication with chunked responses
5. **Personality-Driven**: Each agent responds in character while providing technical expertise

## Project Structure

```
frankenstein-ai/
├── frankenstein-ai-backend/     # Python FastAPI backend
│   ├── agents/                  # Agent personalities
│   ├── graph/                   # LangGraph orchestration
│   ├── learning/                # Memory & metrics system
│   ├── api/                     # API layer
│   └── main.py                  # Server entry point
│
└── frankenstein-ai-frontend/    # Next.js frontend
    ├── app/                     # App router (landing + studio)
    ├── components/              # React components
    └── lib/                     # Utilities & hooks
```

## Development Workflow

1. Backend runs on `localhost:8000` (FastAPI + Uvicorn)
2. Frontend runs on `localhost:3000` (Next.js dev server)
3. WebSocket connection at `ws://localhost:8000/ws/chat`
4. REST API at `http://localhost:8000/api/*`

## Important Notes

- All agents use Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- API key stored in `.env` file (never commit)
- CORS configured for `localhost:3000` and `localhost:3001`
- Learning data stored in `frankenstein-ai-backend/learning/memory/`
- Each agent has distinct personality prompts in `agents/personalities.py`

## System Credits

**Built by**: Kiro AI Assistant
**Architecture**: Multi-agent LangGraph system with personality-driven specialists
**Innovation**: Horror-themed coding assistant with learning capabilities
**Date**: December 2025
