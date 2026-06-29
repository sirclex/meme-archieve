// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import Image from "@/types/image";

interface ApiSearchResponse {
    items: Array<{
        img: string;
        title: string;
    }>;
    has_more: boolean;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const text = Array.isArray(req.query.text)
        ? req.query.text[0]
        : req.query.text;
    const rawOffset = Array.isArray(req.query.offset)
        ? req.query.offset[0]
        : req.query.offset;
    const offset = Number(rawOffset ?? 0);
    const response = await axios.get<ApiSearchResponse>(process.env.API_URL!, {
        params: {
            text: text,
            offset: Number.isNaN(offset) ? 0 : offset,
        },
    });

    const items: Image[] = response.status === 200
        ? response.data.items.map((item) => ({
            img: `memes/${item.img}`,
            title: item.title,
        }))
        : [];

    return res.status(200).json({
        items,
        hasMore: Boolean(response.data.has_more),
    });
}
