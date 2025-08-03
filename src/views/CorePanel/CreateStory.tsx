import { Button, TextField, Tooltip, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { RichTextEditor } from '../../components/RichTextEditor';
import './CreateStory.css';
import { apiClient } from '../../api/client';
import { useNavigate } from 'react-router-dom';

type FormData = {
  name: string;
  description: string;
};

export const CreateStory = () => {
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
      description: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await apiClient.createStory(data);
      const newStoryId = response.data.id;

      if (newStoryId) {
        navigate(`/story/${newStoryId}`);
      } else {
        console.error('No story ID returned from API');
      }
    } catch (error) {
      console.error('Error creating creature:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" component="h2" className="create-creature-title">
        Create New Story
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="create-story-stack">
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
          <Controller
            name="description"
            control={control}
            render={({ field }) => <RichTextEditor onChange={field.onChange} />}
          />
          <div className="create-story-button-group">
            <Button type="submit" variant="contained" fullWidth>
              Create Story
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
