from typing import Any, Dict, Optional, TypedDict, Literal, List
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from pydantic import BaseModel
from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient
import os
import asyncio

# default_mcps = {
#     "github": {
#     "command": "npx",
#     "args": [
#         "-y",
#         "@modelcontextprotocol/server-github"
#     ],
#     "env": {
#         "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
#     }
#     },
#     "infofinance_mcp": {
#     "command": "node",
#     "args": [
#         "/Users/tanbajintaro/Development/Infofinance/PolynanceDev/mcps/new_mcp/build/index.js"
#     ]
#     },
#     "playwright": {
#     "command": "node",
#     "args": [
#         "/Users/tanbajintaro/Development/mcp/playwright-mcp/cli.js"
#     ]
#     },
#     "blackswan-mcp": {
#         "command":"node",
#         "args":["/Users/tanbajintaro/Development/blackswan_protocol/mcp_server/dist/index.js"]
#     }
# }
default_mcps = [
    {
        "name": "github",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "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"
        }
    },
    {
        "name": "playwright",
        "command": "node",
        "args": ["/Users/tanbajintaro/Development/mcp/playwright-mcp/cli.js"],
    },
    {
        "name": "infofinance_mcp",
        "command": "node",
        "args": ["/Users/tanbajintaro/Development/Infofinance/PolynanceDev/mcps/new_mcp/build/index.js"],
    },
    {
        "name": "blackswan-mcp",
        "command": "node",
        "args": ["/Users/tanbajintaro/Development/blackswan_protocol/mcp_server/dist/index.js"],
    }
]
 


# mcp_client = MultiServerMCPClient(default_mcps);
# tools = mcp_client.get_tools();

class McpServer(BaseModel):
    name: str
    command: str
    args: List[str]
    env: Optional[Dict[str, str]]=None
    transport: Optional[str]=None

class MCP2Tools:
    mcp_servers: List[McpServer]
    mcp_client: MultiServerMCPClient
    tools: List[BaseTool]
    async def getTools(self, mcp_servers: List[dict[str, Any]]) -> List[BaseTool]:
        self.mcp_servers = [McpServer.model_validate(mcp_server) for mcp_server in mcp_servers]
        mcp_servers_dict = {
            s.name: {
                "command": s.command,
                "args": s.args,
                "env": s.env or {},
                "transport": s.transport or "stdio"
            }
            for s in self.mcp_servers
        }
        self.mcp_client = MultiServerMCPClient(mcp_servers_dict)
        self.tools = await self.mcp_client.get_tools()
        return self.tools
