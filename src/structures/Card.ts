import { Colors } from "../types/Colors";
import { flexLayout } from "../utils";

interface CardData {
  width?: number;
  height?: number;
  colors: Colors;
}

interface Padding {
  x: number;
  y: number;
}

export class Card {
  width: number;
  height: number;
  css = "";
  colors: Colors = {} as Colors;
  borderRadius = 4.5;
  title: string | null = null;

  padding: Padding = { x: 25, y: 35 };

  constructor({ width = 100, height = 100, colors }: CardData) {
    this.width = width;
    this.height = height;

    this.colors = colors;
  }

  setCSS(v: string) {
    this.css = v;
  }

  setTitle(str: string) {
    this.title = str;
  }

  renderTitle() {
    const titleText = `
    <text
      x="0"
      y="0"
      class="header"
      data-testid="header"
    >${this.title}</text>
  `;

    return `
    <g
      data-testid="card-title"
      transform="translate(${this.padding.x}, ${this.padding.y})"
    >
      ${flexLayout({
        items: [titleText],
        gap: 25,
      }).join("")}
    </g>
  `;
  }

  render(body: string) {
    return `
      <svg
        width="${this.width}"
        height="${this.height}"
        viewBox="0 0 ${this.width} ${this.height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          .header {
            font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
          }
          ${this.css}

          * { animation-duration: 0s !important; animation-delay: 0s !important; }
        </style>
        <rect
          data-testid="card-bg"
          x="0.5"
          y="0.5"
          rx="${this.borderRadius}"
          height="99%"
          stroke="${this.colors.borderColor}"
          width="${this.width - 1}"
          fill="${this.colors.bgColor}"
          stroke-opacity="${this.colors?.borderColor ? 1 : 0}"
        />

        ${!this.title ? "" : this.renderTitle()}

        <g
          data-testid="main-card-body"
          transform="translate(0, ${!this.title ? this.padding.x : this.padding.y + 20})"
        >
          ${body}
        </g>
      </svg>
    `;
  }
}
