type ScrollContainer = Pick<HTMLElement, 'scrollTo'>;

export const resetProfileScroll = (container: ScrollContainer | null) => {
  container?.scrollTo({ top: 0, behavior: 'auto' });
};
