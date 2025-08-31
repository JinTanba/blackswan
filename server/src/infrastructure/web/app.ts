import express from 'express';
import cors from 'cors';
import { createInsuranceRoutes } from './routes';
import { InsuranceController } from '../../infrastructure/web/InsuranceController';

export function createApp(insuranceController: InsuranceController) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', createInsuranceRoutes(insuranceController));

  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  return app;
}