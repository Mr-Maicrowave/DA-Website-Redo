export const isMathsAmbientPreview = (search: string): boolean => {
  const values = new URLSearchParams(search).getAll('motionPreview');
  return values.length === 1 && values[0] === '1';
};
