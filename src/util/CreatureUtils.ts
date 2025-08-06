import { Actor, Class } from '../api/generated';
import { Creature } from '../api/generated';
import { useClasses } from '../context/ClassContext';

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

export const getHealth = (creature: Creature, classes: Class[]) => {
  if (!creature) return 0;

  const creatureClassLevels = classes
    .filter((c) => creature.classes?.includes(c.id))
    .flatMap((c) => c.classLevels)
    .filter((cl) => cl!.level <= creature.level);

  const healthFromClasses: number =
    creatureClassLevels.reduce(
      (sum, classLevel) => sum + (classLevel!.health ?? 0),
      0
    ) ?? 0;

  return (
    healthFromClasses +
    Number(creature.baseHealth ?? 0) +
    Number(creature.might)
  );
};

export const getRemainingHealth = (actor: Actor, classes: Class[]) => {
  if (!actor) return 0;
  return getHealth(actor.creature!, classes) - actor.healthDamage!;
};

export const getRemainingEndurance = (actor: Actor, classes: Class[]) => {
  return getHealth(actor.creature!, classes) - actor.enduranceDamage!;
};

export const getMomentum = (creature: Creature) => {
  return Number(creature.spirit) + 2;
};

export const getRemainingMomentum = (actor: Actor) => {
  return getMomentum(actor.creature!) - actor.momentumSpent!;
};
