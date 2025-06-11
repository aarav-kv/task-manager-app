import { useEffect, useRef, useState } from "react";

export default function Message({ msg, dismiss, getIcon, arr }) {
    const [slideOut, setSlideOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setSlideOut(true);
            setTimeout(async () => dismiss(msg.id), 300);
        }, 3000);

        return async () => clearTimeout(timer);
    }, [msg.id]);

    const handleClose = () => {
        setSlideOut(true);
        setTimeout(() => dismiss(msg.id), 300);
    };

    return (
        <div className={`message ${msg.type} ${slideOut ? 'slide-out' : 'slide-in'}`}>
            <div className="msg_content">
                {getIcon(msg.type)}
                <span className="message-text">{msg.text}</span>
                <button className="close-button" onClick={() => handleClose()}>×</button>
            </div>
            <div className="msg_loader loader-animation"></div>
        </div>
    );
}
