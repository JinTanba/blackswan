from langchain_core.tools import tool
from typing import Annotated

@tool
def add(a: Annotated[int | float, "First number"], b: Annotated[int | float, "Second number"]) -> float:
    """Add two numbers together."""
    return a + b
