import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const source = "public/work",
  output = "public/work-optimized";
await fs.mkdir(output, { recursive: true });
const files = (await fs.readdir(source))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();
const photos = [];
for (const file of files) {
  const id = path.parse(file).name;
  const meta = await sharp(path.join(source, file)).rotate().metadata();
  const variants = [];
  for (const width of [480, 960, 1600]) {
    const name = `${id}-${width}.webp`;
    const info = await sharp(path.join(source, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(output, name));
    variants.push({
      src: `/work-optimized/${name}`,
      width: info.width,
      height: info.height,
    });
  }
  photos.push({
    id,
    original: `/work/${file}`,
    src: variants[1].src,
    full: variants[2].src,
    srcSet: variants
      .filter((v, i, a) => a.findIndex((x) => x.width === v.width) === i)
      .map((v) => `${v.src} ${v.width}w`)
      .join(", "),
    width: variants[2].width,
    height: variants[2].height,
  });
}
await fs.writeFile(
  "src/data/photos.generated.json",
  JSON.stringify(photos, null, 2) + "\n",
);
console.log(`Prepared ${photos.length} originals without modifying them.`);
