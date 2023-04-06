import React from "react";
import { useStore } from "../store";
import { AdminControls } from "./AdminControls";
import { ECSBrowser } from "./ECSBrowser";
import { Leaderboard } from "./Leaderboard";
import { LoadingScreen } from "./LoadingScreen";
import { PlayerBar } from "./PlayerBar";
import { Spawn } from "./Spawn";
import { Wrapper } from "./Wrapper";
import { ActionQueue } from "./ActionQueue";
import { DMTools } from "./DMTools";

export const UIRoot = () => {
  const layers = useStore((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <LoadingScreen />
      <AdminControls />

      <DMTools />

      <Leaderboard />
      <ActionQueue />

      <PlayerBar />
      <Spawn />

      <ECSBrowser />
    </Wrapper>
  );
};
