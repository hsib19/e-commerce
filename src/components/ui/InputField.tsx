import React from "react";

type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    value: string;
    placeholder?: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

export default function InputField({
    label,
    name,
    type = "text",
    value,
    placeholder,
    error,
    onChange,
    required = false,
}: InputFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="block font-medium mb-1">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                required={required}
                onChange={onChange}
                className={`w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    }`}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
}
