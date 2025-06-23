import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Box, List, ListItem, ListItemText } from '@mui/material';
import './CreateCreature.css';
import { StatEditor } from './CreateCreature/StatEditor';
import { apiClient } from '../../api/client';
import { Class } from '../../api/generated';
import { useCorePanel, CorePanelState } from '../../context/CorePanelContext';

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
  const { setCurrentState, setCreatureId } = useCorePanel();
  
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
  const [classes, setClasses] = useState<Class[]>([]);
  const [creatureClass, setCreatureClass] = useState<Class | null>(null);

  // Watch all stat values to calculate sum
  const might = watch('might');
  const agility = watch('agility');
  const intellect = watch('intellect');
  const spirit = watch('spirit');
  const classId = watch('selectedClassId');

  const totalStats = might + agility + intellect + spirit;
  const disbleIncrement = totalStats >= 3;

  const getFeatures = () => {
    const classWithLevels = creatureClass as any;
    return classWithLevels.classLevels?.flatMap((level: { features?: any[] }) => level.features ?? []) ?? [];
  };

  const getHealth = () => {
    const baseHealth = creatureClass?.classLevels?.reduce((sum, level) => sum + (level.health ?? 0), 0) ?? 0;
    return baseHealth + Number(might);
  };

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
  // console.log(getFeatures());
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

  const fetchClasses = () => {
    setLoading(true);
    return apiClient
      .getClasses()
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching classes:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = async (data: any) => {
    console.log('Form data:', data);
    setLoading(true);
    
    try {
      const response = await apiClient.createCreature(data);
      const newCreatureId = response.data.id;
      
      if (newCreatureId) {
        // Navigate to view the newly created creature
        setCreatureId(newCreatureId);
        setCurrentState(CorePanelState.VIEW_CREATURE);
      } else {
        console.error('No creature ID returned from API');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error creating creature:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-creature-container">
      <Typography variant="h5" component="h2" className="create-creature-title">
        Create New Creature
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                {creatureClass && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Health: {getHealth()}
                  </Typography>
                )}
                {creatureClass && getFeatures().length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Features:
                    </Typography>
                    <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                      {getFeatures().map((feature: { id: number; name: string; Description: string }) => (
                        <ListItem key={feature.id} sx={{ display: 'list-item', p: 0 }}>
                          <ListItemText primary={feature.name} secondary={feature.Description} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
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

          <div className="create-creature-button-group">
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
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
        </div>
      </form>
    </div>
  );
};

export default CreateCreature;
