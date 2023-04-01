import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { EntityIndex, Has, HasValue, runQuery } from "@latticexyz/recs";
import { useEffect, useMemo, useState } from "react";
import { useMUD } from "../store";
import { GameMessages } from "./GameMessages";
import { useActionButton } from "./hooks/useActionButton";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { Button } from "./theme/Button";
import { ClickWrapper } from "./theme/ClickWrapper";

function AttackButton({ monster }: { monster: EntityIndex }) {
  const {
    networkLayer: {
      utils: {
        txApi: { attack },
      },
    },
  } = useMUD();

  const { button: attackButton } = useActionButton({
    label: "Attack",
    actionName: "attack",
    actionFunction: () => {
      attack(monster);
    },
  });

  return attackButton;
}

export function PlayerBar() {
  const {
    networkLayer: {
      components: { Position, Health, Strength, Monster, OptimisticStamina },
      utils: {
        txApi: { move, heal },
      },
    },
  } = useMUD();

  const currentPlayer = useCurrentPlayer();
  const playerPosition = useComponentValue(
    Position,
    currentPlayer?.player || (0 as EntityIndex)
  ) || { x: 0, y: 0 };

  const adjacentPositions = useMemo(
    () => [
      { ...playerPosition, y: playerPosition.y - 1 },
      { ...playerPosition, y: playerPosition.y + 1 },
      { ...playerPosition, x: playerPosition.x - 1 },
      { ...playerPosition, x: playerPosition.x + 1 },
    ],
    [playerPosition]
  );

  const allMonsters = useEntityQuery([Has(Monster)]);
  const [adjacentMonster, setAdjacentMonster] = useState<
    EntityIndex | undefined
  >();

  useEffect(() => {
    setAdjacentMonster(undefined);
    for (const position of adjacentPositions) {
      const entities = [
        ...runQuery([
          Has(Monster),
          HasValue(Position, { x: position.x, y: position.y }),
        ]),
      ];
      if (entities.length > 0) {
        setAdjacentMonster(entities[0]);
        break;
      }
    }
  }, [playerPosition, setAdjacentMonster, adjacentPositions, allMonsters]);

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
  const playerStrength = useComponentValue(
    Strength,
    (currentPlayer?.player || 0) as EntityIndex
  );
  const playerStamina = useComponentValue(
    OptimisticStamina,
    (currentPlayer?.player || 0) as EntityIndex
  );

  if (!currentPlayer) return <></>;
  if (!playerHealth) return <></>;
  if (!playerStrength) return <></>;

  return (
    <ClickWrapper className="absolute bottom-0 left-0 h-[150px] w-screen bg-slate-400/40 flex flex-row items-center justify-center p-8 rounded-lg">
      <div>
        <div className="w-40 px-4 h-8 bg-red-600 rounded-lg mb-4 flex flex-row items-center justify-center">
          <div className="text-center text-white">
            {playerHealth.current} / {playerHealth.max} HP
          </div>
        </div>

        <div className="w-40 h-8 bg-green-600 rounded-lg mb-4 flex flex-row items-center justify-center">
          <div className="text-center text-white">
            {playerStrength.value} STR
          </div>
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

      <div className="flex flex-col items-center ml-8">
        <div className="mb-2">
          {adjacentMonster ? (
            <AttackButton monster={adjacentMonster} />
          ) : (
            <Button disabled={true}>Nothing to Attack</Button>
          )}
        </div>

        <div>{healButton}</div>
      </div>

      <div className="h-full w-[300px] ml-4 -mt-16">
        <GameMessages height={150} />
      </div>
    </ClickWrapper>
  );
}
