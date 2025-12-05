# 🏗️ Frankenstein.AI - Architecture Documentation

## System Overview

Frankenstein.AI is a distributed multi-agent system built on a modern microservices architecture, combining FastAPI backend with Next.js frontend, orchestrated through LangGraph and powered by Claude Sonnet 4.

## High-Level Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                         │
│              (Next.js Frontend - Port 3000)                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    WebSocket + REST API
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION TIER                         │
│              (FastAPI Backend - Port 8000)                   │
│                   + LangGraph Orchestration                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                      API Calls (HTTPS)
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                       │
│                  (Anthropic Claude API)                      │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer (Next.js)

#### Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
├── page.tsx (Landing Page)
└── studio/
    └── page.tsx (Main IDE)
        │
        ├── StudioLayout
        │   ├── AgentSelector
        │   ├── ChatInterface
        │   │   ├── MessageList
        │   │   ├── MessageInput
        │   │   └── AgentAvatar
        │   │
        │   ├── CodeEditor (Monaco)
        │   │   ├── EditorTabs
        │   │   ├── EditorPane
        │   │   └── PreviewPane
        │   │
        │   └── LearningPanel
        │       ├── MetricsChart
        │       └── AgentStats
        │
        └── WebSocketProvider
```

#### State Management (Zustand)

```typescript
interface ChatStore {
  messages: Message[]
  currentAgent: string
  isConnected: boolean
  orchestrationEnabled: boolean
  
  sendMessage: (content: string) => void
  setAgent: (agent: string) => void
  toggleOrchestration: () => void
}
```


### 2. Backend Layer (FastAPI)

#### Request Processing Pipeline

```
WebSocket Connection
        ↓
FastAPI Endpoint (/ws/chat)
        ↓
Message Validation
        ↓
Agent Graph Initialization
        ↓
┌─────────────────────────────────┐
│    Supervisor Agent (Router)    │
│  - Analyzes request             │
│  - Selects specialist           │
│  - Manages orchestration        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│     Specialist Agent Node       │
│  - Retrieves learning context   │
│  - Generates response           │
│  - Applies personality          │
└─────────────────────────────────┘
        ↓
Orchestration Enabled?
        ↓
    Yes │ No
        │  └──→ Return Response
        ↓
┌─────────────────────────────────┐
│      Pinhead Review Node        │
│  - Reviews code quality         │
│  - Checks best practices        │
│  - Provides feedback            │
└─────────────────────────────────┘
        ↓
    Approved?
        ↓
    Yes │ No (max 3 iterations)
        │  └──→ Revision Loop
        ↓
┌─────────────────────────────────┐
│      Learning System            │
│  - Record interaction           │
│  - Update metrics               │
│  - Store context                │
└─────────────────────────────────┘
        ↓
Stream Response to Client
```

#### API Endpoints Structure

```python
FastAPI App
├── / (GET)
│   └── Root info
│
├── /api/health (GET)
│   └── System health check
│
├── /api/agents (GET)
│   └── List all agents
│
├── /api/metrics (GET)
│   └── Learning metrics
│
└── /ws/chat (WebSocket)
    ├── Connection handler
    ├── Message receiver
    ├── Agent graph executor
    └── Response streamer
```

### 3. LangGraph Orchestration

#### Agent Graph Structure

```
                    START
                      ↓
            ┌─────────────────┐
            │   Supervisor    │
            │   (Router)      │
            └─────────────────┘
                      ↓
        ┌─────────────┴─────────────┐
        │  Route to Specialist      │
        └─────────────┬─────────────┘
                      ↓
    ┌─────────────────────────────────────┐
    │                                     │
    ↓         ↓         ↓         ↓       ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Annabelle│ │Chucky │ │Freddy  │ │Jason   │
│Frontend│ │Backend│ │Fullstack│ │Business│
└────────┘ └────────┘ └────────┘ └────────┘
    ↓         ↓         ↓         ↓
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Pennywise│ │Ghostface│ │Valak  │ │Pinhead │
│Testing │ │Security│ │  PM   │ │  CTO   │
└────────┘ └────────┘ └────────┘ └────────┘
    │         │         │         │
    └─────────┴─────────┴─────────┘
                      ↓
            ┌─────────────────┐
            │ Orchestration?  │
            └─────────────────┘
                   ↓  ↓
              Yes  │  │ No
                   ↓  └──→ END
            ┌─────────────────┐
            │ Pinhead Review  │
            └─────────────────┘
                      ↓
            ┌─────────────────┐
            │  Approved?      │
            └─────────────────┘
                   ↓  ↓
              Yes  │  │ No
                   ↓  └──→ Revision Loop
                  END
```

#### State Management

```python
class AgentState(TypedDict):
    messages: list[BaseMessage]
    current_agent: str
    user_request: str
    final_response: str
    orchestration_enabled: bool
    iteration_count: int
    workflow_phase: str
    review_status: str
    review_feedback: str
```

### 4. Learning & Memory System

#### Data Flow

```
User Interaction
        ↓
Agent Response
        ↓
┌─────────────────────────────────┐
│   Interaction Recording         │
│  - Timestamp                    │
│  - Agent ID                     │
│  - User request                 │
│  - Agent response               │
│  - Review status                │
│  - Rating                       │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│   Memory Storage                │
│  - JSON file per agent          │
│  - Indexed by timestamp         │
│  - Searchable by keywords       │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│   Metrics Calculation           │
│  - Total interactions           │
│  - Success rate                 │
│  - Average rating               │
│  - Approval rate                │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│   Context Retrieval             │
│  - Similar past requests        │
│  - Successful patterns          │
│  - Common pitfalls              │
└─────────────────────────────────┘
        ↓
Feed into Next Response
```

#### Memory Structure

```json
{
  "agent": "annabelle",
  "interactions": [
    {
      "timestamp": "2025-11-28T10:30:00Z",
      "user_request": "Build a button component",
      "agent_response": "...",
      "review_status": "approved",
      "review_feedback": null,
      "rating": 5.0
    }
  ],
  "metrics": {
    "total_interactions": 42,
    "success_rate": 0.95,
    "average_rating": 4.7,
    "approval_rate": 0.90
  }
}
```


## Communication Protocols

### WebSocket Protocol

#### Connection Flow

```
Client                          Server
  │                               │
  ├──── Connect ─────────────────→│
  │                               │
  │←──── Accept ───────────────────┤
  │                               │
  ├──── Send Message ────────────→│
  │     {content, agent}          │
  │                               │
  │←──── Thinking Status ──────────┤
  │     {type: "thinking"}        │
  │                               │
  │←──── Stream Chunks ────────────┤
  │     {type: "stream"}          │
  │     (multiple)                │
  │                               │
  │←──── Final Response ───────────┤
  │     {type: "response"}        │
  │                               │
  ├──── Send Message ────────────→│
  │     (next request)            │
  │                               │
```

#### Message Types

**Client → Server**
```typescript
interface ClientMessage {
  content: string
  agent?: string  // Optional: specific agent
  orchestration_enabled?: boolean
}
```

**Server → Client**
```typescript
// Thinking status
interface ThinkingMessage {
  type: "thinking"
  agent: string
  message: string
}

// Streaming response
interface StreamMessage {
  type: "stream"
  agent: string
  content: string
  workflow_phase?: string
  iteration_count?: number
}

// Final response
interface ResponseMessage {
  type: "response"
  agent: string
  content: string
  review_status?: string
  current_agent: string
}

// Error
interface ErrorMessage {
  type: "error"
  message: string
}
```

### REST API Protocol

All REST endpoints return JSON with consistent structure:

```typescript
// Success response
{
  "status": "success",
  "data": { ... }
}

// Error response
{
  "status": "error",
  "message": "Error description"
}
```

## Data Models

### Frontend Models

```typescript
// Message in chat
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  agent?: string
  timestamp: Date
  workflowPhase?: string
  iterationCount?: number
  reviewStatus?: string
}

// Agent definition
interface Agent {
  id: string
  name: string
  icon: string
  specialty: string
  description: string
  expertise: string[]
}

// Learning metrics
interface AgentMetrics {
  agent: string
  totalInteractions: number
  successRate: number
  averageRating: number
  approvalRate: number
}
```

### Backend Models

```python
# Agent state
class AgentState(TypedDict):
    messages: list[BaseMessage]
    current_agent: str
    user_request: str
    final_response: str
    orchestration_enabled: bool
    iteration_count: int
    workflow_phase: str
    review_status: str
    review_feedback: str

# Interaction record
class Interaction:
    timestamp: datetime
    agent: str
    user_request: str
    agent_response: str
    review_status: str
    review_feedback: Optional[str]
    rating: Optional[float]
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────┐
│   Frontend (Next.js)            │
│  - No auth required (Phase 1)   │
│  - Ready for JWT integration    │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│   CORS Middleware               │
│  - Allowed origins              │
│  - Credentials support          │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│   Backend API                   │
│  - Environment variables        │
│  - API key validation           │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│   Anthropic API                 │
│  - Secure API key               │
│  - HTTPS only                   │
└─────────────────────────────────┘
```

### Security Measures

1. **API Key Protection**
   - Stored in `.env` file
   - Never exposed to frontend
   - Validated on startup

2. **CORS Configuration**
   - Whitelist specific origins
   - Credentials support
   - Method restrictions

3. **Input Validation**
   - Message content sanitization
   - Agent name validation
   - Request size limits

4. **Prompt Injection Prevention**
   - Structured prompts
   - Clear role separation
   - Output validation

## Scalability Considerations

### Current Architecture (Phase 1)

```
Single Server Deployment
├── FastAPI (1 instance)
├── WebSocket connections (limited)
└── In-memory state
```

### Future Scaling (Phase 5+)

```
Load Balanced Architecture
├── Multiple FastAPI instances
├── Redis for session management
├── PostgreSQL for persistent storage
├── Message queue for async processing
└── CDN for frontend assets
```

## Performance Optimization

### Backend Optimizations

1. **Async Processing**
   - All I/O operations are async
   - Non-blocking WebSocket handling
   - Concurrent agent processing

2. **Streaming Responses**
   - Chunked response delivery
   - Reduced perceived latency
   - Better user experience

3. **Caching Strategy**
   - Learning context caching
   - Agent personality caching
   - Response pattern caching

### Frontend Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Dynamic imports

2. **State Management**
   - Zustand for minimal re-renders
   - Selective subscriptions
   - Optimistic updates

3. **Asset Optimization**
   - Image optimization
   - Font subsetting
   - CSS purging

## Monitoring & Observability

### Logging Strategy

```
Application Logs
├── INFO: Normal operations
├── WARNING: Potential issues
├── ERROR: Failures
└── DEBUG: Development details

Log Structure:
{
  "timestamp": "2025-11-28T10:30:00Z",
  "level": "INFO",
  "component": "supervisor",
  "message": "Routed to annabelle",
  "metadata": {
    "request_id": "abc123",
    "agent": "annabelle"
  }
}
```

### Metrics Tracked

1. **System Metrics**
   - Request count
   - Response time
   - Error rate
   - WebSocket connections

2. **Agent Metrics**
   - Interactions per agent
   - Success rate
   - Average rating
   - Approval rate

3. **Business Metrics**
   - Active users
   - Messages per session
   - Feature usage
   - Orchestration adoption

## Deployment Architecture

### Development Environment

```
Local Machine
├── Backend: localhost:8000
├── Frontend: localhost:3000
└── Hot reload enabled
```

### Production Environment (Future)

```
Cloud Infrastructure
├── Frontend
│   ├── Vercel/Netlify
│   └── CDN distribution
│
├── Backend
│   ├── AWS/GCP/Azure
│   ├── Container orchestration
│   └── Auto-scaling
│
└── Database
    ├── PostgreSQL (RDS)
    └── Redis (ElastiCache)
```

## Technology Stack Details

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Runtime |
| FastAPI | Latest | Web framework |
| Uvicorn | Latest | ASGI server |
| LangGraph | Latest | Agent orchestration |
| LangChain | Latest | LLM framework |
| Anthropic SDK | Latest | Claude API |
| WebSockets | Latest | Real-time communication |
| Pydantic | Latest | Data validation |

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework |
| React | 19.2 | UI library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 4 | Styling |
| Monaco Editor | 4.7 | Code editor |
| Zustand | 5.0 | State management |
| Framer Motion | 12.23 | Animations |
| React Three Fiber | 9.4 | 3D graphics |

## Design Patterns

### Backend Patterns

1. **Agent Pattern**
   - Each agent is autonomous
   - Specialized responsibilities
   - Personality-driven behavior

2. **State Machine Pattern**
   - LangGraph manages state transitions
   - Clear workflow phases
   - Predictable behavior

3. **Observer Pattern**
   - WebSocket event streaming
   - Real-time updates
   - Decoupled communication

### Frontend Patterns

1. **Component Composition**
   - Reusable UI components
   - Props-based configuration
   - Clear hierarchy

2. **Custom Hooks**
   - Encapsulated logic
   - Reusable state management
   - Side effect handling

3. **Provider Pattern**
   - WebSocket context
   - Theme context
   - Global state

## Error Handling

### Backend Error Handling

```python
try:
    # Agent processing
    response = await agent.process(request)
except AnthropicAPIError as e:
    # API-specific errors
    logger.error(f"Anthropic API error: {e}")
    return error_response("AI service unavailable")
except ValidationError as e:
    # Input validation errors
    logger.warning(f"Validation error: {e}")
    return error_response("Invalid input")
except Exception as e:
    # Unexpected errors
    logger.error(f"Unexpected error: {e}")
    return error_response("Internal server error")
```

### Frontend Error Handling

```typescript
try {
  await sendMessage(content)
} catch (error) {
  if (error instanceof WebSocketError) {
    // Connection errors
    showToast("Connection lost. Reconnecting...")
    reconnect()
  } else {
    // Other errors
    showToast("Something went wrong. Please try again.")
  }
}
```

## Testing Strategy

### Backend Testing

```
Unit Tests
├── Agent personality tests
├── Routing logic tests
└── State management tests

Integration Tests
├── WebSocket communication
├── Agent graph execution
└── Learning system

End-to-End Tests
└── Full request/response cycle
```

### Frontend Testing

```
Unit Tests
├── Component rendering
├── Hook behavior
└── Utility functions

Integration Tests
├── WebSocket integration
├── State management
└── User interactions

Visual Tests
└── Component snapshots
```

## Future Enhancements

### Phase 5: Code Execution
- Sandboxed code execution
- Live preview
- Error handling

### Phase 6: Project Context
- File system integration
- Project analysis
- Context-aware responses

### Phase 7: Deployment
- Production infrastructure
- Monitoring & alerting
- Auto-scaling

---

**Last Updated**: November 28, 2025
**Version**: 1.0.0
