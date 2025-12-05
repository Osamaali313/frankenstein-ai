import Anthropic from '@anthropic-ai/sdk';
import { loadCompletePrompt, loadDocGenerator } from '@/lib/prompt-loader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout for long document generation

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Load PinHead conversational prompt
    const systemPrompt = await loadCompletePrompt();

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build messages array
    const messages = [
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    console.log('🧠 Calling Claude Haiku 4.5 (PinHead Conversational mode)');

    // Create a readable stream to send to client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = '';

          const stream = anthropic.messages.stream({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 8192,
            system: systemPrompt,
            messages: messages,
          });

          // Stream conversational response
          for await (const event of stream) {
            if (event.type === 'content_block_start') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'content_start', data: event })}\n\n`)
              );
            } else if (event.type === 'content_block_delta') {
              const delta = event.delta;
              if (delta.type === 'text_delta' && delta.text) {
                fullResponse += delta.text;
              }
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'content_delta', data: event })}\n\n`)
              );
            } else if (event.type === 'content_block_stop') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'content_stop', data: event })}\n\n`)
              );
            } else if (event.type === 'message_start') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'message_start', data: event })}\n\n`)
              );
            } else if (event.type === 'message_delta') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'message_delta', data: event })}\n\n`)
              );
            } else if (event.type === 'message_stop') {
              // Check if PinHead signaled to generate docs
              if (fullResponse.includes('[GENERATE_DOCS]') && fullResponse.includes('[/GENERATE_DOCS]')) {
                console.log('📄 PinHead signaled doc generation! Calling Doc Generator...');

                // Extract requirements
                const requirementsMatch = fullResponse.match(/\[GENERATE_DOCS\]([\s\S]*?)\[\/GENERATE_DOCS\]/);
                const requirements = requirementsMatch ? requirementsMatch[1].trim() : '';

                // Call Doc Generator with streaming
                const docPrompt = await loadDocGenerator();
                console.log('🤖 Calling Doc Generator with requirements (streaming)...');

                // Signal that doc generation has started
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({
                    type: 'docs_generation_started',
                    data: {}
                  })}\n\n`)
                );

                let docContent = '';
                const docStream = anthropic.messages.stream({
                  model: 'claude-sonnet-4-20250514',
                  max_tokens: 8192, // Standard output limit
                  system: docPrompt,
                  messages: [{ role: 'user', content: requirements }],
                });

                // Stream the Doc Generator output in real-time
                for await (const docEvent of docStream) {
                  if (docEvent.type === 'content_block_delta') {
                    const delta = docEvent.delta;
                    if (delta.type === 'text_delta' && delta.text) {
                      docContent += delta.text;
                      // Send streaming doc content to frontend
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: 'docs_content_delta',
                          data: { delta: delta.text, fullContent: docContent }
                        })}\n\n`)
                      );
                    }
                  }
                }

                console.log('✅ Doc Generator completed! Total length:', docContent.length);

                // Send final docs_generated event
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({
                    type: 'docs_generated',
                    data: { content: docContent }
                  })}\n\n`)
                );
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'message_stop', data: event })}\n\n`)
              );
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
