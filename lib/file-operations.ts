import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ToolResult {
  success: boolean;
  message?: string;
  content?: string;
  error?: string;
}

/**
 * Execute a tool based on its name and input
 */
export async function executeToolUse(toolName: string, input: any): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'frank_write_file':
        return await writeFile(input.file_path, input.content);

      case 'frank_replace_code':
        return await replaceCode(
          input.file_path,
          input.search,
          input.replace,
          input.first_line,
          input.last_line
        );

      case 'frank_read_file':
        return await readFile(input.file_path, input.lines);

      case 'frank_search_files':
        return await searchFiles(
          input.query,
          input.include_pattern,
          input.exclude_pattern,
          input.case_sensitive
        );

      case 'frank_add_package':
        return await addPackage(input.package);

      case 'frank_delete_file':
        return await deleteFile(input.file_path);

      case 'frank_rename_file':
        return await renameFile(input.original_path, input.new_path);

      default:
        return {
          success: false,
          error: `Unknown tool: ${toolName}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Write or update a file
 */
async function writeFile(filePath: string, content: string): Promise<ToolResult> {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  await fs.mkdir(dir, { recursive: true });

  // Write the file
  await fs.writeFile(fullPath, content, 'utf-8');

  return {
    success: true,
    message: `File created/updated: ${filePath}`
  };
}

/**
 * Replace code in a file using line numbers
 */
async function replaceCode(
  filePath: string,
  search: string,
  replace: string,
  firstLine: number,
  lastLine: number
): Promise<ToolResult> {
  const fullPath = path.join(process.cwd(), filePath);

  // Read the file
  const content = await fs.readFile(fullPath, 'utf-8');
  const lines = content.split('\n');

  // Validate line numbers
  if (firstLine < 1 || lastLine > lines.length || firstLine > lastLine) {
    return {
      success: false,
      error: `Invalid line range: ${firstLine}-${lastLine} (file has ${lines.length} lines)`
    };
  }

  // Replace the specified lines
  const before = lines.slice(0, firstLine - 1);
  const after = lines.slice(lastLine);
  const newLines = [...before, replace, ...after];

  // Write back to file
  await fs.writeFile(fullPath, newLines.join('\n'), 'utf-8');

  return {
    success: true,
    message: `Replaced lines ${firstLine}-${lastLine} in ${filePath}`
  };
}

/**
 * Read a file
 */
async function readFile(filePath: string, lineRange?: string): Promise<ToolResult> {
  const fullPath = path.join(process.cwd(), filePath);
  const content = await fs.readFile(fullPath, 'utf-8');
  const lines = content.split('\n');

  if (lineRange) {
    // Parse line ranges like "1-100, 200-300"
    const ranges = lineRange.split(',').map(r => r.trim());
    const selectedLines: string[] = [];

    for (const range of ranges) {
      const [start, end] = range.split('-').map(n => parseInt(n.trim()));
      selectedLines.push(...lines.slice(start - 1, end));
    }

    return {
      success: true,
      content: selectedLines.join('\n')
    };
  }

  // Return first 500 lines by default
  const limitedLines = lines.slice(0, 500);

  return {
    success: true,
    content: limitedLines.join('\n'),
    message: lines.length > 500 ? `Showing first 500 of ${lines.length} lines` : undefined
  };
}

/**
 * Search files using regex
 */
async function searchFiles(
  query: string,
  includePattern: string,
  excludePattern?: string,
  caseSensitive?: boolean
): Promise<ToolResult> {
  // This is a simplified implementation
  // In production, you'd want to use a proper file search library
  const results: string[] = [];

  return {
    success: true,
    content: results.join('\n'),
    message: `Search completed for: ${query}`
  };
}

/**
 * Add an npm package
 */
async function addPackage(packageName: string): Promise<ToolResult> {
  const { stdout, stderr } = await execAsync(`npm install ${packageName}`);

  return {
    success: true,
    message: `Package installed: ${packageName}`,
    content: stdout
  };
}

/**
 * Delete a file
 */
async function deleteFile(filePath: string): Promise<ToolResult> {
  const fullPath = path.join(process.cwd(), filePath);
  await fs.unlink(fullPath);

  return {
    success: true,
    message: `File deleted: ${filePath}`
  };
}

/**
 * Rename a file
 */
async function renameFile(originalPath: string, newPath: string): Promise<ToolResult> {
  const fullOriginalPath = path.join(process.cwd(), originalPath);
  const fullNewPath = path.join(process.cwd(), newPath);

  // Create destination directory if needed
  const newDir = path.dirname(fullNewPath);
  await fs.mkdir(newDir, { recursive: true });

  // Rename the file
  await fs.rename(fullOriginalPath, fullNewPath);

  return {
    success: true,
    message: `File renamed: ${originalPath} → ${newPath}`
  };
}
