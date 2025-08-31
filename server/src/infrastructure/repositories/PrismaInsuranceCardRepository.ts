import { PrismaClient, Prisma, InsuranceCard } from '../../generated/prisma';
import { IInsuranceCardRepository } from '../../application/repositories/IInsuranceCardRepository';

export class PrismaInsuranceCardRepository implements IInsuranceCardRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.InsuranceCardCreateInput): Promise<InsuranceCard> {
    return this.prisma.insuranceCard.create({
      data,
      include: {
        agentCard: true
      }
    });
  }

  async findUnique(where: Prisma.InsuranceCardWhereUniqueInput): Promise<InsuranceCard | null> {
    return this.prisma.insuranceCard.findUnique({
      where,
      include: {
        agentCard: true
      }
    });
  }

  async findFirst(args?: Prisma.InsuranceCardFindFirstArgs): Promise<InsuranceCard | null> {
    return this.prisma.insuranceCard.findFirst({
      ...args,
      include: {
        agentCard: true,
        ...args?.include
      }
    });
  }

  async findMany(args?: Prisma.InsuranceCardFindManyArgs): Promise<InsuranceCard[]> {
    return this.prisma.insuranceCard.findMany({
      ...args,
      include: {
        agentCard: true,
        ...args?.include
      }
    });
  }

  async update(args: Prisma.InsuranceCardUpdateArgs): Promise<InsuranceCard> {
    return this.prisma.insuranceCard.update({
      ...args,
      include: {
        agentCard: true
      }
    });
  }

  async delete(where: Prisma.InsuranceCardWhereUniqueInput): Promise<InsuranceCard> {
    return this.prisma.insuranceCard.delete({
      where,
      include: {
        agentCard: true
      }
    });
  }

  async deleteMany(where?: Prisma.InsuranceCardWhereInput): Promise<Prisma.BatchPayload> {
    return this.prisma.insuranceCard.deleteMany({
      where
    });
  }

  async count(where?: Prisma.InsuranceCardWhereInput): Promise<number> {
    return this.prisma.insuranceCard.count({
      where
    });
  }

  async upsert(args: Prisma.InsuranceCardUpsertArgs): Promise<InsuranceCard> {
    return this.prisma.insuranceCard.upsert({
      ...args,
      include: {
        agentCard: true
      }
    });
  }
}