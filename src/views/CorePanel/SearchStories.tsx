import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { Story } from '../../api/generated';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';

export const SearchStories = () => {
  const [stories, setStories] = useState<Story[]>();

  const fetchStories = useCallback(() => {
    return apiClient
      .getStories()
      .then((response) => {
        setStories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching creatures:', error);
      });
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories?.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <Link to={`/view-story/${story.id}`} className="story-link">
                    {story.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
