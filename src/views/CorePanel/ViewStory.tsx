import { Typography } from '@mui/material';
import { RichTextEditor } from '../../components/RichTextEditor';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { Story } from '../../api/generated';
import { SearchLocations } from './ViewStory/SearchLocations';

export const ViewStory = () => {
  const { id } = useParams<{ id: string }>();
  const storyId = id ? parseInt(id, 10) : 0;

  const [story, setStory] = useState<Story>();

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      const response = await apiClient.getStoryById(storyId);
      setStory(response.data);
    } catch (err) {
      console.error('Error fetching story:', err);
    }
  };

  if (!storyId) return null;

  return (
    <>
      <Typography variant="h5" component="h2" className="create-creature-title">
        {story?.name}
      </Typography>
      <RichTextEditor readonly={true} initialValue={story?.description} />
      <SearchLocations storyId={storyId} />
    </>
  );
};
