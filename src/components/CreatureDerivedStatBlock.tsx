import { Box, Typography } from '@mui/material';
import { Creature } from '../api/generated';
import { useClasses } from '../context/ClassContext';
import SectionBox from './SectionBox';

export const CreatureDerivedStatBlock = ({
  creature,
}: {
  creature: Creature;
}) => {
  const { classes, loading: classesLoading } = useClasses();

  const creatureClassLevels = classes
    .filter((c) => creature.classes?.includes(c.id))
    .flatMap((c) => c.classLevels)
    .filter((cl) => cl!.level <= creature.level);

  const createClassFeatures = creatureClassLevels.flatMap((cl) => cl!.features);

  const getHealth = () => {
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

  const getMomentum = () => {
    return Number(creature.spirit) + 2;
  };

  const getTacticalSurgeBonus = () => {
    return Number(creature.intellect);
  };

  const getDodgeBonus = () => {
    return Number(creature.agility);
  };

  const getResolveBonus = () => {
    return Number(creature.spirit);
  };

  const getMeleeDescription = () => {
    return '+' + Number(creature.might) + ', +' + Number(creature.might);
  };

  const getFinesseMeleeDescription = () => {
    return (
      '+' +
      Math.max(Number(creature.might), Number(creature.agility)) +
      ', +' +
      Number(creature.might)
    );
  };

  const getRangedDescription = () => {
    return '+' + Number(creature.agility) + ', +' + Number(creature.might);
  };

  const getEnduranceRegeneration = () => {
    return createClassFeatures.reduce(
      (sum, feature) => sum + (feature!.enduranceRegeneration ?? 0),
      0
    );
  };

  return (
    <SectionBox>
      <div>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Health/Endurance: {getHealth()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Momentum: {getMomentum()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Tactical Surge Bonus: {getTacticalSurgeBonus()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Dodge Bonus: {getDodgeBonus()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Resolve Bonus: {getResolveBonus()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Melee: {getMeleeDescription()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Finesse Melee: {getFinesseMeleeDescription()}
        </Typography>
        <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
          Ranged: {getRangedDescription()}
        </Typography>
        {getEnduranceRegeneration() > 0 && (
          <Typography variant="body2" color="test.primary" sx={{ mt: 1 }}>
            Endurance Regeneration: {getEnduranceRegeneration()}
          </Typography>
        )}
      </div>
    </SectionBox>
  );
};
