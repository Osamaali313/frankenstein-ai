---
inclusion: always
---

# Frankenstein.AI Coding Standards

## Backend Standards (Python)

### Code Style
- Follow PEP 8 conventions
- Use type hints for all function parameters and returns
- Async/await for all I/O operations
- Descriptive variable names (no single letters except loop counters)

### Agent Development
- Each agent must have a personality prompt in `agents/personalities.py`
- Agent functions must be async and accept `AgentState`
- Always retrieve learning context before generating responses
- Include personality-driven commentary in responses
- Provide production-ready code examples

### LangGraph Patterns
```python
async def agent_function(state: AgentState) -> AgentState:
    """Agent implementation"""
    # 1. Get learning context
    learning_context = agent_memory.get_learning_context(agent_name, state['user_request'])
    
    # 2. Build prompt with personality
    prompt = get_personality_prompt(agent_name) + learning_context + state['user_request']
    
    # 3. Generate response
    response = await llm.ainvoke(prompt)
    
    # 4. Update state
    state['final_response'] = response.content
    state['current_agent'] = agent_name
    
    return state
```

### Error Handling
- Always use try/except blocks for external API calls
- Log errors with context using `logger.error()`
- Return graceful error messages to users
- Never expose internal errors or API keys

### Logging
```python
logger.info(f"Processing request for {agent_name}")
logger.warning(f"Unusual pattern detected: {pattern}")
logger.error(f"Failed to process: {error}")
```

## Frontend Standards (TypeScript/React)

### Code Style
- Use TypeScript for all files
- Functional components with hooks
- Descriptive component and variable names
- Props interfaces for all components

### Component Structure
```typescript
interface ComponentProps {
  // Props definition
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks at top
  const [state, setState] = useState()
  
  // Event handlers
  const handleEvent = () => {}
  
  // Render
  return <div>...</div>
}
```

### State Management (Zustand)
- Keep stores focused and minimal
- Use selectors for performance
- Async actions in store methods
- Clear naming for actions

### WebSocket Communication
- Always handle connection errors
- Implement reconnection logic
- Show loading states during communication
- Stream responses for better UX

### Styling
- Use Tailwind CSS utility classes
- Follow horror theme color palette
- Responsive design (mobile-first)
- Smooth animations with Framer Motion

## API Design

### WebSocket Messages
```typescript
// Client → Server
{
  "content": string,
  "agent"?: string,
  "orchestration_enabled"?: boolean
}

// Server → Client
{
  "type": "thinking" | "stream" | "response" | "error",
  "agent": string,
  "content": string,
  "workflow_phase"?: string,
  "iteration_count"?: number,
  "review_status"?: string
}
```

### REST Endpoints
- Use consistent response format
- Include status in all responses
- Proper HTTP status codes
- Clear error messages

## Testing Standards

### Backend Testing
- Test agent routing logic
- Test personality prompt generation
- Test learning system recording
- Test WebSocket communication

### Frontend Testing
- Test component rendering
- Test WebSocket integration
- Test state management
- Test user interactions

## Git Workflow

### Commit Messages
```
feat: Add new agent (Jason - Business Analyst)
fix: Resolve WebSocket reconnection issue
docs: Update architecture documentation
refactor: Improve agent routing logic
test: Add tests for learning system
```

### Branch Naming
- `feature/agent-name` - New agent development
- `fix/issue-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/component-name` - Code refactoring

## Security Guidelines

1. **Never commit**:
   - `.env` files
   - API keys
   - Sensitive credentials

2. **Always validate**:
   - User input
   - Agent selection
   - Message content

3. **Use environment variables** for:
   - API keys
   - Configuration
   - Secrets

## Performance Guidelines

### Backend
- Use async operations for all I/O
- Stream responses for better perceived performance
- Cache learning context when possible
- Limit iteration count in orchestration mode

### Frontend
- Lazy load components
- Optimize images and assets
- Use code splitting
- Minimize re-renders with proper memoization

## Documentation Standards

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for technical changes
- Add inline comments for complex logic
- Document all public APIs
- Keep examples up to date

---

**Maintained by**: Kiro AI Assistant
**Last Updated**: December 2025
