"""
Git Integration

Simple Git operations for version control within projects.
"""

import subprocess
from pathlib import Path
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class GitManager:
    """Handles Git operations for projects"""

    def __init__(self, workspace_root: str = "./workspaces"):
        self.workspace_root = Path(workspace_root)

    def _run_git_command(
        self,
        project_dir: Path,
        command: List[str]
    ) -> Dict[str, Any]:
        """
        Run a git command in the project directory

        Args:
            project_dir: Project directory path
            command: Git command as list of strings

        Returns:
            Result with stdout, stderr, and status
        """
        try:
            result = subprocess.run(
                ['git'] + command,
                cwd=project_dir,
                capture_output=True,
                text=True,
                timeout=30
            )

            return {
                'success': result.returncode == 0,
                'output': result.stdout.strip(),
                'error': result.stderr.strip()
            }

        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'output': '',
                'error': 'Git command timed out'
            }
        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': str(e)
            }

    async def init_repository(self, project_id: str) -> Dict[str, Any]:
        """
        Initialize a Git repository in the project

        Args:
            project_id: Project identifier

        Returns:
            Result status
        """
        try:
            project_dir = self.workspace_root / project_id

            if not project_dir.exists():
                raise ValueError(f"Project not found: {project_id}")

            # Check if git is already initialized
            if (project_dir / '.git').exists():
                return {
                    'success': True,
                    'message': 'Git repository already initialized'
                }

            # Initialize git
            result = self._run_git_command(project_dir, ['init'])

            if result['success']:
                # Create .gitignore
                gitignore_content = """
# Dependencies
node_modules/
__pycache__/
*.pyc
.Python
env/
venv/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env files
.env
.env.local

# Build outputs
dist/
build/
*.egg-info/
"""
                gitignore_path = project_dir / '.gitignore'
                gitignore_path.write_text(gitignore_content.strip())

                logger.info(f"Initialized Git repository for project {project_id}")

            return result

        except Exception as e:
            logger.error(f"Error initializing Git: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def get_status(self, project_id: str) -> Dict[str, Any]:
        """
        Get Git status

        Args:
            project_id: Project identifier

        Returns:
            Git status information
        """
        try:
            project_dir = self.workspace_root / project_id

            if not (project_dir / '.git').exists():
                return {
                    'success': False,
                    'error': 'Git repository not initialized'
                }

            result = self._run_git_command(project_dir, ['status', '--short'])

            return result

        except Exception as e:
            logger.error(f"Error getting Git status: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def commit(
        self,
        project_id: str,
        message: str,
        files: List[str] = None
    ) -> Dict[str, Any]:
        """
        Commit changes

        Args:
            project_id: Project identifier
            message: Commit message
            files: Specific files to commit (None = all)

        Returns:
            Commit result
        """
        try:
            project_dir = self.workspace_root / project_id

            if not (project_dir / '.git').exists():
                return {
                    'success': False,
                    'error': 'Git repository not initialized'
                }

            # Add files
            if files:
                for file in files:
                    self._run_git_command(project_dir, ['add', file])
            else:
                self._run_git_command(project_dir, ['add', '.'])

            # Commit
            result = self._run_git_command(project_dir, ['commit', '-m', message])

            logger.info(f"Git commit in project {project_id}: {message}")

            return result

        except Exception as e:
            logger.error(f"Error committing to Git: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def get_log(
        self,
        project_id: str,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Get commit history

        Args:
            project_id: Project identifier
            limit: Number of commits to retrieve

        Returns:
            Commit history
        """
        try:
            project_dir = self.workspace_root / project_id

            if not (project_dir / '.git').exists():
                return {
                    'success': False,
                    'error': 'Git repository not initialized'
                }

            result = self._run_git_command(
                project_dir,
                ['log', f'-{limit}', '--pretty=format:%H|%an|%ae|%ad|%s', '--date=iso']
            )

            if result['success'] and result['output']:
                commits = []
                for line in result['output'].split('\n'):
                    if line:
                        parts = line.split('|')
                        if len(parts) >= 5:
                            commits.append({
                                'hash': parts[0],
                                'author': parts[1],
                                'email': parts[2],
                                'date': parts[3],
                                'message': parts[4]
                            })

                result['commits'] = commits

            return result

        except Exception as e:
            logger.error(f"Error getting Git log: {e}")
            return {
                'success': False,
                'error': str(e)
            }


# Singleton instance
git_manager = GitManager()
