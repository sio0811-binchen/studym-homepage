import sys
import logging

logging.basicConfig(level=logging.DEBUG)

from notebooklm_tools.core.auth import load_cached_tokens
from notebooklm_tools.core.client import NotebookLMClient

try:
    tokens = load_cached_tokens()
    print("Tokens loaded:", tokens is not None)
    c = NotebookLMClient(
        cookies=tokens.cookies, 
        csrf_token=tokens.csrf_token, 
        session_id=tokens.session_id, 
        user_agent=tokens.user_agent
    )
    print("Notebooks:", c.list_notebooks())
except Exception as e:
    print(f"FAILED WITH EXCEPTION: {e}")
    raise
