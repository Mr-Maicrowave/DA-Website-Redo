export type AquariumFish = {
  id: string;
  label: string;
  src: string;
  fact: string;
  start: { x: number; y: number; scale: number; speed: number };
};

export const aquariumFish: AquariumFish[] = [
  { id: 'clownfish', label: 'clownfish', src: '/primary-reference/aquarium/fish/clownfish.png', fact: 'Clownfish live safely among sea anemones!', start: { x: .22, y: .48, scale: .12, speed: .82 } },
  { id: 'blue-tang', label: 'blue tang', src: '/primary-reference/aquarium/fish/blue-tang.png', fact: 'Blue tangs use their bright colour to help them find friends!', start: { x: .68, y: .28, scale: .13, speed: 1.02 } },
  { id: 'yellow-tang', label: 'yellow tang', src: '/primary-reference/aquarium/fish/yellow-tang.png', fact: 'Yellow tangs graze on algae and help keep reefs healthy!', start: { x: .76, y: .62, scale: .1, speed: .9 } },
  { id: 'pufferfish', label: 'pufferfish', src: '/primary-reference/aquarium/fish/pufferfish.png', fact: 'Pufferfish can puff themselves up when they feel threatened!', start: { x: .44, y: .67, scale: .095, speed: .7 } },
  { id: 'seahorse', label: 'seahorse', src: '/primary-reference/aquarium/fish/seahorse.png', fact: 'Daddy seahorses carry the babies!', start: { x: .84, y: .43, scale: .08, speed: .55 } },
  { id: 'reef-fish', label: 'reef fish', src: '/primary-reference/aquarium/fish/reef-fish.png', fact: 'Reef fish use colour and patterns to recognise one another!', start: { x: .38, y: .3, scale: .08, speed: 1.18 } },
  { id: 'starfish', label: 'sea star', src: '/primary-reference/aquarium/fish/starfish.png', fact: 'Sea stars can regrow lost arms!', start: { x: .16, y: .78, scale: .07, speed: .2 } },
];
