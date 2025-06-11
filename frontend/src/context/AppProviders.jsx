import { useState } from "react";
import { ThemeProvider } from "./ThemeContext";
import { SidebarProvider } from "./SideBarContext";
import { AuthProvider } from "./AuthContext";
import { MessageProvider } from "./MessageContext";
import { TaskProvider } from "./TaskContext";
const AppProviders = ({ children }) => {
    return (
        <TaskProvider>
            <MessageProvider>
                <ThemeProvider>
                    <SidebarProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </SidebarProvider>
                </ThemeProvider>
            </MessageProvider>
        </TaskProvider>
    );
}

export default AppProviders;