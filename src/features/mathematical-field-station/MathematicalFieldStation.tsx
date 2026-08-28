import { useEffect, useRef, useState } from 'react';
import './mathematical-field-station.css';

const STATION_ENTRY = '/interactive/mathematical-field-station/index.html';
const STATION_ASSET_ROOT = '/interactive/mathematical-field-station';

function loadScript(source: string, marker: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-field-station-script="${marker}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = source;
    script.async = false;
    script.dataset.fieldStationScript = marker;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load ${source}`)), { once: true });
    document.body.appendChild(script);
  });
}

function scopeStationStyles(styles: string) {
  return styles
    .replace(/html\{/g, '.field-station-native{')
    .replace(/body,body \*/g, '.field-station-native,.field-station-native *')
    .replace(/body\{/g, '.field-station-native{');
}

export function MathematicalFieldStation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    const style = document.createElement('style');
    style.dataset.fieldStationNative = 'true';

    async function mountStation() {
      try {
        const response = await fetch(STATION_ENTRY);
        if (!response.ok) throw new Error(`Unable to load The Sightings (${response.status})`);

        const source = new DOMParser().parseFromString(await response.text(), 'text/html');
        const station = source.querySelector('#station');
        const stationStyles = source.querySelector('style')?.textContent;
        if (!station || !stationStyles) throw new Error('The Sightings source is incomplete');
        if (cancelled) return;

        station.querySelectorAll<HTMLElement>('[src], [href]').forEach((element) => {
          for (const attribute of ['src', 'href'] as const) {
            const value = element.getAttribute(attribute);
            if (value?.startsWith('assets/')) element.setAttribute(attribute, `${STATION_ASSET_ROOT}/${value}`);
          }
        });

        style.textContent = scopeStationStyles(stationStyles);
        document.head.appendChild(style);
        mount.innerHTML = station.outerHTML;

        await loadScript(`${STATION_ASSET_ROOT}/assets/field-station-model.js`, 'model');
        await loadScript(`${STATION_ASSET_ROOT}/vendor/katex/katex.min.js`, 'katex');
        await loadScript(`${STATION_ASSET_ROOT}/engine.js`, 'engine');
      } catch {
        if (!cancelled) setHasError(true);
      }
    }

    void mountStation();
    return () => {
      cancelled = true;
      style.remove();
      mount.replaceChildren();
    };
  }, []);

  return (
    <section id="mathematical-field-station" className="field-station-native min-h-[100dvh] bg-[#06141c]" aria-labelledby="mathematical-field-station-heading">
      <h2 id="mathematical-field-station-heading" className="sr-only">The Sightings: Interactive Mathematical Field Station</h2>
      <div ref={mountRef} className="field-station-native__mount min-h-[100dvh]" />
      {hasError ? <p className="field-station-native__fallback">The interactive field station could not be loaded.</p> : null}
    </section>
  );
}
