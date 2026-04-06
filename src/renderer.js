import { Chalk } from 'chalk';
import { coffeeCount, estimateValue, findHottestFile, readingTime } from './funfacts.js';

export function renderReport(report, options = {}) {
  const chalk = new Chalk({ level: options.color === false ? 0 : 3 });
  const top = normalizeTop(options.top);
  const directoryLabel = options.targetDir ?? report.rootDir;
  const languageRows = [...report.languages.values()].sort((left, right) => right.total - left.total);

  const output = [];
  output.push(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  output.push(`${chalk.bold.cyan('LINX')}  ${chalk.dim(`scanning ${directoryLabel}`)}`);
  output.push(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  output.push('');

  if (report.totalFiles === 0) {
    output.push(chalk.yellow('No supported source files were found in this directory.'));
    output.push(chalk.dim(`Generated in ${formatDuration(report.durationMs)}`));
    console.log(output.join('\n'));
    return;
  }

  output.push(
    `${chalk.bold(formatNumber(report.totalFiles))} files  ` +
      `${chalk.bold(formatNumber(report.totals.total))} lines  ` +
      `${chalk.dim(`${formatNumber(report.totals.code)} code / ${formatNumber(report.totals.comment)} comments / ${formatNumber(report.totals.blank)} blank`)}`,
  );
  output.push('');

  for (const language of languageRows) {
    const percentage = report.totals.total === 0 ? 0 : (language.total / report.totals.total) * 100;
    const bar = buildBar(percentage);
    const label = language.name.padEnd(14, ' ');
    output.push(
      `${chalk.hex(language.color)(label)} ${bar} ${percentage.toFixed(1).padStart(5, ' ')}% ${formatNumber(language.total).padStart(8, ' ')} lines`,
    );
  }

  output.push('');
  output.push(chalk.cyan('Top Files'));
  for (const [filePath, stats] of report.largestFiles.slice(0, top)) {
    output.push(
      `${filePath}  ${chalk.dim(`${formatNumber(stats.total)} lines · ${stats.language}`)}`,
    );
  }

  output.push('');
  output.push(chalk.cyan('Fun Facts'));
  output.push(`Coffee needed: ~${coffeeCount(report.totals.total)} cups`);
  output.push(`Reading time: ${readingTime(report.totals.total)}`);
  output.push(`Estimated value: ${formatCurrency(estimateValue(report.totals.code))}`);

  const hottest = findHottestFile(report.files);
  if (hottest) {
    output.push(`Hottest file: ${hottest[0]} (${formatNumber(hottest[1].total)} lines)`);
  }

  output.push('');
  output.push(chalk.dim(`Generated in ${formatDuration(report.durationMs)}`));
  console.log(output.join('\n'));
}

function normalizeTop(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

function buildBar(percentage, width = 24) {
  const filled = Math.round((percentage / 100) * width);
  return `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, width - filled))}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDuration(durationMs) {
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  }

  return `${(durationMs / 1000).toFixed(2)}s`;
}
