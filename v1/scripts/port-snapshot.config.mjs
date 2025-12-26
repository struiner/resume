export const config = {
  apiBaseUrl: 'https://api.econdb.com',
  auth: {
    envVar: 'ECONDB_API_KEY',
    header: 'Authorization',
    prefix: 'Bearer '
  },
  endpoints: {
    vesselSchedule: '/ports/vessel-schedule',
    portsMetadata: '',
    containerStats: ''
  },
  inputFiles: {
    vesselSchedule: '',
    portsMetadata: '',
    containerStats: ''
  },
  adapters: {
    vesselSchedule: (_payload) => {
      throw new Error('Define vesselSchedule adapter in scripts/port-snapshot.config.mjs');
    },
    portsMetadata: (_payload) => {
      throw new Error('Define portsMetadata adapter in scripts/port-snapshot.config.mjs');
    },
    containerStats: (_payload) => {
      throw new Error('Define containerStats adapter in scripts/port-snapshot.config.mjs');
    }
  },
  outputFile: 'src/assets/data/port-snapshot.json',
  topN: 50
};
