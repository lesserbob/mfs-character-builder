import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { ClassFeature, Creature } from '../api/generated';
import { useClasses } from '../context/ClassContext';

export const CreatureAbiltities = ({ creature }: { creature: Creature }) => {
  const { classes, loading: classesLoading } = useClasses();

  const creatureClassLevels = classes
    .filter((c) => creature.classes?.includes(c.id))
    .flatMap((c) => c.classLevels)
    .filter((cl) => cl!.level <= creature.level);

  const classFeatures = creatureClassLevels.flatMap((cl) => cl!.features);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'grey.400',
        borderRadius: 1,
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Abilities
      </Typography>
      {classFeatures.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <List dense sx={{ listStyleType: 'none', pl: 2 }}>
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
