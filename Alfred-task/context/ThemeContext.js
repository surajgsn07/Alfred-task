import React, { createContext, useState, useContext, useMemo } from 'react';
import { Alert } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    // ✅ Memoize the value to avoid re-creation on every render
    const contextValue = useMemo(() => ({
        isDarkMode,
        toggleTheme,
    }), [isDarkMode]);  // Only re-create when `isDarkMode` changes

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
