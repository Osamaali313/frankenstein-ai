// Test script to call the chat API and see what happens
const fetch = require('node-fetch');

async function testChat() {
  console.log('🧪 Testing chat API...\n');

  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'build me a simple todo app',
      conversationHistory: []
    }),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers.raw());

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  console.log('\n📡 Streaming response:\n');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          console.log('\n✅ Stream completed');
          break;
        }

        try {
          const event = JSON.parse(data);
          console.log('Event:', event.type, event.tool_name ? `(${event.tool_name})` : '');

          if (event.type === 'content_delta' && event.data?.delta?.text) {
            process.stdout.write(event.data.delta.text);
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
  }
}

testChat().catch(console.error);
