import { InsuranceStatus, Prisma, InsuranceCard, BaseAgentImage } from '../../generated/prisma';

export interface CreateInsuranceCardDto {
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

export interface UpdateInsuranceCardDto {
  name?: string;
  detail?: string;
  creator?: string;
  metadata?: Record<string, any>;
  status?: InsuranceStatus;
  talebMade?: boolean;
}

export interface UpdateInsuranceStatusDto {
  status: InsuranceStatus;
}

export interface SearchInsuranceCardsDto {
  queries: string[];
}

export interface InsuranceCardResponseDto {
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

export interface CreateInsuranceCardResponseDto {
  insuranceCard: InsuranceCardResponseDto;
  txHash: string;
}

export interface UpdateInsuranceCardResponseDto {
  insuranceCard: InsuranceCardResponseDto;
  txHash: string;
}

export interface ClaimInsuranceResponseDto {
  txHash: string;
}

type InsuranceCardWithAgent = InsuranceCard & {
  agentCard?: BaseAgentImage | null;
};

export class InsuranceCardMapper {
  static toCreateInput(dto: CreateInsuranceCardDto): {
    insuranceData: Omit<Prisma.InsuranceCardCreateInput, 'agentCard'>;
    agentData: Prisma.BaseAgentImageCreateInput;
  } {
    return {
      insuranceData: {
        name: dto.name,
        detail: dto.detail,
        creator: dto.creator,
        metadata: dto.metadata,
        status: dto.status,
        talebMade: dto.talebMade ?? false
      },
      agentData: {
        systemPrompt: dto.agentData.systemPrompt,
        tools: dto.agentData.tools,
        sources: dto.agentData.sources,
        metadata: dto.agentData.metadata
      }
    };
  }

  static toUpdateInput(dto: UpdateInsuranceCardDto): Prisma.InsuranceCardUpdateInput {
    const updateInput: Prisma.InsuranceCardUpdateInput = {};
    
    if (dto.name !== undefined) updateInput.name = dto.name;
    if (dto.detail !== undefined) updateInput.detail = dto.detail;
    if (dto.creator !== undefined) updateInput.creator = dto.creator;
    if (dto.metadata !== undefined) updateInput.metadata = dto.metadata;
    if (dto.status !== undefined) updateInput.status = dto.status;
    if (dto.talebMade !== undefined) updateInput.talebMade = dto.talebMade;

    return updateInput;
  }

  static toResponseDto(insuranceCard: InsuranceCardWithAgent): InsuranceCardResponseDto {
    return {
      id: insuranceCard.id,
      name: insuranceCard.name,
      detail: insuranceCard.detail,
      creator: insuranceCard.creator,
      metadata: insuranceCard.metadata as Record<string, any>,
      status: insuranceCard.status,
      talebMade: insuranceCard.talebMade,
      agentCard: insuranceCard.agentCard ? {
        id: insuranceCard.agentCard.id,
        systemPrompt: insuranceCard.agentCard.systemPrompt,
        tools: insuranceCard.agentCard.tools as any[],
        sources: insuranceCard.agentCard.sources,
        metadata: insuranceCard.agentCard.metadata as Record<string, any>
      } : undefined
    };
  }

  static toCreateResponseDto(
    insuranceCard: InsuranceCardWithAgent, 
    txHash: string
  ): CreateInsuranceCardResponseDto {
    return {
      insuranceCard: this.toResponseDto(insuranceCard),
      txHash
    };
  }

  static toUpdateResponseDto(
    insuranceCard: InsuranceCardWithAgent, 
    txHash: string
  ): UpdateInsuranceCardResponseDto {
    return {
      insuranceCard: this.toResponseDto(insuranceCard),
      txHash
    };
  }

  static toResponseDtoArray(insuranceCards: InsuranceCardWithAgent[]): InsuranceCardResponseDto[] {
    return insuranceCards.map(card => this.toResponseDto(card));
  }
}