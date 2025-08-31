import { IBlockchainRepository, TxHash } from "../repositories/IBlockchainRepository";
import { IInsuranceCardRepository } from "../repositories/IInsuranceCardRepository";
import { IVectorStore } from "../repositories/IVectorStore";
import { Prisma, InsuranceCard, InsuranceStatus } from "../../generated/prisma";
import { Document } from "@langchain/core/documents";

export class ManageData {
    constructor(
        private insuranceCardRepository: IInsuranceCardRepository,
        private vectorStore: IVectorStore,
        private blockchainRepository: IBlockchainRepository
    ) {
        this.insuranceCardRepository = insuranceCardRepository;
        this.vectorStore = vectorStore;
        this.blockchainRepository = blockchainRepository;
    }

    async createInsuranceCard(input: Prisma.InsuranceCardCreateInput): Promise<{ insuranceCard: InsuranceCard, txHash: TxHash }> {
        const insuranceCard = await this.insuranceCardRepository.create(input);
        const [txHash,] = await Promise.all([
            this.blockchainRepository.create(insuranceCard),
            this.vectorStore.addDocuments([new Document({
                pageContent: `${insuranceCard.name}\n${insuranceCard.detail}`,
                metadata: {
                    source: insuranceCard.id
                }
            })])
        ]);
        return { insuranceCard, txHash: txHash };
    }

    async updateInsuranceCard(id: string, input: Prisma.InsuranceCardUpdateInput): Promise<{ insuranceCard: InsuranceCard, txHash: TxHash }> {
        const [insuranceCard, txHash] = await Promise.all([
            this.insuranceCardRepository.update({ where: { id }, data: input }),
            this.blockchainRepository.updateStatus(id, input.status as InsuranceStatus)
        ]);
        return { insuranceCard, txHash };
    }

    async getInsuranceCard(id: string): Promise<InsuranceCard | null> {
        const insuranceCard = await this.insuranceCardRepository.findUnique({ id });
        return insuranceCard;
    }

    async searchInsuranceCard(queries: string[]): Promise<InsuranceCard[]> {
        let promises = [];
        for (const query of queries) {
            promises.push(this.vectorStore.retrieve(query));
        }
        const docs = await Promise.all(promises);
        const insuranceCards = await Promise.all(docs.flat().map(async (doc) => {
            const insuranceCard = await this.insuranceCardRepository.findUnique({ id: doc.metadata.source });
            return insuranceCard;
        }));
        return insuranceCards.filter((insuranceCard) => insuranceCard !== null);
    }

    async updateInsuranceStatus(id: string, status: InsuranceStatus): Promise<{ insuranceCard: InsuranceCard, txHash: TxHash }> {
        const [insuranceCard, txHash] = await Promise.all([
            this.insuranceCardRepository.update({ where: { id }, data: { status } }),
            this.blockchainRepository.updateStatus(id, status)
        ]);
        return { insuranceCard, txHash };
    }
}