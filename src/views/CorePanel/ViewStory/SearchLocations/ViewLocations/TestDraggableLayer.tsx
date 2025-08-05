import { Layer, Rect } from 'react-konva';
import { useLocation } from '../../../../../context/LocationContext';

export const TestDraggableLayer = () => {
  const { gridSize } = useLocation();

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const snappedX = Math.round(node.x() / gridSize) * gridSize;
    const snappedY = Math.round(node.y() / gridSize) * gridSize;
    node.position({ x: snappedX, y: snappedY });
  };

  return (
    <Layer>
      {/* The draggable box */}
      <Rect
        x={50}
        y={50}
        width={gridSize}
        height={gridSize}
        fill="skyblue"
        draggable
        onDragEnd={handleDragEnd}
      />
    </Layer>
  );
};
