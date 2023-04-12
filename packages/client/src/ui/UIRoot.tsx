import React from "react";
import { useStore } from "../store";
import { AdminControls } from "./AdminControls";
import { ECSBrowser } from "./ECSBrowser";
import { LoadingScreen } from "./LoadingScreen";
import { PlayerBar } from "./PlayerBar";
import { Spawn } from "./Spawn";
import { Wrapper } from "./Wrapper";
import { ActionQueue } from "./ActionQueue";
import { DMTools } from "./DMTools";
import { Coord } from "./Coord";

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

      <ActionQueue />

      <PlayerBar />
      <Spawn />
      <Coord />

      <ECSBrowser />
    </Wrapper>
  );
};
