import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { Product } from "@/types/product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;

    if (typeof slug !== "string" || slug.trim() === "") {
        return res.status(400).json({
            status: false,
            data: null,
            message: "Slug is required",
        });
    }

    const filePath = path.join(process.cwd(), "data", "products.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const products: Product[] = JSON.parse(jsonData);

    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return res.status(404).json({
            status: false,
            data: null,
            message: `Product with slug "${slug}" not found`,
        });
    }

    res.status(200).json({
        status: true,
        data: product,
        message: "fetch product detail successfully",
    });
}
