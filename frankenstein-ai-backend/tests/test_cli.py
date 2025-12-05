"""
Frankenstein.AI - CLI Testing Tool

Simple command-line interface to test the agent system.
"""

import asyncio
import websockets
import json
import sys
from typing import Optional


async def test_agent_system():
    """Interactive CLI for testing agents"""
    uri = "ws://localhost:8000/ws/chat"

    print("\n" + "=" * 60)
    print("🧟 FRANKENSTEIN.AI - Agent Testing CLI")
    print("=" * 60)
    print("\nAvailable agents:")
    print("  👻 ANNABELLE - Frontend specialist (React, UI/UX, CSS)")
    print("  🔪 CHUCKY - Backend specialist (APIs, databases, performance)")
    print("  😈 FREDDY - Fullstack specialist (complex features, integrations)")
    print("\n" + "=" * 60)
    print("\nType your coding questions or requests.")
    print("Commands: 'exit' or 'quit' to close, 'clear' to clear screen")
    print("=" * 60 + "\n")

    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to Frankenstein.AI backend\n")

            while True:
                # Get user input
                try:
                    user_input = input("💀 You: ")
                except (EOFError, KeyboardInterrupt):
                    print("\n\n👋 Goodbye!")
                    break

                if user_input.lower() in ['exit', 'quit']:
                    print("\n👋 Goodbye!")
                    break

                if user_input.lower() == 'clear':
                    # Clear screen
                    print('\033[2J\033[H', end='')
                    continue

                if not user_input.strip():
                    continue

                # Send to agent system
                await websocket.send(json.dumps({
                    "content": user_input
                }))

                # Receive responses
                while True:
                    response = await websocket.recv()
                    data = json.loads(response)

                    if data['type'] == 'thinking':
                        print(f"\n⚡ {data['message']}")

                    elif data['type'] == 'response':
                        agent_icons = {
                            'annabelle': '👻',
                            'chucky': '🔪',
                            'freddy': '😈'
                        }
                        icon = agent_icons.get(data['agent'], '🎃')
                        agent_name = data['agent'].upper()

                        print(f"\n{icon} {agent_name}:")
                        print("-" * 60)
                        print(data['content'])
                        print("-" * 60)
                        break

                    elif data['type'] == 'error':
                        print(f"\n❌ Error: {data['message']}")
                        break

                print()  # Extra newline for spacing

    except websockets.exceptions.WebSocketException as e:
        print(f"\n❌ WebSocket error: {e}")
        print("\nMake sure the backend is running:")
        print("  cd frankenstein-ai-backend")
        print("  python main.py")
        sys.exit(1)
    except ConnectionRefusedError:
        print("\n❌ Connection refused!")
        print("\nMake sure the backend is running:")
        print("  cd frankenstein-ai-backend")
        print("  python main.py")
        sys.exit(1)


def main():
    """Main entry point"""
    print("\n🧟 Frankenstein.AI CLI Test Tool")
    print("Connecting to backend at ws://localhost:8000/ws/chat...")

    try:
        asyncio.run(test_agent_system())
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
