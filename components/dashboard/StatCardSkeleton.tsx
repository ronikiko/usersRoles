
import React from 'react';
import Card from '../ui/Card';

const StatCardSkeleton: React.FC = () => (
    <Card>
        <div className="flex items-center animate-pulse">
            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <div className="ml-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-500 rounded mb-2"></div>
                <div className="h-7 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    </Card>
);

export default StatCardSkeleton;
