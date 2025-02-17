import React from "react";
import { ImageList, ImageListItem } from "@mui/material";

import path from "path";
import fs from "fs";

const loadImages = () => {
    const imagesDir = path.join(process.cwd(), "public/images");
    const imageFiles = fs.readdirSync(imagesDir);

    return imageFiles.map((file) => ({
        img: `/memes/images/${file}`,
        title: path.basename(file, path.extname(file)),
    }));
};

const itemData = loadImages();

export default function Home() {

    return (
        <ImageList cols={10} gap={8}>
            {itemData.map((item) => (
                <ImageListItem key={item.img}>
                    <img
                        src={`${item.img}?&fit=cover`}
                        alt={item.title}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
