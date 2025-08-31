import { InsuranceCard, InsuranceStatus } from '../../generated/prisma';

export type TxHash = `0x${string}`;

export interface IBlockchainRepository {
    calculateId(insuranceCard: InsuranceCard): Promise<string>;
    create(insuranceCard: InsuranceCard): Promise<TxHash>;
    getInsuranceCard(calculatedId:string): Promise<InsuranceCard>;
    updateStatus(calculatedId:string, status: InsuranceStatus): Promise<TxHash>;
    // claim
    tryClaim(calculatedId:string): Promise<TxHash>;
}