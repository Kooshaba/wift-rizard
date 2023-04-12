import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../store";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { useActionButton } from "./hooks/useActionButton";
import { EntityIndex } from "@latticexyz/recs";
import { ClickWrapper } from "./theme/ClickWrapper";

export function DMTools() {
  const {
    networkLayer: {
      components: { Room },
      utils: {
        txApi: { createSpawner, spawnMonster, tickRoom },
      },
    },
  } = useMUD();

  const currentPlayer = useCurrentPlayer();
  const playerRoom = useComponentValue(
    Room,
    currentPlayer?.player || (0 as EntityIndex)
  ) || { x: 0, y: 0 };

  const { button: spawnMonsterButton } = useActionButton({
    label: "Spawn Monster",
    actionName: "spawnMonster",
    actionFunction: () => {
      spawnMonster();
    },
  });

  const { button: createSpawnerButton } = useActionButton({
    label: "Create Spawner",
    actionName: "createSpawner",
    actionFunction: () => {
      createSpawner();
    },
  });

  const { button: tickMonsterButton } = useActionButton({
    label: "Tick Monster",
    actionName: "tickMonster",
    actionFunction: () => {
      tickRoom(playerRoom);
    },
  });

  return <ClickWrapper className="flex flex-col w-fit">
    {spawnMonsterButton}
    {createSpawnerButton}
    {tickMonsterButton}
  </ClickWrapper>;
}
