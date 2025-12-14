import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ChatWidget } from './ChatWidget';

export const PublicLayout: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24">
                <Outlet />
            </main>
            <ChatWidget />
        </div>
    );
};
