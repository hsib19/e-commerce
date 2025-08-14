import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { Product } from "@/types/product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { search } = req.query;

    const filePath = path.join(process.cwd(), "data", "products.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    let products: Product[] = JSON.parse(jsonData);

    if (typeof search === "string" && search.trim() !== "") {
        const keyword = search.toLowerCase();
        products = products.filter(
            (p) =>
                p.name.toLowerCase().includes(keyword) 
        );
    }

    res.status(200).json({
        status: true,
        data: products,
        message: "fetch product successfully",
    });
}
