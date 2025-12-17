import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from './ChatWidget';
import { WhatsAppButton } from './WhatsAppButton';

export const PublicLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24" key={location.pathname}>
                <div className="animate-fade-in-up">
                    <Outlet />
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
            <ChatWidget />
        </div>
    );
};
