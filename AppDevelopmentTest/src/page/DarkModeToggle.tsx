import React, { useState, useEffect } from "react";
import { Switch } from "antd"; // You can use Ant Design's Switch component for the toggle

const DarkModeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Check the localStorage for the user's dark mode preference
    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode");
        if (storedMode) {
            setIsDarkMode(storedMode === "true");
            handleToggle(true);
        }
    }, []);

    // Toggle dark mode on and off
    const handleToggle = (checked: boolean) => {
        setIsDarkMode(checked);
        localStorage.setItem("darkMode", checked ? "true" : "false");

        if (checked) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <div className="flex items-center mb-4 justify-end">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={isDarkMode} onChange={handleToggle} />
        </div>
    );
};

export default DarkModeToggle;
