# # backend/database/__init__.py
# from .db_config import get_db_connection
#
# from contextlib import contextmanager
#
# @contextmanager
# def get_cursor(commit: bool = False):
#     """
#     Usage:
#         with get_cursor(commit=True) as (cur, conn):
#             cur.execute("INSERT ...")
#     """
#     conn = get_db_connection()
#     try:
#         with conn.cursor() as cur:
#             yield cur, conn
#         if commit:
#             conn.commit()
#     finally:
#         conn.close()
#
# __all__ = ["get_db_connection", "get_cursor"]
