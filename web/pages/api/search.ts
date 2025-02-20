// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import Image from "@/types/image";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { text } = req.query;
    const response = await axios.get(process.env.API_URL!, {
        params: {
            text: text,
        },
    });
    const processed_list: Image[] = [];
    if (response.status == 200) {
        for (let i = 0; i < response.data.length; i++) {
            const data = response.data[i];
            const img: Image = {
                img: `memes/${data.img}`,
                title: data.title,
            }
            processed_list.push(img);
        }
    }
    return res.status(200).json(processed_list);
}
