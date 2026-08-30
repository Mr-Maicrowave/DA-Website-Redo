export const PRESENTATION_UPDATE_EVENT = 'complete-shelf-presentation-update';

const setMaterialColours = (materials, value, softlyLiftFoil = false) => {
  (materials ?? []).forEach((material) => {
    material?.color?.set(value);
    if (softlyLiftFoil && material?.emissive) {
      material.emissive.set(value);
      material.emissiveIntensity = 0.28;
    }
  });
};

export function applyCompleteShelfPresentation({ presentation, textures, materials, onDispose }) {
  if (!presentation) return false;
  const { sources = {}, colours = {} } = presentation;
  const applyTexture = (texture, source) => {
    if (!texture || !source) return;
    texture.image = source;
    texture.needsUpdate = true;
    if (typeof source.addEventListener === 'function') {
      const refresh = () => { texture.needsUpdate = true; };
      source.addEventListener(PRESENTATION_UPDATE_EVENT, refresh);
      onDispose?.(() => source.removeEventListener(PRESENTATION_UPDATE_EVENT, refresh));
    }
  };

  applyTexture(textures.cover, sources.cover);
  applyTexture(textures.coverFoil, sources.coverFoil);
  applyTexture(textures.spine, sources.spine);
  applyTexture(textures.spineFoil, sources.spineFoil);
  applyTexture(textures.back, sources.back);
  applyTexture(textures.backFoil, sources.backFoil);
  applyTexture(textures.openingEndpaper, sources.openingEndpaper);
  applyTexture(textures.frontEndpaper, sources.frontEndpaper);
  (sources.interiors ?? []).slice(0, textures.interiors?.length ?? 0).forEach((source, index) => applyTexture(textures.interiors[index], source));
  if (colours.cloth) setMaterialColours(materials.cloth, colours.cloth);
  if (colours.foil) setMaterialColours(materials.foil, colours.foil, true);
  if (colours.paper) setMaterialColours(materials.paper, colours.paper);
  if (colours.edge) setMaterialColours(materials.edge, colours.edge);
  return true;
}
