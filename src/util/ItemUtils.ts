import { Item } from '../api/generated';

const costTable = [0, 1, 2, 4, 6, 9, 12, 16, 20, 25, 30];
export const cost = (item: Item) => {
  return costTable[item.rank ?? 0] ?? 0;
};
