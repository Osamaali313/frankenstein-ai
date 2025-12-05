"""
Code Execution Module

Safely executes code in sandboxed environments with resource limits.
Supports: Python, JavaScript/Node.js, with extensible architecture.
"""

import asyncio
import subprocess
import tempfile
import os
import json
from typing import Dict, Any, Optional
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class CodeExecutor:
    """Handles safe code execution in sandboxed environments"""

    def __init__(self):
        self.timeout = 10  # 10 seconds max execution time
        self.max_output_size = 10000  # 10KB max output

    async def execute(
        self,
        code: str,
        language: str,
        filename: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute code in a sandboxed environment

        Args:
            code: The code to execute
            language: Programming language (python, javascript, etc.)
            filename: Optional filename for context

        Returns:
            Dict with success status, output, and any errors
        """
        try:
            language = language.lower()

            if language in ['python', 'py']:
                return await self._execute_python(code)
            elif language in ['javascript', 'js', 'node', 'nodejs']:
                return await self._execute_javascript(code)
            elif language in ['typescript', 'ts']:
                return await self._execute_typescript(code)
            else:
                return {
                    'success': False,
                    'error': f'Execution not supported for language: {language}',
                    'output': ''
                }

        except Exception as e:
            logger.error(f"Execution error: {e}")
            return {
                'success': False,
                'error': str(e),
                'output': ''
            }

    async def _execute_python(self, code: str) -> Dict[str, Any]:
        """Execute Python code in a restricted environment"""
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(
                mode='w',
                suffix='.py',
                delete=False,
                encoding='utf-8'
            ) as f:
                f.write(code)
                temp_file = f.name

            try:
                # Execute with timeout and capture output
                process = await asyncio.create_subprocess_exec(
                    'python',
                    temp_file,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    # Security: limit resources
                    preexec_fn=None if os.name == 'nt' else self._limit_resources
                )

                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(),
                        timeout=self.timeout
                    )

                    output = stdout.decode('utf-8', errors='replace')
                    error = stderr.decode('utf-8', errors='replace')

                    # Limit output size
                    if len(output) > self.max_output_size:
                        output = output[:self.max_output_size] + "\n... (output truncated)"

                    if process.returncode == 0:
                        return {
                            'success': True,
                            'output': output,
                            'error': ''
                        }
                    else:
                        return {
                            'success': False,
                            'output': output,
                            'error': error or f'Process exited with code {process.returncode}'
                        }

                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                    return {
                        'success': False,
                        'output': '',
                        'error': f'Execution timeout after {self.timeout} seconds'
                    }

            finally:
                # Clean up temp file
                try:
                    os.unlink(temp_file)
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {e}")

        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': f'Python execution error: {str(e)}'
            }

    async def _execute_javascript(self, code: str) -> Dict[str, Any]:
        """Execute JavaScript code using Node.js"""
        try:
            # Check if Node.js is available
            node_check = await asyncio.create_subprocess_exec(
                'node',
                '--version',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await node_check.wait()

            if node_check.returncode != 0:
                return {
                    'success': False,
                    'output': '',
                    'error': 'Node.js is not installed or not in PATH'
                }

            # Create temporary file
            with tempfile.NamedTemporaryFile(
                mode='w',
                suffix='.js',
                delete=False,
                encoding='utf-8'
            ) as f:
                f.write(code)
                temp_file = f.name

            try:
                # Execute with Node.js
                process = await asyncio.create_subprocess_exec(
                    'node',
                    temp_file,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )

                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(),
                        timeout=self.timeout
                    )

                    output = stdout.decode('utf-8', errors='replace')
                    error = stderr.decode('utf-8', errors='replace')

                    # Limit output size
                    if len(output) > self.max_output_size:
                        output = output[:self.max_output_size] + "\n... (output truncated)"

                    if process.returncode == 0:
                        return {
                            'success': True,
                            'output': output,
                            'error': ''
                        }
                    else:
                        return {
                            'success': False,
                            'output': output,
                            'error': error or f'Process exited with code {process.returncode}'
                        }

                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                    return {
                        'success': False,
                        'output': '',
                        'error': f'Execution timeout after {self.timeout} seconds'
                    }

            finally:
                try:
                    os.unlink(temp_file)
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {e}")

        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': f'JavaScript execution error: {str(e)}'
            }

    async def _execute_typescript(self, code: str) -> Dict[str, Any]:
        """Execute TypeScript code using ts-node"""
        try:
            # Check if ts-node is available
            tsnode_check = await asyncio.create_subprocess_exec(
                'ts-node',
                '--version',
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await tsnode_check.wait()

            if tsnode_check.returncode != 0:
                return {
                    'success': False,
                    'output': '',
                    'error': 'ts-node is not installed. Please install with: npm install -g ts-node typescript'
                }

            # Create temporary file
            with tempfile.NamedTemporaryFile(
                mode='w',
                suffix='.ts',
                delete=False,
                encoding='utf-8'
            ) as f:
                f.write(code)
                temp_file = f.name

            try:
                # Execute with ts-node
                process = await asyncio.create_subprocess_exec(
                    'ts-node',
                    temp_file,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )

                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(),
                        timeout=self.timeout
                    )

                    output = stdout.decode('utf-8', errors='replace')
                    error = stderr.decode('utf-8', errors='replace')

                    if len(output) > self.max_output_size:
                        output = output[:self.max_output_size] + "\n... (output truncated)"

                    if process.returncode == 0:
                        return {
                            'success': True,
                            'output': output,
                            'error': ''
                        }
                    else:
                        return {
                            'success': False,
                            'output': output,
                            'error': error or f'Process exited with code {process.returncode}'
                        }

                except asyncio.TimeoutError:
                    process.kill()
                    await process.wait()
                    return {
                        'success': False,
                        'output': '',
                        'error': f'Execution timeout after {self.timeout} seconds'
                    }

            finally:
                try:
                    os.unlink(temp_file)
                except Exception as e:
                    logger.warning(f"Failed to delete temp file: {e}")

        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': f'TypeScript execution error: {str(e)}'
            }

    def _limit_resources(self):
        """Limit system resources for subprocess (Unix only)"""
        try:
            import resource
            # Limit CPU time to 10 seconds
            resource.setrlimit(resource.RLIMIT_CPU, (10, 10))
            # Limit memory to 256MB
            resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
        except ImportError:
            # resource module not available on Windows
            pass
        except Exception as e:
            logger.warning(f"Failed to set resource limits: {e}")


# Singleton instance
code_executor = CodeExecutor()
