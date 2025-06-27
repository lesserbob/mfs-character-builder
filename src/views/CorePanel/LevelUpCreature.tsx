import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ReadOnlyField } from './ViewCreature/ReadOnlyField';
import { apiClient, Creature } from '../../api/client';
import { useState, useEffect } from 'react';
import { useClasses } from '../../context/ClassContext';
import { getClassDescription } from '../../util/CreatureUtils';
import { StatEditor } from './CreateCreature/StatEditor';
import { CreatureDerivedStatBlock } from '../../components/CreatureDerivedStatBlock';
import { CreatureAbiltities } from '../../components/CreatureAbilities';
import './LevelUpCreature.css';
import { FeatureSelectionPanel } from '../../components/FeatureSelectionPanel';

type FormData = {
  might: number;
  agility: number;
  intellect: number;
  spirit: number;
  selectedClassId?: number;
};

const LevelUpCreature = () => {
  const { id, level } = useParams<{ id: string; level: string }>();
  const creatureId = id ? parseInt(id, 10) : 0;
  const { classes, loading: classesLoading } = useClasses();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      might: 0,
      agility: 0,
      intellect: 0,
      spirit: 0,
      selectedClassId: undefined,
    },
  });

  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

  const selectedClassId = watch('selectedClassId');

  const fetchCreature = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCreatureById(creatureId);
      setCreature(response.data);
      setValue('might', response.data.might!);
      setValue('agility', response.data.agility!);
      setValue('intellect', response.data.intellect!);
      setValue('spirit', response.data.spirit!);
    } catch (err) {
      console.error('Error fetching creature:', err);
      setError('Failed to load creature data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreature();
  }, [creatureId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!creature) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Creature not found
      </Alert>
    );
  }

  const selectNewClass = () => {
    return Number(level) === 2 || Number(level) === 6;
  };

  const availableClasses = classes.filter(
    (cls) =>
      cls.classLevels &&
      cls.classLevels.some((lvl) => lvl.level === Number(level))
  );

  const statBonus =
    classes
      .filter((cl) => creature.classes?.includes(cl.id))
      .flatMap((cl) => cl.classLevels)
      .filter((lvl) => lvl!.level === Number(level))[0]?.statBonus || 0;

  const totalStats =
    watch('might') + watch('agility') + watch('intellect') + watch('spirit');
  const statBonusAllocated =
    totalStats -
    creature.might! -
    creature.agility! -
    creature.intellect! -
    creature.spirit!;
  const disableStatAllocation = statBonusAllocated === statBonus;

  const getModifiedCreature = () => {
    // Assume creature is your current creature object and selectedClassId is the new class to add
    const currentClasses = creature.classes ?? [];
    // Only add selectedClassId if it is defined and not already present
    const newClasses =
      selectedClassId && !currentClasses.includes(selectedClassId)
        ? [...currentClasses, selectedClassId]
        : currentClasses;

    const newFeatures = [
      ...new Set([...(creature?.features ?? []), ...selectedFeatures]),
    ];

    const modifiedCreature = { ...creature };
    modifiedCreature.level = Number(level);
    modifiedCreature.might = watch('might');
    modifiedCreature.agility = watch('agility');
    modifiedCreature.intellect = watch('intellect');
    modifiedCreature.spirit = watch('spirit');
    modifiedCreature.classes = newClasses;
    modifiedCreature.features = newFeatures;

    return modifiedCreature;
  };

  const onSubmit = async (data: any) => {
    // console.log(getModifiedCreature());
    const response = await apiClient.updateCreature(
      creatureId,
      getModifiedCreature()
    );
    if (response.status === 200) {
      navigate(`/creature/${creatureId}`);
    } else {
      setError('Failed to save creature');
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2">
        {creature.name}
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          console.log('Form errors:', formErrors);
        })}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 1,
                padding: 2,
              }}
            >
              <Stack spacing={2}>
                <ReadOnlyField label="Name" value={creature.name} />
                <ReadOnlyField
                  label="Level"
                  value={
                    level +
                    ' ' +
                    getClassDescription(getModifiedCreature(), classes)
                  }
                />

                {selectNewClass() && (
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
                          <InputLabel>Select Class</InputLabel>
                          <Select
                            {...field}
                            value={field.value ?? ''}
                            label="Select Class"
                            disabled={loading}
                          >
                            {availableClasses.map((cls) => (
                              <MenuItem key={cls.name} value={cls.id}>
                                {cls.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Tooltip>
                    )}
                  />
                )}

                <Controller
                  name="might"
                  control={control}
                  render={({ field }) => (
                    <StatEditor
                      stat="Might"
                      value={field.value}
                      min={creature.might!}
                      max={creature.might! + (statBonus > 0 ? 1 : 0)}
                      setValue={field.onChange}
                      disableIncrement={disableStatAllocation}
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
                      min={creature.agility!}
                      max={creature.agility! + (statBonus > 0 ? 1 : 0)}
                      setValue={field.onChange}
                      disableIncrement={disableStatAllocation}
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
                      min={creature.intellect!}
                      max={creature.intellect! + (statBonus > 0 ? 1 : 0)}
                      setValue={field.onChange}
                      disableIncrement={disableStatAllocation}
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
                      min={creature.spirit!}
                      max={creature.spirit! + (statBonus > 0 ? 1 : 0)}
                      setValue={field.onChange}
                      disableIncrement={disableStatAllocation}
                    />
                  )}
                />
              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <CreatureDerivedStatBlock creature={getModifiedCreature()} />
          </Grid>
        </Grid>
        <Box sx={{ py: 2 }}>
          <CreatureAbiltities creature={getModifiedCreature()} />
        </Box>
        <Box sx={{ py: 2 }}>
          <FeatureSelectionPanel
            creature={getModifiedCreature()}
            creatureBeforeLevelUp={creature}
            onSelectionChange={setSelectedFeatures}
          />
        </Box>
        <div className="update-creature-button-group">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Saveing...' : 'Save'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/creature/${creatureId}`)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LevelUpCreature;
