import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Class, ClassFeature, Creature } from '../api/generated';
import { useClasses } from '../context/ClassContext';

export const CharacterCapabilities = ({ creature }: { creature: Creature }) => {
  const { classes, loading: classesLoading } = useClasses();

  const creatureClassLevels = classes
    .filter((c) => creature.classes?.includes(c.id))
    .flatMap((c) => c.classLevels)
    .filter((cl) => cl!.level <= creature.level);

  const classFeatures = creatureClassLevels.flatMap((cl) => cl!.features);
  const getHealth = () => {
    const baseHealth =
      creatureClassLevels.reduce(
        (sum, classLevel) => sum + (classLevel!.health ?? 0),
        0
      ) ?? 0;

    return baseHealth + Number(creature.might);
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

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'grey.400',
        borderRadius: 1,
        padding: 2,
      }}
    >
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
      </div>

      {classFeatures.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
            {classFeatures.map(
              (feature: ClassFeature | undefined) =>
                feature && (
                  <ListItem
                    key={feature.id}
                    sx={{ display: 'list-item', p: 0 }}
                  >
                    <ListItemText
                      primary={feature.name}
                      secondary={feature.description}
                    />
                  </ListItem>
                )
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};
