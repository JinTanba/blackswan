import { Prisma, BaseAgentImage } from "../../generated/prisma";

export interface IBaseAgentImageRepository {
    create(data: Prisma.BaseAgentImageCreateInput): Promise<BaseAgentImage>;
    findUnique(params: { id: string }): Promise<BaseAgentImage | null>;
    update(params: { where: Prisma.BaseAgentImageWhereUniqueInput; data: Prisma.BaseAgentImageUpdateInput }): Promise<BaseAgentImage>;
    delete(params: { where: Prisma.BaseAgentImageWhereUniqueInput }): Promise<BaseAgentImage>;
}