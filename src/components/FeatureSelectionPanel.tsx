import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Checkbox,
} from '@mui/material';
import { Creature, SelectableList } from '../api/generated';
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
  const [selectableList, setSelectableList] = useState<SelectableList | null>();
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const { classes } = useClasses();

  useEffect(() => {
    fetchSelectableList();
  }, [selectableId]);

  const fetchSelectableList = async () => {
    try {
      const response = await apiClient.getSelectableListById(selectableId!);
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

  const existingSelection = selectableList?.items
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
        {selectableList?.name}
      </Typography>
      <List dense sx={{ listStyleType: 'none', pl: 2 }}>
        {selectableList?.items?.map((item: any) => (
          <div>
            {(totalToAllocate > 0 || existingSelection?.includes(item.id)) && (
              <ListItem
                key={item.id}
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
                    ]?.includes(item.id)}
                    onChange={(e) =>
                      handleCheckboxChange(item.id, e.target.checked)
                    }
                    //                  Disable if
                    // a. This is an existing selection (cant be removed)
                    // b> we have selected enough AND this is NOT a selected item
                    disabled={
                      existingSelection?.includes(item.id) ||
                      (selectedItemIds.length === totalToAllocate &&
                        !selectedItemIds.includes(item.id))
                    }
                  />
                )}
                <ListItemText
                  primary={item.name}
                  secondary={item.description}
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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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

  const handleSelectionChange = (selectedIds: number[]) => {
    setSelectedItems(selectedIds);
    onSelectionChange?.(selectedIds);
  };

  return (
    <div>
      {selectableListIds?.map((id) => (
        <FeaturePanel
          key={id}
          selectableId={id!}
          creature={creature}
          creatureBeforeLevelUp={creatureBeforeLevelUp ?? creature}
          onSelectionChange={handleSelectionChange}
        />
      ))}
    </div>
  );
};
