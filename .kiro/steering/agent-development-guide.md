---
inclusion: fileMatch
fileMatchPattern: '**/agents/**'
---

# Agent Development Guide

## Adding a New Agent

When adding a new horror character agent to Frankenstein.AI, follow this checklist:

### 1. Define Personality (`agents/personalities.py`)

```python
NEW_AGENT_PERSONALITY = """
You are [CHARACTER NAME], [brief description].

PERSONALITY:
- [Key personality trait 1]
- [Key personality trait 2]
- [Speaking style]
- [Metaphors/themes to use]

EXPERTISE:
- [Technology 1]
- [Technology 2]
- [Domain knowledge]

RESPONSE FORMAT:
- [How to structure responses]
- [Code style preferences]
- [Explanation approach]

EXAMPLE:
User: "[Example request]"
You: "[Example response with personality]"
"""
```

### 2. Create Agent Function (`graph/agent_graph.py`)

```python
async def new_agent_function(state: AgentState) -> AgentState:
    """[Agent name] - [Specialty]"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )
    
    # Get learning context
    learning_context = agent_memory.get_learning_context(
        'agent_id', 
        state['user_request']
    )
    
    # Check for revision feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)
    
    # Build prompt
    system_prompt = get_personality_prompt('agent_id')
    
    if review_feedback:
        user_prompt = f"""
REVISION REQUEST (Iteration {iteration_count}/3)

ORIGINAL REQUEST: {state['user_request']}

PINHEAD'S FEEDBACK:
{review_feedback}

Please revise your response addressing the feedback above.
"""
    else:
        user_prompt = f"""
{learning_context}

USER REQUEST: {state['user_request']}

Respond in character with production-ready code and advice.
"""
    
    # Generate response
    try:
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response = await llm.ainvoke(messages)
        
        state['final_response'] = response.content
        state['current_agent'] = 'agent_id'
        state['workflow_phase'] = 'revision' if review_feedback else 'implementation'
        
        logger.info(f"Agent [name] generated response")
        return state
        
    except Exception as e:
        logger.error(f"Error in [agent_name]: {e}")
        state['final_response'] = "Error generating response"
        return state
```

### 3. Add to Agent Graph (`graph/agent_graph.py`)

```python
def create_agent_graph():
    # ... existing code ...
    
    # Add node
    graph.add_node("new_agent", new_agent_function)
    
    # Add routing from supervisor
    graph.add_conditional_edges(
        "supervisor",
        lambda state: state['current_agent'],
        {
            # ... existing agents ...
            "new_agent": "new_agent",
        }
    )
    
    # Add edge to orchestration check
    graph.add_edge("new_agent", "check_orchestration")
```

### 4. Update Supervisor Routing (`graph/agent_graph.py`)

```python
routing_prompt = f"""
Analyze this developer request and decide which specialist to route it to:

REQUEST: {state['user_request']}

SPECIALISTS:
- ANNABELLE: Frontend, React, UI/UX, CSS, design, components, styling, animations
- CHUCKY: Backend, APIs, databases, performance, optimization, servers, data
- FREDDY: Fullstack, complex features, integrations, real-time, authentication, payments
- JASON: Business Analyst, requirements gathering, user stories, acceptance criteria
- PENNYWISE: Testing, QA, unit tests, integration tests, debugging
- GHOSTFACE: Security, authentication, encryption, vulnerabilities, OWASP
- VALAK: Project Manager, clarifying questions, project planning
- PINHEAD: CTO/Reviewer, code review, architectural review
- NEW_AGENT: [Specialty description]  # ADD THIS LINE

Respond with ONLY the agent name: ANNABELLE, CHUCKY, FREDDY, JASON, PENNYWISE, GHOSTFACE, VALAK, PINHEAD, or NEW_AGENT
"""

# Update valid agents list
valid_agents = ["ANNABELLE", "CHUCKY", "FREDDY", "JASON", "PENNYWISE", "GHOSTFACE", "VALAK", "PINHEAD", "NEW_AGENT"]
```

### 5. Update API Endpoints (`main.py`)

```python
@app.get("/api/agents")
async def get_agents():
    return {
        "agents": [
            # ... existing agents ...
            {
                "id": "new_agent",
                "name": "Character Name",
                "icon": "🎃",
                "specialty": "Specialty Area",
                "description": "Character description",
                "expertise": ["Tech1", "Tech2", "Tech3"]
            }
        ]
    }
```

### 6. Update Frontend Agent List (`components/chat/AgentSelector.tsx`)

The frontend will automatically fetch agents from the API, but ensure the icon renders correctly.

### 7. Test the Agent

```bash
# Start backend
cd frankenstein-ai-backend
python main.py

# Test with CLI
python tests/test_cli.py

# Test specific routing
# Send a request that should route to your new agent
```

## Agent Personality Guidelines

### Horror Theme Consistency
- Choose a horror character that fits the specialty
- Maintain character voice throughout responses
- Use horror-themed metaphors naturally
- Balance creepy personality with helpful technical advice

### Technical Expertise
- Provide production-ready code
- Include best practices
- Explain design decisions
- Suggest improvements
- Consider edge cases

### Response Structure
1. **Character greeting** (1-2 lines)
2. **Technical solution** (code + explanation)
3. **Character commentary** (1-2 lines)

### Example Response Format

```
[Character greeting with personality]

[Code block with solution]

[Technical explanation]

[Character commentary tying back to theme]
```

## Learning Integration

Each agent automatically:
- Retrieves past successful patterns
- Learns from Pinhead's reviews
- Improves based on user ratings
- Adapts to common request types

Ensure your agent:
- Uses `agent_memory.get_learning_context()`
- Records interactions via the main WebSocket handler
- Responds to review feedback in revision mode

## Common Pitfalls

❌ **Don't**:
- Break character mid-response
- Provide incomplete code examples
- Ignore review feedback
- Use generic responses

✅ **Do**:
- Stay in character consistently
- Provide complete, runnable code
- Address all aspects of the request
- Use personality to enhance, not distract

---

**System Architect**: Kiro AI Assistant
**Framework**: LangGraph Multi-Agent System
**Last Updated**: December 2025
