export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatValue(value: number, unit: string): string {
  return `${value}${unit}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "critical":
      return "red";
    case "warning":
      return "amber";
    case "ok":
    case "operational":
    case "resolved":
      return "green";
    case "offline":
    case "maintenance":
      return "slate";
    case "info":
      return "blue";
    default:
      return "slate";
  }
}

export function clampRandom(base: number, variance: number): number {
  return Math.round((base + (Math.random() - 0.5) * 2 * variance) * 10) / 10;
}
