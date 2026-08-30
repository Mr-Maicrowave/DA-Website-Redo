export type AquariumFish = {
  id: string;
  label: string;
  src: string;
  fact: string;
  start: { x: number; y: number; scale: number; speed: number };
};

export const aquariumFish: AquariumFish[] = [
  { id: 'blue-tang', label: 'blue tang', src: '/primary-reference/aquarium/fish/blue-tang.png', fact: 'Blue tangs use their bright colour to help them find friends!', start: { x: .58, y: .43, scale: .22, speed: .9 } },
  { id: 'clownfish', label: 'clownfish', src: '/primary-reference/aquarium/fish/clownfish.png', fact: 'Clownfish live safely among sea anemones!', start: { x: .28, y: .56, scale: .18, speed: .78 } },
  { id: 'yellow-tang', label: 'yellow tang', src: '/primary-reference/aquarium/fish/yellow-tang.png', fact: 'Yellow tangs graze on algae and help keep reefs healthy!', start: { x: .77, y: .57, scale: .16, speed: .86 } },
  { id: 'pufferfish', label: 'pufferfish', src: '/primary-reference/aquarium/fish/pufferfish.png', fact: 'Pufferfish can puff themselves up when they feel threatened!', start: { x: .43, y: .68, scale: .14, speed: .66 } },
  { id: 'seahorse', label: 'seahorse', src: '/primary-reference/aquarium/fish/seahorse.png', fact: 'Daddy seahorses carry the babies!', start: { x: .86, y: .38, scale: .13, speed: .5 } },
];

export const aquariumBackgroundFish: AquariumFish[] = [
  { id: 'reef-fish', label: 'reef fish', src: '/primary-reference/aquarium/fish/reef-fish.png', fact: '', start: { x: .4, y: .28, scale: .065, speed: 1.08 } },
  { id: 'starfish', label: 'sea star', src: '/primary-reference/aquarium/fish/starfish.png', fact: '', start: { x: .18, y: .79, scale: .055, speed: .18 } },
];

export const aquariumCreatures = [...aquariumFish, ...aquariumBackgroundFish];
