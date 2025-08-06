import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';

// const BackgroundLayer = ({ imageUrl }: { imageUrl: string }) => {
export const BackgroundLayer = () => {
  // Hard code for now
  const imageUrl = '/locations/CityScape/city1.jpg';

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(new window.Image());

  useEffect(() => {
    const img = imageRef.current;
    img.src = imageUrl;
    img.onload = () => setImage(img);
  }, [imageUrl]);

  return (
    <Layer>
      {image && <KonvaImage image={image} width={800} height={600} />}
    </Layer>
  );
};
