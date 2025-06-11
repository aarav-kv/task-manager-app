import { createContext, useEffect, useState } from "react";
export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const TYPE = {
        ERROR: 'error',
        WARNING: 'warning',
        SUCCESS: 'success',
        INFO: 'info'
    };

    const [messages, setMessages] = useState([]);

    function add(text, type) {
        const id = Date.now();
        const message = {
            id: id,
            text,
            type
        };
        setMessages(prev => [...prev, message]);
    }

    const dismiss = async (id) => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
    };

    return (
        <MessageContext.Provider value={{ messages, add, dismiss, TYPE }}>
            {children}
        </MessageContext.Provider >
    );
}