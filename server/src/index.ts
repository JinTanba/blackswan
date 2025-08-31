import 'dotenv/config';
import { PrismaClient } from './generated/prisma';
import { PrismaInsuranceCardRepository } from './infrastructure/repositories/PrismaInsuranceCardRepository';
import { PrismaBaseAgentImageRepository } from './infrastructure/repositories/PrismaBaseAgentImageRepository';
import { InMemoryVectorStore } from './infrastructure/repositories/InMemoryVectorStore';
import { MockBlockchainRepository } from './infrastructure/repositories/MockBlockchainRepository';
import { ManageData } from './application/usecases/ManageData';
import { InsuranceManager } from './application/usecases/InsuranceClaim';
import { InsuranceController } from './infrastructure/web/InsuranceController';
import { createApp } from './infrastructure/web/app';

async function main() {
  const prisma = new PrismaClient();
  
  const insuranceCardRepository = new PrismaInsuranceCardRepository(prisma);
  const baseAgentImageRepository = new PrismaBaseAgentImageRepository(prisma);
  const vectorStore = new InMemoryVectorStore();
  const blockchainRepository = new MockBlockchainRepository();

  const manageData = new ManageData(
    insuranceCardRepository,
    vectorStore,
    blockchainRepository,
    baseAgentImageRepository
  );

  const insuranceManager = new InsuranceManager(blockchainRepository);

  const insuranceController = new InsuranceController(
    manageData,
    insuranceManager
  );

  const app = createApp(insuranceController);

  const port = process.env.PORT || 3000;
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch(console.error);