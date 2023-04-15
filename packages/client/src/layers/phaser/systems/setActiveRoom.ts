import {
  Has,
  HasValue,
  defineSystem,
  getComponentValue,
  removeComponent,
  runQuery,
  setComponent,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";

export function setActiveRoom(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      playerEntity,
      components: { Player, Room, Position },
      singletonEntity,
    },
    components: { ActiveRoom, InActiveRoom },
  } = layer;

  function refreshActiveRoom() {
    // remove the in-active room flag from all entities
    const activeEntities = runQuery([Has(InActiveRoom)]);
    activeEntities.forEach((entity) => {
      removeComponent(InActiveRoom, entity);
    });

    const activeRoom = getComponentValue(ActiveRoom, singletonEntity);
    if (!activeRoom) return;
    
    const existingEntitiesInRoom = runQuery([Has(Position), HasValue(Room, activeRoom)]);
    existingEntitiesInRoom.forEach((entity) => {
      setComponent(InActiveRoom, entity, { value: true });
    });
  }

  // set the active room to the player's room
  defineSystem(world, [Has(Player), Has(Room)], ({ entity: player }) => {
    if (player !== playerEntity) return;

    const room = getComponentValue(Room, player);
    if (!room) return;

    setComponent(ActiveRoom, singletonEntity, room);

    refreshActiveRoom();
  });

  defineSystem(world, [Has(Position), Has(Room)], ({ entity }) => {
    const room = getComponentValue(Room, entity);
    const activeRoom = getComponentValue(ActiveRoom, singletonEntity);

    if (room?.x !== activeRoom?.x && room?.y !== activeRoom?.y) return;

    setComponent(InActiveRoom, entity, { value: true });
  });

  defineSystem(world, [Has(ActiveRoom)], () => {
    refreshActiveRoom();
  });
}
