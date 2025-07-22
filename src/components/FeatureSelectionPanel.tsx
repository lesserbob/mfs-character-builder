import { List, ListItem, ListItemText, Checkbox, Tooltip } from '@mui/material';
import {
  Creature,
  SelectableFeature,
  SelectableFeatureList,
} from '../api/generated';
import { useClasses } from '../context/ClassContext';
import { apiClient } from '../api/client';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { capitalizeFirst } from '../util/TextUtils';
import SectionHeader from './SectionHeader';
import SectionBox from './SectionBox';
import './FeatureSelectionPanel.css';
import { Text } from './Text';

interface FeaturePanelProps {
  selectableId: number;
  creature: Creature;
  creatureBeforeLevelUp: Creature;
  onSelectionChange: (selectedIds: number[]) => void;
}

export type FeaturePanelHandle = {
  canSubmit: () => boolean;
};

export const FeaturePanel = forwardRef<FeaturePanelHandle, FeaturePanelProps>(
  (props, ref) => {
    const selectableId = props.selectableId;
    const creature = props.creature;
    const creatureBeforeLevelUp = props.creatureBeforeLevelUp;
    const onSelectionChange = props.onSelectionChange;

    const [featureSelectError, setFeatureSelectError] =
      useState<boolean>(false);

    const [selectableList, setSelectableList] =
      useState<SelectableFeatureList | null>();
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    const { classes } = useClasses();

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

    useEffect(() => {
      fetchSelectableList();
    }, [selectableId]);

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
    const toAllocate = totalToAllocate - selectedItemIds.length;

    useImperativeHandle(ref, () => ({
      canSubmit: () => {
        setFeatureSelectError(toAllocate > 0);
        return toAllocate === 0;
      },
    }));

    const handleCheckboxChange = (itemId: number, checked: boolean) => {
      const newSelectedIds = checked
        ? [...selectedItemIds, itemId]
        : selectedItemIds.filter((id) => id !== itemId);

      if (featureSelectError && toAllocate === 0) setFeatureSelectError(false);
      setSelectedItemIds(newSelectedIds);
      onSelectionChange(newSelectedIds);
    };

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

    // TODO Organise by pre-requisites

    const getDisplayText = (feature: SelectableFeature) => {
      const actionType = feature.actionType;
      const uses = feature.uses;

      const extraInformation =
        actionType || uses
          ? '(' + capitalizeFirst(actionType ?? '') + `,  Uses: ${uses}` + ')'
          : '';
      return `${feature.name} ${extraInformation}`;
    };

    return (
      <SectionBox>
        <SectionHeader>{selectableList?.name}</SectionHeader>
        {totalToAllocate > 0 && (
          <Tooltip
            open={featureSelectError}
            title="There are still features to select"
            placement="right"
            arrow
          >
            <Text>Features to select: {toAllocate}</Text>
          </Tooltip>
        )}
        <List dense className="feature-selection-list">
          {selectableList?.features?.map((feature: any) => (
            <div>
              {displayFeature(feature) && (
                <ListItem key={feature.id} className="feature-selection-item">
                  {totalToAllocate > 0 && (
                    <Checkbox
                      checked={[
                        ...existingSelection!,
                        ...selectedItemIds,
                      ]?.includes(feature.id)}
                      onChange={(e) =>
                        handleCheckboxChange(feature.id, e.target.checked)
                      }
                      // Disable if
                      // a. This is an existing selection (cant be removed)
                      // b. we have selected enough AND this is NOT a selected item
                      disabled={
                        existingSelection?.includes(feature.id) ||
                        (selectedItemIds.length === totalToAllocate &&
                          !selectedItemIds.includes(feature.id))
                      }
                    />
                  )}
                  <ListItemText
                    primary={getDisplayText(feature)}
                    secondary={feature.description}
                  />
                </ListItem>
              )}
            </div>
          ))}
        </List>
      </SectionBox>
    );
  }
);

export type FeatureSelectionPanelHandle = {
  canSubmit: () => boolean;
};

export interface FeatureSelectionPanelProps {
  creature: Creature;
  creatureBeforeLevelUp?: Creature;
  onSelectionChange?: (selectedIds: number[]) => void;
}

export const FeatureSelectionPanel = forwardRef<
  FeatureSelectionPanelHandle,
  FeatureSelectionPanelProps
>((props, ref) => {
  const creature = props.creature;
  const creatureBeforeLevelUp = props.creatureBeforeLevelUp;
  const onSelectionChange = props.onSelectionChange;

  const featurePanelRefs = useRef<Array<FeaturePanelHandle | null>>([]);

  useImperativeHandle(ref, () => ({
    canSubmit: () => {
      return featurePanelRefs.current.every((panel) => panel?.canSubmit());
    },
  }));

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
      {selectableListIds?.map((id, idx) => (
        <FeaturePanel
          key={id}
          selectableId={id!}
          creature={creature}
          creatureBeforeLevelUp={creatureBeforeLevelUp ?? creature}
          onSelectionChange={(featureIds) =>
            handleSelectionChange(id!, featureIds)
          }
          ref={(el) => {
            featurePanelRefs.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
});
