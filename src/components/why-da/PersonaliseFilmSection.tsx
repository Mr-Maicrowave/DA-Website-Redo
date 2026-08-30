import type { CSSProperties } from 'react';
import {
  heroPersonalisationPhoto,
  personalisationFrames,
  type PersonalisationFrame,
  type PersonalisationPhoto,
} from './personalisationPhotos';
import './PersonaliseFilmSection.css';

function ImageOrPlaceholder({ photo, label }: { photo: PersonalisationPhoto; label: string }) {
  const style = { '--film-position-desktop':photo.objectPositionDesktop, '--film-position-tablet':photo.objectPositionTablet, '--film-position-mobile':photo.objectPositionMobile } as CSSProperties;
  return <div className="film-image" style={style}>{photo.src ? <img src={photo.src} alt={photo.alt} /> : <span>{label}</span>}<i aria-hidden="true" /></div>;
}

function FilmSprockets() { return <><span className="film-sprockets film-sprockets--top" aria-hidden="true"/><span className="film-sprockets film-sprockets--bottom" aria-hidden="true"/></>; }
function FilmMarkings({ number }: { number:string }) { return <div className="film-markings" aria-hidden="true"><span>DA FILM 400</span><b>{number}</b><span>35MM</span></div>; }

export function FilmFrame({ frame, hero=false }: { frame:PersonalisationFrame | PersonalisationPhoto; hero?:boolean }) {
  const story = 'id' in frame ? frame : null;
  return <article className={`film-frame${hero?' film-frame--hero':''}`} data-film-frame={story?.id ?? 'hero'} data-motion={hero?'personalise-hero-film':'personalise-frame'}><FilmSprockets/><FilmMarkings number={story?.number ?? '43'}/><ImageOrPlaceholder photo={frame} label={hero?'MAIN PHOTO PENDING':'PHOTO PENDING'}/>{story && <div className="film-frame__copy"><span>{story.number}</span><div><h3>{story.title}</h3><p>{story.body}</p></div><i aria-hidden="true"/></div>}</article>;
}

export function FilmStrip() { return <div className="film-strip" data-motion="personalise-film-strip">{personalisationFrames.map(frame=><FilmFrame frame={frame} key={frame.id}/>) }<span className="film-strip__playhead" aria-hidden="true"/><span className="film-strip__light" aria-hidden="true"/></div>; }

export default function PersonaliseFilmSection() {
  return <section id="why-da-personalise" className="why-da-personalise why-da-personalise--film" data-testid="why-da-personalise" aria-labelledby="why-da-personalise-title">
    <div className="personalise-film__top"><header data-motion="personalise-intro"><div className="why-da-section-heading"><span>02</span><h2 id="why-da-personalise-title">WE PERSONALISE</h2></div><h3>Now that we<br/>know, we build<br/>it <em>around them.</em></h3><span/><p>Every child learns differently.<br/>We create a learning experience<br/>that fits them perfectly.</p></header><FilmFrame frame={heroPersonalisationPhoto} hero/></div>
    <FilmStrip/>
  </section>;
}
