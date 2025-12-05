"""
Script to add learning context to remaining worker agents
"""

import re

# Read the file
with open('graph/agent_graph.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the patterns and replacements for each agent
agents = {
    'freddy': {
        'pattern': r'(async def freddy_agent\(state: AgentState\) -> AgentState:.*?\n    # Check if this is a revision based on Pinhead\'s feedback\n    review_feedback = state\.get\(\'review_feedback\', \'\'\)\n    iteration_count = state\.get\(\'iteration_count\', 0\))',
        'replacement': r'\1\n\n    # Get learning context from past interactions\n    learning_context = agent_memory.get_learning_context(\'freddy\', state[\'user_request\'])'
    },
    'pennywise': {
        'pattern': r'(async def pennywise_agent\(state: AgentState\) -> AgentState:.*?\n    # Check if this is a revision based on Pinhead\'s feedback\n    review_feedback = state\.get\(\'review_feedback\', \'\'\)\n    iteration_count = state\.get\(\'iteration_count\', 0\))',
        'replacement': r'\1\n\n    # Get learning context from past interactions\n    learning_context = agent_memory.get_learning_context(\'pennywise\', state[\'user_request\'])'
    },
    'ghostface': {
        'pattern': r'(async def ghostface_agent\(state: AgentState\) -> AgentState:.*?\n    # Check if this is a revision based on Pinhead\'s feedback\n    review_feedback = state\.get\(\'review_feedback\', \'\'\)\n    iteration_count = state\.get\(\'iteration_count\', 0\))',
        'replacement': r'\1\n\n    # Get learning context from past interactions\n    learning_context = agent_memory.get_learning_context(\'ghostface\', state[\'user_request\'])'
    }
}

# Apply the replacements
for agent, patterns in agents.items():
    content = re.sub(patterns['pattern'], patterns['replacement'], content, flags=re.DOTALL)

# Now update the prompts to include learning context
# For Freddy
content = re.sub(
    r'(\{get_personality_prompt\(\'freddy\'\)\})\n\nORIGINAL REQUEST:',
    r'\1\n\n{learning_context}\n\nORIGINAL REQUEST:',
    content
)
content = re.sub(
    r'(\{get_personality_prompt\(\'freddy\'\)\})\n\nUSER REQUEST:',
    r'\1\n\n{learning_context}\n\nUSER REQUEST:',
    content
)

# For Pennywise
content = re.sub(
    r'(\{get_personality_prompt\(\'pennywise\'\)\})\n\nORIGINAL REQUEST:',
    r'\1\n\n{learning_context}\n\nORIGINAL REQUEST:',
    content
)
content = re.sub(
    r'(\{get_personality_prompt\(\'pennywise\'\)\})\n\nUSER REQUEST:',
    r'\1\n\n{learning_context}\n\nUSER REQUEST:',
    content
)

# For Ghostface
content = re.sub(
    r'(\{get_personality_prompt\(\'ghostface\'\)\})\n\nORIGINAL REQUEST:',
    r'\1\n\n{learning_context}\n\nORIGINAL REQUEST:',
    content
)
content = re.sub(
    r'(\{get_personality_prompt\(\'ghostface\'\)\})\n\nUSER REQUEST:',
    r'\1\n\n{learning_context}\n\nUSER REQUEST:',
    content
)

# Update logging messages
content = re.sub(
    r'logger\.info\(f"Freddy generated response \(iteration \{iteration_count\}\)"\)',
    r'logger.info(f"Freddy generated response (iteration {iteration_count}) with learning context")',
    content
)
content = re.sub(
    r'logger\.info\(f"Pennywise generated response \(iteration \{iteration_count\}\)"\)',
    r'logger.info(f"Pennywise generated response (iteration {iteration_count}) with learning context")',
    content
)
content = re.sub(
    r'logger\.info\(f"Ghostface generated response \(iteration \{iteration_count\}\)"\)',
    r'logger.info(f"Ghostface generated response (iteration {iteration_count}) with learning context")',
    content
)

# Write back
with open('graph/agent_graph.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated Freddy, Pennywise, and Ghostface agents with learning context!")
