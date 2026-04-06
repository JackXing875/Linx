<p align="center">
  <img src="./assets/linx-logo.svg" alt="linx logo" width="360">
</p>

<p align="center">
  <strong>A fast CLI for scanning codebases and summarizing code statistics.</strong>
</p>

<p align="center">
  <img alt="npm package" src="https://img.shields.io/badge/npm-%40jackxing875%2Flinx%401.0.2-CB3837?style=flat-square">
  <img alt="license" src="https://img.shields.io/badge/license-GPLv3-16a34a?style=flat-square">
  <img alt="runtime" src="https://img.shields.io/badge/runtime-Node.js-5fa04e?style=flat-square">
</p>

<p align="center">
  English · <a href="./README.zh-CN.md">简体中文</a>
</p>

`linx` is a lightweight command-line tool that scans a project directory and prints a clean summary of:

- lines by language
- total / code / comment / blank lines
- largest files
- quick fun facts
- JSON and CSV exports

It is designed to be simple, fast, and readable in a real terminal.

Published package:

```bash
@jackxing875/linx@1.0.2
```

Quick install:

```bash
npm install -g @jackxing875/linx
linx .
```

## Features

- Language breakdown with visual bars
- Largest file ranking
- Comment and blank line counting
- `.gitignore` support
- Extra ignore patterns from the CLI
- JSON / CSV export
- Colorful terminal output with a plain-text fallback

## Installation

Install globally from npm:

```bash
npm install -g @jackxing875/linx
```

Install a fixed version explicitly:

```bash
npm install -g @jackxing875/linx@1.0.1
```

Then run:

```bash
linx .
```

Run without a permanent install:

```bash
npx @jackxing875/linx .
```

Run a fixed published version:

```bash
npx @jackxing875/linx@1.0.1 .
```

## Local Development

Install dependencies:

```bash
npm install
```

Run from source:

```bash
node ./bin/linx.js .
```

Or link it as a local command:

```bash
npm link
linx .
```

## Usage

```bash
linx [dir]
```

Examples:

```bash
# Scan the current directory
linx

# Scan a specific directory
linx ./src

# Show the 10 largest files
linx . --top 10

# Add extra ignore patterns
linx . --ignore coverage dist '*.snap'

# Export as JSON
linx . --export ./stats.json

# Export as CSV
linx . --export ./stats.csv

# Disable colors
linx . --no-color
```

## Example Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINX  scanning ./my-project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

248 files  21,447 lines  18,902 code / 1,841 comments / 704 blank

TypeScript     ███████████████████░░░░░  58.2%   12,481 lines
JavaScript     ██████░░░░░░░░░░░░░░░░░░  17.8%    3,819 lines
HTML           ████░░░░░░░░░░░░░░░░░░░░  11.1%    2,380 lines
CSS            ██░░░░░░░░░░░░░░░░░░░░░░   7.3%    1,566 lines
Python         █░░░░░░░░░░░░░░░░░░░░░░░   5.6%    1,201 lines

Top Files
src/api/router.ts     847 lines · TypeScript
src/core/config.ts    611 lines · TypeScript
src/index.ts          488 lines · TypeScript

Fun Facts
Coffee needed: ~38 cups
Reading time: 9.5 hours
Hottest file: src/api/router.ts (847 lines)

Generated in 0.43s
```

## Command Options

| Flag | Description |
|---|---|
| `--top <n>` | Show the largest `n` files |
| `--export <file>` | Export the report as `.json` or `.csv` |
| `--ignore <pattern...>` | Add ignore patterns on top of `.gitignore` |
| `--no-color` | Disable colored output |
| `--help` | Show CLI help |

## What linx Scans

`linx` currently recognizes common source and text formats, including:

TypeScript, JavaScript, Python, Rust, Go, Java, C, C++, C#, CSS, HTML, Markdown, JSON, YAML, TOML, Shell, SQL, Ruby, PHP, Swift, Kotlin, XML, Dockerfile, and Makefile.

It also respects:

- your project's `.gitignore`
- common build and dependency directories such as `node_modules/`, `dist/`, `build/`, and `coverage/`
- binary file detection

## Exporting

Two export formats are supported:

- `.json` for structured reporting and automation
- `.csv` for spreadsheets and lightweight analysis

Example:

```bash
linx . --export ./stats.json
linx . --export ./stats.csv
```

## Publishing

If you maintain this package and want to publish a new release:

```bash
npm login
npm test
npm run pack:check
npm publish --access public
```


## License

GNU General Public License Version 3, 29 June 2007
