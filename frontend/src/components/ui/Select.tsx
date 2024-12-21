import React from 'react';
import clsx from 'clsx';

interface Option {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Option[];
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className,
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                className={clsx(
                    'w-full px-3 py-2 border rounded-md shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    error ? 'border-red-500' : 'border-gray-300',
                    className
                )}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}; 