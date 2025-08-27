import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../ui/Card';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
      <Card className="max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">Appearance</h2>
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200">Theme</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred interface theme.</p>
          </div>
          <div className="flex items-center space-x-3">
             <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Light</span>
             <button
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === 'dark'}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
                }`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
             <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dark</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
