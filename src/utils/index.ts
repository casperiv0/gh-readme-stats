export function clampValue(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}

export function formatNumber(num: number) {
  return Math.abs(num) > 999
    ? `${(Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1)}k`
    : Math.sign(num) * Math.abs(num);
}

export function flexLayout({
  items,
  gap,
  direction,
}: {
  items: any[];
  gap: number;
  direction?: "column";
}) {
  // filter() for filtering out empty strings
  return items.filter(Boolean).map((item, i) => {
    let transform = `translate(${gap * i}, 0)`;
    if (direction === "column") {
      transform = `translate(0, ${gap * i})`;
    }
    return `<g transform="${transform}">${item}</g>`;
  });
}
