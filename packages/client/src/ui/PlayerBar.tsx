import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  Has,
  HasValue,
  getComponentValueStrict,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
import { useMUD } from "../store";
import { GameMessages } from "./GameMessages";
import { useActionButton } from "./hooks/useActionButton";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { Button } from "./theme/Button";
import { ClickWrapper } from "./theme/ClickWrapper";
import { ItemTypeNames, ItemTypeSprites } from "../layers/network/types";
import { twMerge } from "tailwind-merge";
import { SpriteImage } from "./theme/SpriteImage";
import { Sprites } from "../layers/phaser/constants";
import { useEffect } from "react";

function Inventory({
  playerData,
}: {
  playerData: NonNullable<ReturnType<typeof useCurrentPlayer>>;
}) {
  const {
    networkLayer: {
      world,
      components: { EquippedBy, Position, ItemType, OptimisticStamina, Attack },
      singletonEntity,
    },
    phaserLayer: {
      components: { Targeting },
    },
  } = useMUD();

  const ugh = "0x" + playerData.playerId.replace("0x", "").padStart(64, "0");
  const equippedItems = useEntityQuery([HasValue(EquippedBy, { value: ugh })]);

  const playerStamina = useComponentValue(OptimisticStamina, playerData.player);

  const playerPosition = useComponentValue(Position, playerData.player);
  if (!playerPosition) return <></>;
  if (!playerStamina) return <></>;

  return (
    <div>
      <div className="flex flex-row items-center justify-center flex-wrap">
        {equippedItems.map((item) => {
          const itemType = getComponentValueStrict(ItemType, item).value;
          const attackCost = getComponentValueStrict(Attack, item).staminaCost;
          const name = ItemTypeNames[itemType];

          return (
            <div
              key={item}
              style={{
                border: "1px #5D6065 solid",
              }}
              className={twMerge(
                "rounded-lg ml-4 cursor-pointer bg-gray-900 hover:bg-gray-700 hover:shadow-lg hover:border-gray-600 px-4",
                playerStamina.current < attackCost && "bg-red-600 disabled hover:bg-red-600"
              )}
              onClick={() => {
                setComponent(Targeting, playerData.player, {
                  item: world.entities[item],
                });
              }}
            >
              <SpriteImage spriteKey={ItemTypeSprites[itemType]} scale={5} />
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
        txApi: { move },
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

  useEffect(() => {
    if (!currentPlayer) return;
    if (!playerPosition) return;
    if (!playerRoom) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w") {
        move({ ...playerPosition, y: playerPosition.y - 1 });
      }
      if (e.key === "s") {
        move({ ...playerPosition, y: playerPosition.y + 1 });
      }
      if (e.key === "a") {
        move({ ...playerPosition, x: playerPosition.x - 1 });
      }
      if (e.key === "d") {
        move({ ...playerPosition, x: playerPosition.x + 1 });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentPlayer, playerPosition, playerRoom]);

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
  if (!playerStamina) return <></>;

  const currentHealthPercent = Math.floor(
    (playerHealth.current / playerHealth.max) * 100
  );
  const healthMissingPercent = 100 - currentHealthPercent;
  const currentStaminaPercent = Math.floor(
    (playerStamina.current / playerStamina.max) * 100
  );
  const staminaMissingPercent = 100 - currentStaminaPercent;

  return (
    <ClickWrapper className="absolute bottom-0 left-0 h-[175px] w-screen flex flex-row items-center justify-center">
      <div>
        <SpriteImage spriteKey={Sprites.Avatar} scale={3.5} />
      </div>

      <div className="h-[125px]">
        <div className="mb-10">
          <div className="mb-2 flex flex-flow justify-between">
            <SpriteImage spriteKey={Sprites.Heart} />
            <span className="text-white">
              {playerHealth.current} / {playerHealth.max}
            </span>
          </div>
          <div className="relative w-[400px]">
            <span
              style={{
                transform: `translateX(-${
                  healthMissingPercent / 2
                }%) scaleX(${currentHealthPercent}%)`,
              }}
              className="absolute top-0 left-0 overflow-hidden"
            >
              <SpriteImage spriteKey={Sprites.HealthBarFill} />
            </span>
            <span className="absolute top-0 left-0">
              <SpriteImage spriteKey={Sprites.BarFrame} />
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-flow justify-between">
            <SpriteImage spriteKey={Sprites.StaminaDot} />
            <span className="text-white">
              {playerStamina.current / 1000} / {playerStamina.max / 1000}
            </span>
          </div>
          <div className="relative w-[400px]">
            <span
              style={{
                transform: `translateX(-${
                  staminaMissingPercent / 2
                }%) scaleX(${currentStaminaPercent}%)`,
              }}
              className="absolute top-0 left-0 overflow-hidden transition-all ease-linear"
            >
              <SpriteImage spriteKey={Sprites.StaminaBarFill} />
            </span>

            <span className="absolute top-0 left-0">
              <SpriteImage spriteKey={Sprites.BarFrame} />
            </span>
          </div>
        </div>
      </div>

      <Inventory playerData={currentPlayer} />
    </ClickWrapper>
  );
}
