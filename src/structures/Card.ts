interface CardData {
  width?: number;
  height?: number;
  colors: Colors;
}

interface Padding {
  x: number;
  y: number;
}

export interface Colors {
  bgColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
}

export class Card {
  width: number;
  height: number;
  css = "";
  colors: Colors = {} as Colors;
  borderRadius = 4.5;

  padding: Padding = { x: 25, y: 35 };

  constructor({ width = 100, height = 100, colors }: CardData) {
    this.width = width;
    this.height = height;

    this.colors = colors;
  }

  setCSS(v: string) {
    this.css = v;
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
          fill="${typeof this.colors.bgColor === "object" ? "url(#gradient)" : this.colors.bgColor}"
          stroke-opacity="0"
        />
        <g
          data-testid="main-card-body"
          transform="translate(0, ${this.padding.x})"
        >
          ${body}
        </g>
      </svg>
    `;
  }
}
