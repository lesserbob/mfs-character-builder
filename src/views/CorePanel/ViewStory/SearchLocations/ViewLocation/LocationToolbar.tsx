/**
 * Toolbar for the location
 */

import { useLocation } from '../../../../../context/LocationContext';
import './LocationToolbar.css';

export const LocationToolbar = () => {
  const {
    setGridSize,
    gridSize,
    setMapWidth,
    mapWidth,
    setMapHeight,
    mapHeight,
    setPromptForNewZone,
  } = useLocation();

  return (
    <div className={'location-toolbar'}>
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
      <label>
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
      </label>
      <button
        onClick={() => {
          setPromptForNewZone(true);
        }}
        className={'location-toolbar-button'}
      >
        New Zone
      </button>
    </div>
  );
};
