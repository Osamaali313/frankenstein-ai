"""
Project Analysis Engine

Analyzes project structure, dependencies, and provides context for AI agents.
Understands different project types (React, Python, Node.js, etc.)
"""

import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)


class ProjectAnalyzer:
    """Analyzes projects to provide context to AI agents"""

    def __init__(self, workspace_root: str = "./workspaces"):
        self.workspace_root = Path(workspace_root)

        # Project type detection patterns
        self.project_patterns = {
            'react': {
                'files': ['package.json'],
                'content_patterns': ['"react"', '"next"'],
                'markers': ['src/', 'components/', 'pages/']
            },
            'python': {
                'files': ['requirements.txt', 'pyproject.toml', 'setup.py'],
                'markers': ['*.py', 'src/', 'tests/']
            },
            'node': {
                'files': ['package.json'],
                'markers': ['node_modules/', 'src/', 'lib/']
            },
            'django': {
                'files': ['manage.py', 'requirements.txt'],
                'content_patterns': ['django']
            },
            'fastapi': {
                'files': ['main.py', 'requirements.txt'],
                'content_patterns': ['fastapi']
            }
        }

    async def analyze_project(self, project_id: str) -> Dict[str, Any]:
        """
        Perform comprehensive project analysis

        Args:
            project_id: Project identifier

        Returns:
            Analysis results with project type, structure, dependencies
        """
        try:
            project_dir = self.workspace_root / project_id

            if not project_dir.exists():
                raise ValueError(f"Project not found: {project_id}")

            # Detect project type
            project_type = await self._detect_project_type(project_dir)

            # Analyze structure
            structure_info = await self._analyze_structure(project_dir)

            # Parse dependencies
            dependencies = await self._parse_dependencies(project_dir, project_type)

            # Get file statistics
            stats = await self._get_file_stats(project_dir)

            # Identify entry points
            entry_points = await self._find_entry_points(project_dir, project_type)

            return {
                'success': True,
                'analysis': {
                    'project_type': project_type,
                    'structure': structure_info,
                    'dependencies': dependencies,
                    'statistics': stats,
                    'entry_points': entry_points
                }
            }

        except Exception as e:
            logger.error(f"Error analyzing project: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _detect_project_type(self, project_dir: Path) -> str:
        """Detect project type based on files and content"""
        detected_types = []

        for project_type, patterns in self.project_patterns.items():
            score = 0

            # Check for marker files
            if 'files' in patterns:
                for file in patterns['files']:
                    if (project_dir / file).exists():
                        score += 10

            # Check for content patterns
            if 'content_patterns' in patterns and 'files' in patterns:
                for file in patterns['files']:
                    file_path = project_dir / file
                    if file_path.exists():
                        try:
                            content = file_path.read_text()
                            for pattern in patterns['content_patterns']:
                                if pattern in content:
                                    score += 5
                        except:
                            pass

            # Check for marker directories/patterns
            if 'markers' in patterns:
                for marker in patterns['markers']:
                    if marker.endswith('/'):
                        # Directory marker
                        if (project_dir / marker.rstrip('/')).exists():
                            score += 3
                    else:
                        # File pattern marker
                        if list(project_dir.rglob(marker)):
                            score += 3

            if score > 0:
                detected_types.append((project_type, score))

        if detected_types:
            # Return type with highest score
            detected_types.sort(key=lambda x: x[1], reverse=True)
            return detected_types[0][0]

        return 'unknown'

    async def _analyze_structure(self, project_dir: Path) -> Dict[str, Any]:
        """Analyze project directory structure"""
        structure = {
            'has_src': (project_dir / 'src').exists(),
            'has_tests': (project_dir / 'tests').exists() or (project_dir / 'test').exists(),
            'has_docs': (project_dir / 'docs').exists(),
            'has_config': False,
            'directories': [],
            'root_files': []
        }

        # Find important directories
        for item in project_dir.iterdir():
            if item.name.startswith('.'):
                continue

            if item.is_dir():
                structure['directories'].append(item.name)
            else:
                structure['root_files'].append(item.name)

        # Check for config files
        config_files = ['package.json', 'tsconfig.json', 'pyproject.toml', 'setup.py', '.env']
        structure['has_config'] = any((project_dir / f).exists() for f in config_files)

        return structure

    async def _parse_dependencies(
        self,
        project_dir: Path,
        project_type: str
    ) -> Dict[str, List[str]]:
        """Parse project dependencies"""
        dependencies = {
            'runtime': [],
            'dev': [],
            'python': [],
            'npm': []
        }

        try:
            # Parse package.json (Node/React projects)
            package_json = project_dir / 'package.json'
            if package_json.exists():
                with open(package_json) as f:
                    data = json.load(f)
                    if 'dependencies' in data:
                        dependencies['npm'].extend(data['dependencies'].keys())
                        dependencies['runtime'].extend(data['dependencies'].keys())
                    if 'devDependencies' in data:
                        dependencies['dev'].extend(data['devDependencies'].keys())

            # Parse requirements.txt (Python projects)
            requirements = project_dir / 'requirements.txt'
            if requirements.exists():
                with open(requirements) as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            # Extract package name (before ==, >=, etc.)
                            pkg = line.split('==')[0].split('>=')[0].split('<=')[0].strip()
                            dependencies['python'].append(pkg)
                            dependencies['runtime'].append(pkg)

            # Parse pyproject.toml
            pyproject = project_dir / 'pyproject.toml'
            if pyproject.exists():
                # Simple parsing - could use toml library for better parsing
                content = pyproject.read_text()
                if '[tool.poetry.dependencies]' in content:
                    dependencies['python'].append('poetry-managed')

        except Exception as e:
            logger.error(f"Error parsing dependencies: {e}")

        return dependencies

    async def _get_file_stats(self, project_dir: Path) -> Dict[str, Any]:
        """Get file statistics for the project"""
        stats = {
            'total_files': 0,
            'total_dirs': 0,
            'total_size': 0,
            'file_types': {},
            'largest_files': []
        }

        files_with_sizes = []

        for item in project_dir.rglob('*'):
            # Skip hidden and node_modules
            if any(part.startswith('.') for part in item.parts):
                continue
            if 'node_modules' in item.parts or '__pycache__' in item.parts:
                continue

            if item.is_file():
                stats['total_files'] += 1
                size = item.stat().st_size
                stats['total_size'] += size

                # Track file types
                ext = item.suffix or 'no_extension'
                stats['file_types'][ext] = stats['file_types'].get(ext, 0) + 1

                # Track for largest files
                files_with_sizes.append({
                    'path': str(item.relative_to(project_dir)),
                    'size': size
                })

            elif item.is_dir():
                stats['total_dirs'] += 1

        # Get top 5 largest files
        files_with_sizes.sort(key=lambda x: x['size'], reverse=True)
        stats['largest_files'] = files_with_sizes[:5]

        return stats

    async def _find_entry_points(
        self,
        project_dir: Path,
        project_type: str
    ) -> List[str]:
        """Find main entry points for the project"""
        entry_points = []

        # Common entry point patterns by project type
        entry_patterns = {
            'react': ['src/index.tsx', 'src/index.js', 'src/App.tsx', 'pages/index.tsx'],
            'node': ['index.js', 'src/index.js', 'server.js', 'app.js'],
            'python': ['main.py', 'app.py', '__main__.py', 'src/main.py'],
            'django': ['manage.py', 'wsgi.py'],
            'fastapi': ['main.py', 'app/main.py', 'src/main.py']
        }

        patterns = entry_patterns.get(project_type, ['main.py', 'index.js', 'app.py'])

        for pattern in patterns:
            file_path = project_dir / pattern
            if file_path.exists():
                entry_points.append(pattern)

        return entry_points

    async def get_context_for_ai(
        self,
        project_id: str,
        current_file: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get relevant context for AI agents

        Args:
            project_id: Project identifier
            current_file: Current file being worked on

        Returns:
            Context information for AI prompting
        """
        try:
            analysis = await self.analyze_project(project_id)

            if not analysis['success']:
                return analysis

            project_dir = self.workspace_root / project_id

            context = {
                'project_type': analysis['analysis']['project_type'],
                'structure_overview': analysis['analysis']['structure'],
                'dependencies': analysis['analysis']['dependencies'],
                'file_count': analysis['analysis']['statistics']['total_files']
            }

            # Add current file context if provided
            if current_file:
                file_path = project_dir / current_file
                if file_path.exists():
                    # Get related files (same directory)
                    related_files = []
                    for sibling in file_path.parent.iterdir():
                        if sibling.is_file() and sibling != file_path:
                            related_files.append(str(sibling.relative_to(project_dir)))

                    context['current_file'] = {
                        'path': current_file,
                        'directory': str(file_path.parent.relative_to(project_dir)),
                        'related_files': related_files[:10]  # Limit to 10
                    }

            return {
                'success': True,
                'context': context
            }

        except Exception as e:
            logger.error(f"Error getting AI context: {e}")
            return {
                'success': False,
                'error': str(e)
            }


# Singleton instance
project_analyzer = ProjectAnalyzer()
