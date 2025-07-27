import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import './CreateCreature.css';
import { StatEditor } from '../../components/StatEditor';
import { apiClient } from '../../api/client';
import {
  Class,
  ClassClassificationEnum,
  CreatureBespokeFeature,
} from '../../api/generated';
import { useClasses } from '../../context/ClassContext';
import { CreatureDerivedStatBlock } from '../../components/CreatureDerivedStatBlock';
import { CreatureAbiltities } from '../../components/CreatureAbilities';
import {
  FeatureSelectionPanel,
  FeatureSelectionPanelHandle,
} from '../../components/FeatureSelectionPanel';
import SectionBox from '../../components/SectionBox';
import { Text } from '../../components/Text';
import { SelectPortait } from './CreateCreature/SelectPortrait';
import { capitalizeFirst } from '../../util/TextUtils';
import { BespokeFeatureModal } from './CreateCreature/BespokeFeatureModal';

type FormData = {
  name: string;
  level: number;
  might: number;
  agility: number;
  intellect: number;
  spirit: number;
  selectedClassId?: number;
  portrait: string | null;
  baseHealth: number;
};

export enum Mode {
  PLAYER_CHARACTER = 'Player Character',
  ANTOGANIST = 'Antagonist',
}

export interface CreateCreatureProps {
  mode: Mode;
}

const CreateCreature = ({ mode }: CreateCreatureProps): React.JSX.Element => {
  const { classes, loading: classesLoading } = useClasses();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      level: 1,
      might: 0,
      agility: 0,
      intellect: 0,
      spirit: 0,
      baseHealth: 0,
      selectedClassId: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const [creatureClass, setCreatureClass] = useState<Class | null>(null);
  const [pointAllocationError, setPointAllocationError] =
    useState<boolean>(false);
  const featurePanelRef = useRef<FeatureSelectionPanelHandle>(null);
  // const [bespokeFeatures, setBespokeFeatures] = useState<[string, string][]>([]);
  const [bespokeFeatures, setBespokeFeatures] = useState<
    CreatureBespokeFeature[]
  >([]);

  // Watch all stat values to calculate sum
  const level = watch('level');
  const might = watch('might');
  const agility = watch('agility');
  const intellect = watch('intellect');
  const spirit = watch('spirit');
  const classId = watch('selectedClassId');
  const baseHealth = watch('baseHealth');

  const totalStats = might + agility + intellect + spirit;
  const toAllocate = 3 - totalStats;
  const disableIncrement =
    mode === Mode.PLAYER_CHARACTER ? toAllocate <= 0 : false;

  const racialClasses = classes.filter(
    (cls) => cls.classification === ClassClassificationEnum.Race
  );

  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

  useEffect(() => {
    if (classId) {
      const creatureClass = classes.find((cls) => cls.id === classId);
      if (creatureClass) {
        setCreatureClass(creatureClass);
        setValue('might', creatureClass.minMight ?? 0);
        setValue('agility', creatureClass.minAgility ?? 0);
        setValue('intellect', creatureClass.minIntellect ?? 0);
        setValue('spirit', creatureClass.minSpirit ?? 0);
      }
    } else {
      setCreatureClass(null);
      // Reset stats if no class is selected
      setValue('might', 0);
      setValue('agility', 0);
      setValue('intellect', 0);
      setValue('spirit', 0);
    }
  }, [classId, setValue]);

  const getCreature = () => {
    return {
      id: 0,
      name: watch('name'),
      level: level,
      might: might,
      agility: agility,
      intellect: intellect,
      spirit: spirit,
      classes: classId ? [classId] : [],
      features: selectedFeatures,
      items: [], // Items done elsewhere
      baseHealth: baseHealth,
      bespokeFeatures: bespokeFeatures,
    };
  };

  const onPortraitSelect = (portrait: string | null) => {
    setValue('portrait', portrait);
  };

  const onSubmit = async (data: any) => {
    if (mode === Mode.PLAYER_CHARACTER && toAllocate !== 0) {
      setPointAllocationError(true);
      return;
    }
    if (!featurePanelRef.current?.canSubmit()) {
      return;
    }

    setPointAllocationError(false);

    setLoading(true);

    const creature = {
      name: data.name,
      level: data.level,
      might: data.might,
      agility: data.agility,
      intellect: data.intellect,
      spirit: data.spirit,
      classes: [data.selectedClassId],
      features: selectedFeatures,
      items: [],
      portrait: data.portrait,
      type: mode === Mode.PLAYER_CHARACTER ? 'PLAYER' : 'ANTAGONIST',
      baseHealth: data.baseHealth,
      bespokeFeatures: bespokeFeatures,
    };

    try {
      const response = await apiClient.createCreature(creature);
      const newCreatureId = response.data.id;

      if (newCreatureId) {
        navigate(`/creature/${newCreatureId}`);
      } else {
        console.error('No creature ID returned from API');
      }
    } catch (error) {
      console.error('Error creating creature:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBespokeFeature = (name: string, description: string) => {
    setBespokeFeatures((prev) => [
      ...prev,
      { name: name, description: description },
    ]);
  };

  return (
    <div>
      <Typography variant="h5" component="h2" className="create-creature-title">
        Create New {capitalizeFirst(mode)}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <div className="create-creature-stack">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Tooltip
                    title={errors.name?.message || ''}
                    open={!!errors.name}
                    disableHoverListener={!errors.name}
                    placement="right"
                    arrow
                  >
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                    />
                  </Tooltip>
                )}
              />

              {mode === Mode.PLAYER_CHARACTER && (
                <>
                  <Controller
                    name="selectedClassId"
                    control={control}
                    rules={{ required: 'Class selection is required' }}
                    render={({ field }) => (
                      <Tooltip
                        title={errors.selectedClassId?.message || ''}
                        open={!!errors.selectedClassId}
                        disableHoverListener={!errors.selectedClassId}
                        placement="right"
                        arrow
                      >
                        <FormControl fullWidth error={!!errors.selectedClassId}>
                          <InputLabel>Select Race</InputLabel>
                          <Select
                            {...field}
                            value={field.value ?? ''}
                            label="Select Race"
                            disabled={loading}
                          >
                            {racialClasses.map((cls) => (
                              <MenuItem key={cls.name} value={cls.id}>
                                {cls.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    )}
                  />

                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Level"
                        type="number"
                        fullWidth
                        error={!!errors.level}
                        helperText={errors.level?.message}
                        slotProps={{ input: { readOnly: true } }}
                        value={1}
                      />
                    )}
                  />
                </>
              )}

              <SectionBox>
                <div className="create-creature-stack">
                  {mode === Mode.PLAYER_CHARACTER && (
                    <Tooltip
                      open={pointAllocationError}
                      title="You must allocate all points"
                      placement="right"
                      arrow
                    >
                      <Text>Points to allocate: {toAllocate}</Text>
                    </Tooltip>
                  )}
                  {mode === Mode.ANTOGANIST && <Text>Total: {totalStats}</Text>}
                  <Controller
                    name="might"
                    control={control}
                    render={({ field }) => (
                      <StatEditor
                        stat="Might"
                        value={field.value}
                        min={
                          mode === Mode.PLAYER_CHARACTER
                            ? (creatureClass?.minMight ?? -1)
                            : -999
                        }
                        max={mode === Mode.PLAYER_CHARACTER ? 3 : 999}
                        setValue={(val) => {
                          field.onChange(val);
                          setPointAllocationError(false);
                        }}
                        disableIncrement={disableIncrement}
                      />
                    )}
                  />

                  <Controller
                    name="agility"
                    control={control}
                    render={({ field }) => (
                      <StatEditor
                        stat="Agility"
                        value={field.value}
                        min={
                          mode === Mode.PLAYER_CHARACTER
                            ? (creatureClass?.minAgility ?? -1)
                            : -999
                        }
                        max={mode === Mode.PLAYER_CHARACTER ? 3 : 999}
                        setValue={(val) => {
                          field.onChange(val);
                          setPointAllocationError(false);
                        }}
                        disableIncrement={disableIncrement}
                      />
                    )}
                  />

                  <Controller
                    name="intellect"
                    control={control}
                    render={({ field }) => (
                      <StatEditor
                        stat="Intellect"
                        value={field.value}
                        min={
                          mode === Mode.PLAYER_CHARACTER
                            ? (creatureClass?.minIntellect ?? -1)
                            : -999
                        }
                        max={mode === Mode.PLAYER_CHARACTER ? 3 : 999}
                        setValue={(val) => {
                          field.onChange(val);
                          setPointAllocationError(false);
                        }}
                        disableIncrement={disableIncrement}
                      />
                    )}
                  />

                  <Controller
                    name="spirit"
                    control={control}
                    render={({ field }) => (
                      <StatEditor
                        stat="Spirit"
                        value={field.value}
                        min={
                          mode === Mode.PLAYER_CHARACTER
                            ? (creatureClass?.minSpirit ?? -1)
                            : -999
                        }
                        max={mode === Mode.PLAYER_CHARACTER ? 3 : 999}
                        setValue={(val) => {
                          field.onChange(val);
                          setPointAllocationError(false);
                        }}
                        disableIncrement={disableIncrement}
                      />
                    )}
                  />

                  {mode === Mode.ANTOGANIST && (
                    <Controller
                      name="baseHealth"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={field.value}
                          type="number"
                          label="Base Health"
                          fullWidth
                          error={!!errors.baseHealth}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === '' ? undefined : Number(value)
                            );
                          }}
                        />
                      )}
                    />
                  )}
                </div>
              </SectionBox>
            </div>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <SelectPortait onPortraitSelect={onPortraitSelect} />
            <CreatureDerivedStatBlock creature={getCreature()} />
          </Grid>
        </Grid>
        <Box sx={{ py: 1 }}>
          <CreatureAbiltities
            creature={getCreature()}
            allowCreate={mode === Mode.ANTOGANIST}
            onCreate={(name, description) => {
              addBespokeFeature(name, description);
            }}
          />
        </Box>
        <Box sx={{ py: 0 }}>
          <FeatureSelectionPanel
            creature={getCreature()}
            creatureBeforeLevelUp={{ ...getCreature(), features: [] }}
            onSelectionChange={setSelectedFeatures}
            ref={featurePanelRef}
          />
        </Box>
        <div className="create-creature-button-group">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Creature'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => reset()}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCreature;
