import { useEffect, useState } from "react";
import { useMessage } from "../hooks/useMessage";
import '../styles/message.css';
import { Info, CircleX, CircleAlert, CircleCheck } from 'lucide-react'
import Message from "./Message";
export default function MessageHandler() {
    let { messages, dismiss, TYPE } = useMessage();

    const getIcon = (type) => {
        switch (type) {
            case TYPE.ERROR:
                return <span className="message-icon error-icon"><CircleX /></span>;
            case TYPE.WARNING:
                return <span className="message-icon warning-icon"><CircleAlert /></span>;
            case TYPE.SUCCESS:
                return <span className="message-icon success-icon"><CircleCheck /></span>;
            case TYPE.INFO:
                return <span className="message-icon info-icon"><Info /></span>;
            default:
                return null;
        }
    };

    return (
        <div className="message-container">
            {messages.map((msg) => (
                <Message
                    key={msg.id}
                    msg={msg}
                    messages={messages}
                    dismiss={dismiss}
                    getIcon={getIcon}
                />
            ))}
        </div>
    );
}