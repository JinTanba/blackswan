import { Request, Response } from 'express';
import { ManageData } from '../../application/usecases/ManageData';
import { InsuranceManager } from '../../application/usecases/InsuranceClaim';
import { InsuranceStatus } from '../../generated/prisma';
import { 
  CreateInsuranceCardDto, 
  UpdateInsuranceCardDto, 
  UpdateInsuranceStatusDto, 
  SearchInsuranceCardsDto,
  InsuranceCardMapper
} from './InsuranceCardDto';

export class InsuranceController {
  constructor(
    private manageData: ManageData,
    private insuranceManager: InsuranceManager
  ) {}

  async createInsuranceCard(req: Request<{}, {}, CreateInsuranceCardDto>, res: Response) {
    try {
      const result = await this.manageData.createInsuranceCard(req.body);
      const responseDto = InsuranceCardMapper.toCreateResponseDto(result.insuranceCard, result.txHash);
      res.status(201).json(responseDto);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getInsuranceCard(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const insuranceCard = await this.manageData.getInsuranceCard(id);
      
      if (!insuranceCard) {
        return res.status(404).json({ error: 'Insurance card not found' });
      }
      
      const responseDto = InsuranceCardMapper.toResponseDto(insuranceCard);
      return res.json(responseDto);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateInsuranceCard(req: Request<{ id: string }, {}, UpdateInsuranceCardDto>, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.manageData.updateInsuranceCard(id, req.body);
      const responseDto = InsuranceCardMapper.toUpdateResponseDto(result.insuranceCard, result.txHash);
      res.json(responseDto);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async searchInsuranceCards(req: Request<{}, {}, SearchInsuranceCardsDto>, res: Response) {
    try {
      const { queries } = req.body;
      
      if (!Array.isArray(queries)) {
        return res.status(400).json({ error: 'Queries must be an array' });
      }
      
      const results = await this.manageData.searchInsuranceCard(queries);
      const responseDto = InsuranceCardMapper.toResponseDtoArray(results);
      return res.json(responseDto);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateInsuranceStatus(req: Request<{ id: string }, {}, UpdateInsuranceStatusDto>, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!Object.values(InsuranceStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const result = await this.manageData.updateInsuranceStatus(id, status);
      const responseDto = InsuranceCardMapper.toUpdateResponseDto(result.insuranceCard, result.txHash);
      return res.json(responseDto);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async claimInsurance(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const txHash = await this.insuranceManager.claimInsurance(id);
      return res.json({ txHash });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}