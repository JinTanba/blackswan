from typing import Any, TypedDict, Literal, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from pydantic import BaseModel
from systemPrompt import system_prompt
from tools.main import tools
import asyncio
import os
from mcp2tools import MCP2Tools
from dotenv import load_dotenv

load_dotenv()


def generate_general_agent(mcp_servers: List[dict[str, Any]]):
    mcp2tools = MCP2Tools()
    mcp_tools = asyncio.run(mcp2tools.getTools(mcp_servers))
    print(len(mcp_tools))
    react_agent = create_react_agent(
        tools=mcp_tools + tools,
        model=ChatOpenAI(model="gpt-4.1"),
        prompt=system_prompt
    )
    return react_agent

if __name__ == "__main__":
    mcp_servers = [
        {
            "name": "github",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {
                "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
            }
        }
    ]
    agent = generate_general_agent(mcp_servers)
    res = agent.stream({"messages": [HumanMessage(content="what tools are available?")]})
    final_res = ""
    for chunk in res:
        print(chunk)
