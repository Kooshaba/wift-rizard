import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useMUD } from "../store";
import { getStringColor } from "@latticexyz/std-client";

export function Leaderboard() {
  const {
    networkLayer: {
      world,
      components: {
        Player,
        Position,
        Health,
      },
    },
  } = useMUD();

  const allPlayers = useEntityQuery([
    Has(Player),
    Has(Position),
    Has(Health),
  ]);
  const playerData = allPlayers
    .map((player) => {
      const playerAddress = world.entities[player];
      const playerNumber = getComponentValueStrict(Player, player).value;
      const position = getComponentValueStrict(Position, player);
      const health = getComponentValueStrict(Health, player);

      return {
        player,
        playerAddress,
        position,
        health,
        playerNumber,
      };
    });

  return (
    <div className="absolute left-0 h-screen w-fit flex flex-col items-center justify-around">
      <div>
        {playerData.map((player) => {
          return (
            <div
              style={{
                backgroundColor: `#${getStringColor(
                  player.playerAddress
                ).toString(16)}`,
              }}
              className="flex flex-row p-2 rounded-lg"
            >
              Player {player.playerNumber}: ({player.position.x},{" "}
              {player.position.y})<br />
              Health: {player.health.current} / {player.health.max}
            </div>
          );
        })}
      </div>
    </div>
  );
}
