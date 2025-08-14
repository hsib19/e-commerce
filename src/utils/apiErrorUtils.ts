export interface ApiErrorResponse {
    response: {
        data: {
            details?: { message: string }[] | unknown;
            message?: string;
            [key: string]: unknown; 
        };
    };
}

export function isApiError(error: unknown): error is ApiErrorResponse {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const resp = (error as Record<string, unknown>).response;
        if (
            typeof resp === "object" &&
            resp !== null &&
            "data" in resp
        ) {
            return true;
        }
    }
    return false;
}

export function extractApiErrorMessage(error: unknown): string {
    if (isApiError(error)) {
        const data = error.response.data;
        if (data.details) {
            return Array.isArray(data.details)
                ? data.details.map((d: { message: string }) => d.message).join(", ")
                : JSON.stringify(data.details);
        }
        if (typeof data.message === "string") {
            return data.message;
        }
        return "Failed to send payment data";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "Failed to send payment data";
}
