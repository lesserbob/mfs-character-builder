import { Box, List, ListItem, ListItemText } from '@mui/material';
import {
  Class,
  ClassClassificationEnum,
  ClassFeature,
  ClassLevel,
  Creature,
} from '../api/generated';
import { useClasses } from '../context/ClassContext';
import SectionHeader from './SectionHeader';
import SectionBox from './SectionBox';
import './CreatureAbilities.css';

export interface CreatureAbilityParams {
  // The creature
  creature: Creature;

  // In case of level up, the level to highlight (i.e. the new abilities)
  highlghtLevel?: number;
}

export const CreatureAbiltities = ({
  creature,
  highlghtLevel,
}: CreatureAbilityParams) => {
  const { classes, loading: classesLoading } = useClasses();

  const customOrder = [
    ClassClassificationEnum.Race,
    ClassClassificationEnum.Path,
    ClassClassificationEnum.Specialisation,
  ] as const;

  // Get features that
  // are appropriate for selected classes
  // whose level is less than or equal to class level
  // are flagged to display
  const classFeatures = classes
    .filter((c) => creature.classes?.includes(c.id))
    .sort(
      (a, b) =>
        customOrder.indexOf(a.classification) -
        customOrder.indexOf(b.classification)
    )
    .flatMap((clazz) =>
      clazz
        .classLevels!.filter((cl) => cl!.level <= creature.level)
        .flatMap((classLevel) =>
          classLevel
            .features!.filter((f) => f!.display)
            .map((feature) => ({
              feature,
              classLevel,
              clazz,
            }))
        )
    );

  const getFeatureTitle = (feature: {
    feature: ClassFeature;
    classLevel: ClassLevel;
    clazz: Class;
  }) => {
    return (
      feature.feature.name +
      ' (' +
      feature.clazz.name +
      ', Level ' +
      feature.classLevel.level +
      ')'
    );
  };

  return (
    <SectionBox>
      <SectionHeader>Abilities</SectionHeader>
      {classFeatures.length > 0 && (
        <Box className="creature-abilities-container">
          <List dense className="creature-abilities-list">
            {classFeatures.map(
              (feature: {
                feature: ClassFeature;
                classLevel: ClassLevel;
                clazz: Class;
              }) =>
                feature && (
                  <ListItem
                    key={feature.feature.id}
                    className={`creature-abilities-item ${
                      highlghtLevel === feature.classLevel.level
                        ? 'highlighted'
                        : ''
                    }`}
                  >
                    <ListItemText
                      primary={getFeatureTitle(feature)}
                      secondary={feature.feature.description}
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
