import languageColors from "../data/languages.json";
import { Card } from "../structures/Card.js";
import { Colors } from "../types/Colors.js";
import { WakatimeLanguage, WakatimeStats } from "../types/WakatimeStats.js";
import { getStyles } from "../utils/getStyles.js";

interface Options {
  colors: Colors;
  count: number;
}

export function renderWakatimeCard({ languages }: WakatimeStats, options: Options) {
  const cssStyles = getStyles(options.colors);

  const width = 490;
  const height = 90 + Math.round(options.count / 2) * 25;
  let progressOffset = 0;

  const compactProgressBar = languages
    .slice(0, options.count)
    .map((language) => {
      // const progress = (width * lang.percent) / 100;
      const progress = ((width - 25) * language.percent) / 100;

      const languageColor = languageColors[language.name] || "#858585";

      const output = `
          <rect
            mask="url(#rect-mask)"
            data-testid="lang-progress"
            x="${progressOffset}"
            y="0"
            width="${progress}"
            height="8"
            fill="${languageColor}"
          />
        `;
      progressOffset += progress;
      return output;
    })
    .join("");

  const layout = `
    <mask id="rect-mask">
      <rect x="25" y="0" width="${width - 50}" height="8" fill="white" rx="5" />
    </mask>

    ${compactProgressBar}
    ${createLanguageTextNode({
      x: 0,
      y: 25,
      langs: languages.slice(0, options.count),
    }).join("")}
`;

  const card = new Card({
    width,
    height,
    colors: options.colors,
  });

  card.setTitle("Wakatime Stats");
  card.setCSS(`
    ${cssStyles}
    .lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${options.colors.textColor} }
    `);

  return card.render(`
    <svg x="0" y="0" width="100%">
      ${layout}
    </svg>
`);
}

interface CreateLanguageOptions {
  langs: WakatimeLanguage[];
  x: number;
  y: number;
}

function createCompactLangNode({
  lang,
  x,
  y,
}: Pick<CreateLanguageOptions, "x" | "y"> & { lang: WakatimeLanguage }) {
  const color = languageColors[lang.name] || "#858585";

  return `
    <g transform="translate(${x}, ${y})">
      <circle cx="5" cy="6" r="5" fill="${color}" />
      <text data-testid="lang-name" x="15" y="10" class='lang-name'>
        ${lang.name} - ${lang.text}
      </text>
    </g>
    `;
}

function createLanguageTextNode({ langs, y }: Exclude<CreateLanguageOptions, "x">) {
  return langs.map((lang, index) => {
    if (index % 2 === 0) {
      return createCompactLangNode({
        lang,
        x: 25,
        y: 12.5 * index + y,
      });
    }
    return createCompactLangNode({
      lang,
      x: 230,
      y: 12.5 + 12.5 * index,
    });
  });
}
