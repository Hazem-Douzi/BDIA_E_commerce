from datetime import datetime
from decimal import Decimal


def to_iso(value):
    if isinstance(value, datetime):
        return value.isoformat()
    return value


def to_float(value):
    if isinstance(value, Decimal):
        return float(value)
    return value

