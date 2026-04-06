import fs from 'node:fs/promises';
import path from 'node:path';
import { renderReport } from './renderer.js';
import { scanDirectory } from './scanner.js';

export async function run(dir = '.', options = {}) {
  try {
    const targetDir = path.resolve(dir);
    const stat = await fs.stat(targetDir);
    if (!stat.isDirectory()) {
      throw new Error(`${targetDir} is not a directory.`);
    }

    const report = await scanDirectory(targetDir, {
      ignorePatterns: normalizeIgnorePatterns(options.ignore),
    });

    renderReport(report, {
      color: options.color,
      top: options.top,
      targetDir: path.relative(process.cwd(), targetDir) || '.',
    });

    if (options.export) {
      const outputPath = path.resolve(options.export);
      await exportReport(report, outputPath);
      console.log(`\nExported report to ${outputPath}`);
    }
  } catch (error) {
    console.error(`linx failed: ${error.message}`);
    process.exitCode = 1;
  }
}

function normalizeIgnorePatterns(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

async function exportReport(report, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const extension = path.extname(outputPath).toLowerCase();
  if (extension === '.csv') {
    await fs.writeFile(outputPath, toCsv(report), 'utf8');
    return;
  }

  await fs.writeFile(outputPath, `${JSON.stringify(toJson(report), null, 2)}\n`, 'utf8');
}

function toJson(report) {
  return {
    rootDir: report.rootDir,
    totalFiles: report.totalFiles,
    totals: report.totals,
    durationMs: report.durationMs,
    languages: [...report.languages.values()].sort((left, right) => right.total - left.total),
    files: [...report.files.entries()].map(([filePath, stats]) => ({
      path: filePath,
      ...stats,
    })),
  };
}

function toCsv(report) {
  const rows = [
    ['path', 'language', 'total', 'code', 'comment', 'blank'],
    ...[...report.files.entries()].map(([filePath, stats]) => [
      filePath,
      stats.language,
      stats.total,
      stats.code,
      stats.comment,
      stats.blank,
    ]),
  ];

  return rows
    .map((columns) => columns.map(escapeCsvCell).join(','))
    .join('\n');
}

function escapeCsvCell(value) {
  const text = String(value);
  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}
