// 咖啡杯换算（约 300 行 = 1 杯咖啡）
export function coffeeCount(lines) {
  return Math.round(lines / 300);
}

// 按平均阅读速度估算读完时间（300词/分钟，1行≈8词）
export function readingTime(lines) {
  const minutes = (lines * 8) / 300;
  if (minutes >= 60 * 8) {
    return `${(minutes / (60 * 8)).toFixed(1)} 个工作日`;
  }

  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(1)} 小时`;
  }

  return `${Math.max(1, Math.round(minutes))} 分钟`;
}

// COCOMO 模型估算项目价值
export function estimateValue(lines) {
  const kloc = lines / 1000;
  const effort = 2.4 * Math.pow(kloc, 1.05); // 人月
  return Math.round(effort * 8000); // 按月薪估算
}

// 找出最大的文件
export function findHottestFile(fileMap) {
  return [...fileMap.entries()].sort((a, b) => b[1].total - a[1].total)[0] ?? null;
}
