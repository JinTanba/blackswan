from typing import Any, Dict, TypedDict, Literal, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from pydantic import BaseModel
from langchain_core.tools import BaseTool
from agents.tools.addition_tool import add
import os
from langchain_mcp_adapters.client import MultiServerMCPClient

default_mcps = {
    "github": {
    "command": "npx",
    "args": [
        "-y",
        "@modelcontextprotocol/server-github"
    ],
    "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
    }
    },
    "infofinance_mcp": {
    "command": "node",
    "args": [
        "/Users/tanbajintaro/Development/Infofinance/PolynanceDev/mcps/new_mcp/build/index.js"
    ]
    },
    "playwright": {
    "command": "node",
    "args": [
        "/Users/tanbajintaro/Development/mcp/playwright-mcp/cli.js"
    ]
    },
    "blackswan-mcp": {
        "command":"node",
        "args":["/Users/tanbajintaro/Development/blackswan_protocol/mcp_server/dist/index.js"]
    }
}

# mcp_client = MultiServerMCPClient(default_mcps);
# tools = mcp_client.get_tools();

class McpServer(BaseModel):
    command: str
    args: List[str]
    env: Dict[str, str]

class MCP2Tools(BaseModel):
    mcp_servers: List[McpServer]
    async def getTools(self, mcp_servers: List[dict[str, Any]]) -> List[BaseTool]:
        self.mcp_servers = [McpServer(**mcp_server) for mcp_server in mcp_servers]
        self.mcp_client = MultiServerMCPClient(self.mcp_servers)
        self.tools = await self.mcp_client.get_tools()
        return self.tools
    