"""
Frankenstein.AI - Agent State Management

Defines the state structure for the agent graph.
"""

from typing import TypedDict, List, Dict, Any, Optional


class AgentState(TypedDict):
    """State object that flows through the agent graph"""
    messages: List[Dict[str, Any]]
    current_agent: str
    user_request: str
    final_response: str

    # Phase 6A/6B Orchestration fields
    orchestration_enabled: bool  # Enable Phase 6B review loops
    clarification_questions: Optional[str]  # Questions from Valak
    user_answers: Optional[str]  # User's answers to clarifying questions
    requirements: Optional[str]  # Refined requirements from Jason
    work_output: Optional[str]  # Code/output from worker agents
    review_feedback: Optional[str]  # Review from Pinhead
    review_status: Optional[str]  # "approved", "needs_work", "rejected"
    iteration_count: int  # Track review iterations
    workflow_phase: str  # "clarification", "requirements", "work", "review", "complete"
