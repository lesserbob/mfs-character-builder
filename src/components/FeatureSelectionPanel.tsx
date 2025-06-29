import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
} from '@mui/material';
import {
  Creature,
  SelectableFeature,
  SelectableFeatureList,
} from '../api/generated';
import { useClasses } from '../context/ClassContext';
import { apiClient } from '../api/client';
import { useEffect, useState } from 'react';

const FeaturePanel = ({
  selectableId,
  creature,
  creatureBeforeLevelUp,
  onSelectionChange,
}: {
  selectableId: number;
  creature: Creature;
  creatureBeforeLevelUp: Creature;
  onSelectionChange: (selectedIds: number[]) => void;
}) => {
  const [selectableList, setSelectableList] =
    useState<SelectableFeatureList | null>();
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const { classes } = useClasses();

  useEffect(() => {
    fetchSelectableList();
  }, [selectableId]);

  const fetchSelectableList = async () => {
    try {
      const response = await apiClient.getSelectableFeatureListById(
        selectableId!
      );
      setSelectableList(response.data);
    } catch (err) {
      console.error('Error fetching selectable list:', err);
    }
  };

  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedItemIds, itemId]
      : selectedItemIds.filter((id) => id !== itemId);

    setSelectedItemIds(newSelectedIds);
    onSelectionChange(newSelectedIds);
  };

  const existingSelection = selectableList?.features
    ?.filter((i) => creatureBeforeLevelUp?.features?.includes(i.id))
    .map((i) => i.id);

  const existingSelectionLength = existingSelection?.length || 0;

  const totalFeatureRequired =
    creature?.classes
      ?.map((clid) => classes.find((cl) => cl.id === clid))
      .flatMap((cl) => cl!.classLevels)
      .filter((cll) => cll!.level <= creature!.level)
      .flatMap((cll) => cll?.features)
      .filter((f) => f?.selectableListId === selectableId)
      .reduce((acc, curr) => acc + (curr?.selectableCount || 0), 0) || 0;

  const totalToAllocate = totalFeatureRequired - existingSelectionLength;

  const displayFeature = (feature: SelectableFeature) => {
    return (
      // This is a feature you already have (always display)
      existingSelection?.includes(feature.id) ||
      // We have items to allocate
      (totalToAllocate > 0 &&
        // Item either has no requirement, or the creature has the requirement
        (!feature.requiredSelectableFeatureId ||
          creature.features?.find(
            (cf) => cf === feature.requiredSelectableFeatureId
          )))
    );
  };

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'grey.400',
        borderRadius: 1,
        padding: 0,
        mt: 1,
      }}
    >
      <Typography variant="h6" sx={{ pl: 1, mt: 1, mb: 0 }}>
        {selectableList?.name}
      </Typography>
      <List dense sx={{ listStyleType: 'none', pl: 2 }}>
        {selectableList?.features?.map((feature: any) => (
          <div>
            {displayFeature(feature) && (
              <ListItem
                key={feature.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 0,
                }}
              >
                {totalToAllocate > 0 && (
                  <Checkbox
                    checked={[
                      ...existingSelection!,
                      ...selectedItemIds,
                    ]?.includes(feature.id)}
                    onChange={(e) =>
                      handleCheckboxChange(feature.id, e.target.checked)
                    }
                    //                  Disable if
                    // a. This is an existing selection (cant be removed)
                    // b> we have selected enough AND this is NOT a selected item
                    disabled={
                      existingSelection?.includes(feature.id) ||
                      (selectedItemIds.length === totalToAllocate &&
                        !selectedItemIds.includes(feature.id))
                    }
                  />
                )}
                <ListItemText
                  primary={feature.name}
                  secondary={feature.description}
                />
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </Box>
  );
};

export const FeatureSelectionPanel = ({
  creature,
  creatureBeforeLevelUp = undefined,
  onSelectionChange = undefined,
}: {
  creature: Creature;
  creatureBeforeLevelUp?: Creature;
  onSelectionChange?: (selectedIds: number[]) => void;
}) => {
  const { classes } = useClasses();
  const [selectedFeatures, setSelectedFeatures] = useState<
    Map<number, number[]>
  >(new Map());

  // Flatten all classLevels for the creature's classes
  const selectableListIds = [
    ...new Set(
      creature.classes
        ?.flatMap((c) => classes.find((cl) => cl.id === c)?.classLevels ?? [])
        .filter((cl) => cl.level <= creature.level)
        .flatMap((cl) => cl.features)
        .filter((f) => f?.selectableListId)
        .map((f) => f!.selectableListId)
    ),
  ];

  const handleSelectionChange = (listId: number, selectedIds: number[]) => {
    const newSelectedFeatures = new Map(selectedFeatures);
    newSelectedFeatures.set(listId, selectedIds);
    setSelectedFeatures(newSelectedFeatures);
  };

  useEffect(() => {
    // We need to return
    // a. All current selected features from the current character
    // b. All selected features from the all lists
    const allSelectedFeatures = Array.from(selectedFeatures.values()).flat();
    onSelectionChange?.([
      ...(creatureBeforeLevelUp?.features || []),
      ...allSelectedFeatures,
    ]);
  }, [selectedFeatures]);

  return (
    <div>
      {selectableListIds?.map((id) => (
        <FeaturePanel
          key={id}
          selectableId={id!}
          creature={creature}
          creatureBeforeLevelUp={creatureBeforeLevelUp ?? creature}
          onSelectionChange={(featureIds) =>
            handleSelectionChange(id!, featureIds)
          }
        />
      ))}
    </div>
  );
};
