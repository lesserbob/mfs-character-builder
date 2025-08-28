/**
 * Toolbar for the location
 */

import { Text } from '../../../../../components/Text';
import { useAuth } from '../../../../../context/AuthContext';
import { useLocation } from '../../../../../context/LocationContext';
import { capitalizeFirst } from '../../../../../util/TextUtils';
import './LocationToolbar.css';

export const LocationToolbar = () => {
  const {
    setGridSize,
    gridSize,
    // setMapWidth,
    // mapWidth,
    // setMapHeight,
    // mapHeight,
    setPromptForNewZone,
    setActingFaction,
    location,
  } = useLocation();
  const { isAuthenticated, user } = useAuth();
  console.log(location);
  return (
    <div className={'location-toolbar'}>
      {/* First Row */}
      <div className="location-toolbar-row">
        <label>
          Grid Size:
          <input
            type="number"
            value={gridSize}
            min={1}
            onChange={(e) => {
              setGridSize(parseInt(e.target.value, 10));
            }}
          />
        </label>
        {location?.actingFaction && (
          <Text>Acting faction:{capitalizeFirst(location.actingFaction)}</Text>
        )}
        {/* <label>
          Width:
          <input
            type="number"
            value={mapWidth}
            min={1}
            onChange={(e) => {
              setMapWidth(parseInt(e.target.value, 10));
            }}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            value={mapHeight}
            min={1}
            onChange={(e) => {
              setMapHeight(parseInt(e.target.value, 10));
            }}
          />
        </label> */}
      </div>

      {/* Second Row - GM Controls */}
      {isAuthenticated && user?.type === 'GM' && (
        <div className="location-toolbar-row">
          <button
            onClick={() => {
              setPromptForNewZone(true);
            }}
            className={'location-toolbar-button'}
          >
            New Zone
          </button>
          {!location?.actingFaction && (
            <>
              <button
                onClick={() => {
                  setActingFaction('PLAYER');
                }}
                className={'location-toolbar-button'}
              >
                Start (Player)
              </button>

              <button
                onClick={() => {
                  setActingFaction('ANTAGONIST');
                }}
                className={'location-toolbar-button'}
              >
                Start (Antagonists)
              </button>
            </>
          )}
          {location?.actingFaction && (
            <>
              <button
                onClick={() => {
                  setActingFaction(null);
                }}
                className={'location-toolbar-button stop-button'}
              >
                Stop
              </button>
              <button
                onClick={() => {
                  setActingFaction(
                    location?.actingFaction === 'PLAYER'
                      ? 'ANTAGONIST'
                      : 'PLAYER'
                  );
                }}
                className={'location-toolbar-button stop-button'}
              >
                Set phase to{' '}
                {location?.actingFaction === 'PLAYER' ? 'Antagonist' : 'Player'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
