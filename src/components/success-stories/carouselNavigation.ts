export const getAdjacentStoryIndex = (currentIndex: number, direction: -1 | 1, storyCount: number) => {
  if (storyCount <= 0) return 0;
  return (currentIndex + direction + storyCount) % storyCount;
};
