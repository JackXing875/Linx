export function coffeeCount(lines) {
  return Math.round(lines / 300);
}

export function readingTime(lines) {
  const minutes = (lines * 8) / 300;
  if (minutes >= 60 * 8) {
    return `${(minutes / (60 * 8)).toFixed(1)} days`;
  }

  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(1)} hours`;
  }

  return `${Math.max(1, Math.round(minutes))} minutes`;
}


export function findHottestFile(fileMap) {
  return [...fileMap.entries()].sort((a, b) => b[1].total - a[1].total)[0] ?? null;
}
