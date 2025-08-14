import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

// Load env variables
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

// Setup Google Sheets API auth
const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Validation schema with Joi
const schema = Joi.object({
    customer: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        streetAddress: Joi.string().required(),
        unitNumber: Joi.string().allow("").optional(),
        postalCode: Joi.string().required(),
    }).required(),
    items: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().required(),
                name: Joi.string().required(),
                variant: Joi.string().min(1).optional(),
                quantity: Joi.number().min(1).required(),
                price: Joi.number().min(0).required(),
                discount: Joi.number().min(0).max(100).optional().default(0),
            })
        )
        .min(1)
        .required(),
    paymentMethod: Joi.string().valid("credit_card", "bank_transfer", "paypal").required(),
    paymentStatus: Joi.string().required(),
    stripeError: Joi.object().optional(), // opsional, untuk terima error dari Stripe jika ada
});

interface Item {
    price: number;
    quantity: number;
    discount?: number; 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    // Validate input body
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        // Kirim detail error validasi lengkap ke client
        return res.status(400).json({ message: "Validation error", details: error.details });
    }

    const { customer, items, paymentMethod, paymentStatus, stripeError } = value;

    // Jika ada error dari Stripe yang dikirim frontend, tampilkan juga
    if (stripeError) {
        console.error("Stripe error received:", stripeError);
        return res.status(400).json({ message: "Stripe error", details: stripeError });
    }

    // Calculate subtotal, discount, total
    let subtotal = 0;
    let totalDiscount = 0;
    items.forEach((item: Item) => {
        subtotal += item.price * item.quantity;
        totalDiscount += ((item.discount ?? 0) / 100) * item.price * item.quantity;
    });
    const totalAmount = subtotal - totalDiscount;

    // Generate order ID (uuid)
    const orderId = uuidv4();

    // Prepare row data to save in Google Sheets
    const itemsJson = JSON.stringify(items);
    const createdAt = new Date().toISOString();
    const token = uuidv4();

    const row = [
        orderId,
        customer.name,
        customer.email,
        customer.streetAddress,
        customer.unitNumber || "",
        customer.postalCode,
        itemsJson,
        subtotal.toFixed(2),
        totalDiscount.toFixed(2),
        totalAmount.toFixed(2),
        paymentStatus,
        paymentMethod,
        token,
        createdAt,
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: "Orders!A:N",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row],
            },
        });

        return res.status(200).json({
            message: "Order saved successfully",
            orderId,
            totalAmount,
            token
        });
    } catch (e) {
        console.error("Failed to save order:", e);
        return res.status(500).json({ message: "Failed to save order", error: e instanceof Error ? e.message : e });
    }
}
