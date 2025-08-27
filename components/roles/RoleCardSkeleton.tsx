
import React from 'react';
import Card from '../ui/Card';

const RoleCardSkeleton: React.FC = () => {
    return (
        <Card>
            <div className="animate-pulse">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-500 rounded mb-3"></div>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="m-1 h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default RoleCardSkeleton;
