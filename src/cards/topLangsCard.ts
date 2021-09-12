import { Card } from "../structures/Card.js";
import { Colors } from "../types/Colors.js";
import { EdgeNode } from "../types/TopLanguagesResponse.js";
import { clampValue } from "../utils/index.js";

const DEFAULT_CARD_WIDTH = 300;
const DEFAULT_LANGS_COUNT = 7;
const CARD_PADDING = 25;

function _calculateCompactLayoutHeight(totalLangs: number) {
  return 90 + Math.round(totalLangs / 2) * 25;
}

function createCompactLangNode({ lang, totalSize, x, y }: any) {
  const percentage = ((lang.size / totalSize) * 100).toFixed(2);
  const color = lang.color || "#858585";

  return `
    <g transform="translate(${x}, ${y})">
      <circle cx="5" cy="6" r="5" fill="${color}" />
      <text data-testid="lang-name" x="15" y="10" class='lang-name'>
        ${lang.name} ${percentage}%
      </text>
    </g>
    `;
}

function createLanguageTextNode({ langs, totalSize, x, y }: any) {
  return (langs as any[]).map((lang, index) => {
    if (index % 2 === 0) {
      return createCompactLangNode({
        lang,
        x,
        y: 12.5 * index + y,
        totalSize,
        index,
      });
    }
    return createCompactLangNode({
      lang,
      x: 150,
      y: 12.5 + 12.5 * index,
      totalSize,
      index,
    });
  });
}

function useLanguages(topLangs: Record<string, EdgeNode>, hide: string[], langs_count: number) {
  const langsCount = clampValue(langs_count, 1, 10);

  // filter out languages to be hidden
  const langs = Object.values(topLangs)
    .sort((a, b) => b.size - a.size)
    .filter(({ name }) => {
      return !hide.includes(name.toLowerCase());
    })
    .slice(0, langsCount);

  const totalLanguageSize = langs.reduce((acc, curr) => acc + curr.size, 0);

  return { langs, totalLanguageSize };
}

function renderCompactLayout(langs: EdgeNode[], width: number, totalLanguageSize: number) {
  const paddingRight = 50;
  const offsetWidth = width - paddingRight;
  // progressOffset holds the previous language's width and used to offset the next language
  // so that we can stack them one after another, like this: [--][----][---]
  let progressOffset = 0;
  const compactProgressBar = langs
    .map((lang) => {
      const percentage = parseFloat(((lang.size / totalLanguageSize) * offsetWidth).toFixed(2));

      const progress = percentage < 10 ? percentage + 10 : percentage;

      const output = `
          <rect
            mask="url(#rect-mask)"
            data-testid="lang-progress"
            x="${progressOffset}"
            y="0"
            width="${progress}"
            height="8"
            fill="${lang.color || "#858585"}"
          />
        `;
      progressOffset += percentage;
      return output;
    })
    .join("");

  return `
      <mask id="rect-mask">
        <rect x="0" y="0" width="${offsetWidth}" height="8" fill="white" rx="5" />
      </mask>

      ${compactProgressBar}
      ${createLanguageTextNode({
        x: 0,
        y: 25,
        langs,
        totalSize: totalLanguageSize,
      }).join("")}
    `;
}

interface Options {
  hide?: string[];
  colors?: Colors;
}

export function renderTopLanguages(
  topLangs: Record<string, EdgeNode>,
  options: Options = {} as Options,
) {
  const { langs, totalLanguageSize } = useLanguages(
    topLangs,
    options.hide ?? [],
    DEFAULT_LANGS_COUNT,
  );

  const width = DEFAULT_CARD_WIDTH + 50;
  const height = _calculateCompactLayoutHeight(langs.length);
  const layout = renderCompactLayout(langs, width, totalLanguageSize);

  const card = new Card({
    width,
    height,
    colors: options.colors ?? ({} as Colors),
    title: "Most Used Languages",
  });

  card.setCustomCSS(
    `.lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${
      options.colors?.textColor ?? "#858585"
    } }`,
  );

  return card.render(`
    <svg data-testid="lang-items" x="${CARD_PADDING}">
      ${layout}
    </svg>
  `);
}
