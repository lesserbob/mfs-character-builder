import { PrismaClient, ClassClassification, Prisma } from '@prisma/client';
import { apiItem } from '../types/ItemApiTypes';

const prisma = new PrismaClient();

export const getItems = async (): Promise<apiItem[]> => {
  const items = await prisma.item.findMany();
  return items.map((item) => buildItem(item));
};

const buildItem = (item: Prisma.ItemGetPayload<{}>): apiItem => {
  return {
    id: item.id,
    name: item.name,
    type: item.type as any,
    rank: item.rank,
    damageUnarmored: item.damageUnarmored,
    damageArmored: item.damageArmored,
    concealable: item.concealable,
    twoHanded: item.twoHanded,
    reach: item.reach,
    finesse: item.finesse,
    thrown: item.thrown,
    attacksWorthOfAmmo: item.attacksWorthOfAmmo,
    rateOfFire: item.rateOfFire as any,
    range: item.range as any,
    reliability: item.reliability as any,
    scatter: item.scatter,
    sniper: item.sniper,
    brace: item.brace,
    armorType: item.armorType,
    soak: item.soak,
  };
};
