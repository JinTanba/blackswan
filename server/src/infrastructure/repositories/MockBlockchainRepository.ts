import { IBlockchainRepository, TxHash } from "../../application/repositories/IBlockchainRepository";
import { InsuranceCard, InsuranceStatus } from "../../generated/prisma";

export class MockBlockchainRepository implements IBlockchainRepository {
  
  async calculateId(insuranceCard: InsuranceCard): Promise<string> {
    return `bc_${insuranceCard.id}`;
  }

  async create(insuranceCard: InsuranceCard): Promise<TxHash> {
    const txHash: TxHash = `0x${Math.random().toString(16).substring(2, 66)}` as TxHash;
    console.log(`Mock blockchain: Created insurance card ${insuranceCard.id} with txHash: ${txHash}`);
    return txHash;
  }

  async getInsuranceCard(id: string): Promise<InsuranceCard> {
    throw new Error("getInsuranceCard not implemented in mock - use primary repository");
  }

  async updateStatus(id: string, status: InsuranceStatus): Promise<TxHash> {
    const txHash: TxHash = `0x${Math.random().toString(16).substring(2, 66)}` as TxHash;
    console.log(`Mock blockchain: Updated insurance card ${id} status to ${status} with txHash: ${txHash}`);
    return txHash;
  }

  async tryClaim(id: string): Promise<TxHash> {
    const txHash: TxHash = `0x${Math.random().toString(16).substring(2, 66)}` as TxHash;
    console.log(`Mock blockchain: Claimed insurance card ${id} with txHash: ${txHash}`);
    return txHash;
  }
}