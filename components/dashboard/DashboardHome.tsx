import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import type { User } from '../../types';
import { getMockUsers } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element }> = ({ title, value, icon }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 dark:text-primary-300">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    </Card>
);

const DashboardHome: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const userList = await getMockUsers();
            setUsers(userList);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;

    const welcomeMessage = `Welcome back, ${currentUser?.name}!`;
    const lastLogin = `Your last login was on ${currentUser?.lastLogin.toLocaleString()}`;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{welcomeMessage}</h1>
                <p className="text-gray-500 dark:text-gray-400">{lastLogin}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={loading ? '...' : totalUsers} icon={<UsersIcon />} />
                <StatCard title="Active Users" value={loading ? '...' : activeUsers} icon={<CheckCircleIcon />} />
                <StatCard title="Your Role" value={currentUser?.role ?? 'N/A'} icon={<ShieldIcon />} />
            </div>

            <div className="mt-8">
                 <Card>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
                     <p className="text-gray-600 dark:text-gray-300">Use the sidebar to navigate through the user management system.</p>
                </Card>
            </div>
        </div>
    );
};

// Icons
const UsersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CheckCircleIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056 2.5 2.5 0 00-1.382-4.432z" /></svg>;


export default DashboardHome;