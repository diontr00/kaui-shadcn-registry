import path from "path";
import fs from "fs/promises";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import sharp from "sharp";

interface OgConfig {
  title: string;
  tags?: string[];
  secondaryText?: string;
}

const [bgImg, logo, regularFont, boldFont] = await Promise.all([
  fs.readFile(path.resolve("./src/assets/og/graph-paper.svg"), "base64"),
  fs.readFile(path.resolve("./src/assets/og/logo.png"), "base64"),
  fs.readFile(path.resolve("./src/assets/og/Geist-Regular.ttf")),
  fs.readFile(path.resolve("./src/assets/og/Geist-Bold.ttf")),
]);

const satoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Geist",
      data: regularFont,
      weight: 400,
      style: "normal",
    },
    {
      name: "Geist",
      data: boldFont,
      weight: 600,
      style: "normal",
    },
  ],
} satisfies SatoriOptions;

export async function generateOpenGraphImage({
  title,
  tags = [],
  secondaryText,
}: OgConfig) {
  const markup = html(`
    <div style="
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: #09090b;
      padding: 80px;
      font-family: 'Geist';
      position: relative;
    ">
      <img 
        src="data:image/svg+xml;base64,${bgImg}" 
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 1200px;
          height: 630px;
          object-fit: cover;
          opacity: 0.15; /* Adjust opacity to make text readable against the paper grid */
        " 
      />

      <div style="display: flex; flex-direction: column; gap: 20px; z-index: 10;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${tags
            .map(
              (tag) => `
            <span style="
              background-color: #27272a;
              color: #f4f4f5;
              padding: 6px 16px;
              border-radius: 9999px;
              font-size: 18px;
              font-weight: 600;
              border: 1px solid #3f3f46;
            ">${tag}</span>
          `,
            )
            .join("")}
        </div>

        <h1 style="
          font-size: 64px;
          color: #ffffff;
          line-height: 1.2;
          margin: 20px 0 0 0;
          font-weight: 700;
          letter-spacing: -0.05em;
        ">${title}</h1>
      </div>

      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #27272a;
        padding-top: 40px;
        z-index: 10;
      ">
        <span style="color: #a1a1aa; font-size: 24px; font-weight: 500;">
          ${secondaryText || "Documentation"}
        </span>
        
        <div style="display: flex; align-items: center; gap: 12px;">
          <img 
            src="data:image/png;base64,${logo}" 
            style="width: 32px; height: 32px; object-fit: contain;" 
          />
          <span style="color: rgb(189, 2, 73); font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
            KaUI Shadcn Registry
          </span>
        </div>
      </div>
    </div>
  `);

  const svg = await satori(markup as any, satoriOptions);

  const webpBuffer = await sharp(Buffer.from(svg))
    .webp({ quality: 100 })
    .toBuffer();

  const responseBody = new Uint8Array(webpBuffer);
  return new Response(responseBody, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
