import CreateCreature, { Mode } from './CreateCreature';

export const CreatePlayerCharacter = () => {
  return <CreateCreature mode={Mode.PLAYER_CHARACTER} />;
};
