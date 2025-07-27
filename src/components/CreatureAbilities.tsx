import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material';
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
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { BespokeFeatureModal } from '../views/CorePanel/CreateCreature/BespokeFeatureModal';

export interface CreatureAbilityParams {
  // The creature
  creature: Creature;

  // In case of level up, the level to highlight (i.e. the new abilities)
  highlghtLevel?: number;

  // Indicates that the user is allowed to create new, bespoke, abilities
  allowCreate?: boolean;

  // When create is allowed, callback to handle creation
  onCreate?(name: string, description: string): void;
}

export const CreatureAbiltities = ({
  creature,
  highlghtLevel,
  allowCreate = false,
  onCreate,
}: CreatureAbilityParams) => {
  const { classes } = useClasses();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleCloseModal = (
    result: { name: string; description: string } | null
  ) => {
    setIsModalOpen(false);
    if (result) {
      onCreate(result.name, result.description);
    }
  };

  return (
    <>
      <BespokeFeatureModal
        isModalOpen={isModalOpen}
        closeModal={handleCloseModal}
      ></BespokeFeatureModal>
      <SectionBox>
        {allowCreate ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <SectionHeader>Abilities</SectionHeader>
            <IconButton
              onClick={() => {
                setIsModalOpen(true);
              }}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Box>
        ) : (
          <SectionHeader>Abilities</SectionHeader>
        )}
        <Box className="creature-abilities-container">
          <List dense className="creature-abilities-list">
            {classFeatures.map(
              (
                feature: {
                  feature: ClassFeature;
                  classLevel: ClassLevel;
                  clazz: Class;
                },
                index
              ) =>
                feature && (
                  <ListItem
                    // key={feature.feature.id}
                    key={index}
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
            {creature.bespokeFeatures.map((feature, index) => (
              <ListItem key={999 + index} className={`creature-abilities-item`}>
                <ListItemText
                  primary={feature.name}
                  secondary={feature.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </SectionBox>
    </>
  );
};
