import React from "react";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useMUD } from "../store";
import { ActionState, ActionStateString } from "@latticexyz/std-client";

export function ActionQueue() {
  const {
    networkLayer: {
      actions: { Action },
    },
  } = useMUD();

  const allActions = useEntityQuery([Has(Action)]);
  const actionData = allActions.map((action) => {
    const actionComponent = getComponentValueStrict(Action, action);
    const { state, on, metadata, overrides, txHash } = actionComponent;

    return {
      action,
      state,
      on,
      metadata,
      overrides,
      txHash,
    };
  });

  const getStateColor = (state: ActionState) => {
    switch (state) {
      case ActionState.Requested:
        return "bg-blue-500";
      case ActionState.Executing:
        return "bg-yellow-500";
      case ActionState.WaitingForTxEvents:
        return "bg-orange-500";
      case ActionState.Complete:
        return "bg-green-500";
      case ActionState.Failed:
        return "bg-red-500";
      case ActionState.Cancelled:
        return "bg-gray-500";
      case ActionState.TxReduced:
        return "bg-indigo-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="absolute right-0 h-screen w-fit flex flex-col items-center justify-around bg-red">
      <div>
        {actionData.map((actionItem) => {
          return (
            <div
              className={`flex flex-row p-2 rounded-lg ${getStateColor(
                actionItem.state
              )}`}
              key={`actionItem${actionItem}`}
            >
              Action {actionItem.action}:{" "}
              {ActionStateString[actionItem.state as 0]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
