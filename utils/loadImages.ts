import path from "path";
import fs from "fs";

interface Img {
    img: string,
    title: string
}

export async function loadImages() {
    const imagesDir = path.join(process.cwd(), "public/images");
    const imageFiles = fs.readdirSync(imagesDir);

    return imageFiles.map((file) => ({
        img: `/memes/images/${file}`,
        title: path.basename(file, path.extname(file)),
    }));
};

export type {Img}
