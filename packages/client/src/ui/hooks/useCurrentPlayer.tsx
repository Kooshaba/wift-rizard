import { useEffect, useState } from "react";
import { useMUD } from "../../store";
import { Entity } from "@latticexyz/recs";

export const useCurrentPlayer = () => {
  const {
    networkLayer: {
      utils: { onPlayerLoaded },
    },
  } = useMUD();

  const [playerData, setPlayerData] = useState<{
    player: Entity;
  } | null>(null);

  useEffect(() => {
    onPlayerLoaded((data) => {
      setPlayerData(data);
    });
  }, [onPlayerLoaded]);

  return playerData;
};
