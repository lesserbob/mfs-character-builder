import { Controller, useForm } from 'react-hook-form';
import { Creature } from '../../../api/generated';
import { apiClient } from '../../../api/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from '@mui/material';

export interface SetWealthDialogProps {
  isModelOpen: boolean;
  closeModel(): void;
  creature: Creature | undefined;
}
export const SetWealthDialog = ({
  isModelOpen,
  closeModel,
  creature,
}: SetWealthDialogProps) => {
  type FormData = {
    wealth: number;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();
  const wealth = watch('wealth');

  const onSubmit = async (data: any) => {
    if (!creature) return;

    const modifiedCreature = { ...creature, wealth: Number(wealth) };
    await apiClient.updateCreature(creature.id, modifiedCreature);

    closeModel();
  };

  if (!creature) return <></>;

  return (
    <Dialog open={isModelOpen} onClose={closeModel}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Set Wealth for {creature.name}</DialogTitle>
        <DialogContent>
          {creature.name} current wealth is {creature.wealth}
          <Controller
            name="wealth"
            control={control}
            rules={{ required: 'New wealth is required' }}
            render={({ field }) => (
              <Tooltip
                title={errors.wealth?.message || ''}
                open={!!errors.wealth}
                disableHoverListener={!errors.wealth}
                placement="right"
                arrow
              >
                <TextField
                  {...field}
                  label="New Wealth"
                  fullWidth
                  error={!!errors.wealth}
                />
              </Tooltip>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModel}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
