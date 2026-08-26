export interface DerivativeSample {
  x: number;
  y: number;
  derivative: number;
}

export const sampleDerivativeModel = (sampleCount: number): DerivativeSample[] => {
  if (!Number.isInteger(sampleCount) || sampleCount < 2) {
    throw new Error('Derivative model requires at least two samples.');
  }

  const xMinimum = -1.6;
  const xMaximum = 1.6;
  const step = (xMaximum - xMinimum) / (sampleCount - 1);

  return Array.from({ length: sampleCount }, (_, index) => {
    const x = index === sampleCount - 1 ? xMaximum : xMinimum + index * step;
    return {
      x,
      y: x ** 3 - 3 * x,
      derivative: 3 * x ** 2 - 3,
    };
  });
};
