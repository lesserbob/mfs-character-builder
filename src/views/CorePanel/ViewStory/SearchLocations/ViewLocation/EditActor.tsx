import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { useLocation } from '../../../../../context/LocationContext';
import {
  getHealth,
  getMomentum,
  getRemainingEndurance,
  getRemainingHealth,
  getRemainingMomentum,
} from '../../../../../util/CreatureUtils';
import { useClasses } from '../../../../../context/ClassContext';
import { useEffect, useState } from 'react';
import { Controller, get, useForm } from 'react-hook-form';
import './EditActor.css';
import { Actor } from '../../../../../api/generated';

type FormData = {
  remainingHealth: number;
  remainingEndurance: number;
  remainingMomentum: number;
  remainingActionPoints: number;
  tacticalSurgeToken: boolean;
  tacticalActionsTaken: number;
};

export const EditActor = () => {
  const { editActor, setEditActor, updateActor } = useLocation();
  const { classes } = useClasses();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      remainingHealth: 0,
      remainingEndurance: 0,
      remainingMomentum: 0,
      remainingActionPoints: 0,
      tacticalSurgeToken: false,
      tacticalActionsTaken: 0,
    },
  });

  const remainingHealth = watch('remainingHealth');
  const remainingEndurance = watch('remainingEndurance');
  const remainingMomentum = watch('remainingMomentum');
  const remainingActionPoints = watch('remainingActionPoints');
  const tacticalSurgeToken = watch('tacticalSurgeToken');
  const tacticalActionsTaken = watch('tacticalActionsTaken');

  useEffect(() => {
    if (editActor) {
      setValue('remainingHealth', getRemainingHealth(editActor, classes));
      setValue('remainingEndurance', getRemainingEndurance(editActor, classes));
      setValue('remainingMomentum', getRemainingMomentum(editActor));
      setValue('remainingActionPoints', editActor.actionPoints);
      setValue('tacticalSurgeToken', editActor.tacticalSurgeToken);
      setValue('tacticalActionsTaken', editActor.tacticalActionsTaken);
    }
  }, [editActor, classes, setValue]);

  const onSubmit = async (data: any) => {
    const actor = {
      ...editActor,
      healthDamage: getHealth(editActor?.creature!, classes) - remainingHealth,
      enduranceDamage:
        getHealth(editActor?.creature!, classes) - remainingEndurance,
      momentumSpent: getMomentum(editActor?.creature!) - remainingMomentum,
      actionPoints: Number(remainingActionPoints),
      tacticalSurgeToken: tacticalSurgeToken,
      tacticalActionsTaken: Number(tacticalActionsTaken),
    } as Actor;

    updateActor(actor);
    setEditActor(undefined);
  };

  return (
    <Dialog
      open={!!editActor}
      slotProps={{
        paper: {
          className: 'simple-asset-dialog-paper',
        },
      }}
    >
      <DialogTitle>{editActor?.creature!.name}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>Health</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="remainingHealth"
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant="standard" size="small" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              /
              {editActor?.creature
                ? getHealth(editActor?.creature, classes)
                : 0}
            </Grid>
            <Grid size={{ xs: 4 }}>Action Ponts</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="remainingActionPoints"
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant="standard" size="small" />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>Endurance</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="remainingEndurance"
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant="standard" size="small" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              /
              {editActor?.creature
                ? getHealth(editActor?.creature, classes)
                : 0}
            </Grid>
            <Grid size={{ xs: 4 }}>Tac Surge Attempt</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="tacticalSurgeToken"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <Checkbox
                    checked={!!value}
                    onChange={(e, checked) => onChange(checked)}
                    size="small"
                    sx={{ p: 0, m: 0 }}
                    {...rest}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}>Momentum</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="remainingMomentum"
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant="standard" size="small" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              /{editActor?.creature ? getMomentum(editActor.creature) : 0}
            </Grid>
            <Grid size={{ xs: 4 }}>Tac actions taken</Grid>
            <Grid size={{ xs: 1 }}>
              <Controller
                name="tacticalActionsTaken"
                control={control}
                render={({ field }) => (
                  <TextField {...field} variant="standard" size="small" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <div className="edit-actor-button-group">
          <Button type="submit" variant="contained" fullWidth>
            Save
          </Button>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => {
              setEditActor(undefined);
            }}
          >
            Close
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
