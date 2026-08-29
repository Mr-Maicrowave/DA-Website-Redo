import assert from "node:assert/strict";
import test from "node:test";

const seam = await import("../../../public/dev/complete-shelf-rig/complete-shelf-presentation-seam.js");

function createColourMaterial() {
  return { color: { values: [], set(value) { this.values.push(value); } } };
}

test("applies supplied presentation canvases and colours to existing material slots, then refreshes on portrait readiness", () => {
  const cover = new EventTarget();
  const sources = {
    cover,
    coverFoil: new EventTarget(),
    spine: new EventTarget(),
    spineFoil: new EventTarget(),
    back: new EventTarget(),
    backFoil: new EventTarget(),
    endpaper: new EventTarget(),
    interiors: Array.from({ length: 6 }, () => new EventTarget()),
  };
  const texture = () => ({ version: 0, set needsUpdate(value) { if (value) this.version += 1; } });
  const textures = { cover: texture(), coverFoil: texture(), spine: texture(), spineFoil: texture(), back: texture(), backFoil: texture(), endpaper: texture(), interiors: Array.from({ length: 6 }, texture) };
  const materials = {
    cloth: [createColourMaterial()],
    foil: [createColourMaterial()],
    paper: [createColourMaterial(), createColourMaterial()],
    edge: [createColourMaterial()],
  };

  const applied = seam.applyCompleteShelfPresentation({
    presentation: { tutorId: "T003", sources, colours: { cloth: "#1b3858", foil: "#d5b369", paper: "#f2eadc", edge: "#e5d9c7" } },
    textures,
    materials,
  });

  assert.equal(applied, true);
  assert.equal(textures.cover.image, cover);
  assert.equal(textures.interiors[5].image, sources.interiors[5]);
  assert.deepEqual(materials.cloth[0].color.values, ["#1b3858"]);
  assert.deepEqual(materials.foil[0].color.values, ["#d5b369"]);
  assert.deepEqual(materials.paper[0].color.values, ["#f2eadc"]);
  assert.deepEqual(materials.edge[0].color.values, ["#e5d9c7"]);

  const initialVersion = textures.cover.version;
  cover.dispatchEvent(new Event(seam.PRESENTATION_UPDATE_EVENT));
  assert.equal(textures.cover.version, initialVersion + 1);
});
