# Pulse ⚡

> **Feel the heartbeat of your codebase.**

Pulse is a beautiful, fast CLI tool that scans your project and gives you a full breakdown of code statistics — lines by language, file distribution, comment ratios, and quirky fun facts — all rendered in a stunning terminal UI.

---

## Features

- 📊 **Language breakdown** — lines of code per language with visual bar charts
- 📁 **File-level stats** — top largest files, deepest nesting, hottest modules
- 💬 **Comment & blank line ratio** — understand how well-documented your project is
- ☕ **Fun facts** — coffee cups needed, reading time, COCOMO project value estimate
- 📤 **Export** — save results as JSON or CSV for CI pipelines and dashboards
- 🎨 **Beautiful output** — color-coded, minimal, and fast. No bloat.

---

## Installation

```bash
npm install -g pulse-cli
```

Or run without installing:

```bash
npx pulse-cli
```

---

## Usage

```bash
# Scan current directory
pulse

# Scan a specific path
pulse ./my-project

# Show top 10 largest files
pulse --top 10

# Export results to JSON
pulse --export stats.json

# Export as CSV
pulse --export stats.csv

# Disable color output (for CI environments)
pulse --no-color

# Compare with a previous scan
pulse --diff stats.json
```

---

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
◆ PULSE  v1.0.0  │  scanning ./my-project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCANNING ████████████████████ 100%   247 files found

TypeScript   ████████████████████░░░░░░░   58.2%   12,481 lines
JavaScript   ██████░░░░░░░░░░░░░░░░░░░░░   17.8%    3,819 lines
HTML         ████░░░░░░░░░░░░░░░░░░░░░░░   11.1%    2,380 lines
CSS          ██░░░░░░░░░░░░░░░░░░░░░░░░░    7.3%    1,566 lines
Python       █░░░░░░░░░░░░░░░░░░░░░░░░░░    5.6%    1,201 lines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Lines   21,447    Code   18,902    Comments   1,841    Blank   704
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✦ FUN FACTS
  ☕ Coffee needed: ~38 cups
  📖 Reading time: 3.2 days
  💰 Est. value: $74,200  (COCOMO model)
  🔥 Hottest file: src/api/router.ts (847 lines)
  🏆 Language streak: TypeScript · 47 days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated in 0.43s
```

---

## Options

| Flag | Alias | Description |
|---|---|---|
| `--top <n>` | `-t` | Show top N largest files (default: 5) |
| `--export <file>` | `-e` | Export results to `.json` or `.csv` |
| `--diff <file>` | `-d` | Compare against a previous export |
| `--ignore <pattern>` | `-i` | Additional ignore patterns |
| `--no-color` | | Disable color output |
| `--version` | `-v` | Show version |
| `--help` | `-h` | Show help |

---

## Ignored by Default

Pulse automatically skips directories and files that don't belong to your source code:

- `node_modules/`, `.git/`, `dist/`, `build/`, `.next/`
- Binary files (images, fonts, executables)
- Lock files (`package-lock.json`, `yarn.lock`, etc.)
- Your project's `.gitignore` rules are respected automatically

---

## Supported Languages

Pulse recognizes 40+ languages out of the box, including:

TypeScript · JavaScript · Python · Rust · Go · Java · C · C++ · C# · Ruby · PHP · Swift · Kotlin · Dart · HTML · CSS · SCSS · SQL · Shell · Markdown · JSON · YAML · TOML · and more.

Missing a language? [Open an issue](https://github.com/your-username/pulse) or submit a PR — the config is a single JSON file.

---

## Why Pulse?

Most code counters are either too minimal (just raw numbers) or too heavy (spawning a full LSP). Pulse sits in the sweet spot: **instant, readable, and actually enjoyable to run.**

It's the kind of tool you add to your project onboarding docs so new teammates can understand the codebase at a glance.

---

## Contributing

```bash
git clone https://github.com/your-username/pulse
cd pulse
npm install
npm link        # makes `pulse` available globally from source
```

Pull requests are welcome. Please open an issue first for major changes.

---

## License

MIT © 2025
