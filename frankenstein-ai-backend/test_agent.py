"""
Quick test script to verify agents are working
"""
import asyncio
import websockets
import json
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


async def test_agent():
    uri = "ws://localhost:8000/ws/chat"

    print("Testing Frankenstein.AI Agents...\n")

    async with websockets.connect(uri) as websocket:
        # Test 1: Frontend request (should go to Annabelle)
        print("=" * 60)
        print("TEST 1: Frontend Request")
        print("=" * 60)
        await websocket.send(json.dumps({
            "content": "Build me a simple button component in React"
        }))

        while True:
            response = await websocket.recv()
            data = json.loads(response)

            if data['type'] == 'thinking':
                print(f"⚡ {data['message']}")
            elif data['type'] == 'response':
                print(f"\n{data['agent'].upper()} responded:\n")
                print(data['content'][:500] + "..." if len(data['content']) > 500 else data['content'])
                break
            elif data['type'] == 'error':
                print(f"\n❌ Error: {data['message']}")
                break

        print("\n" + "=" * 60)
        print("✅ Test complete!")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_agent())
