/**
 * Project Management Service
 *
 * Handles all project-related API calls to the backend
 */

const API_BASE = 'http://localhost:8000/api';

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  files_count: number;
}

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path?: string;
  size?: number;
  extension?: string;
  children?: FileNode[];
}

export interface FileContent {
  path: string;
  content: string;
  size: number;
  modified_at: string;
}

export class ProjectService {
  /**
   * Create a new project workspace
   */
  static async createProject(projectId: string, name: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/projects/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, name })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create project'
      };
    }
  }

  /**
   * Get project structure as tree
   */
  static async getProjectStructure(projectId: string): Promise<{ success: boolean; structure?: FileNode; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/projects/structure/${projectId}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project structure'
      };
    }
  }

  /**
   * Analyze project (get type, dependencies, etc.)
   */
  static async analyzeProject(projectId: string): Promise<{ success: boolean; analysis?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/projects/analyze/${projectId}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze project'
      };
    }
  }

  /**
   * Get AI context for project
   */
  static async getProjectContext(projectId: string, currentFile?: string): Promise<{ success: boolean; context?: any; error?: string }> {
    try {
      const url = currentFile
        ? `${API_BASE}/projects/context/${projectId}?current_file=${encodeURIComponent(currentFile)}`
        : `${API_BASE}/projects/context/${projectId}`;

      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get project context'
      };
    }
  }

  /**
   * Create a new file
   */
  static async createFile(projectId: string, filePath: string, content: string = ''): Promise<{ success: boolean; file?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, file_path: filePath, content })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create file'
      };
    }
  }

  /**
   * Read file content
   */
  static async readFile(projectId: string, filePath: string): Promise<{ success: boolean; file?: FileContent; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/files/read/${projectId}/${encodeURIComponent(filePath)}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read file'
      };
    }
  }

  /**
   * Update file content
   */
  static async updateFile(projectId: string, filePath: string, content: string): Promise<{ success: boolean; file?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/files/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, file_path: filePath, content })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update file'
      };
    }
  }

  /**
   * Delete a file
   */
  static async deleteFile(projectId: string, filePath: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/files/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, file_path: filePath })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file'
      };
    }
  }

  /**
   * Create a directory
   */
  static async createDirectory(projectId: string, dirPath: string): Promise<{ success: boolean; directory?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/directories/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, dir_path: dirPath })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create directory'
      };
    }
  }

  /**
   * List files in a directory
   */
  static async listFiles(projectId: string, dirPath: string = '.'): Promise<{ success: boolean; items?: any[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/files/list/${projectId}?dir_path=${encodeURIComponent(dirPath)}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files'
      };
    }
  }

  /**
   * Initialize Git repository
   */
  static async initGit(projectId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/git/init/${projectId}`, {
        method: 'POST'
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize Git'
      };
    }
  }

  /**
   * Get Git status
   */
  static async getGitStatus(projectId: string): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/git/status/${projectId}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get Git status'
      };
    }
  }

  /**
   * Commit changes
   */
  static async commitChanges(projectId: string, message: string, files?: string[]): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/git/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, message, files })
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to commit changes'
      };
    }
  }

  /**
   * Get commit history
   */
  static async getCommitLog(projectId: string, limit: number = 10): Promise<{ success: boolean; commits?: any[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/git/log/${projectId}?limit=${limit}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get commit log'
      };
    }
  }
}
