import { IconButton, Menu, MenuItem, Paper } from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Creature } from '../../api/generated';
import { useClasses } from '../../context/ClassContext';
import { getClassDescription } from '../../util/CreatureUtils';
import './SearchCreatures.css';
import { useAuth } from '../../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import { SetWealthDialog } from './SearchCreatures/SetWealthDialog';

const SearchCreatures = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const { classes } = useClasses();
  const hasFetched = useRef(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isWealthModalOpen, setWealthModalOpen] = useState(false);
  const [currentCreature, setCurrentCreature] = useState<Creature | undefined>(
    undefined
  );

  const { user } = useAuth();

  const fetchCreatures = useCallback(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;
    return apiClient
      .getCreatures()
      .then((response) => {
        setCreatures(response.data);
      })
      .catch((error) => {
        console.error('Error fetching creatures:', error);
      });
  }, []);

  useEffect(() => {
    fetchCreatures();
  }, [fetchCreatures]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    creature: Creature
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentCreature(creature);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSetWealth = () => {
    setWealthModalOpen(true);
    handleMenuClose();
  };

  const handleCloseWealth = () => {
    setWealthModalOpen(false);
    setCurrentCreature(undefined);
  };

  return (
    <>
      <SetWealthDialog
        isModelOpen={isWealthModalOpen}
        closeModel={handleCloseWealth}
        creature={currentCreature}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Level</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creatures.map((creature, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Link
                    to={`/creature/${creature.id}`}
                    className="creature-link"
                  >
                    {creature.name}
                  </Link>
                </TableCell>
                <TableCell>{creature.level}</TableCell>
                <TableCell>{getClassDescription(creature, classes)}</TableCell>
                <TableCell>
                  {user?.type === 'GM' && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, creature)}
                      className="gm-settings-button"
                      color="primary"
                    >
                      <SettingsIcon />
                    </IconButton>
                  )}
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => handleSetWealth()}>
                      Set wealth
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SearchCreatures;
