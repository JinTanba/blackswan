import { InsuranceCardMapper, CreateInsuranceCardDto, UpdateInsuranceCardDto } from './InsuranceCardDto';
import { InsuranceStatus } from '../../generated/prisma';

describe('InsuranceCardMapper', () => {
  describe('toCreateInput', () => {
    it('should convert CreateInsuranceCardDto to separate insurance and agent data', () => {
      const dto: CreateInsuranceCardDto = {
        name: 'Test Insurance',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: { test: 'data' },
        status: InsuranceStatus.ACTIVE,
        talebMade: true,
        agentData: {
          systemPrompt: 'Test system prompt',
          tools: [{ name: 'testTool' }],
          sources: ['source1', 'source2'],
          metadata: { agent: 'metadata' }
        }
      };

      const result = InsuranceCardMapper.toCreateInput(dto);

      expect(result.insuranceData).toEqual({
        name: 'Test Insurance',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: { test: 'data' },
        status: InsuranceStatus.ACTIVE,
        talebMade: true
      });

      expect(result.agentData).toEqual({
        systemPrompt: 'Test system prompt',
        tools: [{ name: 'testTool' }],
        sources: ['source1', 'source2'],
        metadata: { agent: 'metadata' }
      });
    });

    it('should default talebMade to false when not provided', () => {
      const dto: CreateInsuranceCardDto = {
        name: 'Test Insurance',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: {},
        status: InsuranceStatus.WAITING,
        agentData: {
          systemPrompt: 'Test prompt',
          tools: [],
          sources: [],
          metadata: {}
        }
      };

      const result = InsuranceCardMapper.toCreateInput(dto);

      expect(result.insuranceData.talebMade).toBe(false);
    });
  });

  describe('toUpdateInput', () => {
    it('should convert UpdateInsuranceCardDto to Prisma update input', () => {
      const dto: UpdateInsuranceCardDto = {
        name: 'Updated Name',
        status: InsuranceStatus.FINISHED,
        metadata: { updated: true }
      };

      const result = InsuranceCardMapper.toUpdateInput(dto);

      expect(result).toEqual({
        name: 'Updated Name',
        status: InsuranceStatus.FINISHED,
        metadata: { updated: true }
      });
    });

    it('should only include provided fields in update input', () => {
      const dto: UpdateInsuranceCardDto = {
        name: 'Updated Name'
      };

      const result = InsuranceCardMapper.toUpdateInput(dto);

      expect(result).toEqual({
        name: 'Updated Name'
      });
      expect(result.status).toBeUndefined();
      expect(result.metadata).toBeUndefined();
    });
  });

  describe('toResponseDto', () => {
    it('should convert InsuranceCard to response DTO with agent data', () => {
      const insuranceCard = {
        id: '1',
        name: 'Test Card',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: { test: 'data' },
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCardId: 'agent-1',
        agentCard: {
          id: 'agent-1',
          systemPrompt: 'Test prompt',
          tools: [{ name: 'tool1' }],
          sources: ['source1'],
          metadata: { agent: 'data' }
        }
      } as any;

      const result = InsuranceCardMapper.toResponseDto(insuranceCard);

      expect(result).toEqual({
        id: '1',
        name: 'Test Card',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: { test: 'data' },
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: {
          id: 'agent-1',
          systemPrompt: 'Test prompt',
          tools: [{ name: 'tool1' }],
          sources: ['source1'],
          metadata: { agent: 'data' }
        }
      });
    });

    it('should handle InsuranceCard without agent data', () => {
      const insuranceCard = {
        id: '1',
        name: 'Test Card',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: { test: 'data' },
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCardId: 'agent-1',
        agentCard: null
      } as any;

      const result = InsuranceCardMapper.toResponseDto(insuranceCard);

      expect(result.agentCard).toBeUndefined();
    });
  });

  describe('toCreateResponseDto', () => {
    it('should convert to create response DTO with tx hash', () => {
      const insuranceCard = {
        id: '1',
        name: 'Test Card',
        detail: 'Test detail',
        creator: 'test-creator',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCardId: 'agent-1',
        agentCard: null
      } as any;

      const txHash = '0x123456';

      const result = InsuranceCardMapper.toCreateResponseDto(insuranceCard, txHash);

      expect(result).toEqual({
        insuranceCard: expect.objectContaining({
          id: '1',
          name: 'Test Card'
        }),
        txHash: '0x123456'
      });
    });
  });
});