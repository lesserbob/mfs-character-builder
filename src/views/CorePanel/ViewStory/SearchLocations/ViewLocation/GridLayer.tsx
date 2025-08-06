import { Layer, Rect } from 'react-konva';
import { useLocation } from '../../../../../context/LocationContext';

export const GridLayer = () => {
  const { gridSize, mapWidth, mapHeight } = useLocation();

  return (
    <Layer>
      {Array.from({ length: mapWidth + 1 }).map((_, i) => (
        <Rect
          key={`v-${i}`}
          x={i * gridSize}
          y={0}
          width={1}
          height={mapHeight * gridSize}
          fill="#ddd"
        />
      ))}
      {Array.from({ length: mapHeight + 1 }).map((_, i) => (
        <Rect
          key={`h-${i}`}
          x={0}
          y={i * gridSize}
          width={mapWidth * gridSize}
          height={1}
          fill="#ddd"
        />
      ))}
    </Layer>
  );
};
