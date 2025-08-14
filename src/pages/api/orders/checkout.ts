import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import Joi from "joi";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const customerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    streetAddress: Joi.string().min(5).required(),
    unitNumber: Joi.string().min(5).optional(),
    postalCode: Joi.number().required(),
});

const itemSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().min(2).max(100).required(),
    variant: Joi.string().min(2).max(100).optional(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0).required(),
    discount: Joi.number().min(0).max(100).default(0),
});

const checkoutSchema = Joi.object({
    customer: customerSchema.required(),
    items: Joi.array().items(itemSchema).min(1).required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { error, value } = checkoutSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => d.message),
        });
    }

    const { customer, items } = value;

    // Hitung total amount (dalam smallest currency unit, misal cent)
    let totalAmount = 0;
    for (const item of items) {
        const price = item.price;
        const discount = item.discount ?? 0;
        const discountedPrice = price * (1 - discount / 100);
        totalAmount += discountedPrice * item.quantity;
    }
    const amountInCents = Math.round(totalAmount * 100);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "sgd",
            metadata: {
                customer_name: customer.name,
                customer_email: customer.email,
            },
            payment_method_types: ["card"],
        });

        const response = {
            status: true,
            client_secret: paymentIntent.client_secret,
            message: "craete token checkout sucessfully"
        }

        return res.status(200).json(response);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        } else {
            console.error('Unknown error:', err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
