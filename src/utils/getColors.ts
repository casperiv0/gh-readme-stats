export function getColors(query: Record<string, any>) {
  return {
    titleColor: query.titleColor ? `#${query.titleColor}` : "#2f80ed",
    iconColor: query.iconColor ? `#${query.iconColor}` : "#4c71f2",
    textColor: query.textColor ? `#${query.textColor}` : "#333333",
    bgColor: query.bgColor ? `#${query.bgColor}` : "#fffefe",
    borderColor: query.borderColor && `#${query.borderColor}`,
  };
}
