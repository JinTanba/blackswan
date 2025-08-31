enum InsuranceStatus {
    FINISHED = 'finished',
    ACTIVE = 'active',
    WAITING = 'waiting',
    FAILED = 'failed'
}

interface InsuranceCard {
    id: string;
    name: string;
    detail: string;
    creator: string;
    metadata: Record<string, any>;
    agentCard: BaseAgentImage;
    status: InsuranceStatus;
    createdAt: Date;
    updatedAt: Date;
}

interface BaseAgentImage {
    systemPrompt: string;
    tools: Record<string, any>[];
    sources: string[];
    metadata: Record<string, any>;
}