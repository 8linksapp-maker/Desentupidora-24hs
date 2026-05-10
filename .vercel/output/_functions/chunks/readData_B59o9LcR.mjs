import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_DIR = resolve(process.cwd(), "src/data");
function readData(filename, fallback = {}) {
  try {
    return JSON.parse(readFileSync(resolve(DATA_DIR, filename), "utf-8"));
  } catch {
    return fallback;
  }
}

export { readData as r };
