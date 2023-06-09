import { useEffect } from "react";
import { useMUD } from "../store";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { useComponentValue } from "@latticexyz/react";
import { EntityIndex, hasComponent } from "@latticexyz/recs";

export function PlayerControls() {
  const {
    networkLayer: {
      singletonEntity,
      components: { Position, Room },
      utils: {
        txApi: { moveRoom },
      },
    },
    phaserLayer: {
      components: { ActiveRoom },
    },
  } = useMUD();

  const currentPlayer = useCurrentPlayer();
  const playerPosition = useComponentValue(
    Position,
    currentPlayer?.player || (0 as EntityIndex)
  ) || { x: 0, y: 0 };
  const playerRoom = useComponentValue(
    Room,
    currentPlayer?.player || (0 as EntityIndex)
  ) || { x: 0, y: 0 };

  useEffect(() => {
    if (!currentPlayer) return;
    if (!playerPosition) return;
    if (!playerRoom) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (hasComponent(ActiveRoom, singletonEntity)) return;

      const targetPosition = playerRoom;
      if (e.key === "w") {
        moveRoom({ ...targetPosition, y: targetPosition.y - 1 });
      }
      if (e.key === "s") {
        moveRoom({ ...targetPosition, y: targetPosition.y + 1 });
      }
      if (e.key === "a") {
        moveRoom({ ...targetPosition, x: targetPosition.x - 1 });
      }
      if (e.key === "d") {
        moveRoom({ ...targetPosition, x: targetPosition.x + 1 });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentPlayer, playerPosition, playerRoom]);

  return <></>;
}
