import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_CONFIG = 'scripts/pinball-snapshot.config.mjs';

const args = process.argv.slice(2);
const configFlagIndex = args.indexOf('--config');
const configPath = configFlagIndex >= 0 ? args[configFlagIndex + 1] : DEFAULT_CONFIG;

if (!configPath) {
  throw new Error('Missing --config <path> argument.');
}

const resolvedConfigPath = path.resolve(configPath);
const { config } = await import(pathToFileURL(resolvedConfigPath).href);

validateConfig(config);

const regions = await resolveRegions(config);
const locations = await fetchLocationsForRegions(regions, config);
const topLocations = selectTopLocations(locations, config.topN);

const enriched = await enrichWithMachines(topLocations, config);
await writeJson(config.outputFile, enriched);

console.log(`Wrote ${enriched.length} locations to ${config.outputFile}`);

function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Config must be an object exported as { config }.');
  }
  if (!config.apiBaseUrl) {
    throw new Error('config.apiBaseUrl is required.');
  }
  if (!config.endpoints?.locationsByRegion) {
    throw new Error('config.endpoints.locationsByRegion is required.');
  }
  if (!config.endpoints?.regions) {
    throw new Error('config.endpoints.regions is required.');
  }
  if (!config.endpoints?.machineDetails) {
    throw new Error('config.endpoints.machineDetails is required.');
  }
  if (!config.outputFile) {
    throw new Error('config.outputFile is required.');
  }
  if (!config.topN || typeof config.topN !== 'number') {
    throw new Error('config.topN must be a number.');
  }
}

async function loadPayload(config, endpoint) {
  if (endpoint.startsWith('file://')) {
    const filePath = endpoint.replace('file://', '');
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  }
  const url = new URL(endpoint, config.apiBaseUrl).toString();
  const response = await fetch(url, { headers: config.requestHeaders ?? {} });
  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function resolveRegions(config) {
  if (Array.isArray(config.regions) && config.regions.length > 0) {
    return config.regions;
  }
  if (config.regionSelection?.mode === 'oecd-western-europe') {
    return buildRegionsByCountry(config, config.regionSelection.countries ?? []);
  }
  throw new Error('Provide config.regions with at least one region slug.');
}

async function fetchLocationsForRegions(regions, config) {
  const allLocations = [];
  for (const region of regions) {
    const endpoint = config.endpoints.locationsByRegion.replace(':region', region);
    const payload = await loadPayload(config, endpoint);
    const locations = adaptLocations(payload);
    allLocations.push(...locations);
  }
  return allLocations;
}

async function buildRegionsByCountry(config, countries) {
  const payload = await loadPayload(config, config.endpoints.regions);
  const regions = Array.isArray(payload?.regions) ? payload.regions : [];
  if (regions.length === 0) {
    throw new Error('Regions payload missing or empty.');
  }
  const countrySet = new Set(countries.map((code) => String(code).toUpperCase()));
  const matched = [];

  for (const region of regions) {
    const regionSlug = region?.name;
    if (typeof regionSlug !== 'string') {
      continue;
    }
    const endpoint = config.endpoints.locationsByRegion.replace(':region', regionSlug);
    const locationsPayload = await loadPayload(config, endpoint);
    const countriesInRegion = extractCountries(locationsPayload);
    const hasMatch = countriesInRegion.some((code) => countrySet.has(code));
    if (hasMatch) {
      matched.push(regionSlug);
    }
    if (config.fetchDelayMs) {
      await delay(config.fetchDelayMs);
    }
  }

  if (matched.length === 0) {
    throw new Error('No regions matched the configured country list.');
  }

  return matched;
}

function extractCountries(payload) {
  const rawLocations = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.locations)
      ? payload.locations
      : [];
  const codes = new Set();
  rawLocations.forEach((item) => {
    const code = item?.country;
    if (typeof code === 'string' && code.trim()) {
      codes.add(code.trim().toUpperCase());
    }
  });
  return Array.from(codes);
}

function adaptLocations(payload) {
  const rawLocations = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.locations)
      ? payload.locations
      : null;

  if (!rawLocations) {
    throw new Error('Locations payload must be an array or include a locations array.');
  }

  const result = [];
  let skipped = 0;

  rawLocations.forEach((item) => {
    if (!item || typeof item !== 'object') {
      skipped += 1;
      return;
    }
    const {
      id,
      name,
      city,
      country,
      latitude,
      longitude,
      lat,
      lon,
      num_machines,
      machine_count,
      location_machine_xrefs
    } = item;
    const parsedId = typeof id === 'number' ? id : Number(id);
    const latValue = latitude ?? lat;
    const lonValue = longitude ?? lon;
    const countValue = num_machines ?? machine_count;
    const parsedLat = typeof latValue === 'number' ? latValue : Number(latValue);
    const parsedLon = typeof lonValue === 'number' ? lonValue : Number(lonValue);
    const parsedMachines = typeof countValue === 'number' ? countValue : Number(countValue);

    if (
      !Number.isFinite(parsedId) ||
      typeof name !== 'string' ||
      !Number.isFinite(parsedLat) ||
      !Number.isFinite(parsedLon) ||
      !Number.isFinite(parsedMachines)
    ) {
      skipped += 1;
      return;
    }

    const safeCity = typeof city === 'string' ? city : '';
    const safeCountry = typeof country === 'string' ? country : '';
    const topMachines = Array.isArray(location_machine_xrefs)
      ? location_machine_xrefs
          .map((entry) => entry?.machine?.name)
          .filter((machineName) => typeof machineName === 'string')
      : [];

    result.push({
      id: parsedId,
      name,
      city: safeCity,
      country: safeCountry,
      latitude: parsedLat,
      longitude: parsedLon,
      machineCount: parsedMachines,
      topMachines
    });
  });

  if (skipped > 0) {
    console.warn(`Skipped ${skipped} locations with missing fields.`);
  }

  return result;
}

function selectTopLocations(locations, topN) {
  return [...locations]
    .sort((a, b) => b.machineCount - a.machineCount)
    .slice(0, topN);
}

async function enrichWithMachines(locations, config) {
  const result = [];
  for (const location of locations) {
    if (Array.isArray(location.topMachines) && location.topMachines.length > 0) {
      result.push({ ...location, topMachines: location.topMachines.slice(0, config.machineListLimit) });
      continue;
    }
    const endpoint = config.endpoints.machineDetails.replace(':id', String(location.id));
    const payload = await loadPayload(config, endpoint);
    const machines = adaptMachines(payload, config.machineListLimit);
    result.push({ ...location, topMachines: machines });
    if (config.fetchDelayMs) {
      await delay(config.fetchDelayMs);
    }
  }
  return result;
}

function adaptMachines(payload, limit) {
  const rawMachines = Array.isArray(payload?.machines) ? payload.machines : [];
  const names = rawMachines
    .map((item) => (item && typeof item === 'object' ? item.name : null))
    .filter((name) => typeof name === 'string');
  if (limit && typeof limit === 'number') {
    return names.slice(0, limit);
  }
  return names;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeJson(outputFile, data) {
  const resolvedPath = path.resolve(outputFile);
  const json = JSON.stringify(data, null, 2);
  await writeFile(resolvedPath, json, 'utf8');
}
