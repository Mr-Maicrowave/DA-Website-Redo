export const getHoverFlipState = (
  supportsHover: boolean,
  isEntering: boolean,
  currentState: boolean,
) => supportsHover ? isEntering : currentState;
