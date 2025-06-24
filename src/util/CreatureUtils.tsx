import { Class } from '../api/generated';
import { Creature } from '../api/generated';

export const getClassDescription = (
  creature: Creature,
  classes: Class[]
): string => {
  if (!creature.classes || creature.classes.length === 0) {
    return '';
  }

  return creature.classes
    .map((classId) => classes.find((cls) => cls.id === classId)?.name ?? '')
    .filter((name) => name !== '')
    .join(', ');
};
