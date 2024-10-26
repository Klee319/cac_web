
import React from 'react';

type Props = {
    isDarkMode: boolean;
    toggleMode: () => void;
};

export default function SwitchLightDark({ isDarkMode, toggleMode }: Props) {
    return (
        <a onClick={toggleMode} className="cursor-pointer p-2 rounded text-left">
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </a>
    );
}



