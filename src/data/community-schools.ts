/**
 * Community reach — school origin points shown on the Wayfinder locations map.
 *
 * All 80 rows below are currently placeholder visual texture (`verified: false`) and do not
 * represent verified DA Tuition student-origin data. The card component must never render a
 * school count derived from these rows — only from rows with `verified: true`. Replace rows
 * one-for-one with real, verified data as it becomes available; the shape below is designed
 * so that swap requires no changes to the map or card components.
 */

export type CommunitySchool = {
  id: string;
  name: string | null;
  suburb: string;
  coordinates: { lat: number; lng: number };
  verified: boolean;
};

// 52 South-West / Fairfield-Liverpool points, 18 broader Western Sydney points, and 10 Sydney-wide
// points. Coordinates are kept as explicit records so verified data can replace rows one-for-one.
export const COMMUNITY_SCHOOLS: readonly CommunitySchool[] = [
  { id: 'school-001', name: null, suburb: 'Canley Heights', coordinates: { lat: -33.882, lng: 150.926 }, verified: false },
  { id: 'school-002', name: null, suburb: 'Canley Vale', coordinates: { lat: -33.887, lng: 150.948 }, verified: false },
  { id: 'school-003', name: null, suburb: 'Fairfield', coordinates: { lat: -33.872, lng: 150.953 }, verified: false },
  { id: 'school-004', name: null, suburb: 'Fairfield', coordinates: { lat: -33.868, lng: 150.961 }, verified: false },
  { id: 'school-005', name: null, suburb: 'Cabramatta', coordinates: { lat: -33.900, lng: 150.935 }, verified: false },
  { id: 'school-006', name: null, suburb: 'Cabramatta', coordinates: { lat: -33.897, lng: 150.947 }, verified: false },
  { id: 'school-007', name: null, suburb: 'Lansvale', coordinates: { lat: -33.900, lng: 150.949 }, verified: false },
  { id: 'school-008', name: null, suburb: 'Lansvale', coordinates: { lat: -33.893, lng: 150.958 }, verified: false },
  { id: 'school-009', name: null, suburb: 'Smithfield', coordinates: { lat: -33.855, lng: 150.932 }, verified: false },
  { id: 'school-010', name: null, suburb: 'Smithfield', coordinates: { lat: -33.851, lng: 150.940 }, verified: false },
  { id: 'school-011', name: null, suburb: 'Wetherill Park', coordinates: { lat: -33.846, lng: 150.896 }, verified: false },
  { id: 'school-012', name: null, suburb: 'Wetherill Park', coordinates: { lat: -33.852, lng: 150.903 }, verified: false },
  { id: 'school-013', name: null, suburb: 'Wakeley', coordinates: { lat: -33.854, lng: 150.918 }, verified: false },
  { id: 'school-014', name: null, suburb: 'Wakeley', coordinates: { lat: -33.860, lng: 150.913 }, verified: false },
  { id: 'school-015', name: null, suburb: 'St Johns Park', coordinates: { lat: -33.880, lng: 150.899 }, verified: false },
  { id: 'school-016', name: null, suburb: 'St Johns Park', coordinates: { lat: -33.886, lng: 150.905 }, verified: false },
  { id: 'school-017', name: null, suburb: 'Bossley Park', coordinates: { lat: -33.862, lng: 150.881 }, verified: false },
  { id: 'school-018', name: null, suburb: 'Bossley Park', coordinates: { lat: -33.867, lng: 150.889 }, verified: false },
  { id: 'school-019', name: null, suburb: 'Bonnyrigg', coordinates: { lat: -33.892, lng: 150.889 }, verified: false },
  { id: 'school-020', name: null, suburb: 'Bonnyrigg', coordinates: { lat: -33.900, lng: 150.896 }, verified: false },
  { id: 'school-021', name: null, suburb: 'Greenfield Park', coordinates: { lat: -33.875, lng: 150.896 }, verified: false },
  { id: 'school-022', name: null, suburb: 'Greenfield Park', coordinates: { lat: -33.879, lng: 150.905 }, verified: false },
  { id: 'school-023', name: null, suburb: 'Mount Pritchard', coordinates: { lat: -33.903, lng: 150.904 }, verified: false },
  { id: 'school-024', name: null, suburb: 'Mount Pritchard', coordinates: { lat: -33.908, lng: 150.913 }, verified: false },
  { id: 'school-025', name: null, suburb: 'Prairiewood', coordinates: { lat: -33.865, lng: 150.907 }, verified: false },
  { id: 'school-026', name: null, suburb: 'Prairiewood', coordinates: { lat: -33.870, lng: 150.915 }, verified: false },
  { id: 'school-027', name: null, suburb: 'Edensor Park', coordinates: { lat: -33.876, lng: 150.873 }, verified: false },
  { id: 'school-028', name: null, suburb: 'Edensor Park', coordinates: { lat: -33.883, lng: 150.882 }, verified: false },
  { id: 'school-029', name: null, suburb: 'Abbotsbury', coordinates: { lat: -33.867, lng: 150.864 }, verified: false },
  { id: 'school-030', name: null, suburb: 'Abbotsbury', coordinates: { lat: -33.875, lng: 150.870 }, verified: false },
  { id: 'school-031', name: null, suburb: 'Cecil Hills', coordinates: { lat: -33.889, lng: 150.858 }, verified: false },
  { id: 'school-032', name: null, suburb: 'Cecil Hills', coordinates: { lat: -33.898, lng: 150.865 }, verified: false },
  { id: 'school-033', name: null, suburb: 'Hoxton Park', coordinates: { lat: -33.924, lng: 150.853 }, verified: false },
  { id: 'school-034', name: null, suburb: 'Hoxton Park', coordinates: { lat: -33.917, lng: 150.864 }, verified: false },
  { id: 'school-035', name: null, suburb: 'Hinchinbrook', coordinates: { lat: -33.917, lng: 150.845 }, verified: false },
  { id: 'school-036', name: null, suburb: 'Hinchinbrook', coordinates: { lat: -33.908, lng: 150.852 }, verified: false },
  { id: 'school-037', name: null, suburb: 'Liverpool', coordinates: { lat: -33.922, lng: 150.924 }, verified: false },
  { id: 'school-038', name: null, suburb: 'Liverpool', coordinates: { lat: -33.930, lng: 150.930 }, verified: false },
  { id: 'school-039', name: null, suburb: 'Liverpool', coordinates: { lat: -33.918, lng: 150.936 }, verified: false },
  { id: 'school-040', name: null, suburb: 'Casula', coordinates: { lat: -33.949, lng: 150.909 }, verified: false },
  { id: 'school-041', name: null, suburb: 'Casula', coordinates: { lat: -33.956, lng: 150.919 }, verified: false },
  { id: 'school-042', name: null, suburb: 'Moorebank', coordinates: { lat: -33.942, lng: 150.952 }, verified: false },
  { id: 'school-043', name: null, suburb: 'Moorebank', coordinates: { lat: -33.949, lng: 150.960 }, verified: false },
  { id: 'school-044', name: null, suburb: 'West Hoxton', coordinates: { lat: -33.932, lng: 150.831 }, verified: false },
  { id: 'school-045', name: null, suburb: 'Austral', coordinates: { lat: -33.930, lng: 150.810 }, verified: false },
  { id: 'school-046', name: null, suburb: 'Leppington', coordinates: { lat: -33.966, lng: 150.829 }, verified: false },
  { id: 'school-047', name: null, suburb: 'Prestons', coordinates: { lat: -33.941, lng: 150.873 }, verified: false },
  { id: 'school-048', name: null, suburb: 'Miller', coordinates: { lat: -33.922, lng: 150.884 }, verified: false },
  { id: 'school-049', name: null, suburb: 'Sadlier', coordinates: { lat: -33.917, lng: 150.891 }, verified: false },
  { id: 'school-050', name: null, suburb: 'Heckenberg', coordinates: { lat: -33.911, lng: 150.897 }, verified: false },
  { id: 'school-051', name: null, suburb: 'Warwick Farm', coordinates: { lat: -33.914, lng: 150.936 }, verified: false },
  { id: 'school-052', name: null, suburb: 'Chipping Norton', coordinates: { lat: -33.922, lng: 150.958 }, verified: false },
  { id: 'school-053', name: null, suburb: 'Parramatta', coordinates: { lat: -33.815, lng: 151.000 }, verified: false },
  { id: 'school-054', name: null, suburb: 'Parramatta', coordinates: { lat: -33.809, lng: 151.008 }, verified: false },
  { id: 'school-055', name: null, suburb: 'Merrylands', coordinates: { lat: -33.833, lng: 150.988 }, verified: false },
  { id: 'school-056', name: null, suburb: 'Merrylands', coordinates: { lat: -33.840, lng: 150.995 }, verified: false },
  { id: 'school-057', name: null, suburb: 'Guildford', coordinates: { lat: -33.850, lng: 150.984 }, verified: false },
  { id: 'school-058', name: null, suburb: 'Guildford', coordinates: { lat: -33.856, lng: 150.992 }, verified: false },
  { id: 'school-059', name: null, suburb: 'Granville', coordinates: { lat: -33.837, lng: 151.009 }, verified: false },
  { id: 'school-060', name: null, suburb: 'Auburn', coordinates: { lat: -33.850, lng: 151.031 }, verified: false },
  { id: 'school-061', name: null, suburb: 'Auburn', coordinates: { lat: -33.856, lng: 151.039 }, verified: false },
  { id: 'school-062', name: null, suburb: 'Blacktown', coordinates: { lat: -33.770, lng: 150.905 }, verified: false },
  { id: 'school-063', name: null, suburb: 'Blacktown', coordinates: { lat: -33.762, lng: 150.914 }, verified: false },
  { id: 'school-064', name: null, suburb: 'Seven Hills', coordinates: { lat: -33.778, lng: 150.935 }, verified: false },
  { id: 'school-065', name: null, suburb: 'Wentworthville', coordinates: { lat: -33.807, lng: 150.969 }, verified: false },
  { id: 'school-066', name: null, suburb: 'Greystanes', coordinates: { lat: -33.824, lng: 150.952 }, verified: false },
  { id: 'school-067', name: null, suburb: 'Chester Hill', coordinates: { lat: -33.879, lng: 150.996 }, verified: false },
  { id: 'school-068', name: null, suburb: 'Bankstown', coordinates: { lat: -33.919, lng: 151.032 }, verified: false },
  { id: 'school-069', name: null, suburb: 'Regents Park', coordinates: { lat: -33.882, lng: 151.021 }, verified: false },
  { id: 'school-070', name: null, suburb: 'Lidcombe', coordinates: { lat: -33.865, lng: 151.047 }, verified: false },
  { id: 'school-071', name: null, suburb: 'Ryde', coordinates: { lat: -33.816, lng: 151.102 }, verified: false },
  { id: 'school-072', name: null, suburb: 'Baulkham Hills', coordinates: { lat: -33.759, lng: 150.994 }, verified: false },
  { id: 'school-073', name: null, suburb: 'Castle Hill', coordinates: { lat: -33.731, lng: 151.002 }, verified: false },
  { id: 'school-074', name: null, suburb: 'Rouse Hill', coordinates: { lat: -33.681, lng: 150.916 }, verified: false },
  { id: 'school-075', name: null, suburb: 'Newtown', coordinates: { lat: -33.898, lng: 151.177 }, verified: false },
  { id: 'school-076', name: null, suburb: 'Marrickville', coordinates: { lat: -33.909, lng: 151.157 }, verified: false },
  { id: 'school-077', name: null, suburb: 'Mascot', coordinates: { lat: -33.925, lng: 151.197 }, verified: false },
  { id: 'school-078', name: null, suburb: 'Hurstville', coordinates: { lat: -33.965, lng: 151.100 }, verified: false },
  { id: 'school-079', name: null, suburb: 'Chatswood', coordinates: { lat: -33.795, lng: 151.180 }, verified: false },
  { id: 'school-080', name: null, suburb: 'North Sydney', coordinates: { lat: -33.835, lng: 151.208 }, verified: false },
];
