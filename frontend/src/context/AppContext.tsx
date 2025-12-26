import React, { createContext, useContext, useState, useEffect } from "react";


interface AppContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    selectedProject: any | null;
    setSelectedProject: (project: any | null) => void;
    user: any | null;
    token: string | null;
    login: (user: any, token: string) => void;
    logout: () => void;
    showCreateIssue: boolean;
    setShowCreateIssue: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showCreateIssue, setShowCreateIssue] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData: any, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AppContext.Provider value={{
            activeTab,
            setActiveTab,
            selectedProject,
            setSelectedProject,
            user,
            token,
            login,
            logout,
            showCreateIssue,
            setShowCreateIssue
        }}>
            {children}
        </AppContext.Provider>
    );
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
