import { useEffect, useState } from "react";
import { useMUD } from "../store";
import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../layers/phaser/constants";
import { useComponentValue } from "@latticexyz/react";

export function Coord() {
  const {
    phaserLayer: {
      components: { ActiveRoom },
      scenes: {
        Main: { input },
      },
    },
    networkLayer: { singletonEntity },
  } = useMUD();

  const [coord, setCoord] = useState({ x: 0, y: 0 } as {
    x: number;
    y: number;
  } | null);
  const room = useComponentValue(ActiveRoom, singletonEntity);

  useEffect(() => {
    const sub = input.pointermove$.subscribe(({ pointer }) => {
      const tileCoord = pixelCoordToTileCoord(
        {
          x: pointer.worldX,
          y: pointer.worldY,
        },
        TILE_WIDTH,
        TILE_HEIGHT
      );
      setCoord(tileCoord);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="absolute top-0 right-0 text-white p-4">
      <div>{room && `Room: (${room?.x}, ${room?.y})`}</div>({coord?.x},{" "}
      {coord?.y})
    </div>
  );
}
