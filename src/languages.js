import path from 'node:path';

export const LANGUAGES = {
  '.c': { name: 'C', color: '#555555', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.cc': { name: 'C++', color: '#f34b7d', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.cpp': { name: 'C++', color: '#f34b7d', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.cs': { name: 'C#', color: '#178600', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.css': { name: 'CSS', color: '#563d7c', block: { start: '/*', end: '*/' } },
  '.go': { name: 'Go', color: '#00add8', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.h': { name: 'C/C++ Header', color: '#a074c4', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.html': { name: 'HTML', color: '#e34c26', block: { start: '<!--', end: '-->' } },
  '.java': { name: 'Java', color: '#b07219', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.js': { name: 'JavaScript', color: '#f1e05a', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.json': { name: 'JSON', color: '#292929' },
  '.jsx': { name: 'JavaScript', color: '#f1e05a', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.kt': { name: 'Kotlin', color: '#a97bff', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.md': { name: 'Markdown', color: '#083fa1' },
  '.php': { name: 'PHP', color: '#4f5d95', singleLine: ['//', '#'], block: { start: '/*', end: '*/' } },
  '.py': { name: 'Python', color: '#3572a5', singleLine: ['#'] },
  '.rb': { name: 'Ruby', color: '#701516', singleLine: ['#'] },
  '.rs': { name: 'Rust', color: '#dea584', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.scss': { name: 'SCSS', color: '#c6538c', block: { start: '/*', end: '*/' } },
  '.sh': { name: 'Shell', color: '#89e051', singleLine: ['#'] },
  '.sql': { name: 'SQL', color: '#e38c00', singleLine: ['--'], block: { start: '/*', end: '*/' } },
  '.swift': { name: 'Swift', color: '#f05138', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.toml': { name: 'TOML', color: '#9c4221', singleLine: ['#'] },
  '.ts': { name: 'TypeScript', color: '#3178c6', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.tsx': { name: 'TypeScript', color: '#3178c6', singleLine: ['//'], block: { start: '/*', end: '*/' } },
  '.xml': { name: 'XML', color: '#0060ac', block: { start: '<!--', end: '-->' } },
  '.yaml': { name: 'YAML', color: '#cb171e', singleLine: ['#'] },
  '.yml': { name: 'YAML', color: '#cb171e', singleLine: ['#'] },
};

const SPECIAL_FILENAMES = {
  Dockerfile: { name: 'Dockerfile', color: '#384d54', singleLine: ['#'] },
  Makefile: { name: 'Makefile', color: '#427819', singleLine: ['#'] },
};

export function getLanguageForFile(filePath) {
  const baseName = path.basename(filePath);
  if (SPECIAL_FILENAMES[baseName]) {
    return SPECIAL_FILENAMES[baseName];
  }

  return LANGUAGES[path.extname(filePath).toLowerCase()] ?? null;
}

export function countLines(content, language = null) {
  const lines = content.split(/\r?\n/);
  const singleLine = language?.singleLine ?? [];
  const block = language?.block ?? null;
  let blank = 0;
  let comment = 0;
  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      blank += 1;
      continue;
    }

    if (inBlockComment) {
      comment += 1;
      if (block && trimmed.includes(block.end)) {
        inBlockComment = false;
      }
      continue;
    }

    if (singleLine.some((prefix) => trimmed.startsWith(prefix))) {
      comment += 1;
      continue;
    }

    if (block && trimmed.startsWith(block.start)) {
      comment += 1;
      const startIndex = trimmed.indexOf(block.start);
      const endIndex = trimmed.indexOf(block.end, startIndex + block.start.length);
      inBlockComment = endIndex === -1;
      continue;
    }
  }

  return {
    total: lines.length,
    blank,
    comment,
    code: lines.length - blank - comment,
  };
}
