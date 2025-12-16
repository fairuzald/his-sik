import logging
import sys
from contextvars import ContextVar
from typing import Optional

# Context vars for request tracing
_request_id_ctx_var: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
_user_id_ctx_var: ContextVar[Optional[str]] = ContextVar("user_id", default=None)

def set_request_context(request_id: str, user_id: Optional[str] = None):
    _request_id_ctx_var.set(request_id)
    _user_id_ctx_var.set(user_id)

def clear_request_context():
    _request_id_ctx_var.set(None)
    _user_id_ctx_var.set(None)

class ContextFilter(logging.Filter):
    def filter(self, record):
        record.request_id = _request_id_ctx_var.get()
        record.user_id = _user_id_ctx_var.get()
        return True

def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        # Include request_id and user_id in format
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - [req_id=%(request_id)s user_id=%(user_id)s] - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.addFilter(ContextFilter())
        logger.setLevel(logging.INFO)
    return logger
