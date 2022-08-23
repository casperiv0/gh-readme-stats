import { Card } from "../structures/Card.js";
import { Colors } from "../types/Colors.js";
import { Stats } from "../types/Stats.js";
import { clampValue, flexLayout, formatNumber } from "../utils/index.js";
import { getStyles } from "../utils/getStyles.js";
import { icons } from "../utils/icons.js";

interface CreateNodeOptions {
  icon: string;
  label: string;
  value: number;
  id: string;
}

function createTextNode({ icon, label, value, id }: CreateNodeOptions) {
  const kValue = formatNumber(value);

  const iconSvg = `
      <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
        ${icon}
      </svg>
    `;

  return `
    <g transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat bold" x="25" y="12.5">${label}:</text>
      <text
        class="stat"
        x="160"
        y="12.5"
        data-testid="${id}"
      >${kValue}</text>
    </g>
  `;
}

export function renderStatsCard(stats: Stats, options: { colors: Colors }) {
  const STATS = {
    stars: {
      icon: icons.star,
      label: "Total Stars",
      value: stats.totalStars,
      id: "stars",
    },
    commits: {
      icon: icons.commits,
      label: "Total Commits",
      value: stats.totalCommits,
      id: "commits",
    },
    prs: {
      icon: icons.prs,
      label: "Total PRs",
      value: stats.totalPRs,
      id: "prs",
    },
    issues: {
      icon: icons.issues,
      label: "Total Issues",
      value: stats.totalIssues,
      id: "issues",
    },
    contribs: {
      icon: icons.contribs,
      label: "Contributed to",
      value: stats.contributedTo,
      id: "contribs",
    },
  };

  const statItems = Object.keys(STATS).map((key) =>
    // create the text nodes, and pass index so that we can calculate the line spacing
    createTextNode({
      ...STATS[key],
    }),
  );

  const width = clampValue(50, 270, Infinity);
  const height = Math.max(5 + (statItems.length + 1) * 25, 0);

  const card = new Card({ width, height, colors: options.colors });

  const styles = getStyles(options.colors);

  card.setCustomCSS(styles);

  return card.render(`
  <svg x="0" y="0">
    ${flexLayout({
      items: statItems,
      gap: 25,
      direction: "column",
    }).join("")}
  </svg>
`);
}
