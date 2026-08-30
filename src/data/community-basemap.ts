import type { GeographicCoordinate } from './physical-centres.ts';

export type CommunityBasemapPath = {
  id: string;
  coordinates: readonly GeographicCoordinate[];
};

export type CommunityBasemapLabel = {
  id: string;
  label: string;
  coordinates: GeographicCoordinate;
  offset: { x: number; y: number };
  stage: 'mid' | 'wide';
  mobile?: boolean;
};

// This is an intentionally abstracted, editable regional base layer. Paths supply
// geographic orientation only; they do not depict DA routes, catchment boundaries,
// student origins, or verified school locations.
export const COMMUNITY_WIDE_BASEMAP = {
  districtMasses: [
    { id: 'western-plain', coordinates: [{ lat: -34.02, lng: 150.63 }, { lat: -33.95, lng: 150.76 }, { lat: -33.84, lng: 150.88 }, { lat: -33.78, lng: 150.82 }, { lat: -33.84, lng: 150.66 }, { lat: -33.96, lng: 150.58 }] },
    { id: 'parramatta-ridge', coordinates: [{ lat: -33.88, lng: 150.93 }, { lat: -33.76, lng: 151.01 }, { lat: -33.72, lng: 151.14 }, { lat: -33.82, lng: 151.20 }, { lat: -33.92, lng: 151.08 }] },
    { id: 'harbour-east', coordinates: [{ lat: -33.88, lng: 151.12 }, { lat: -33.77, lng: 151.17 }, { lat: -33.75, lng: 151.31 }, { lat: -33.91, lng: 151.30 }] },
  ] satisfies readonly CommunityBasemapPath[],
  waterways: [
    { id: 'parramatta-river-context', coordinates: [{ lat: -33.76, lng: 151.00 }, { lat: -33.79, lng: 151.07 }, { lat: -33.82, lng: 151.12 }, { lat: -33.85, lng: 151.18 }, { lat: -33.88, lng: 151.24 }] },
    { id: 'southwest-creek-context', coordinates: [{ lat: -33.94, lng: 150.76 }, { lat: -33.91, lng: 150.83 }, { lat: -33.88, lng: 150.88 }] },
  ] satisfies readonly CommunityBasemapPath[],
  majorRoads: [
    { id: 'western-east-axis', coordinates: [{ lat: -33.97, lng: 150.60 }, { lat: -33.93, lng: 150.78 }, { lat: -33.90, lng: 150.97 }, { lat: -33.87, lng: 151.18 }, { lat: -33.86, lng: 151.30 }] },
    { id: 'southwest-north-axis', coordinates: [{ lat: -34.03, lng: 150.76 }, { lat: -33.97, lng: 150.86 }, { lat: -33.91, lng: 150.99 }, { lat: -33.81, lng: 151.08 }] },
    { id: 'parramatta-sydney-axis', coordinates: [{ lat: -33.83, lng: 150.98 }, { lat: -33.82, lng: 151.08 }, { lat: -33.84, lng: 151.19 }, { lat: -33.86, lng: 151.30 }] },
  ] satisfies readonly CommunityBasemapPath[],
  connectors: [
    { id: 'western-connector', coordinates: [{ lat: -33.91, lng: 150.67 }, { lat: -33.88, lng: 150.79 }, { lat: -33.85, lng: 150.91 }] },
    { id: 'fairfield-connector', coordinates: [{ lat: -33.97, lng: 150.86 }, { lat: -33.93, lng: 150.93 }, { lat: -33.90, lng: 151.02 }] },
    { id: 'northern-connector', coordinates: [{ lat: -33.89, lng: 150.99 }, { lat: -33.84, lng: 151.05 }, { lat: -33.79, lng: 151.12 }] },
    { id: 'eastern-connector', coordinates: [{ lat: -33.91, lng: 151.09 }, { lat: -33.88, lng: 151.18 }, { lat: -33.86, lng: 151.26 }] },
  ] satisfies readonly CommunityBasemapPath[],
  labels: [
    { id: 'fairfield', label: 'FAIRFIELD', coordinates: { lat: -33.872, lng: 150.953 }, offset: { x: 18, y: -14 }, stage: 'mid', mobile: true },
    { id: 'liverpool', label: 'LIVERPOOL', coordinates: { lat: -33.922, lng: 150.924 }, offset: { x: -34, y: 24 }, stage: 'mid', mobile: true },
    { id: 'parramatta', label: 'PARRAMATTA', coordinates: { lat: -33.815, lng: 151.000 }, offset: { x: 18, y: -16 }, stage: 'wide' },
    { id: 'sydney', label: 'SYDNEY', coordinates: { lat: -33.868, lng: 151.209 }, offset: { x: -16, y: -16 }, stage: 'wide' },
    { id: 'western-sydney', label: 'WESTERN SYDNEY', coordinates: { lat: -33.86, lng: 150.72 }, offset: { x: -8, y: 10 }, stage: 'wide' },
    { id: 'southwest-sydney', label: 'SOUTH-WEST SYDNEY', coordinates: { lat: -33.965, lng: 150.89 }, offset: { x: -6, y: 20 }, stage: 'wide' },
  ] satisfies readonly CommunityBasemapLabel[],
} as const;
