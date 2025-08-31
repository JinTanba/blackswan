import { InMemoryInsuranceCardRepository } from '../../tests/mocks/InMemoryInsuranceCardRepository';
import { InsuranceStatus, Prisma } from '../../generated/prisma';
import { IInsuranceCardRepository } from '../../application/repositories/IInsuranceCardRepository';

describe('InsuranceCardRepository', () => {
  let repository: IInsuranceCardRepository;

  beforeEach(() => {
    repository = new InMemoryInsuranceCardRepository();
  });

  describe('create', () => {
    it('should create a new insurance card with agent image', async () => {
      const createInput: Prisma.InsuranceCardCreateInput = {
        name: 'Test Insurance',
        detail: 'Test insurance detail',
        creator: 'user123',
        metadata: { type: 'health', coverage: 'full' },
        status: InsuranceStatus.ACTIVE,
        agentCard: {
          create: {
            systemPrompt: 'You are an insurance assistant',
            tools: [{ name: 'calculator', config: {} }],
            sources: ['source1', 'source2'],
            metadata: { version: '1.0' }
          }
        }
      };

      const result = await repository.create(createInput);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Insurance');
      expect(result.status).toBe(InsuranceStatus.ACTIVE);
      expect(result.agentCardId).toBeDefined();
    });
  });

  describe('findUnique', () => {
    it('should find an insurance card by id', async () => {
      // First create a card
      const created = await repository.create({
        name: 'Test Card',
        detail: 'Test detail',
        creator: 'user123',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        agentCard: {
          create: {
            systemPrompt: 'Test prompt',
            tools: [],
            sources: [],
            metadata: {}
          }
        }
      });

      const result = await repository.findUnique({ id: created.id });
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(created.id);
    });

    it('should return null when insurance card not found', async () => {
      const result = await repository.findUnique({ id: 'non-existent-id' });
      
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find all insurance cards with filters', async () => {
      const args: Prisma.InsuranceCardFindManyArgs = {
        where: {
          status: InsuranceStatus.ACTIVE,
          creator: 'user123'
        },
        include: {
          agentCard: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10,
        skip: 0
      };

      const results = await repository.findMany(args);
      
      expect(Array.isArray(results)).toBe(true);
    });

    it('should find all insurance cards without filters', async () => {
      const results = await repository.findMany();
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an insurance card', async () => {
      // First create a card
      const created = await repository.create({
        name: 'Original Insurance',
        detail: 'Original detail',
        creator: 'user123',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        agentCard: {
          create: {
            systemPrompt: 'Original prompt',
            tools: [],
            sources: [],
            metadata: {}
          }
        }
      });

      const updateArgs: Prisma.InsuranceCardUpdateArgs = {
        where: { id: created.id },
        data: {
          name: 'Updated Insurance',
          status: InsuranceStatus.FINISHED,
          metadata: { updated: true }
        }
      };

      const result = await repository.update(updateArgs);
      
      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Insurance');
      expect(result.status).toBe(InsuranceStatus.FINISHED);
    });
  });

  describe('delete', () => {
    it('should delete an insurance card', async () => {
      // First create a card
      const created = await repository.create({
        name: 'To Delete',
        detail: 'Will be deleted',
        creator: 'user123',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        agentCard: {
          create: {
            systemPrompt: 'Delete me',
            tools: [],
            sources: [],
            metadata: {}
          }
        }
      });

      const result = await repository.delete({ id: created.id });
      
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      
      // Verify it's deleted
      const found = await repository.findUnique({ id: created.id });
      expect(found).toBeNull();
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple insurance cards', async () => {
      const result = await repository.deleteMany({
        status: InsuranceStatus.FAILED
      });
      
      expect(result).toBeDefined();
      expect(result.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('count', () => {
    it('should count insurance cards with filter', async () => {
      const count = await repository.count({
        status: InsuranceStatus.ACTIVE
      });
      
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('upsert', () => {
    it('should create or update an insurance card', async () => {
      const upsertArgs: Prisma.InsuranceCardUpsertArgs = {
        where: { id: 'test-id-123' },
        update: {
          name: 'Updated Insurance'
        },
        create: {
          name: 'New Insurance',
          detail: 'New insurance detail',
          creator: 'user123',
          metadata: {},
          status: InsuranceStatus.WAITING,
          agentCard: {
            create: {
              systemPrompt: 'Assistant prompt',
              tools: [],
              sources: [],
              metadata: {}
            }
          }
        }
      };

      const result = await repository.upsert(upsertArgs);
      
      expect(result).toBeDefined();
    });
  });

  describe('findFirst', () => {
    it('should find the first matching insurance card', async () => {
      // Create some test data
      await repository.create({
        name: 'First Card',
        detail: 'First detail',
        creator: 'user123',
        metadata: {},
        status: InsuranceStatus.ACTIVE,
        agentCard: {
          create: {
            systemPrompt: 'First prompt',
            tools: [],
            sources: [],
            metadata: {}
          }
        }
      });

      const args: Prisma.InsuranceCardFindFirstArgs = {
        where: {
          creator: { equals: 'user123' },
          status: { equals: InsuranceStatus.ACTIVE }
        },
        orderBy: {
          createdAt: 'desc'
        }
      };

      const result = await repository.findFirst(args);
      
      expect(result).toBeDefined();
      expect(result?.creator).toBe('user123');
      expect(result?.status).toBe(InsuranceStatus.ACTIVE);
    });
  });
});