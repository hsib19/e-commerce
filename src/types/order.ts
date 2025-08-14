export type CheckoutItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    variant?: string;
    discount?: number;
};

export type CheckoutPayload = {
    customer: {
        name: string;
        email: string;
        streetAddress: string;
        unitNumber?: string;
        postalCode: string;
    };
    items: CheckoutItem[];
};

export type CheckoutResponse = {
    status: boolean;
    client_secret: string;
    message: string;
};

export type OrderDetail = {
    orderId: string;
    customerName: string;
    customerEmail: string;
    streetAddress: string;
    unitNumber?: string;
    postalCode: string;
    items: CheckoutItem[];
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: string;
    createdAt: string;
    token: string;
};

export type PaymentPayload = {
    customer: {
        name: string;
        email: string;
        streetAddress: string;
        unitNumber?: string;
        postalCode: string;
    };
    items: CheckoutItem[];
    paymentMethod: string;
    paymentStatus: string;
};

export type PaymentResponse = {
    orderId: string;
    token: string;
    message: string;
};

export type CheckoutCustomer = {
    name: string;
    email: string;
    streetAddress: string;
    unitAddress?: string;
    postalCode: string;
};

export type Customer = {
    name: string;
    email: string;
    streetAddress: string;
    unitNumber?: string;
    postalCode: string;
};

export type CheckoutState = {
    customer: Customer;
    clientSecret: string | null;
    status: "idle" | "loading" | "success" | "error";
    error?: string;
};
