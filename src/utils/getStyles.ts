import { Colors } from "../types/Colors.js";

export function getStyles({ textColor, iconColor }: Pick<Colors, "textColor" | "iconColor">) {
  return `
      .stat {
        font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${textColor};
      }

      .bold { font-weight: 700; }
      .icon {
        fill: ${iconColor};
        display: block;
      }
    `;
}
