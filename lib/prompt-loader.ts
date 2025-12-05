import fs from 'fs/promises';
import path from 'path';

/**
 * Load the system prompt from prompts/system-prompt.md
 */
export async function loadSystemPrompt(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'prompts/system-prompt.md');
  return await fs.readFile(promptPath, 'utf-8');
}

/**
 * Load PinHead conversational prompt (no doc generation)
 */
export async function loadPinHeadConversational(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'prompts/pinhead-conversational.md');
  return await fs.readFile(promptPath, 'utf-8');
}

/**
 * Load Doc Generator prompt (silent document worker)
 */
export async function loadDocGenerator(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'prompts/doc-generator.md');
  return await fs.readFile(promptPath, 'utf-8');
}

/**
 * Load tool definitions from prompts/tools.json
 */
export async function loadTools(): Promise<any[]> {
  const toolsPath = path.join(process.cwd(), 'prompts/tools.json');
  const content = await fs.readFile(toolsPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Load the complete prompt for PinHead CTO (conversational only)
 */
export async function loadCompletePrompt(): Promise<string> {
  return await loadPinHeadConversational();
}
