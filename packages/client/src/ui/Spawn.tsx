import { Has, getComponentValue, runQuery } from "@latticexyz/recs";
import { useMUD } from "../store";
import { useActionButton } from "./hooks/useActionButton";
import { useCurrentPlayer } from "./hooks/useCurrentPlayer";
import { ClickWrapper } from "./theme/ClickWrapper";
import { Button } from "./theme/Button";

export function Spawn() {
  const {
    networkLayer: {
      components: { Room, Player },
      utils: {
        txApi: { spawnPlayer, spawnMonster, tickMonster },
      },
    },
  } = useMUD();

  const { button: spawnButton } = useActionButton({
    label: "Spawn",
    actionName: "spawnPlayer",
    actionFunction: spawnPlayer,
    className: "text-2xl",
  });

  const tick = () => {
    const playersInRooms = runQuery([Has(Room), Has(Player)]);
    for (const player of playersInRooms) {
      const room = getComponentValue(Room, player);
      if (!room) continue;

      tickMonster(room);
      spawnMonster();
    }
  };

  const startTicking = () => {
    setInterval(tick, 1000);
  };

  const currentPlayer = useCurrentPlayer();
  if (currentPlayer) return <></>;

  return (
    <ClickWrapper className="w-screen h-screen flex flex-col justify-around items-center">
      <div>{spawnButton}</div>

      <Button onClick={startTicking}>Dungeon Master</Button>
    </ClickWrapper>
  );
}
