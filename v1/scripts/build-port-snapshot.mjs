import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_CONFIG = 'scripts/port-snapshot.config.mjs';

const args = process.argv.slice(2);
const configFlagIndex = args.indexOf('--config');
const configPath = configFlagIndex >= 0 ? args[configFlagIndex + 1] : DEFAULT_CONFIG;

if (!configPath) {
  throw new Error('Missing --config <path> argument.');
}

const resolvedConfigPath = path.resolve(configPath);
const { config } = await import(pathToFileURL(resolvedConfigPath).href);

validateConfig(config);

const headers = buildAuthHeaders(config);

const [metadataPayload, statsPayload, schedulePayload] = await Promise.all([
  loadPayload('portsMetadata', config, headers),
  loadPayload('containerStats', config, headers),
  loadPayload('vesselSchedule', config, headers)
]);

const metadata = config.adapters.portsMetadata(metadataPayload);
const stats = config.adapters.containerStats(statsPayload);
const schedule = config.adapters.vesselSchedule(schedulePayload);

const snapshot = buildSnapshot(metadata, stats, schedule, config.topN);
await writeJson(config.outputFile, snapshot);

console.log(`Wrote ${snapshot.length} ports to ${config.outputFile}`);

function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Config must be an object exported as { config }.');
  }
  if (!config.apiBaseUrl) {
    throw new Error('config.apiBaseUrl is required.');
  }
  if (!config.outputFile) {
    throw new Error('config.outputFile is required.');
  }
  if (!config.topN || typeof config.topN !== 'number') {
    throw new Error('config.topN must be a number.');
  }
  const endpoints = config.endpoints ?? {};
  const inputFiles = config.inputFiles ?? {};
  ['portsMetadata', 'containerStats', 'vesselSchedule'].forEach((key) => {
    const hasEndpoint = Boolean(endpoints[key]);
    const hasInput = Boolean(inputFiles[key]);
    if (!hasEndpoint && !hasInput) {
      throw new Error(`Provide config.endpoints.${key} or config.inputFiles.${key}.`);
    }
  });
  if (!config.adapters?.portsMetadata || !config.adapters?.containerStats || !config.adapters?.vesselSchedule) {
    throw new Error('Config adapters must include portsMetadata, containerStats, vesselSchedule.');
  }
}

function buildAuthHeaders(config) {
  const auth = config.auth ?? {};
  if (!auth.envVar || !auth.header) {
    throw new Error('config.auth.envVar and config.auth.header are required.');
  }
  const apiKey = process.env[auth.envVar];
  if (!apiKey) {
    throw new Error(`Missing API key in environment variable ${auth.envVar}.`);
  }
  const prefix = auth.prefix ?? '';
  return { [auth.header]: `${prefix}${apiKey}` };
}

async function loadPayload(key, config, headers) {
  const inputFile = config.inputFiles?.[key];
  if (inputFile) {
    const resolvedPath = path.resolve(inputFile);
    const raw = await readFile(resolvedPath, 'utf8');
    return JSON.parse(raw);
  }
  const endpoint = config.endpoints?.[key];
  const url = new URL(endpoint, config.apiBaseUrl).toString();
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Fetch failed for ${key}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function buildSnapshot(metadata, stats, schedule, topN) {
  const metadataByLocode = new Map(
    metadata.map((item) => [item.locode, item])
  );
  const scheduleByLocode = new Map(
    schedule.map((item) => [item.locode, item])
  );

  const merged = stats.map((item) => {
    const meta = metadataByLocode.get(item.locode);
    const sched = scheduleByLocode.get(item.locode);
    if (!meta) {
      throw new Error(`Missing metadata for port ${item.locode}.`);
    }
    if (!sched) {
      throw new Error(`Missing vessel schedule for port ${item.locode}.`);
    }
    return {
      name: meta.name,
      locode: item.locode,
      latitude: meta.latitude,
      longitude: meta.longitude,
      importTEU: item.importTEU,
      exportTEU: item.exportTEU,
      vesselCalls: sched.vesselCalls
    };
  });

  const sorted = merged
    .sort((a, b) => (b.importTEU + b.exportTEU) - (a.importTEU + a.exportTEU))
    .slice(0, topN);

  return sorted;
}

async function writeJson(outputFile, data) {
  const resolvedPath = path.resolve(outputFile);
  const json = JSON.stringify(data, null, 2);
  await writeFile(resolvedPath, json, 'utf8');
}
