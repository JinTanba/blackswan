import { Prisma, InsuranceCard } from '../../generated/prisma';

export interface IInsuranceCardRepository {
  create(data: Prisma.InsuranceCardCreateInput): Promise<InsuranceCard>;
  findUnique(where: Prisma.InsuranceCardWhereUniqueInput): Promise<InsuranceCard | null>;
  findFirst(args?: Prisma.InsuranceCardFindFirstArgs): Promise<InsuranceCard | null>;
  findMany(args?: Prisma.InsuranceCardFindManyArgs): Promise<InsuranceCard[]>;
  update(args: Prisma.InsuranceCardUpdateArgs): Promise<InsuranceCard>;
  upsert(args: Prisma.InsuranceCardUpsertArgs): Promise<InsuranceCard>;
}