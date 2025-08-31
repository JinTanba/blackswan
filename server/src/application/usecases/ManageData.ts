import { IBlockchainRepository, TxHash } from "../repositories/IBlockchainRepository";
import { IInsuranceCardRepository } from "../repositories/IInsuranceCardRepository";
import { IVectorStore } from "../repositories/IVectorStore";
import { IBaseAgentImageRepository } from "../repositories/IBaseAgentImageRepository";
import { InsuranceCard, InsuranceStatus } from "../../generated/prisma";
import { Document } from "@langchain/core/documents";
import { CreateInsuranceCardDto, UpdateInsuranceCardDto, InsuranceCardMapper } from "../../infrastructure/web/InsuranceCardDto";

export class ManageData {
    constructor(
        private insuranceCardRepository: IInsuranceCardRepository,
        private vectorStore: IVectorStore,
        private blockchainRepository: IBlockchainRepository,
        private baseAgentImageRepository: IBaseAgentImageRepository
    ) {
        this.insuranceCardRepository = insuranceCardRepository;
        this.vectorStore = vectorStore;
        this.blockchainRepository = blockchainRepository;
        this.baseAgentImageRepository = baseAgentImageRepository;
    }

    async createInsuranceCard(dto: CreateInsuranceCardDto): Promise<{ insuranceCard: InsuranceCard, txHash: TxHash }> {
        const { insuranceData, agentData } = InsuranceCardMapper.toCreateInput(dto);
        
        // First create the BaseAgentImage
        const baseAgentImage = await this.baseAgentImageRepository.create(agentData);
        
        // Then create the InsuranceCard with the agent reference
        const insuranceCardInput = {
            ...insuranceData,
            agentCard: {
                connect: { id: baseAgentImage.id }
            }
        };
        
        const insuranceCard = await this.insuranceCardRepository.create(insuranceCardInput);
        
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

    async updateInsuranceCard(id: string, dto: UpdateInsuranceCardDto): Promise<{ insuranceCard: InsuranceCard, txHash: TxHash }> {
        const updateInput = InsuranceCardMapper.toUpdateInput(dto);
        const [insuranceCard, txHash] = await Promise.all([
            this.insuranceCardRepository.update({ where: { id }, data: updateInput }),
            this.blockchainRepository.updateStatus(id, updateInput.status as InsuranceStatus)
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