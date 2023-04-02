import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  Has,
  HasValue,
  getComponentValueStrict,
  setComponent,
} from "@latticexyz/recs";
import { useMUD } from "../store";
import { GameMessages } from "./GameMessages";
import { useActionButton } from "./hooks/useActionButton";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { Button } from "./theme/Button";
import { ClickWrapper } from "./theme/ClickWrapper";
import { ItemTypeNames } from "../layers/network/types";

function Inventory({
  playerData,
}: {
  playerData: NonNullable<ReturnType<typeof useCurrentPlayer>>;
}) {
  const {
    networkLayer: {
      world,
      components: { EquippedBy, Position, ItemType },
      singletonEntity,
    },
    phaserLayer: {
      components: { Targeting },
    },
  } = useMUD();

  const ugh = "0x" + playerData.playerId.replace("0x", "").padStart(64, "0");
  const equippedItems = useEntityQuery([HasValue(EquippedBy, { value: ugh })]);

  const playerPosition = useComponentValue(Position, playerData.player);
  if (!playerPosition) return <></>;

  return (
    <div>
      <div style={{
        maxWidth: "125px",
      }} className="flex flex-row items-center justify-center flex-wrap">
        {equippedItems.map((item) => {
          const itemType = getComponentValueStrict(ItemType, item).value;
          const name = ItemTypeNames[itemType];

          return (
            <div key={item}>
              <Button
                onClick={() => {
                  setComponent(Targeting, playerData.player, {
                    item: world.entities[item],
                  });
                }}
              >
                {name}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlayerBar() {
  const {
    networkLayer: {
      components: { Position, Health, OptimisticStamina, Room },
      utils: {
        txApi: { move, heal, spawnMonster, createSpawner, tickMonster },
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
      tickMonster(playerRoom);
    },
  });

  const { button: moveUpButton } = useActionButton({
    label: "Up",
    actionName: "move",
    actionFunction: () => {
      move({ ...playerPosition, y: playerPosition.y - 1 });
    },
  });

  const { button: moveDownButton } = useActionButton({
    label: "Down",
    actionName: "move",
    actionFunction: () => {
      move({ ...playerPosition, y: playerPosition.y + 1 });
    },
  });

  const { button: moveLeftButton } = useActionButton({
    label: "Left",
    actionName: "move",
    actionFunction: () => {
      move({ ...playerPosition, x: playerPosition.x - 1 });
    },
  });

  const { button: moveRightButton } = useActionButton({
    label: "Right",
    actionName: "move",
    actionFunction: () => {
      move({ ...playerPosition, x: playerPosition.x + 1 });
    },
  });

  const { button: healButton } = useActionButton({
    label: "Heal",
    actionName: "heal",
    actionFunction: () => {
      heal();
    },
  });

  const playerHealth = useComponentValue(
    Health,
    (currentPlayer?.player || 0) as EntityIndex
  );
  const playerStamina = useComponentValue(
    OptimisticStamina,
    (currentPlayer?.player || 0) as EntityIndex
  );

  if (!currentPlayer) return <></>;
  if (!playerHealth) return <></>;

  return (
    <ClickWrapper className="absolute bottom-0 left-0 h-[150px] w-screen bg-slate-400/40 flex flex-row items-center justify-center p-8 rounded-lg">
      <div>
        <div className="w-40 px-4 h-8 bg-red-600 rounded-lg mb-4 flex flex-row items-center justify-center">
          <div className="text-center text-white">
            {playerHealth.current} / {playerHealth.max} HP
          </div>
          {healButton}
        </div>

        {playerStamina && (
          <div className="w-40 h-8 bg-blue-600 rounded-lg mb-4 flex flex-row items-center justify-center">
            <div className="text-center text-white">
              {playerStamina?.current / 1000} / {playerStamina?.max / 1000} STA
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center ml-8">
        <div className="mb-2">{moveUpButton}</div>
        <div className="mb-2">
          <span className="mr-2">{moveLeftButton}</span>
          {moveRightButton}
        </div>
        <div>{moveDownButton}</div>
      </div>

      <div className="ml-4 flex flex-col">
        {spawnMonsterButton}
        {createSpawnerButton}
        {tickMonsterButton}
      </div>

      <div className="flex flex-col items-center ml-8">
        <Inventory playerData={currentPlayer} />
      </div>

      <div className="h-full w-[300px] ml-4 -mt-16">
        <GameMessages height={150} />
      </div>
    </ClickWrapper>
  );
}
