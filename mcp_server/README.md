# BlackSwan Insurance MCP Server

This MCP (Model Context Protocol) server provides tools for interacting with the BlackSwan Insurance API. It allows AI assistants to manage insurance cards through a standardized protocol.

## Features

- **Create Insurance Card**: Create new insurance cards with policy details
- **Get Insurance Card**: Retrieve insurance card information by ID
- **Update Insurance Card**: Modify existing insurance cards
- **Search Insurance Cards**: Semantic search across insurance cards
- **Update Insurance Status**: Change insurance card status (ACTIVE, INACTIVE, etc.)
- **Claim Insurance**: Submit insurance claims
- **Health Check**: Check API server status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Tools

### create-insurance-card
Creates a new insurance card with agent data:
- `name`: Name of the insurance card
- `detail`: Detailed description of the insurance card
- `creator`: Creator of the insurance card
- `metadata`: Additional metadata object
- `status`: Status (FINISHED, ACTIVE, WAITING, FAILED)
- `talebMade`: Optional boolean indicating if taleb is made
- `agentData`: Agent configuration object with:
  - `systemPrompt`: System prompt for the agent
  - `tools`: Array of tools available to the agent
  - `sources`: Array of sources for the agent
  - `metadata`: Agent-specific metadata

### get-insurance-card
Retrieves an insurance card by ID:
- `id`: Insurance card ID

### update-insurance-card
Updates an existing insurance card:
- `id`: Insurance card ID
- `name`: Optional name update
- `detail`: Optional detail update
- `creator`: Optional creator update
- `metadata`: Optional metadata update
- `status`: Optional status update (FINISHED, ACTIVE, WAITING, FAILED)
- `talebMade`: Optional boolean update

### search-insurance-cards
Performs semantic search on insurance cards:
- `queries`: Array of search queries

### update-insurance-status
Updates the status of an insurance card:
- `id`: Insurance card ID
- `status`: New status (FINISHED, ACTIVE, WAITING, FAILED)

### claim-insurance
Submits an insurance claim:
- `id`: Insurance card ID

### health-check
Checks the health status of the insurance API server

## Configuration

The server connects to the insurance API at `http://localhost:3000` by default. This can be configured in the `InsuranceApiClient` constructor.

## MCP Integration

This server implements the Model Context Protocol (MCP) using the official TypeScript SDK. It can be integrated with any MCP-compatible client or AI assistant.