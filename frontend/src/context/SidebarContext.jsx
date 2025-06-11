// In SidebarContext.jsx - Add a transition function
import { createContext, useState, useEffect } from "react";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isOpen, toggleSidebarState] = useState(false);
    const [pageName, setPageName] = useState('');
    const [activeTab, setActiveTab] = useState('today');
    const [nav, setNav] = useState({ title: "today", icon: "house" });

    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [userTheme, setUserTheme] = useState(() => {
        const savedTheme = localStorage.getItem("user-theme");
        if (savedTheme) {
            return savedTheme;
        } else {
            return getCurrentTheme ? "dark" : "light";
        }
    });

    useEffect(() => {
        document.body.classList.toggle("dark", userTheme === "dark");
    }, [userTheme]);

    const toggleUserTheme = () => {
        const currentTheme = localStorage.getItem("user-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("user-theme", newTheme);
        setUserTheme(newTheme);
    };

    const toggleSidebar = () => {
        toggleSidebarState((prev) => (prev === false ? true : false));
    };

    return (
        <SidebarContext.Provider value={{
            isOpen,
            toggleSidebar,
            activeTab,
            setActiveTab,
            nav,
            setNav,
            userTheme,
            toggleUserTheme,
            setPageName,
            pageName,
        }}>
            {children}
        </SidebarContext.Provider>
    );
};