import fs from 'node:fs/promises';
import path from 'node:path';
import ignore from 'ignore';
import { countLines, getLanguageForFile } from './languages.js';

const DEFAULT_IGNORES = [
  '.git/',
  '.hg/',
  '.svn/',
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  '.next/',
  '.nuxt/',
  '.svelte-kit/',
  '.turbo/',
  'out/',
  'vendor/',
  'tmp/',
  'temp/',
];

const DEFAULT_IGNORED_FILES = new Set([
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',
  'Cargo.lock',
]);

export async function scanDirectory(rootDir, options = {}) {
  const startTime = Date.now();
  const matcher = await createIgnoreMatcher(rootDir, options.ignorePatterns ?? []);
  const report = {
    rootDir,
    totalFiles: 0,
    totals: {
      total: 0,
      code: 0,
      comment: 0,
      blank: 0,
    },
    languages: new Map(),
    files: new Map(),
    largestFiles: [],
    durationMs: 0,
  };

  await walk(rootDir, rootDir, matcher, report);

  report.durationMs = Date.now() - startTime;
  report.largestFiles = [...report.files.entries()]
    .sort((left, right) => right[1].total - left[1].total)
    .slice(0, 10);

  return report;
}

async function createIgnoreMatcher(rootDir, extraPatterns) {
  const matcher = ignore();
  matcher.add(DEFAULT_IGNORES);

  if (Array.isArray(extraPatterns) && extraPatterns.length > 0) {
    matcher.add(extraPatterns);
  }

  try {
    const gitignoreContent = await fs.readFile(path.join(rootDir, '.gitignore'), 'utf8');
    matcher.add(gitignoreContent.split(/\r?\n/));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  return matcher;
}

async function walk(rootDir, currentDir, matcher, report) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, absolutePath);
    const normalizedPath = relativePath.split(path.sep).join('/');

    if (shouldIgnore(entry, normalizedPath, matcher)) {
      continue;
    }

    if (entry.isDirectory()) {
      await walk(rootDir, absolutePath, matcher, report);
      continue;
    }

    if (entry.isFile()) {
      await addFileStats(absolutePath, normalizedPath, report);
    }
  }
}

function shouldIgnore(entry, normalizedPath, matcher) {
  if (!normalizedPath) {
    return false;
  }

  if (DEFAULT_IGNORED_FILES.has(entry.name)) {
    return true;
  }

  if (entry.isDirectory()) {
    return matcher.ignores(`${normalizedPath}/`) || matcher.ignores(normalizedPath);
  }

  return matcher.ignores(normalizedPath);
}

async function addFileStats(absolutePath, relativePath, report) {
  const language = getLanguageForFile(relativePath);
  if (!language) {
    return;
  }

  const buffer = await fs.readFile(absolutePath);
  if (isProbablyBinary(buffer)) {
    return;
  }

  const counts = countLines(buffer.toString('utf8'), language);
  report.totalFiles += 1;
  report.totals.total += counts.total;
  report.totals.code += counts.code;
  report.totals.comment += counts.comment;
  report.totals.blank += counts.blank;
  report.files.set(relativePath, {
    language: language.name,
    ...counts,
  });

  const existingLanguage = report.languages.get(language.name);
  if (existingLanguage) {
    existingLanguage.files += 1;
    existingLanguage.total += counts.total;
    existingLanguage.code += counts.code;
    existingLanguage.comment += counts.comment;
    existingLanguage.blank += counts.blank;
    return;
  }

  report.languages.set(language.name, {
    name: language.name,
    color: language.color,
    files: 1,
    total: counts.total,
    code: counts.code,
    comment: counts.comment,
    blank: counts.blank,
  });
}

function isProbablyBinary(buffer) {
  const sampleSize = Math.min(buffer.length, 8000);
  for (let index = 0; index < sampleSize; index += 1) {
    if (buffer[index] === 0) {
      return true;
    }
  }

  return false;
}
