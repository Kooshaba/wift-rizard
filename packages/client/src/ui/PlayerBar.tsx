import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  HasValue,
  getComponentValueStrict,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
import { useMUD } from "../store";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { ClickWrapper } from "./theme/ClickWrapper";
import { ItemTypeSprites } from "../layers/network/types";
import { twMerge } from "tailwind-merge";
import { SpriteImage } from "./theme/SpriteImage";
import { Sprites } from "../layers/phaser/constants";
import { useEffect, useState } from "react";
import { Button } from "./theme/Button";

function AttackDetails({
  screenPosition,
  attackData,
}: {
  screenPosition: { x: number; y: number };
  attackData: {
    strength: number;
    staminaCost: number;
    minRange: number;
    maxRange: number;
    patternX: number[];
    patternY: number[];
  };
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center",
        "bg-gray-900 rounded-lg px-4 py-2",
        "text-white"
      )}
      style={{
        position: "absolute",
        left: screenPosition.x,
        top: screenPosition.y - 100,
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <span className="ml-2">
          Stamina Cost: {attackData.staminaCost / 1000}
        </span>
      </div>
      <div className="flex flex-row items-center justify-center">
        <span className="ml-2">Strength: {attackData.strength}</span>
      </div>
      <div className="flex flex-row items-center justify-center">
        <span className="ml-2">Range: {attackData.minRange}</span>
        <span className="ml-2">-</span>
        <span className="ml-2">{attackData.maxRange}</span>
      </div>
    </div>
  );
}

function Inventory({
  playerData,
}: {
  playerData: NonNullable<ReturnType<typeof useCurrentPlayer>>;
}) {
  const {
    networkLayer: {
      world,
      components: { EquippedBy, Position, ItemType, OptimisticStamina },
    },
    phaserLayer: {
      components: { Targeting },
      utils: { getPlayerAttackData },
    },
  } = useMUD();

  const [hoverAttackData, setHoverAttackData] =
    useState<ReturnType<typeof getPlayerAttackData>>();
  const [hoverPosition, setHoverPosition] = useState<
    { x: number; y: number } | undefined
  >();

  const ugh = "0x" + playerData.playerId.replace("0x", "").padStart(64, "0");
  const equippedItems = useEntityQuery([HasValue(EquippedBy, { value: ugh })]);

  const { player } = playerData;
  const playerStamina = useComponentValue(OptimisticStamina, player);
  const playerPosition = useComponentValue(Position, player);
  const currentTarget = useComponentValue(Targeting, player);

  useEffect(() => {
    if (equippedItems.length === 0) return;

    function onKeyDown(e: KeyboardEvent) {
      const numMatch = e.code.match(new RegExp("Digit(\\d)"));
      if (!numMatch) return;

      const num = parseInt(numMatch[1]) - 1;
      if (num == undefined) return;

      const item = equippedItems[num];
      if (!item) return;

      const itemId = world.entities[item];
      if (currentTarget?.item === itemId) {
        removeComponent(Targeting, playerData.player);
      } else {
        setComponent(Targeting, playerData.player, {
          item: itemId,
        });
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [equippedItems, currentTarget]);

  if (!playerPosition) return <></>;
  if (!playerStamina) return <></>;

  return (
    <div>
      {hoverAttackData && hoverPosition && (
        <AttackDetails
          screenPosition={hoverPosition}
          attackData={hoverAttackData}
        />
      )}

      <div className="flex flex-row items-center justify-center flex-wrap">
        {equippedItems.map((item, index) => {
          const itemType = getComponentValueStrict(ItemType, item).value;
          const attack = getPlayerAttackData(player, item);
          const attackCost = attack?.staminaCost || 0;

          const itemId = world.entities[item];
          const currentlyTargeting = itemId === currentTarget?.item;

          return (
            <div
              key={item}
              style={{
                border: "1px #5D6065 solid",
                backgroundColor: `${currentlyTargeting ? "green" : ""}`,
              }}
              className={twMerge(
                "flex flex-col items-center justify-around",
                "rounded-lg ml-4 bg-gray-900 hover:bg-gray-700 hover:shadow-lg hover:border-gray-600 px-4",
                "cursor-hover",
                playerStamina.current < attackCost &&
                  "bg-red-600 disabled hover:bg-red-600"
              )}
              onMouseEnter={(e) => {
                setHoverAttackData(attack);
                setHoverPosition({
                  x: (e.target as HTMLElement).offsetLeft,
                  y: (e.target as HTMLElement).offsetTop,
                });
              }}
              onMouseLeave={() => {
                setHoverAttackData(undefined);
                setHoverPosition(undefined);
              }}
              onClick={() => {
                setComponent(Targeting, playerData.player, {
                  item: world.entities[item],
                });
              }}
            >
              <span className="text-white w-fit -mb-4 mt-2">{index + 1}</span>
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
      world,
      singletonEntity,
      components: { Health, OptimisticStamina, BonusAttributes },
    },
    phaserLayer: {
      utils: {
        getPlayerAttackData,
        map: { viewWorldMap },
      },
      components: { Targeting, ActiveRoom },
    },
  } = useMUD();

  const currentPlayer = useCurrentPlayer();
  const activeRoom = useComponentValue(ActiveRoom, singletonEntity);

  const player = (currentPlayer?.player || 0) as EntityIndex;
  const playerHealth = useComponentValue(Health, player);
  const playerStamina = useComponentValue(OptimisticStamina, player);

  const bonusAttributes = useComponentValue(BonusAttributes, player);

  const currentlyTargeting = useComponentValue(Targeting, player);
  const currentAttack =
    currentlyTargeting &&
    getPlayerAttackData(
      player,
      world.getEntityIndexStrict(currentlyTargeting.item)
    );

  const pendingStaminaSpend = currentAttack?.staminaCost;

  if (!currentPlayer) return <></>;
  if (!playerHealth) return <></>;
  if (!playerStamina) return <></>;
  if (!bonusAttributes) return <></>;

  const maxHealth = playerHealth.max + bonusAttributes.healthMax;
  const currentHealthPercent = Math.floor(
    (playerHealth.current / maxHealth) * 100
  );
  const healthMissingPercent = 100 - currentHealthPercent;

  const maxStamina = playerStamina.max + bonusAttributes.staminaMax;
  const currentStaminaPercent = Math.floor(
    (playerStamina.current / maxStamina) * 100
  );
  const staminaMissingPercent = 100 - currentStaminaPercent;
  const pendingStaminaSpendPercent = Math.floor(
    ((pendingStaminaSpend || 0) / maxStamina) * 100
  );

  const currentStaminaNumber = pendingStaminaSpend
    ? playerStamina.current - pendingStaminaSpend
    : playerStamina.current;

  return (
    <ClickWrapper className="absolute bottom-0 left-0 h-[175px] w-screen flex flex-row items-center justify-center">
      {activeRoom && (
        <div className="flex flex-col">
          <Button onClick={() => viewWorldMap()}>World Map</Button>
        </div>
      )}

      <div>
        <SpriteImage spriteKey={Sprites.Avatar} scale={3.5} />
      </div>

      <div className="h-[125px]">
        <div className="mb-10">
          <div className="mb-2 flex flex-flow justify-between">
            <SpriteImage spriteKey={Sprites.Heart} />
            <span className="text-white">
              {playerHealth.current} / {maxHealth}
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
              <span
                style={{
                  color: pendingStaminaSpend ? "#ff7f00" : "",
                }}
              >
                {currentStaminaNumber / 1000}
              </span>{" "}
              / {maxStamina / 1000}
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

            <span
              style={{
                transform: `translateX(${
                  (100 - pendingStaminaSpendPercent) / 2 - staminaMissingPercent
                }%) scaleX(${pendingStaminaSpendPercent}%)`,
              }}
              className="absolute top-0 left-0 overflow-hidden transition-all ease-linear"
            >
              <SpriteImage spriteKey={Sprites.PendingStaminaBarFill} />
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
