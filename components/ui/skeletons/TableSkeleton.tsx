
import React from 'react';
import Card from '../Card';

interface TableSkeletonProps {
    rows?: number;
    cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 5 }) => {
    return (
        <Card>
            <div className="overflow-x-auto">
                <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700">
                        <div className="flex">
                            {Array.from({ length: cols }).map((_, i) => (
                                <div key={i} className="flex-1 px-6 py-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.from({ length: rows }).map((_, i) => (
                            <div key={i} className="flex">
                                {Array.from({ length: cols }).map((_, j) => (
                                    <div key={j} className="flex-1 px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TableSkeleton;
