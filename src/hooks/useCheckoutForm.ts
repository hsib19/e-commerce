import { useState } from "react";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, unknown>>(initialState: T, validate: (data: T) => FormErrors<T>) {
    const [form, setForm] = useState<T>(initialState);
    const [errors, setErrors] = useState<FormErrors<T>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        const validationErrors = validate({ ...form, [name]: value });
        setErrors(validationErrors);
    };

    const isValid = Object.keys(validate(form)).length === 0;

    return { form, setForm, errors, setErrors, handleChange, isValid };
}
