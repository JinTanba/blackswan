import { IBlockchainRepository, TxHash } from "../repositories/IBlockchainRepository";

export class InsuranceManager{
    constructor(
        private blockchainRepository: IBlockchainRepository
    ) {
        this.blockchainRepository = blockchainRepository;
    }

    async claimInsurance(insuranceCardId: string): Promise<TxHash> {
        return this.blockchainRepository.tryClaim(insuranceCardId);
    }

}