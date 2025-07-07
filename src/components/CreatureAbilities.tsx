import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { ClassFeature, Creature } from '../api/generated';
import { useClasses } from '../context/ClassContext';
import SectionHeader from './SectionHeader';
import SectionBox from './SectionBox';

export const CreatureAbiltities = ({ creature }: { creature: Creature }) => {
  const { classes, loading: classesLoading } = useClasses();

  const classFeatures = classes
    .filter((c) => creature.classes?.includes(c.id))
    .flatMap((c) => c.classLevels)
    .filter((cl) => cl!.level <= creature.level)
    .flatMap((cl) => cl!.features)
    .filter((f) => f!.display);

  return (
    <SectionBox>
      <SectionHeader>Abilities</SectionHeader>
      {classFeatures.length > 0 && (
        <Box sx={{ mt: 0 }}>
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
    </SectionBox>
  );
};
