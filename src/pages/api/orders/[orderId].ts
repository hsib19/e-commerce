import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { orderId, token } = req.query;

    if (typeof orderId !== "string" || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid parameters" });
    }

    try {
        // Read sheet data
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: "Orders!A:N",
        });

        const rows = response.data.values ?? [];

        // Cari row dengan orderId dan token cocok
        const orderRow = rows.find(row => row[0] === orderId && row[12] === token);

        if (!orderRow) {
            return res.status(404).json({ message: "Order not found or invalid token" });
        }

        // Mapping row ke object bisa kamu sesuaikan
        const order = {
            orderId: orderRow[0],
            customerName: orderRow[1],
            customerEmail: orderRow[2],
            streetAddress: orderRow[3],
            unitNumber: orderRow[4],
            postalCode: orderRow[5],
            items: JSON.parse(orderRow[6]),
            subtotal: orderRow[7],
            totalDiscount: orderRow[8],
            totalAmount: orderRow[9],
            paymentStatus: orderRow[10],
            paymentMethod: orderRow[11],
            createdAt: orderRow[12],
        };

        return res.status(200).json(order);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch order" });
    }
}
