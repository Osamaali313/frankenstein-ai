"""
Frankenstein.AI - LangGraph Agent System

Implements the multi-agent system with supervisor routing and learning loop.
"""

import os
from typing import Literal
from langchain_anthropic import ChatAnthropic
from langgraph.graph import StateGraph, END
from graph.state import AgentState
from agents.personalities import get_personality_prompt
from learning.agent_memory import agent_memory
import logging

logger = logging.getLogger(__name__)


class SupervisorAgent:
    """Supervisor agent that analyzes requests and routes to specialists"""

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")

        self.llm = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            temperature=0.7,
            api_key=api_key
        )

    async def route_request(self, state: AgentState) -> AgentState:
        """Analyze request and decide which agent to use"""

        routing_prompt = f"""
Analyze this developer request and decide which specialist to route it to:

REQUEST: {state['user_request']}

SPECIALISTS:
- ANNABELLE: Frontend, React, UI/UX, CSS, design, components, styling, animations
- CHUCKY: Backend, APIs, databases, performance, optimization, servers, data
- FREDDY: Fullstack, complex features, integrations, real-time, authentication, payments
- JASON: Business Analyst, requirements gathering, user stories, acceptance criteria, edge cases
- PENNYWISE: Testing, QA, unit tests, integration tests, debugging, test frameworks, Jest, Cypress
- GHOSTFACE: Security, authentication, encryption, vulnerabilities, OWASP, pentesting, OAuth
- VALAK: Project Manager, clarifying questions, project planning, risk management, requirements decomposition
- PINHEAD: CTO/Reviewer, code review, architectural review, quality assurance, best practices

Respond with ONLY the agent name: ANNABELLE, CHUCKY, FREDDY, JASON, PENNYWISE, GHOSTFACE, VALAK, or PINHEAD

Examples:
"build a button component" -> ANNABELLE
"optimize my database queries" -> CHUCKY
"create real-time chat" -> FREDDY
"I need help understanding requirements for a login system" -> JASON
"write tests for my login function" -> PENNYWISE
"secure my authentication system" -> GHOSTFACE
"I have a vague idea, need help clarifying" -> VALAK
"review my code for best practices" -> PINHEAD
"""

        try:
            response = await self.llm.ainvoke(routing_prompt)
            agent = response.content.strip().upper()

            # Validate and default to FREDDY if unclear
            valid_agents = ["ANNABELLE", "CHUCKY", "FREDDY", "JASON", "PENNYWISE", "GHOSTFACE", "VALAK", "PINHEAD"]
            if agent not in valid_agents:
                logger.warning(f"Invalid agent routing: {agent}, defaulting to FREDDY")
                agent = "FREDDY"

            state['current_agent'] = agent.lower()
            logger.info(f"Routed request to {agent}")
            return state

        except Exception as e:
            logger.error(f"Error in supervisor routing: {e}")
            # Default to FREDDY on error
            state['current_agent'] = "freddy"
            return state


async def annabelle_agent(state: AgentState) -> AgentState:
    """Frontend specialist - Annabelle the doll"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    # Check if this is a revision based on Pinhead's feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('annabelle', state['user_request'])

    if review_feedback and iteration_count > 0:
        prompt = f"""
{get_personality_prompt('annabelle')}

{learning_context}

ORIGINAL REQUEST: {state['user_request']}

YOUR PREVIOUS WORK:
{state.get('work_output', '')}

PINHEAD'S REVIEW FEEDBACK:
{review_feedback}

This is revision #{iteration_count}. Address Pinhead's feedback and improve your work.
Use your past learnings above to avoid previous mistakes and apply successful patterns.
Respond in character with the improved code and explanation.
"""
    else:
        prompt = f"""
{get_personality_prompt('annabelle')}

{learning_context}

USER REQUEST: {state['user_request']}

Apply your past learnings above to provide the best possible solution.
Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['work_output'] = response.content  # Save for Pinhead review
        state['final_response'] = response.content
        state['workflow_phase'] = 'work'
        logger.info(f"Annabelle generated response (iteration {iteration_count}) with learning context")
    except Exception as e:
        logger.error(f"Error in Annabelle agent: {e}")
        state['final_response'] = f"*Doll eyes glaze over* I... I seem to be having trouble, dear. Error: {str(e)}"

    return state


async def chucky_agent(state: AgentState) -> AgentState:
    """Backend specialist - Chucky the killer"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    # Check if this is a revision based on Pinhead's feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('chucky', state['user_request'])

    if review_feedback and iteration_count > 0:
        prompt = f"""
{get_personality_prompt('chucky')}

{learning_context}

ORIGINAL REQUEST: {state['user_request']}

YOUR PREVIOUS WORK:
{state.get('work_output', '')}

PINHEAD'S REVIEW FEEDBACK:
{review_feedback}

This is revision #{iteration_count}. Address Pinhead's feedback and KILL those issues!
Use your past learnings to avoid previous mistakes.
Respond in character with the improved code.
"""
    else:
        prompt = f"""
{get_personality_prompt('chucky')}

{learning_context}

USER REQUEST: {state['user_request']}

Apply your past learnings to provide the best possible solution.
Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['work_output'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'work'
        logger.info(f"Chucky generated response (iteration {iteration_count}) with learning context")
    except Exception as e:
        logger.error(f"Error in Chucky agent: {e}")
        state['final_response'] = f"DAMMIT! Something went wrong! Error: {str(e)}"

    return state


async def freddy_agent(state: AgentState) -> AgentState:
    """Fullstack specialist - Freddy Krueger"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    # Check if this is a revision based on Pinhead's feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('freddy', state['user_request'])

    if review_feedback and iteration_count > 0:
        prompt = f"""
{get_personality_prompt('freddy')}

{learning_context}

ORIGINAL REQUEST: {state['user_request']}

YOUR PREVIOUS WORK:
{state.get('work_output', '')}

PINHEAD'S REVIEW FEEDBACK:
{review_feedback}

This is revision #{iteration_count}. Wake up and fix these nightmares based on Pinhead's feedback!
Respond in character with the improved solution.
"""
    else:
        prompt = f"""
{get_personality_prompt('freddy')}

{learning_context}

USER REQUEST: {state['user_request']}

Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['work_output'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'work'
        logger.info(f"Freddy generated response (iteration {iteration_count}) with learning context")
    except Exception as e:
        logger.error(f"Error in Freddy agent: {e}")
        state['final_response'] = f"The nightmare has encountered an error... {str(e)}"

    return state


async def jason_agent(state: AgentState) -> AgentState:
    """DevOps specialist - Jason Voorhees"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    prompt = f"""
{get_personality_prompt('jason')}

USER REQUEST: {state['user_request']}

Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['final_response'] = response.content
        logger.info("Jason generated response")
    except Exception as e:
        logger.error(f"Error in Jason agent: {e}")
        state['final_response'] = f"*Machete clatters to the ground* Error: {str(e)}"

    return state


async def pennywise_agent(state: AgentState) -> AgentState:
    """Testing specialist - Pennywise the Clown"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    # Check if this is a revision based on Pinhead's feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('pennywise', state['user_request'])

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('pennywise', state['user_request'])

    if review_feedback and iteration_count > 0:
        prompt = f"""
{get_personality_prompt('pennywise')}

{learning_context}

ORIGINAL REQUEST: {state['user_request']}

YOUR PREVIOUS WORK:
{state.get('work_output', '')}

PINHEAD'S REVIEW FEEDBACK:
{review_feedback}

This is revision #{iteration_count}. Float back up with better tests based on Pinhead's feedback! 🎈
Respond in character with improved test coverage.
"""
    else:
        prompt = f"""
{get_personality_prompt('pennywise')}

{learning_context}

USER REQUEST: {state['user_request']}

Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['work_output'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'work'
        logger.info(f"Pennywise generated response (iteration {iteration_count}) with learning context")
    except Exception as e:
        logger.error(f"Error in Pennywise agent: {e}")
        state['final_response'] = f"🎈 The balloon popped! Error: {str(e)}"

    return state


async def ghostface_agent(state: AgentState) -> AgentState:
    """Security specialist - Ghostface"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    # Check if this is a revision based on Pinhead's feedback
    review_feedback = state.get('review_feedback', '')
    iteration_count = state.get('iteration_count', 0)

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('ghostface', state['user_request'])

    # Get learning context from past interactions
    learning_context = agent_memory.get_learning_context('ghostface', state['user_request'])

    if review_feedback and iteration_count > 0:
        prompt = f"""
{get_personality_prompt('ghostface')}

{learning_context}

ORIGINAL REQUEST: {state['user_request']}

YOUR PREVIOUS WORK:
{state.get('work_output', '')}

PINHEAD'S REVIEW FEEDBACK:
{review_feedback}

This is revision #{iteration_count}. Hunt down those security flaws based on Pinhead's feedback!
Respond in character with improved security measures.
"""
    else:
        prompt = f"""
{get_personality_prompt('ghostface')}

{learning_context}

USER REQUEST: {state['user_request']}

Respond in character with helpful code and advice.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['work_output'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'work'
        logger.info(f"Ghostface generated response (iteration {iteration_count}) with learning context")
    except Exception as e:
        logger.error(f"Error in Ghostface agent: {e}")
        state['final_response'] = f"*Phone line goes dead* Error: {str(e)}"

    return state


async def valak_agent(state: AgentState) -> AgentState:
    """Project Manager - Valak (The Nun)"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    prompt = f"""
{get_personality_prompt('valak')}

USER REQUEST: {state['user_request']}

Your role is to ask clarifying questions to ensure we understand exactly what the user needs.
Ask 5-7 specific questions covering:
- Functional requirements
- Technical constraints
- Performance expectations
- Timeline and resources

Respond in character with your clarifying questions.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['clarification_questions'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'clarification'
        logger.info("Valak generated clarification questions")
    except Exception as e:
        logger.error(f"Error in Valak agent: {e}")
        state['final_response'] = f"*The rosary breaks* Error: {str(e)}"

    return state


async def pinhead_agent(state: AgentState) -> AgentState:
    """CTO/Reviewer - Pinhead"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    llm = ChatAnthropic(
        model="claude-sonnet-4-20250514",
        temperature=0.7,
        api_key=api_key
    )

    work_to_review = state.get('work_output', state.get('final_response', ''))

    prompt = f"""
{get_personality_prompt('pinhead')}

ORIGINAL REQUEST: {state['user_request']}

WORK TO REVIEW:
{work_to_review}

Review this work and provide:
1. Architectural Review (rating out of 5)
2. What works well (The Pleasures)
3. What needs improvement (The Pains)
4. Security concerns
5. Performance concerns
6. Final verdict: APPROVED, NEEDS_WORK, or REJECTED

Respond in character with your review.
"""

    try:
        response = await llm.ainvoke(prompt)
        state['review_feedback'] = response.content
        state['final_response'] = response.content
        state['workflow_phase'] = 'review'

        # Determine review status from response
        content_lower = response.content.lower()
        if 'approved' in content_lower or 'accept' in content_lower:
            state['review_status'] = 'approved'
        elif 'rejected' in content_lower or 'reject' in content_lower:
            state['review_status'] = 'rejected'
        else:
            state['review_status'] = 'needs_work'

        state['iteration_count'] = state.get('iteration_count', 0) + 1
        logger.info(f"Pinhead completed review: {state['review_status']}")
    except Exception as e:
        logger.error(f"Error in Pinhead agent: {e}")
        state['final_response'] = f"*The puzzle box jams* Error: {str(e)}"

    return state


def create_agent_graph():
    """Build and compile the agent graph with Phase 6B orchestration"""

    # Create the graph
    workflow = StateGraph(AgentState)

    # Create supervisor
    supervisor = SupervisorAgent()

    # Add all agent nodes
    workflow.add_node("supervisor", supervisor.route_request)
    workflow.add_node("annabelle", annabelle_agent)
    workflow.add_node("chucky", chucky_agent)
    workflow.add_node("freddy", freddy_agent)
    workflow.add_node("jason", jason_agent)
    workflow.add_node("pennywise", pennywise_agent)
    workflow.add_node("ghostface", ghostface_agent)
    workflow.add_node("valak", valak_agent)
    workflow.add_node("pinhead", pinhead_agent)

    # Define routing function from supervisor
    def route_from_supervisor(state: AgentState) -> Literal["annabelle", "chucky", "freddy", "jason", "pennywise", "ghostface", "valak", "pinhead"]:
        """Route to the agent selected by supervisor"""
        agent = state.get('current_agent', 'freddy')
        logger.info(f"Routing from supervisor to agent: {agent}")
        return agent

    # Define entry routing - skip supervisor if agent already selected
    def route_entry(state: AgentState) -> Literal["supervisor", "annabelle", "chucky", "freddy", "jason", "pennywise", "ghostface", "valak", "pinhead"]:
        """Route directly to agent if already selected, otherwise go to supervisor"""
        current_agent = state.get('current_agent', '')
        valid_agents = ["annabelle", "chucky", "freddy", "jason", "pennywise", "ghostface", "valak", "pinhead"]

        if current_agent and current_agent in valid_agents:
            logger.info(f"Direct routing to pre-selected agent: {current_agent}")
            return current_agent
        else:
            logger.info("No agent selected, routing to supervisor")
            return "supervisor"

    # Define routing from worker agents to Pinhead for review
    def route_after_work(state: AgentState) -> Literal["pinhead", "__end__"]:
        """Route worker output to Pinhead for review, or end if orchestration disabled"""
        # Check if orchestration mode is enabled (future feature)
        orchestration_enabled = state.get('orchestration_enabled', False)

        if orchestration_enabled:
            logger.info("Routing worker output to Pinhead for review")
            return "pinhead"
        else:
            logger.info("Orchestration disabled, ending workflow")
            return "__end__"

    # Define routing from Pinhead based on review status
    def route_after_review(state: AgentState) -> Literal["annabelle", "chucky", "freddy", "pennywise", "ghostface", "__end__"]:
        """Route based on Pinhead's review - iterate or complete"""
        review_status = state.get('review_status', 'approved')
        iteration_count = state.get('iteration_count', 0)
        max_iterations = 3

        if review_status == 'approved' or iteration_count >= max_iterations:
            logger.info(f"Review {review_status}, ending workflow (iterations: {iteration_count})")
            return "__end__"
        elif review_status == 'needs_work':
            # Route back to the worker agent for improvements
            current_agent = state.get('current_agent', 'freddy')
            worker_agents = ["annabelle", "chucky", "freddy", "pennywise", "ghostface"]

            if current_agent in worker_agents:
                logger.info(f"Review needs work, routing back to {current_agent} (iteration {iteration_count})")
                return current_agent
            else:
                logger.info(f"Review needs work but agent {current_agent} not a worker, ending")
                return "__end__"
        else:
            logger.info(f"Review rejected, ending workflow")
            return "__end__"

    # Add a virtual entry node
    workflow.add_node("entry", lambda state: state)
    workflow.set_entry_point("entry")

    # Route from entry to either supervisor or direct agent
    workflow.add_conditional_edges(
        "entry",
        route_entry,
        {
            "supervisor": "supervisor",
            "annabelle": "annabelle",
            "chucky": "chucky",
            "freddy": "freddy",
            "jason": "jason",
            "pennywise": "pennywise",
            "ghostface": "ghostface",
            "valak": "valak",
            "pinhead": "pinhead"
        }
    )

    # Add conditional edges from supervisor to agents
    workflow.add_conditional_edges(
        "supervisor",
        route_from_supervisor,
        {
            "annabelle": "annabelle",
            "chucky": "chucky",
            "freddy": "freddy",
            "jason": "jason",
            "pennywise": "pennywise",
            "ghostface": "ghostface",
            "valak": "valak",
            "pinhead": "pinhead"
        }
    )

    # Phase 6B: Worker agents route to Pinhead (if orchestration enabled) or END
    # Note: Jason, Valak are management agents - they end directly
    # Worker agents: Annabelle, Chucky, Freddy, Pennywise, Ghostface
    workflow.add_conditional_edges("annabelle", route_after_work, {"pinhead": "pinhead", "__end__": END})
    workflow.add_conditional_edges("chucky", route_after_work, {"pinhead": "pinhead", "__end__": END})
    workflow.add_conditional_edges("freddy", route_after_work, {"pinhead": "pinhead", "__end__": END})
    workflow.add_conditional_edges("pennywise", route_after_work, {"pinhead": "pinhead", "__end__": END})
    workflow.add_conditional_edges("ghostface", route_after_work, {"pinhead": "pinhead", "__end__": END})

    # Management agents end directly
    workflow.add_edge("jason", END)
    workflow.add_edge("valak", END)

    # Pinhead routes based on review status (iterate or complete)
    workflow.add_conditional_edges(
        "pinhead",
        route_after_review,
        {
            "annabelle": "annabelle",
            "chucky": "chucky",
            "freddy": "freddy",
            "pennywise": "pennywise",
            "ghostface": "ghostface",
            "__end__": END
        }
    )

    logger.info("Agent graph created successfully with 8 agents and Phase 6B orchestration")
    return workflow.compile()
