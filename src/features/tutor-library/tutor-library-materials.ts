const clampByte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

export function createWalnutGrainPixels(size: number) {
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const normalizedX = x / size;
    const normalizedY = y / size;
    const longGrain = Math.sin(normalizedX * Math.PI * 18 + Math.sin(normalizedY * Math.PI * 5) * 1.8) * 18;
    const fineGrain = Math.sin(normalizedX * Math.PI * 74 + normalizedY * Math.PI * 7) * 7;
    const pores = Math.sin((x * 12.9898 + y * 78.233) * .17) * 4;
    const tonalDrift = Math.sin(normalizedY * Math.PI * 3.2) * 8;
    const level = clampByte(174 + longGrain + fineGrain + pores + tonalDrift);
    const index = (y * size + x) * 4;
    pixels[index] = level;
    pixels[index + 1] = clampByte(level - 4);
    pixels[index + 2] = clampByte(level - 10);
    pixels[index + 3] = 255;
  }
  return pixels;
}
