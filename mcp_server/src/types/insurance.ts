export interface InsuranceCard {
  id: string;
  name: string;
  detail: string;
  creator: string;
  metadata: Record<string, any>;
  status: InsuranceStatus;
  talebMade: boolean;
  agentCard?: {
    id: string;
    systemPrompt: string;
    tools: any[];
    sources: string[];
    metadata: Record<string, any>;
  };
}

export enum InsuranceStatus {
  FINISHED = "FINISHED",
  ACTIVE = "ACTIVE",
  WAITING = "WAITING",
  FAILED = "FAILED"
}

export interface CreateInsuranceCardRequest {
  name: string;
  detail: string;
  creator: string;
  metadata: Record<string, any>;
  status: InsuranceStatus;
  talebMade?: boolean;
  agentData: {
    systemPrompt: string;
    tools: any[];
    sources: string[];
    metadata: Record<string, any>;
  };
}

export interface UpdateInsuranceCardRequest {
  name?: string;
  detail?: string;
  creator?: string;
  metadata?: Record<string, any>;
  status?: InsuranceStatus;
  talebMade?: boolean;
}

export interface CreateInsuranceCardResponse {
  insuranceCard: InsuranceCard;
  txHash: string;
}

export interface UpdateInsuranceCardResponse {
  insuranceCard: InsuranceCard;
  txHash: string;
}

export interface ClaimInsuranceResponse {
  txHash: string;
}

export interface HealthResponse {
  status: string;
}