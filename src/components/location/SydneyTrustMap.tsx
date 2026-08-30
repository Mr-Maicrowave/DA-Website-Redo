import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, MapPin, School } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrustMapSchool {
    name: string;
    type: string;
    distance?: string;
    logo?: string;
}

interface SydneyTrustMapProps {
    focusSuburb?: string;
    schools: TrustMapSchool[];
    className?: string;
}

interface GeoPoint {
    lat: number;
    lng: number;
}

interface Tile {
    key: string;
    left: number;
    top: number;
    url: string;
}

const representedSchoolCount = 122;
const tileSize = 256;
const centrePoint = { lat: -33.8820986, lng: 150.9329945 };

const schoolCoordinates: Record<string, GeoPoint> = {
    'Cabramatta High School': { lat: -33.9010819, lng: 150.9289525 },
    'Cabramatta Public School': { lat: -33.8957592, lng: 150.9426085 },
    'Cabramatta West Public School': { lat: -33.8976059, lng: 150.9230663 },
    'Canley Heights Public School': { lat: -33.8850959, lng: 150.9225287 },
    'Canley Vale High School': { lat: -33.8845067, lng: 150.9512471 },
    'Canley Vale Public School': { lat: -33.8868471, lng: 150.9376943 },
    'Fairfield High School': { lat: -33.8651149, lng: 150.9579021 },
    'Fairfield Public School': { lat: -33.8667838, lng: 150.955318 },
    'Fairfield West Public School': { lat: -33.8683991, lng: 150.9246694 },
    'Fairfield Intensive English Centre': { lat: -33.869879, lng: 150.957081 },
    'Fairvale High School': { lat: -33.8735796, lng: 150.9294389 },
    'Freeman Catholic College': { lat: -33.8876813, lng: 150.8636544 },
    'Holy Spirit Catholic Primary Smithfield': { lat: -33.853935, lng: 150.93644 },
    'John Edmondson High School': { lat: -33.9462893, lng: 150.8431667 },
    'Lansvale East Public School': { lat: -33.8980751, lng: 150.9642667 },
    'Lansvale Public School': { lat: -33.8907719, lng: 150.9535179 },
    'Mount Pritchard East Public': { lat: -33.9049817, lng: 150.912178 },
    'Our Lady of the Rosary Primary': { lat: -33.8726631, lng: 150.9588957 },
    'Patrician Brothers College': { lat: -33.8728424, lng: 150.9631924 },
    'Sacred Heart Primary Cabramatta': { lat: -33.89407, lng: 150.93673 },
    'Smithfield Public School': { lat: -33.8535699, lng: 150.9334587 },
    'Smithfield West Public School': { lat: -33.8573518, lng: 150.917869 },
    "St Gertrude's Primary Canley Vale": { lat: -33.88638, lng: 150.93608 },
    'St Johns Park High School': { lat: -33.873125, lng: 150.8910447 },
};

const schoolLogoMap: Record<string, string> = {
    'Cabramatta High School': '/images/schools/cabramatta-high.png',
    'Canley Heights Public School': '/images/schools/canley-heights-public.png',
    'Canley Vale High School': '/images/schools/canley-vale-high-school.png',
    'Fairfield High School': '/images/schools/fairfield-high.png',
    'Fairvale High School': '/images/schools/fairvale-high-school.png',
    'Freeman Catholic College': '/images/schools/freeman-catholic-college-crest.png',
    'Lansvale Public School': '/images/schools/lansvale-public.png',
    'Patrician Brothers College': '/images/schools/patrician-brothers-fairfield.png',
    'St Johns Park High School': '/images/schools/st-johns-park-high-school.png',
};

function initials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function project({ lat, lng }: GeoPoint, zoom: number) {
    const scale = tileSize * 2 ** zoom;
    const sin = Math.sin((lat * Math.PI) / 180);
    return {
        x: ((lng + 180) / 360) * scale,
        y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
    };
}

function useElementSize<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [size, setSize] = useState({ width: 760, height: 640 });

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const update = () => {
            const rect = node.getBoundingClientRect();
            setSize({
                width: Math.max(1, Math.round(rect.width)),
                height: Math.max(1, Math.round(rect.height)),
            });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return [ref, size] as const;
}

function buildTiles(size: { width: number; height: number }, zoom: number) {
    const centerPixel = project(centrePoint, zoom);
    const topLeft = {
        x: centerPixel.x - size.width / 2,
        y: centerPixel.y - size.height / 2,
    };
    const tileMinX = Math.floor(topLeft.x / tileSize);
    const tileMaxX = Math.floor((topLeft.x + size.width) / tileSize);
    const tileMinY = Math.floor(topLeft.y / tileSize);
    const tileMaxY = Math.floor((topLeft.y + size.height) / tileSize);
    const tileCount = 2 ** zoom;
    const tiles: Tile[] = [];

    for (let x = tileMinX; x <= tileMaxX; x += 1) {
        for (let y = tileMinY; y <= tileMaxY; y += 1) {
            if (y < 0 || y >= tileCount) continue;
            const wrappedX = ((x % tileCount) + tileCount) % tileCount;
            tiles.push({
                key: `${zoom}-${x}-${y}`,
                left: Math.round(x * tileSize - topLeft.x),
                top: Math.round(y * tileSize - topLeft.y),
                url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
            });
        }
    }

    return { tiles, topLeft };
}

const SydneyTrustMap = ({ focusSuburb = 'Sydney', schools, className }: SydneyTrustMapProps) => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [mapRef, mapSize] = useElementSize<HTMLDivElement>();
    const [isVisible, setIsVisible] = useState(false);
    const [count, setCount] = useState(0);
    const zoom = mapSize.width < 640 ? 12 : 13;

    const featuredSchools = useMemo(() => schools.slice(0, 6), [schools]);
    const mappedSchools = useMemo(
        () =>
            schools
                .map((school) => ({ ...school, point: schoolCoordinates[school.name] }))
                .filter((school): school is TrustMapSchool & { point: GeoPoint } => Boolean(school.point)),
        [schools]
    );
    const { tiles, topLeft } = useMemo(() => buildTiles(mapSize, zoom), [mapSize, zoom]);
    const centrePixel = project(centrePoint, zoom);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.28 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            setCount(representedSchoolCount);
            return;
        }

        let frame = 0;
        let start: number | null = null;
        const duration = 1400;

        const tick = (time: number) => {
            if (start === null) start = time;
            const progress = Math.min(1, (time - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * representedSchoolCount));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [isVisible]);

    return (
        <section
            ref={sectionRef}
            className={cn('bg-brand-ivory py-16 sm:py-20 lg:py-24', className)}
            aria-labelledby="sydney-trust-map-title"
        >
            <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,.75fr)] lg:px-8">
                <div
                    ref={mapRef}
                    className="relative min-h-[500px] overflow-hidden rounded-lg border border-brand-gold/20 bg-[#dfe7f0] shadow-[0_34px_90px_-48px_rgba(10,27,52,.7)] sm:min-h-[620px] lg:min-h-[690px]"
                    role="img"
                    aria-label="Map of the Canley Heights area showing DA Tuition and nearby local schools"
                >
                    <div className="absolute inset-0">
                        {tiles.map((tile) => (
                            <img
                                key={tile.key}
                                src={tile.url}
                                alt=""
                                className="absolute h-64 w-64 select-none"
                                draggable={false}
                                loading="lazy"
                                style={{ left: tile.left, top: tile.top }}
                            />
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,244,238,.08),rgba(10,27,52,.04)),radial-gradient(circle_at_46%_53%,rgba(212,175,55,.18),transparent_31%)]" />

                    {mappedSchools.map((school, index) => {
                        const marker = project(school.point, zoom);
                        return (
                            <div
                                key={school.name}
                                className={cn(
                                    'group absolute z-20 -translate-x-1/2 -translate-y-full transition duration-500 ease-out',
                                    isVisible ? 'scale-100 opacity-100' : 'translate-y-[-18px] scale-75 opacity-0'
                                )}
                                title={school.name}
                                style={{
                                    left: marker.x - topLeft.x,
                                    top: marker.y - topLeft.y,
                                    transitionDelay: `${120 + index * 85}ms`,
                                }}
                            >
                                <div className="relative">
                                    <div className="grid h-8 w-8 place-items-center rounded-full rounded-bl-sm border-2 border-white bg-brand-blue text-white shadow-[0_12px_22px_-12px_rgba(10,27,52,.85)] rotate-[-45deg]">
                                        <School className="h-3.5 w-3.5 rotate-45" aria-hidden="true" />
                                    </div>
                                    <div className="pointer-events-none absolute left-1/2 top-9 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-brand-navy/10 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-navy opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                                        {school.name}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div
                        className="absolute z-30 -translate-x-1/2 -translate-y-full"
                        style={{ left: centrePixel.x - topLeft.x, top: centrePixel.y - topLeft.y }}
                    >
                        <div className="grid h-16 w-16 place-items-center rounded-full rounded-bl-md border-[3px] border-white bg-brand-navy text-white shadow-[0_20px_36px_-16px_rgba(10,27,52,.9)] rotate-[-45deg]">
                            <MapPin className="h-7 w-7 rotate-45 text-brand-lightGold" aria-hidden="true" />
                            <span className="sr-only">DA Tuition Canley Heights centre</span>
                        </div>
                        <div className="mt-2 rounded-md border border-brand-navy/10 bg-white/95 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-navy shadow-sm">
                            DA Tuition
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-30 grid gap-1 rounded-lg border border-white/60 bg-white/90 p-4 backdrop-blur sm:left-5 sm:right-auto sm:w-[min(390px,calc(100%-40px))]">
                        <p className="text-sm font-semibold text-brand-navy">Canley Heights centre, surrounded by local schools</p>
                        <p className="text-xs leading-5 text-brand-midnight/65">
                            The pins show real school locations around the centre. Map data © OpenStreetMap contributors.
                        </p>
                    </div>

                    <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 z-30 rounded bg-white/85 px-2 py-1 text-[10px] text-brand-midnight/65"
                    >
                        © OpenStreetMap
                    </a>
                </div>

                <div>
                    <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">Where our students come from</div>
                    <h2 id="sydney-trust-map-title" className="font-serif text-4xl font-semibold leading-tight tracking-normal text-brand-navy sm:text-5xl">
                        One centre, <em className="text-brand-gold">trusted</em> right across Sydney.
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-brand-midnight/75">
                        DA Tuition is based in Canley Heights, but the community reaches well beyond one suburb. Families from {focusSuburb} and across Sydney's west choose the same centre because the teaching, care, and results are worth the trip.
                    </p>

                    <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-lg border border-brand-gold/20 bg-white sm:grid-cols-3">
                        <div className="border-b border-brand-gold/15 p-5 sm:border-b-0 sm:border-r">
                            <div className="font-serif text-4xl font-semibold text-brand-navy">{count}+</div>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-midnight/55 sm:tracking-[0.14em]">schools represented</p>
                        </div>
                        <div className="border-b border-brand-gold/15 p-5 sm:border-b-0 sm:border-r">
                            <div className="font-serif text-4xl font-semibold text-brand-navy">1</div>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-midnight/55 sm:tracking-[0.14em]">physical centre</p>
                        </div>
                        <div className="p-5">
                            <div className="font-serif text-4xl font-semibold text-brand-navy">20+</div>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-midnight/55 sm:tracking-[0.14em]">years local</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3" aria-label="Nearby schools represented at DA Tuition">
                        {featuredSchools.map((school) => {
                            const logo = school.logo ?? schoolLogoMap[school.name];
                            return (
                                <div key={school.name} className="flex items-center gap-4 border-b border-brand-gold/15 pb-3 last:border-b-0">
                                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-brand-gold/20 bg-white">
                                        {logo ? (
                                            <img src={logo} alt="" className="h-9 w-9 object-contain" loading="lazy" />
                                        ) : (
                                            <span className="text-xs font-bold text-brand-navy/70">{initials(school.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-brand-navy">{school.name}</p>
                                        <p className="text-sm text-brand-midnight/60">
                                            {school.type}
                                            {school.distance ? ` - ${school.distance} from our centre` : ''}
                                        </p>
                                    </div>
                                    <School className="hidden h-5 w-5 text-brand-gold sm:block" aria-hidden="true" />
                                </div>
                            );
                        })}
                    </div>

                    <Button asChild size="lg" className="mt-8 bg-brand-navy text-white hover:bg-brand-navy/90">
                        <Link to="/book-interview">
                            Book a free assessment
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default SydneyTrustMap;
