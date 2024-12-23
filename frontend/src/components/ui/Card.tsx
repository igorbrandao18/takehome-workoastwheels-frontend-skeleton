import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

interface CardProps {
    title: string;
    value: string | number;
    type?: 'number' | 'currency' | 'percentage';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const Card: React.FC<CardProps> = ({
    title,
    value,
    type = 'number',
    trend
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                    {value}
                </p>
                {trend && (
                    <span className={`ml-2 flex items-baseline text-sm font-semibold ${
                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {trend.isPositive ? (
                            <ArrowUpIcon className="w-4 h-4 self-center" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4 self-center" />
                        )}
                        {trend.value}%
                    </span>
                )}
            </div>
        </div>
    );
}; 