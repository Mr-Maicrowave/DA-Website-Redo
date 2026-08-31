import { RoundedBox } from '@react-three/drei';
import { Vector2 } from 'three';
import type { CatalogueTutor } from '../../data/teacherCatalogue';
import type { TutorBookEdition } from './tutor-library-data';
import { createCompleteShelfPresentation } from './complete-shelf-presentation';
import { TutorBookCover, TutorBookFoil, useBookMaterialMaps } from './TutorBookCover';

/** The single closed-book physical specification used by shelf and selected rigs. */
export const TUTOR_BOOK_SHELL = Object.freeze({
  width: 1.02,
  height: 1.58,
  pageDepth: .26,
  board: .032,
  boardRadius: .0045,
  spineBoardThickness: .014,
  spineWidth: .082,
  pageInsetWidth: .074,
  pageInsetHeight: .068,
});

export const TUTOR_BOOK_CLOSED_DEPTH = TUTOR_BOOK_SHELL.pageDepth + TUTOR_BOOK_SHELL.board * 2;

/**
 * Lightweight canonical shell: no leaves or interior canvases are mounted here.
 * The selected imperative rig receives the same dimensions and presentation data.
 */
export function TutorBookShell({ tutor, edition, faceOut = false }: { tutor: CatalogueTutor; edition: TutorBookEdition; faceOut?: boolean }) {
  const materials = useBookMaterialMaps();
  const presentation = createCompleteShelfPresentation(tutor, edition);
  const { width, height, board, boardRadius, spineBoardThickness } = TUTOR_BOOK_SHELL;
  const spineX = -width / 2 - spineBoardThickness * .35;
  const cloth = presentation.colours.cloth;
  const pageWidth = width - TUTOR_BOOK_SHELL.pageInsetWidth;
  const pageHeight = height - TUTOR_BOOK_SHELL.pageInsetHeight;

  return <group name={`tutor-book-shell-${edition.id}`}>
    <RoundedBox name="tutor-book-back-board" args={[width, height, board]} position={[0, 0, -TUTOR_BOOK_SHELL.pageDepth / 2 - board / 2]} radius={boardRadius} smoothness={2} castShadow receiveShadow>
      <meshPhysicalMaterial color={cloth} emissive={cloth} emissiveIntensity={.055} normalMap={materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={materials.clothRoughness} bumpMap={materials.clothRoughness} bumpScale={.008} roughness={.96} metalness={.02} sheen={.3} sheenRoughness={.74} />
    </RoundedBox>
    <mesh name="tutor-book-page-block" castShadow receiveShadow>
      <boxGeometry args={[pageWidth, pageHeight, TUTOR_BOOK_SHELL.pageDepth]} />
      <meshPhysicalMaterial color={presentation.colours.paper} map={materials.paper} roughnessMap={materials.paperBump} bumpMap={materials.paperBump} bumpScale={.012} roughness={.94} />
    </mesh>
    <RoundedBox name="tutor-book-front-board" args={[width, height, board]} position={[0, 0, TUTOR_BOOK_SHELL.pageDepth / 2 + board / 2]} radius={boardRadius} smoothness={2} castShadow receiveShadow>
      <meshPhysicalMaterial color={cloth} emissive={cloth} emissiveIntensity={.055} normalMap={materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={materials.clothRoughness} bumpMap={materials.clothRoughness} bumpScale={.008} roughness={.96} metalness={.02} sheen={.3} sheenRoughness={.74} />
    </RoundedBox>
    <RoundedBox name="tutor-book-spine" args={[spineBoardThickness, height - .012, TUTOR_BOOK_CLOSED_DEPTH]} position={[spineX, 0, 0]} radius={.0015} smoothness={1} castShadow receiveShadow>
      <meshPhysicalMaterial color={cloth} normalMap={materials.clothNormal} normalScale={new Vector2(.12, .12)} roughnessMap={materials.clothRoughness} bumpMap={materials.clothRoughness} bumpScale={.008} roughness={.96} metalness={.02} sheen={.3} sheenRoughness={.74} />
    </RoundedBox>
    <TutorBookCover tutor={tutor} edition={edition} mode="spine" width={TUTOR_BOOK_CLOSED_DEPTH - .018} height={height - .075} position={[spineX - spineBoardThickness * .505, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible />
    <TutorBookFoil tutor={tutor} edition={edition} mode="spine" width={TUTOR_BOOK_CLOSED_DEPTH - .014} height={height - .04} position={[spineX - spineBoardThickness * .56, 0, 0]} rotation={[0, -Math.PI / 2, 0]} visible />
    {faceOut ? <group name="tutor-book-cover-art">
      <TutorBookCover tutor={tutor} edition={edition} mode="cover" width={width - .007} height={height - .007} z={TUTOR_BOOK_SHELL.pageDepth / 2 + board + .001} visible />
      <TutorBookFoil tutor={tutor} edition={edition} mode="cover" width={width - .007} height={height - .007} z={TUTOR_BOOK_SHELL.pageDepth / 2 + board + .003} visible />
    </group> : null}
  </group>;
}
