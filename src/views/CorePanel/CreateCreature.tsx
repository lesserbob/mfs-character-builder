import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import Grid from '@mui/material/Grid';
import './CreateCreature.css';
import { StatEditor } from './CreateCreature/StatEditor';
import { apiClient } from '../../api/client';
import { Class } from '../../api/generated';
import { useClasses } from '../../context/ClassContext';
import { CharacterCapabilities } from '../../components/CharacterCapabilities';

type FormData = {
  name: string;
  level: number;
  might: number;
  agility: number;
  intellect: number;
  spirit: number;
  selectedClassId?: number;
};

const CreateCreature = (): React.JSX.Element => {
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
      selectedClassId: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const [creatureClass, setCreatureClass] = useState<Class | null>(null);

  // Watch all stat values to calculate sum
  const level = watch('level');
  const might = watch('might');
  const agility = watch('agility');
  const intellect = watch('intellect');
  const spirit = watch('spirit');
  const classId = watch('selectedClassId');

  const totalStats = might + agility + intellect + spirit;
  const disbleIncrement = totalStats >= 3;

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
    };
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    const creature = {
      name: data.name,
      level: data.level,
      might: data.might,
      agility: data.agility,
      intellect: data.intellect,
      spirit: data.spirit,
      classes: [data.selectedClassId],
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

  return (
    <div>
      <Typography variant="h5" component="h2" className="create-creature-title">
        Create New Creature
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <div className="create-creature-stack">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="selectedClassId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Select Class</InputLabel>
                    <Select
                      {...field}
                      value={field.value ?? ''}
                      label="Select Class"
                      disabled={loading}
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls.name} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

              <Controller
                name="might"
                control={control}
                render={({ field }) => (
                  <StatEditor
                    stat="Might"
                    value={field.value}
                    min={creatureClass?.minMight ?? -1}
                    max={3}
                    setValue={field.onChange}
                    disableIncrement={disbleIncrement}
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
                    min={creatureClass?.minAgility ?? -1}
                    max={3}
                    setValue={field.onChange}
                    disableIncrement={disbleIncrement}
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
                    min={creatureClass?.minIntellect ?? -1}
                    max={3}
                    setValue={field.onChange}
                    disableIncrement={disbleIncrement}
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
                    min={creatureClass?.minSpirit ?? -1}
                    max={3}
                    setValue={field.onChange}
                    disableIncrement={disbleIncrement}
                  />
                )}
              />

              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Total Stats: {totalStats}
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <CharacterCapabilities creature={getCreature()} />
          </Grid>
        </Grid>
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
