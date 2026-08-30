/**
 * TEMPORARY VISUALISATION DATA
 *
 * These regional school points are fabricated for design and interaction prototyping.
 * They do not represent verified DA Tuition student-origin data. Replace with verified
 * aggregate school data before presenting numeric claims or specific school relationships publicly.
 */

export type CommunitySchoolPoint = {
  id: string;
  name: string | null;
  suburb: string;
  coordinates: { lat: number; lng: number };
  verified: boolean;
  mock: boolean;
};

const mockPoint = (id: number, suburb: string, lat: number, lng: number): CommunitySchoolPoint => ({
  id: `mock-school-${String(id).padStart(3, '0')}`,
  name: null,
  suburb,
  coordinates: { lat, lng },
  verified: false,
  mock: true,
});

// 52 South-West / Fairfield-Liverpool points, 18 broader Western Sydney points, and 10 Sydney-wide points.
// Keep coordinates as explicit records so verified data can replace rows one-for-one without map code changes.
export const COMMUNITY_MOCK_REGIONAL_SCHOOLS: readonly CommunitySchoolPoint[] = [
  mockPoint(1, 'Canley Heights', -33.882, 150.926), mockPoint(2, 'Canley Vale', -33.887, 150.948),
  mockPoint(3, 'Fairfield', -33.872, 150.953), mockPoint(4, 'Fairfield', -33.868, 150.961),
  mockPoint(5, 'Cabramatta', -33.900, 150.935), mockPoint(6, 'Cabramatta', -33.897, 150.947),
  mockPoint(7, 'Lansvale', -33.900, 150.949), mockPoint(8, 'Lansvale', -33.893, 150.958),
  mockPoint(9, 'Smithfield', -33.855, 150.932), mockPoint(10, 'Smithfield', -33.851, 150.940),
  mockPoint(11, 'Wetherill Park', -33.846, 150.896), mockPoint(12, 'Wetherill Park', -33.852, 150.903),
  mockPoint(13, 'Wakeley', -33.854, 150.918), mockPoint(14, 'Wakeley', -33.860, 150.913),
  mockPoint(15, 'St Johns Park', -33.880, 150.899), mockPoint(16, 'St Johns Park', -33.886, 150.905),
  mockPoint(17, 'Bossley Park', -33.862, 150.881), mockPoint(18, 'Bossley Park', -33.867, 150.889),
  mockPoint(19, 'Bonnyrigg', -33.892, 150.889), mockPoint(20, 'Bonnyrigg', -33.900, 150.896),
  mockPoint(21, 'Greenfield Park', -33.875, 150.896), mockPoint(22, 'Greenfield Park', -33.879, 150.905),
  mockPoint(23, 'Mount Pritchard', -33.903, 150.904), mockPoint(24, 'Mount Pritchard', -33.908, 150.913),
  mockPoint(25, 'Prairiewood', -33.865, 150.907), mockPoint(26, 'Prairiewood', -33.870, 150.915),
  mockPoint(27, 'Edensor Park', -33.876, 150.873), mockPoint(28, 'Edensor Park', -33.883, 150.882),
  mockPoint(29, 'Abbotsbury', -33.867, 150.864), mockPoint(30, 'Abbotsbury', -33.875, 150.870),
  mockPoint(31, 'Cecil Hills', -33.889, 150.858), mockPoint(32, 'Cecil Hills', -33.898, 150.865),
  mockPoint(33, 'Hoxton Park', -33.924, 150.853), mockPoint(34, 'Hoxton Park', -33.917, 150.864),
  mockPoint(35, 'Hinchinbrook', -33.917, 150.845), mockPoint(36, 'Hinchinbrook', -33.908, 150.852),
  mockPoint(37, 'Liverpool', -33.922, 150.924), mockPoint(38, 'Liverpool', -33.930, 150.930),
  mockPoint(39, 'Liverpool', -33.918, 150.936), mockPoint(40, 'Casula', -33.949, 150.909),
  mockPoint(41, 'Casula', -33.956, 150.919), mockPoint(42, 'Moorebank', -33.942, 150.952),
  mockPoint(43, 'Moorebank', -33.949, 150.960), mockPoint(44, 'West Hoxton', -33.932, 150.831),
  mockPoint(45, 'Austral', -33.930, 150.810), mockPoint(46, 'Leppington', -33.966, 150.829),
  mockPoint(47, 'Prestons', -33.941, 150.873), mockPoint(48, 'Miller', -33.922, 150.884),
  mockPoint(49, 'Sadlier', -33.917, 150.891), mockPoint(50, 'Heckenberg', -33.911, 150.897),
  mockPoint(51, 'Warwick Farm', -33.914, 150.936), mockPoint(52, 'Chipping Norton', -33.922, 150.958),
  mockPoint(53, 'Parramatta', -33.815, 151.000), mockPoint(54, 'Parramatta', -33.809, 151.008),
  mockPoint(55, 'Merrylands', -33.833, 150.988), mockPoint(56, 'Merrylands', -33.840, 150.995),
  mockPoint(57, 'Guildford', -33.850, 150.984), mockPoint(58, 'Guildford', -33.856, 150.992),
  mockPoint(59, 'Granville', -33.837, 151.009), mockPoint(60, 'Auburn', -33.850, 151.031),
  mockPoint(61, 'Auburn', -33.856, 151.039), mockPoint(62, 'Blacktown', -33.770, 150.905),
  mockPoint(63, 'Blacktown', -33.762, 150.914), mockPoint(64, 'Seven Hills', -33.778, 150.935),
  mockPoint(65, 'Wentworthville', -33.807, 150.969), mockPoint(66, 'Greystanes', -33.824, 150.952),
  mockPoint(67, 'Chester Hill', -33.879, 150.996), mockPoint(68, 'Bankstown', -33.919, 151.032),
  mockPoint(69, 'Regents Park', -33.882, 151.021), mockPoint(70, 'Lidcombe', -33.865, 151.047),
  mockPoint(71, 'Ryde', -33.816, 151.102), mockPoint(72, 'Baulkham Hills', -33.759, 150.994),
  mockPoint(73, 'Castle Hill', -33.731, 151.002), mockPoint(74, 'Rouse Hill', -33.681, 150.916),
  mockPoint(75, 'Newtown', -33.898, 151.177), mockPoint(76, 'Marrickville', -33.909, 151.157),
  mockPoint(77, 'Mascot', -33.925, 151.197), mockPoint(78, 'Hurstville', -33.965, 151.100),
  mockPoint(79, 'Chatswood', -33.795, 151.180), mockPoint(80, 'North Sydney', -33.835, 151.208),
];
