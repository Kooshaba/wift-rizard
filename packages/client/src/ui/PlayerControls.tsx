import { useEffect } from "react";
import { useMUD } from "../store";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { useComponentValue } from "@latticexyz/react";
import { EntityIndex } from "@latticexyz/recs";

export function PlayerControls() {
  const {
    networkLayer: {
      singletonEntity,
      components: { Position, Room },
      utils: {
        txApi: { move, moveRoom },
      },
    },
    phaserLayer: {
      components: {
        ActiveRoom,
      },
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
  const activeRoom = useComponentValue(ActiveRoom, singletonEntity);

  useEffect(() => {
    if (!currentPlayer) return;
    if (!playerPosition) return;
    if (!playerRoom) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const targetPosition = activeRoom ? playerPosition : playerRoom;
      const moveFunc = activeRoom ? move : moveRoom;

      if (e.key === "w") {
        moveFunc({ ...targetPosition, y: targetPosition.y - 1 });
      }
      if (e.key === "s") {
        moveFunc({ ...targetPosition, y: targetPosition.y + 1 });
      }
      if (e.key === "a") {
        moveFunc({ ...targetPosition, x: targetPosition.x - 1 });
      }
      if (e.key === "d") {
        moveFunc({ ...targetPosition, x: targetPosition.x + 1 });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentPlayer, playerPosition, playerRoom, activeRoom]);

  return <></>;
}
