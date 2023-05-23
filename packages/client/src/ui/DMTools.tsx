import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "../store";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { useActionButton } from "./hooks/useActionButton";
import { ClickWrapper } from "./theme/ClickWrapper";
import { Entity } from "@latticexyz/recs";

export function DMTools() {
  const {
    networkLayer: {
      components: { Room },
      utils: {
        txApi: { createSpawner, spawnMonster, tickRoom, equipRandomItem },
      },
    },
  } = useMUD();

  const currentPlayer = useCurrentPlayer();
  const playerRoom = useComponentValue(
    Room,
    currentPlayer?.player || ("0" as Entity)
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

  const { button: equipRandomItemButton } = useActionButton({
    label: "Equip Random Item",
    actionName: "equipRandomItem",
    actionFunction: () => {
      equipRandomItem();
    },
  });

  return (
    <ClickWrapper className="flex flex-col w-fit">
      {spawnMonsterButton}
      {createSpawnerButton}
      {tickMonsterButton}
      
      <br />
      
      {equipRandomItemButton}
    </ClickWrapper>
  );
}
