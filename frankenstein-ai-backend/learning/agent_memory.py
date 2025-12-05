"""
Frankenstein.AI - Agent Learning & Memory System

Implements a learning loop where agents improve over time by:
1. Storing successful patterns and feedback
2. Learning from Pinhead's reviews
3. Injecting past learnings into future prompts
4. Tracking performance metrics
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class AgentMemory:
    """Memory system for storing agent learnings and feedback"""

    def __init__(self, memory_dir: str = "learning/memory"):
        self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)

        # Create agent-specific memory files
        self.agents = ["annabelle", "chucky", "freddy", "jason", "pennywise", "ghostface", "valak", "pinhead"]
        for agent in self.agents:
            agent_file = self.memory_dir / f"{agent}_memory.json"
            if not agent_file.exists():
                self._init_agent_memory(agent)

    def _init_agent_memory(self, agent: str):
        """Initialize empty memory for an agent"""
        memory = {
            "agent": agent,
            "total_interactions": 0,
            "successful_patterns": [],
            "feedback_learnings": [],
            "performance_metrics": {
                "average_rating": 0.0,
                "approval_rate": 0.0,
                "iteration_count": 0.0
            },
            "last_updated": datetime.now().isoformat()
        }

        agent_file = self.memory_dir / f"{agent}_memory.json"
        with open(agent_file, 'w') as f:
            json.dump(memory, f, indent=2)

        logger.info(f"Initialized memory for {agent}")

    def get_agent_memory(self, agent: str) -> Dict:
        """Retrieve agent's memory"""
        agent_file = self.memory_dir / f"{agent}_memory.json"

        if not agent_file.exists():
            self._init_agent_memory(agent)

        with open(agent_file, 'r') as f:
            return json.load(f)

    def save_agent_memory(self, agent: str, memory: Dict):
        """Save agent's updated memory"""
        memory["last_updated"] = datetime.now().isoformat()

        agent_file = self.memory_dir / f"{agent}_memory.json"
        with open(agent_file, 'w') as f:
            json.dump(memory, f, indent=2)

        logger.info(f"Saved memory for {agent}")

    def record_interaction(
        self,
        agent: str,
        user_request: str,
        agent_response: str,
        review_status: Optional[str] = None,
        review_feedback: Optional[str] = None,
        rating: Optional[float] = None
    ):
        """Record an agent interaction for learning"""
        memory = self.get_agent_memory(agent)

        # Increment interaction count
        memory["total_interactions"] += 1

        # Store successful pattern if approved
        if review_status == "approved":
            pattern = {
                "request_type": self._categorize_request(user_request),
                "request_snippet": user_request[:200],
                "response_snippet": agent_response[:500],
                "timestamp": datetime.now().isoformat(),
                "rating": rating or 5.0
            }
            memory["successful_patterns"].append(pattern)

            # Keep only the last 50 successful patterns
            if len(memory["successful_patterns"]) > 50:
                memory["successful_patterns"] = memory["successful_patterns"][-50:]

        # Store feedback learnings if there was feedback
        if review_feedback and review_status in ["needs_work", "rejected"]:
            learning = {
                "request_snippet": user_request[:200],
                "what_went_wrong": review_feedback[:500],
                "review_status": review_status,
                "timestamp": datetime.now().isoformat()
            }
            memory["feedback_learnings"].append(learning)

            # Keep only the last 30 feedback learnings
            if len(memory["feedback_learnings"]) > 30:
                memory["feedback_learnings"] = memory["feedback_learnings"][-30:]

        # Update performance metrics
        self._update_metrics(memory, review_status, rating)

        # Save updated memory
        self.save_agent_memory(agent, memory)

        logger.info(f"Recorded interaction for {agent}: {review_status}")

    def _categorize_request(self, request: str) -> str:
        """Categorize the type of request"""
        request_lower = request.lower()

        categories = {
            "component": ["component", "ui", "button", "form", "modal", "card"],
            "api": ["api", "endpoint", "route", "rest", "graphql"],
            "database": ["database", "query", "sql", "mongodb", "postgres"],
            "auth": ["authentication", "login", "oauth", "jwt", "session"],
            "testing": ["test", "unit test", "integration", "jest", "cypress"],
            "security": ["security", "vulnerability", "encrypt", "xss", "csrf"],
            "performance": ["optimize", "performance", "slow", "cache", "speed"],
            "deployment": ["deploy", "docker", "kubernetes", "ci/cd", "build"]
        }

        for category, keywords in categories.items():
            if any(keyword in request_lower for keyword in keywords):
                return category

        return "general"

    def _update_metrics(self, memory: Dict, review_status: Optional[str], rating: Optional[float]):
        """Update performance metrics"""
        metrics = memory["performance_metrics"]
        total = memory["total_interactions"]

        # Update approval rate
        if review_status == "approved":
            # Running average
            current_approvals = metrics["approval_rate"] * (total - 1)
            metrics["approval_rate"] = (current_approvals + 1) / total
        elif review_status in ["needs_work", "rejected"]:
            current_approvals = metrics["approval_rate"] * (total - 1)
            metrics["approval_rate"] = current_approvals / total

        # Update average rating
        if rating:
            current_avg = metrics["average_rating"] * (total - 1)
            metrics["average_rating"] = (current_avg + rating) / total

    def get_learning_context(self, agent: str, request: str) -> str:
        """Generate learning context to inject into agent prompt"""
        memory = self.get_agent_memory(agent)

        if memory["total_interactions"] == 0:
            return ""

        request_category = self._categorize_request(request)

        # Get relevant successful patterns
        relevant_successes = [
            p for p in memory["successful_patterns"]
            if p["request_type"] == request_category
        ][-3:]  # Last 3 successes in this category

        # Get relevant feedback learnings
        relevant_learnings = memory["feedback_learnings"][-5:]  # Last 5 learnings

        # Build context
        context_parts = []

        if relevant_successes:
            context_parts.append("🧠 PAST SUCCESSES (Learn from these):")
            for i, success in enumerate(relevant_successes, 1):
                context_parts.append(f"{i}. Request: {success['request_snippet']}")
                context_parts.append(f"   Successful approach: {success['response_snippet']}")

        if relevant_learnings:
            context_parts.append("\n⚠️ PAST MISTAKES (Avoid these):")
            for i, learning in enumerate(relevant_learnings, 1):
                context_parts.append(f"{i}. Problem: {learning['what_went_wrong']}")

        # Add performance stats
        metrics = memory["performance_metrics"]
        context_parts.append(f"\n📊 YOUR STATS:")
        context_parts.append(f"   Approval Rate: {metrics['approval_rate']*100:.1f}%")
        context_parts.append(f"   Average Rating: {metrics['average_rating']:.1f}/5.0")
        context_parts.append(f"   Total Interactions: {memory['total_interactions']}")

        return "\n".join(context_parts)

    def get_all_metrics(self) -> Dict[str, Dict]:
        """Get performance metrics for all agents"""
        metrics = {}

        for agent in self.agents:
            memory = self.get_agent_memory(agent)
            metrics[agent] = {
                "total_interactions": memory["total_interactions"],
                "approval_rate": memory["performance_metrics"]["approval_rate"],
                "average_rating": memory["performance_metrics"]["average_rating"],
                "successful_patterns": len(memory["successful_patterns"]),
                "learnings": len(memory["feedback_learnings"])
            }

        return metrics


# Global instance
agent_memory = AgentMemory()
