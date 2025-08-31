import request from 'supertest';
import express from 'express';
import { createInsuranceRoutes } from './routes';
import { InsuranceController } from './InsuranceController';

describe('Insurance Routes', () => {
  let app: express.Application;
  let mockController: jest.Mocked<InsuranceController>;

  beforeEach(() => {
    mockController = {
      createInsuranceCard: jest.fn().mockImplementation((req, res) => res.status(201).json({ success: true })),
      getInsuranceCard: jest.fn().mockImplementation((req, res) => res.json({ id: req.params.id })),
      updateInsuranceCard: jest.fn().mockImplementation((req, res) => res.json({ updated: true })),
      searchInsuranceCards: jest.fn().mockImplementation((req, res) => res.json({ results: [] })),
      updateInsuranceStatus: jest.fn().mockImplementation((req, res) => res.json({ statusUpdated: true })),
      claimInsurance: jest.fn().mockImplementation((req, res) => res.json({ txHash: 'hash123' }))
    } as any;

    app = express();
    app.use(express.json());
    app.use('/api', createInsuranceRoutes(mockController));
  });

  it('should have POST /api/insurance-cards route', async () => {
    await request(app)
      .post('/api/insurance-cards')
      .send({ name: 'Test Card' });

    expect(mockController.createInsuranceCard).toHaveBeenCalled();
  });

  it('should have GET /api/insurance-cards/:id route', async () => {
    await request(app)
      .get('/api/insurance-cards/123');

    expect(mockController.getInsuranceCard).toHaveBeenCalled();
  });

  it('should have PUT /api/insurance-cards/:id route', async () => {
    await request(app)
      .put('/api/insurance-cards/123')
      .send({ name: 'Updated Card' });

    expect(mockController.updateInsuranceCard).toHaveBeenCalled();
  });

  it('should have POST /api/insurance-cards/search route', async () => {
    await request(app)
      .post('/api/insurance-cards/search')
      .send({ queries: ['test'] });

    expect(mockController.searchInsuranceCards).toHaveBeenCalled();
  });

  it('should have PATCH /api/insurance-cards/:id/status route', async () => {
    await request(app)
      .patch('/api/insurance-cards/123/status')
      .send({ status: 'ACTIVE' });

    expect(mockController.updateInsuranceStatus).toHaveBeenCalled();
  });

  it('should have POST /api/insurance-cards/:id/claim route', async () => {
    await request(app)
      .post('/api/insurance-cards/123/claim');

    expect(mockController.claimInsurance).toHaveBeenCalled();
  });
});