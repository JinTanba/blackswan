import { Request, Response } from 'express';
import { InsuranceController } from './InsuranceController';
import { ManageData } from '../../application/usecases/ManageData';
import { InsuranceManager } from '../../application/usecases/InsuranceClaim';
import { InsuranceStatus } from '../../generated/prisma';
import { CreateInsuranceCardDto, UpdateInsuranceCardDto, SearchInsuranceCardsDto, UpdateInsuranceStatusDto } from './InsuranceCardDto';

jest.mock('../../application/usecases/ManageData');
jest.mock('../../application/usecases/InsuranceClaim');

describe('InsuranceController', () => {
  let controller: InsuranceController;
  let manageData: jest.Mocked<ManageData>;
  let insuranceManager: jest.Mocked<InsuranceManager>;
  let req: Partial<Request> & { params: any; body: any };
  let res: Partial<Response>;

  beforeEach(() => {
    manageData = new ManageData(null as any, null as any, null as any, null as any) as jest.Mocked<ManageData>;
    insuranceManager = new InsuranceManager(null as any) as jest.Mocked<InsuranceManager>;
    controller = new InsuranceController(manageData, insuranceManager);
    
    req = {
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('createInsuranceCard', () => {
    it('should create insurance card successfully', async () => {
      const mockCard = { 
        id: '1', 
        name: 'Test', 
        detail: 'Test detail',
        creator: 'creator1',
        metadata: {},
        agentCardId: 'agent1',
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: null
      };
      const mockResult = { insuranceCard: mockCard, txHash: 'hash123' };
      manageData.createInsuranceCard.mockResolvedValue(mockResult as any);
      
      const dto: CreateInsuranceCardDto = { 
        name: 'Test', 
        detail: 'Test detail',
        creator: 'creator1',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        agentData: {
          systemPrompt: 'Test prompt',
          tools: [],
          sources: [],
          metadata: {}
        }
      };
      req.body = dto;

      await controller.createInsuranceCard(req as any, res as Response);

      expect(manageData.createInsuranceCard).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        insuranceCard: expect.any(Object),
        txHash: 'hash123'
      }));
    });

    it('should handle create errors', async () => {
      const error = new Error('Creation failed');
      manageData.createInsuranceCard.mockRejectedValue(error);

      await controller.createInsuranceCard(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Creation failed' });
    });
  });

  describe('getInsuranceCard', () => {
    it('should get insurance card successfully', async () => {
      const mockCard = { 
        id: '1', 
        name: 'Test',
        detail: 'Test detail',
        creator: 'creator1',
        metadata: {},
        agentCardId: 'agent1',
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: null
      };
      manageData.getInsuranceCard.mockResolvedValue(mockCard as any);
      req.params = { id: '1' };

      await controller.getInsuranceCard(req as any, res as Response);

      expect(manageData.getInsuranceCard).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        name: 'Test'
      }));
    });

    it('should return 404 when card not found', async () => {
      manageData.getInsuranceCard.mockResolvedValue(null);
      req.params = { id: '1' };

      await controller.getInsuranceCard(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insurance card not found' });
    });

    it('should handle get errors', async () => {
      const error = new Error('Database error');
      manageData.getInsuranceCard.mockRejectedValue(error);
      req.params = { id: '1' };

      await controller.getInsuranceCard(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateInsuranceCard', () => {
    it('should update insurance card successfully', async () => {
      const mockCard = { 
        id: '1', 
        name: 'Updated',
        detail: 'Updated detail',
        creator: 'creator1',
        metadata: {},
        agentCardId: 'agent1',
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: null
      };
      const mockResult = { insuranceCard: mockCard, txHash: 'hash123' };
      manageData.updateInsuranceCard.mockResolvedValue(mockResult as any);
      req.params = { id: '1' };
      
      const dto: UpdateInsuranceCardDto = { name: 'Updated' };
      req.body = dto;

      await controller.updateInsuranceCard(req as any, res as Response);

      expect(manageData.updateInsuranceCard).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        insuranceCard: expect.any(Object),
        txHash: 'hash123'
      }));
    });
  });

  describe('searchInsuranceCards', () => {
    it('should search insurance cards successfully', async () => {
      const mockCards = [{ 
        id: '1', 
        name: 'Test',
        detail: 'Test detail',
        creator: 'creator1',
        metadata: {},
        agentCardId: 'agent1',
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: null
      }];
      manageData.searchInsuranceCard.mockResolvedValue(mockCards as any);
      
      const dto: SearchInsuranceCardsDto = { queries: ['test query'] };
      req.body = dto;

      await controller.searchInsuranceCards(req as any, res as Response);

      expect(manageData.searchInsuranceCard).toHaveBeenCalledWith(['test query']);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Test' })
      ]));
    });

    it('should return 400 when queries is not array', async () => {
      req.body = { queries: 'not an array' };

      await controller.searchInsuranceCards(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Queries must be an array' });
    });
  });

  describe('updateInsuranceStatus', () => {
    it('should update status successfully', async () => {
      const mockCard = { 
        id: '1', 
        name: 'Test',
        detail: 'Test detail',
        creator: 'creator1',
        metadata: {},
        agentCardId: 'agent1',
        status: InsuranceStatus.ACTIVE,
        talebMade: false,
        agentCard: null
      };
      const mockResult = { insuranceCard: mockCard, txHash: 'hash123' };
      manageData.updateInsuranceStatus.mockResolvedValue(mockResult as any);
      req.params = { id: '1' };
      
      const dto: UpdateInsuranceStatusDto = { status: InsuranceStatus.ACTIVE };
      req.body = dto;

      await controller.updateInsuranceStatus(req as any, res as Response);

      expect(manageData.updateInsuranceStatus).toHaveBeenCalledWith('1', InsuranceStatus.ACTIVE);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        insuranceCard: expect.any(Object),
        txHash: 'hash123'
      }));
    });

    it('should return 400 for invalid status', async () => {
      req.params = { id: '1' };
      req.body = { status: 'INVALID_STATUS' };

      await controller.updateInsuranceStatus(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });
  });

  describe('claimInsurance', () => {
    it('should claim insurance successfully', async () => {
      const mockTxHash = '0x1234567890abcdef' as `0x${string}`;
      insuranceManager.claimInsurance.mockResolvedValue(mockTxHash);
      req.params = { id: '1' };

      await controller.claimInsurance(req as any, res as Response);

      expect(insuranceManager.claimInsurance).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ txHash: mockTxHash });
    });

    it('should handle claim errors', async () => {
      const error = new Error('Claim failed');
      insuranceManager.claimInsurance.mockRejectedValue(error);
      req.params = { id: '1' };

      await controller.claimInsurance(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Claim failed' });
    });
  });
});