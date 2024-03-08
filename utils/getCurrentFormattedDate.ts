function formatDateTimeComponent(value: number): string {
  return String(value).padStart(2, '0');
}

export default function (): string {
  const now = new Date();

  const year = now.getFullYear();
  // 月份是從 0 開始的
  const month = formatDateTimeComponent(now.getMonth() + 1);
  const day = formatDateTimeComponent(now.getDate());

  const hours = formatDateTimeComponent(now.getHours());
  const minutes = formatDateTimeComponent(now.getMinutes());
  const seconds = formatDateTimeComponent(now.getSeconds());

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
