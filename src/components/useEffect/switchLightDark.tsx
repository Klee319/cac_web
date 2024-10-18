"use client"
import { useState, useEffect } from 'react';

export default function SwitchLightDark() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <a onClick={toggleMode} className="cursor-pointer p-2 rounded text-left">
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </a>
    );
}