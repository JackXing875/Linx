<p align="center">
  <img src="https://raw.githubusercontent.com/JackXing875/Linx/main/assets/linx-logo.svg" alt="linx logo" width="360">
</p>

<p align="center">
  <strong>一个快速扫描代码仓库并汇总代码统计信息的 CLI 工具。</strong>
</p>

<p align="center">

  <img alt="license" src="https://img.shields.io/badge/license-GPLv3-16a34a?style=flat-square">
  <img alt="runtime" src="https://img.shields.io/badge/runtime-Node.js-5fa04e?style=flat-square">
</p>

<p align="center">
  <a href="./README.md">English</a> · 简体中文
</p>

`linx` 是一个轻量、直接、适合终端使用的命令行工具，用来扫描项目目录并输出：

- 按语言分组的行数统计
- 总行数 / 代码行 / 注释行 / 空行
- 最大文件排行
- 一些简短的趣味指标
- JSON / CSV 导出

它的目标不是做成一个臃肿的分析平台，而是让你在几秒内看懂一个项目的大致规模和结构。

## 功能特性

- 语言分布统计与可视化条形图
- 最大文件 Top N
- 注释行和空行统计
- 自动读取 `.gitignore`
- 支持命令行追加忽略规则
- 导出为 JSON / CSV
- 支持彩色输出，也支持纯文本输出

## 安装

发布到 npm 之后，用户可以直接全局安装：

```bash
npm install -g @jackxing875/linx
```

安装后直接使用：

```bash
linx .
```

如果不想全局安装，也可以直接临时运行：

```bash
npx @jackxing875/linx .
```

## 本地开发

先安装依赖：

```bash
npm install
```

直接从源码运行：

```bash
node ./bin/linx.js .
```

如果你想把命令名固定成 `linx` 来测试：

```bash
npm link
linx .
```

## 用法

```bash
linx [dir]
```

示例：

```bash
# 扫描当前目录
linx

# 扫描指定目录
linx ./src

# 只显示前 10 个最大文件
linx . --top 10

# 追加忽略规则
linx . --ignore coverage dist '*.snap'

# 导出为 JSON
linx . --export ./stats.json

# 导出为 CSV
linx . --export ./stats.csv

# 关闭颜色输出
linx . --no-color
```

## 输出示例

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
Estimated value: $74,200
Hottest file: src/api/router.ts (847 lines)

Generated in 0.43s
```

## 命令选项

| 参数 | 说明 |
|---|---|
| `--top <n>` | 显示最大的前 `n` 个文件 |
| `--export <file>` | 导出为 `.json` 或 `.csv` |
| `--ignore <pattern...>` | 在 `.gitignore` 之外追加忽略规则 |
| `--no-color` | 关闭彩色输出 |
| `--help` | 查看帮助 |

## linx 会扫描什么

当前版本已支持常见源码和文本文件类型，例如：

TypeScript、JavaScript、Python、Rust、Go、Java、C、C++、C#、CSS、HTML、Markdown、JSON、YAML、TOML、Shell、SQL、Ruby、PHP、Swift、Kotlin、XML、Dockerfile、Makefile。

同时会自动处理这些场景：

- 读取项目根目录的 `.gitignore`
- 跳过 `node_modules/`、`dist/`、`build/`、`coverage/` 等常见目录
- 过滤二进制文件

## 导出

目前支持两种导出格式：

- `.json`：适合脚本、自动化和后续处理
- `.csv`：适合表格工具和轻量分析

示例：

```bash
linx . --export ./stats.json
linx . --export ./stats.csv
```

## 发布

如果你要自己发布新版本，流程可以保持成这样：

```bash
npm login
npm test
npm run pack:check
npm publish --access public
```

## 后续计划

比较适合继续补强的方向：

- 更准确的注释统计
- 更多语言规则
- 大仓库扫描进度显示
- 历史对比 / diff 支持

## License

GNU General Public License Version 3, 29 June 2007
