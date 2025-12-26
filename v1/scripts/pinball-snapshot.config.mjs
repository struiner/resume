export const config = {
  apiBaseUrl: 'https://pinballmap.com',
  endpoints: {
    locationsByRegion: '/api/v1/region/:region/locations.json',
    machineDetails: '/api/v1/locations/:id/machine_details.json',
    regions: '/api/v1/regions.json'
  },
  regions: [],
  regionSelection: {
    mode: 'oecd-western-europe',
    countries: [
      'AT',
      'BE',
      'CH',
      'DE',
      'DK',
      'ES',
      'FI',
      'FR',
      'GB',
      'GR',
      'IE',
      'IS',
      'IT',
      'LU',
      'NL',
      'NO',
      'PT',
      'SE',
      'UK'
    ]
  },
  outputFile: 'src/assets/data/pinball-snapshot.json',
  topN: 50,
  machineListLimit: 6,
  fetchDelayMs: 0,
  requestHeaders: {
    'User-Agent': 'resume-portal-snapshot/1.0 (contact: admin@pinballmap.com)',
    'Accept': 'application/json'
  }
};
