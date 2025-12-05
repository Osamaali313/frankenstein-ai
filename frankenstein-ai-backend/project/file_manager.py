"""
File Management System

Handles real file system operations with security and validation.
Supports CRUD operations for files and folders within project workspaces.
"""

import os
import shutil
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class FileManager:
    """Manages file system operations for user projects"""

    def __init__(self, workspace_root: str = "./workspaces"):
        """
        Initialize file manager with workspace root

        Args:
            workspace_root: Root directory for all user workspaces
        """
        self.workspace_root = Path(workspace_root)
        self.workspace_root.mkdir(exist_ok=True)

        # Security: Allowed file extensions
        self.allowed_extensions = {
            # Code
            '.py', '.js', '.ts', '.tsx', '.jsx', '.html', '.css', '.scss',
            '.json', '.yaml', '.yml', '.toml', '.xml',
            # Config
            '.env', '.gitignore', '.dockerignore', '.editorconfig',
            # Docs
            '.md', '.txt', '.rst',
            # Data
            '.csv', '.sql',
            # Build
            '.sh', '.bat', '.ps1'
        }

        # Dangerous paths to block
        self.blocked_patterns = [
            '..', '~', '/etc/', '/sys/', '/proc/', 'C:\\Windows',
            'node_modules', '__pycache__', '.git/objects', '.git/hooks'
        ]

    def _validate_path(self, project_id: str, file_path: str) -> Path:
        """
        Validate and resolve file path within project workspace

        Args:
            project_id: Project identifier
            file_path: Relative file path

        Returns:
            Resolved absolute path

        Raises:
            ValueError: If path is invalid or outside workspace
        """
        # Check for dangerous patterns
        for pattern in self.blocked_patterns:
            if pattern in file_path:
                raise ValueError(f"Path contains blocked pattern: {pattern}")

        # Resolve project directory
        project_dir = self.workspace_root / project_id

        # Resolve full path
        full_path = (project_dir / file_path).resolve()

        # Ensure path is within workspace
        if not str(full_path).startswith(str(project_dir.resolve())):
            raise ValueError("Path traversal detected")

        return full_path

    def _validate_extension(self, file_path: str) -> bool:
        """Check if file extension is allowed"""
        ext = Path(file_path).suffix.lower()
        return ext in self.allowed_extensions or ext == ''

    async def create_project(self, project_id: str, name: str) -> Dict[str, Any]:
        """
        Create a new project workspace

        Args:
            project_id: Unique project identifier
            name: Human-readable project name

        Returns:
            Project metadata
        """
        try:
            project_dir = self.workspace_root / project_id

            if project_dir.exists():
                raise ValueError(f"Project {project_id} already exists")

            # Create project directory
            project_dir.mkdir(parents=True)

            # Create project metadata
            metadata = {
                'id': project_id,
                'name': name,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'files_count': 0
            }

            # Save metadata
            metadata_file = project_dir / '.project.json'
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)

            logger.info(f"Created project: {project_id} ({name})")

            return {
                'success': True,
                'project': metadata
            }

        except Exception as e:
            logger.error(f"Error creating project: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def create_file(
        self,
        project_id: str,
        file_path: str,
        content: str = ""
    ) -> Dict[str, Any]:
        """
        Create a new file in the project

        Args:
            project_id: Project identifier
            file_path: Relative path for new file
            content: File content

        Returns:
            Result with file metadata
        """
        try:
            # Validate path and extension
            full_path = self._validate_path(project_id, file_path)

            if not self._validate_extension(file_path):
                raise ValueError(f"File extension not allowed: {Path(file_path).suffix}")

            # Check if file already exists
            if full_path.exists():
                raise ValueError(f"File already exists: {file_path}")

            # Create parent directories
            full_path.parent.mkdir(parents=True, exist_ok=True)

            # Write file
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)

            logger.info(f"Created file: {file_path} in project {project_id}")

            return {
                'success': True,
                'file': {
                    'path': file_path,
                    'size': len(content),
                    'created_at': datetime.now().isoformat()
                }
            }

        except Exception as e:
            logger.error(f"Error creating file: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def read_file(self, project_id: str, file_path: str) -> Dict[str, Any]:
        """
        Read file content

        Args:
            project_id: Project identifier
            file_path: Relative file path

        Returns:
            File content and metadata
        """
        try:
            full_path = self._validate_path(project_id, file_path)

            if not full_path.exists():
                raise ValueError(f"File not found: {file_path}")

            if not full_path.is_file():
                raise ValueError(f"Not a file: {file_path}")

            # Read file
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Get file stats
            stats = full_path.stat()

            return {
                'success': True,
                'file': {
                    'path': file_path,
                    'content': content,
                    'size': stats.st_size,
                    'modified_at': datetime.fromtimestamp(stats.st_mtime).isoformat()
                }
            }

        except Exception as e:
            logger.error(f"Error reading file: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def update_file(
        self,
        project_id: str,
        file_path: str,
        content: str
    ) -> Dict[str, Any]:
        """
        Update existing file content

        Args:
            project_id: Project identifier
            file_path: Relative file path
            content: New file content

        Returns:
            Result with updated metadata
        """
        try:
            full_path = self._validate_path(project_id, file_path)

            if not full_path.exists():
                raise ValueError(f"File not found: {file_path}")

            # Write updated content
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)

            logger.info(f"Updated file: {file_path} in project {project_id}")

            return {
                'success': True,
                'file': {
                    'path': file_path,
                    'size': len(content),
                    'updated_at': datetime.now().isoformat()
                }
            }

        except Exception as e:
            logger.error(f"Error updating file: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def delete_file(self, project_id: str, file_path: str) -> Dict[str, Any]:
        """
        Delete a file

        Args:
            project_id: Project identifier
            file_path: Relative file path

        Returns:
            Result status
        """
        try:
            full_path = self._validate_path(project_id, file_path)

            if not full_path.exists():
                raise ValueError(f"File not found: {file_path}")

            # Delete file
            full_path.unlink()

            logger.info(f"Deleted file: {file_path} from project {project_id}")

            return {
                'success': True,
                'message': f"File deleted: {file_path}"
            }

        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def create_directory(
        self,
        project_id: str,
        dir_path: str
    ) -> Dict[str, Any]:
        """
        Create a new directory

        Args:
            project_id: Project identifier
            dir_path: Relative directory path

        Returns:
            Result with directory metadata
        """
        try:
            full_path = self._validate_path(project_id, dir_path)

            if full_path.exists():
                raise ValueError(f"Directory already exists: {dir_path}")

            # Create directory
            full_path.mkdir(parents=True, exist_ok=True)

            logger.info(f"Created directory: {dir_path} in project {project_id}")

            return {
                'success': True,
                'directory': {
                    'path': dir_path,
                    'created_at': datetime.now().isoformat()
                }
            }

        except Exception as e:
            logger.error(f"Error creating directory: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def list_files(
        self,
        project_id: str,
        dir_path: str = "."
    ) -> Dict[str, Any]:
        """
        List files and directories

        Args:
            project_id: Project identifier
            dir_path: Relative directory path

        Returns:
            List of files and directories
        """
        try:
            full_path = self._validate_path(project_id, dir_path)

            if not full_path.exists():
                raise ValueError(f"Directory not found: {dir_path}")

            if not full_path.is_dir():
                raise ValueError(f"Not a directory: {dir_path}")

            items = []

            for item in full_path.iterdir():
                # Skip hidden files and blocked patterns
                if item.name.startswith('.') and item.name != '.env':
                    continue

                if any(pattern in str(item) for pattern in self.blocked_patterns):
                    continue

                stats = item.stat()

                items.append({
                    'name': item.name,
                    'path': str(item.relative_to(full_path.parent)),
                    'type': 'directory' if item.is_dir() else 'file',
                    'size': stats.st_size if item.is_file() else 0,
                    'modified_at': datetime.fromtimestamp(stats.st_mtime).isoformat()
                })

            # Sort: directories first, then alphabetically
            items.sort(key=lambda x: (x['type'] != 'directory', x['name'].lower()))

            return {
                'success': True,
                'items': items
            }

        except Exception as e:
            logger.error(f"Error listing files: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def get_project_structure(self, project_id: str) -> Dict[str, Any]:
        """
        Get entire project file structure as tree

        Args:
            project_id: Project identifier

        Returns:
            Hierarchical file structure
        """
        try:
            project_dir = self.workspace_root / project_id

            if not project_dir.exists():
                raise ValueError(f"Project not found: {project_id}")

            def build_tree(path: Path) -> Dict[str, Any]:
                """Recursively build file tree"""
                if path.is_file():
                    stats = path.stat()
                    return {
                        'name': path.name,
                        'type': 'file',
                        'size': stats.st_size,
                        'extension': path.suffix
                    }
                else:
                    children = []
                    for item in path.iterdir():
                        # Skip hidden and blocked
                        if item.name.startswith('.') and item.name != '.env':
                            continue
                        if any(pattern in str(item) for pattern in self.blocked_patterns):
                            continue

                        children.append(build_tree(item))

                    return {
                        'name': path.name,
                        'type': 'directory',
                        'children': sorted(children, key=lambda x: (x['type'] != 'directory', x['name'].lower()))
                    }

            structure = build_tree(project_dir)

            return {
                'success': True,
                'structure': structure
            }

        except Exception as e:
            logger.error(f"Error getting project structure: {e}")
            return {
                'success': False,
                'error': str(e)
            }


# Singleton instance
file_manager = FileManager()
