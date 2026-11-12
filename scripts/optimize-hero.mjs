import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Resolve from this script so the command also works outside the project directory.
const original = new URL('../public/images/hero/pasta.jpg', import.meta.url);
const output = new URL('../public/images/hero/pasta-mobile.avif', import.meta.url);
const dataFile = new URL('../data/hero-mobile.ts', import.meta.url);

const image = await sharp(fileURLToPath(original))
  .rotate()
  .resize({ width: 480, withoutEnlargement: true })
  .avif({ quality: 50, effort: 6, chromaSubsampling: '4:2:0' })
  .toBuffer();

const dataUri = `data:image/avif;base64,${image.toString('base64')}`;
const metadata = await sharp(image).metadata();
const moduleSource = `/** Original credited pasta photograph, encoded once at ${metadata.width}×${metadata.height} / AVIF quality 50.
 * Server Hero embeds this small first-screen image to avoid a phone's extra request. */
export const mobilePastaSrc = ${JSON.stringify(dataUri)};
`;

await mkdir(new URL('./', output), { recursive: true });
await mkdir(new URL('./', dataFile), { recursive: true });
await writeFile(output, image);
await writeFile(dataFile, moduleSource, 'utf8');

console.log(`Generated phone hero: ${metadata.width}×${metadata.height} AVIF, ${image.length.toLocaleString('en-US')} bytes.`);
console.log('Updated public/images/hero/pasta-mobile.avif and data/hero-mobile.ts.');
