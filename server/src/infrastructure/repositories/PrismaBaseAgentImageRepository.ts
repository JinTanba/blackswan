import { PrismaClient, Prisma, BaseAgentImage } from "../../generated/prisma";
import { IBaseAgentImageRepository } from "../../application/repositories/IBaseAgentImageRepository";

export class PrismaBaseAgentImageRepository implements IBaseAgentImageRepository {
    constructor(private prisma: PrismaClient) {}

    async create(data: Prisma.BaseAgentImageCreateInput): Promise<BaseAgentImage> {
        return this.prisma.baseAgentImage.create({ data });
    }

    async findUnique(params: { id: string }): Promise<BaseAgentImage | null> {
        return this.prisma.baseAgentImage.findUnique({
            where: { id: params.id }
        });
    }

    async update(params: { where: Prisma.BaseAgentImageWhereUniqueInput; data: Prisma.BaseAgentImageUpdateInput }): Promise<BaseAgentImage> {
        return this.prisma.baseAgentImage.update(params);
    }

    async delete(params: { where: Prisma.BaseAgentImageWhereUniqueInput }): Promise<BaseAgentImage> {
        return this.prisma.baseAgentImage.delete(params);
    }
}