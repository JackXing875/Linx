#!/usr/bin/env node
import { program } from 'commander';
import { run } from '../src/index.js';

program
  .name('linx')
  .description('Scan a project and print language statistics in the terminal.')
  .argument('[dir]', '要扫描的目录', '.')
  .option('-e, --export <file>', '导出为 JSON/CSV')
  .option('-i, --ignore <pattern...>', '附加忽略规则')
  .option('--no-color', '关闭颜色输出')
  .option('--top <n>', '显示 Top N 最大文件', '5')
  .action(run);

program.parse();
