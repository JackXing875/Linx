import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { countLines, getLanguageForFile } from '../src/languages.js';
import { renderReport } from '../src/renderer.js';
import { scanDirectory } from '../src/scanner.js';

test('countLines handles trailing newline without adding a phantom blank line', () => {
  const js = getLanguageForFile('sample.js');
  const counts = countLines('const a = 1;\n', js);

  assert.deepEqual(counts, {
    total: 1,
    blank: 0,
    comment: 0,
    code: 1,
  });
});

test('countLines counts single-line and block comments correctly', () => {
  const js = getLanguageForFile('sample.js');
  const counts = countLines(
    [
      '// headline comment',
      'const a = 1;',
      '',
      '/* block comment',
      'still comment */',
      'const b = 2;',
    ].join('\n'),
    js,
  );

  assert.deepEqual(counts, {
    total: 6,
    blank: 1,
    comment: 3,
    code: 2,
  });
});

test('scanDirectory aggregates language totals and respects ignore rules', async () => {
  const fixtureDir = await fs.mkdtemp(path.join(os.tmpdir(), 'linx-fixture-'));

  try {
    await fs.mkdir(path.join(fixtureDir, 'src'));
    await fs.mkdir(path.join(fixtureDir, 'ignored'));
    await fs.mkdir(path.join(fixtureDir, 'node_modules'));

    await fs.writeFile(path.join(fixtureDir, '.gitignore'), 'ignored/\n', 'utf8');
    await fs.writeFile(
      path.join(fixtureDir, 'src', 'app.js'),
      [
        '// comment',
        'const answer = 42;',
        '',
        '/* block comment',
        'still comment */',
        'console.log(answer);',
      ].join('\n'),
      'utf8',
    );
    await fs.writeFile(
      path.join(fixtureDir, 'src', 'tool.py'),
      [
        '# python comment',
        'print("hi")',
        '',
      ].join('\n'),
      'utf8',
    );
    await fs.writeFile(path.join(fixtureDir, 'ignored', 'skip.js'), 'const skipped = true;\n', 'utf8');
    await fs.writeFile(path.join(fixtureDir, 'node_modules', 'lib.js'), 'const dependency = true;\n', 'utf8');
    await fs.writeFile(path.join(fixtureDir, 'notes.md'), '# Title\n\nBody\n', 'utf8');
    await fs.writeFile(path.join(fixtureDir, 'data.bin'), Buffer.from([0, 1, 2, 3]));

    const report = await scanDirectory(fixtureDir, {
      ignorePatterns: ['notes.md'],
    });

    assert.equal(report.totalFiles, 2);
    assert.deepEqual(report.totals, {
      total: 8,
      code: 3,
      comment: 4,
      blank: 1,
    });

    assert.equal(report.languages.get('JavaScript')?.total, 6);
    assert.equal(report.languages.get('JavaScript')?.comment, 3);
    assert.equal(report.languages.get('Python')?.total, 2);
    assert.equal(report.languages.get('Python')?.blank, 0);

    assert.deepEqual([...report.files.keys()].sort(), ['src/app.js', 'src/tool.py']);
    assert.equal(report.largestFiles[0]?.[0], 'src/app.js');
  } finally {
    await fs.rm(fixtureDir, { recursive: true, force: true });
  }
});

test('scanDirectory recognizes special filenames such as Dockerfile', async () => {
  const fixtureDir = await fs.mkdtemp(path.join(os.tmpdir(), 'linx-special-'));

  try {
    await fs.writeFile(
      path.join(fixtureDir, 'Dockerfile'),
      ['# base image', 'FROM node:20-alpine'].join('\n'),
      'utf8',
    );

    const report = await scanDirectory(fixtureDir);

    assert.equal(report.totalFiles, 1);
    assert.equal(report.languages.get('Dockerfile')?.total, 2);
    assert.equal(report.languages.get('Dockerfile')?.comment, 1);
    assert.equal(report.languages.get('Dockerfile')?.code, 1);
  } finally {
    await fs.rm(fixtureDir, { recursive: true, force: true });
  }
});

test('renderReport prints output without depending on removed fun facts', () => {
  const originalLog = console.log;
  const lines = [];
  console.log = (message) => {
    lines.push(message);
  };

  try {
    renderReport({
      rootDir: '/tmp/project',
      totalFiles: 1,
      totals: {
        total: 10,
        code: 7,
        comment: 2,
        blank: 1,
      },
      languages: new Map([
        ['JavaScript', { name: 'JavaScript', color: '#f1e05a', files: 1, total: 10, code: 7, comment: 2, blank: 1 }],
      ]),
      files: new Map([
        ['src/index.js', { language: 'JavaScript', total: 10, code: 7, comment: 2, blank: 1 }],
      ]),
      largestFiles: [
        ['src/index.js', { language: 'JavaScript', total: 10, code: 7, comment: 2, blank: 1 }],
      ],
      durationMs: 12,
    }, {
      color: false,
      top: 5,
      targetDir: '.',
    });
  } finally {
    console.log = originalLog;
  }

  assert.equal(lines.length, 1);
  assert.match(lines[0], /Fun Facts/);
  assert.doesNotMatch(lines[0], /Estimated value/);
  assert.match(lines[0], /Hottest file: src\/index\.js/);
});
