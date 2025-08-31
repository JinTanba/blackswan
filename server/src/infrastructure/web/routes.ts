import { Router } from 'express';
import { InsuranceController } from './InsuranceController';

export function createInsuranceRoutes(insuranceController: InsuranceController): Router {
  const router = Router();

  router.post('/insurance-cards', (req, res) => 
    insuranceController.createInsuranceCard(req, res)
  );

  router.get('/insurance-cards/:id', (req, res) => 
    insuranceController.getInsuranceCard(req, res)
  );

  router.put('/insurance-cards/:id', (req, res) => 
    insuranceController.updateInsuranceCard(req, res)
  );

  router.post('/insurance-cards/search', (req, res) => 
    insuranceController.searchInsuranceCards(req, res)
  );

  router.patch('/insurance-cards/:id/status', (req, res) => 
    insuranceController.updateInsuranceStatus(req, res)
  );

  router.post('/insurance-cards/:id/claim', (req, res) => 
    insuranceController.claimInsurance(req, res)
  );

  return router;
}