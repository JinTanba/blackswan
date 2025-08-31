import { Prisma, InsuranceCard, InsuranceStatus } from '../../generated/prisma';
import { IInsuranceCardRepository } from '../../application/repositories/IInsuranceCardRepository';

export class InMemoryInsuranceCardRepository implements IInsuranceCardRepository {
  private cards: Map<string, InsuranceCard> = new Map();
  private idCounter = 1;

  async create(data: Prisma.InsuranceCardCreateInput): Promise<InsuranceCard> {
    const id = `card-${this.idCounter++}`;
    const agentCardId = `agent-${this.idCounter++}`;
    
    // Create the agent card data
    const agentCard = {
      id: agentCardId,
      systemPrompt: (data.agentCard as any)?.create?.systemPrompt || '',
      tools: (data.agentCard as any)?.create?.tools || [],
      sources: (data.agentCard as any)?.create?.sources || [],
      metadata: (data.agentCard as any)?.create?.metadata || {},
      insuranceCard: null
    };

    const card = {
      id,
      name: data.name,
      detail: data.detail,
      creator: data.creator,
      metadata: data.metadata as Prisma.JsonValue,
      agentCardId,
      agentCard, // Include the agentCard relation
      status: data.status as InsuranceStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    this.cards.set(id, card);
    return card;
  }

  async findUnique(where: Prisma.InsuranceCardWhereUniqueInput): Promise<InsuranceCard | null> {
    if (where.id) {
      return this.cards.get(where.id) || null;
    }
    return null;
  }

  async findFirst(args?: Prisma.InsuranceCardFindFirstArgs): Promise<InsuranceCard | null> {
    const cards = Array.from(this.cards.values());
    
    if (!args?.where) {
      return cards[0] || null;
    }

    const filtered = cards.filter(card => this.matchesWhere(card, args.where!));
    return filtered[0] || null;
  }

  async findMany(args?: Prisma.InsuranceCardFindManyArgs): Promise<InsuranceCard[]> {
    let cards = Array.from(this.cards.values());

    if (args?.where) {
      cards = cards.filter(card => this.matchesWhere(card, args.where!));
    }

    if (args?.orderBy) {
      cards.sort((a, b) => {
        const orderBy = args.orderBy as any;
        const field = Object.keys(orderBy)[0];
        const direction = orderBy[field];
        
        if (direction === 'asc') {
          return (a as any)[field] > (b as any)[field] ? 1 : -1;
        } else {
          return (a as any)[field] < (b as any)[field] ? 1 : -1;
        }
      });
    }

    if (args?.skip) {
      cards = cards.slice(args.skip);
    }

    if (args?.take) {
      cards = cards.slice(0, args.take);
    }

    return cards;
  }

  async update(args: Prisma.InsuranceCardUpdateArgs): Promise<InsuranceCard> {
    const card = await this.findUnique(args.where);
    if (!card) {
      throw new Error('Card not found');
    }

    const updated = {
      ...card,
      ...(args.data as any),
      updatedAt: new Date(),
      agentCard: (card as any).agentCard, // Preserve the agentCard relation
    };

    this.cards.set(card.id, updated);
    return updated;
  }

  async delete(where: Prisma.InsuranceCardWhereUniqueInput): Promise<InsuranceCard> {
    const card = await this.findUnique(where);
    if (!card) {
      throw new Error('Card not found');
    }

    this.cards.delete(card.id);
    return card;
  }

  async deleteMany(where?: Prisma.InsuranceCardWhereInput): Promise<Prisma.BatchPayload> {
    let toDelete = Array.from(this.cards.values());
    
    if (where) {
      toDelete = toDelete.filter(card => this.matchesWhere(card, where));
    }

    toDelete.forEach(card => this.cards.delete(card.id));
    
    return { count: toDelete.length };
  }

  async count(where?: Prisma.InsuranceCardWhereInput): Promise<number> {
    if (!where) {
      return this.cards.size;
    }

    const filtered = Array.from(this.cards.values()).filter(card => 
      this.matchesWhere(card, where)
    );
    
    return filtered.length;
  }

  async upsert(args: Prisma.InsuranceCardUpsertArgs): Promise<InsuranceCard> {
    const existing = await this.findUnique(args.where);
    
    if (existing) {
      return this.update({
        where: args.where,
        data: args.update,
      });
    } else {
      return this.create(args.create as Prisma.InsuranceCardCreateInput);
    }
  }

  private matchesWhere(card: InsuranceCard, where: Prisma.InsuranceCardWhereInput): boolean {
    if (where.id) {
      if (typeof where.id === 'string') {
        return card.id === where.id;
      } else if ((where.id as any).equals) {
        return card.id === (where.id as any).equals;
      }
    }
    
    if (where.status) {
      if (typeof where.status === 'string') {
        return card.status === where.status;
      } else if ((where.status as any).equals) {
        return card.status === (where.status as any).equals;
      }
    }
    
    if (where.creator) {
      if (typeof where.creator === 'string') {
        return card.creator === where.creator;
      } else if ((where.creator as any).equals) {
        return card.creator === (where.creator as any).equals;
      }
    }
    
    if (where.AND) {
      const conditions = Array.isArray(where.AND) ? where.AND : [where.AND];
      return conditions.every(cond => this.matchesWhere(card, cond));
    }
    
    if (where.OR) {
      const conditions = Array.isArray(where.OR) ? where.OR : [where.OR];
      return conditions.some(cond => this.matchesWhere(card, cond));
    }
    
    return true;
  }
}