import { useEffect, useState } from "react";
import eveningIcon from "../assets/evening-icon.svg";
import nightIcon from "../assets/night-icon.svg";
import morningIcon from "../assets/morning-icon.svg";

export function useGreeting() {
    const [message, setMessage] = useState("");
    const [icon, setIcon] = useState(null);
    useEffect(() => {
        const updateGreeting = () => {
            const hours = new Date().getHours();
            
            if (hours < 12) {
                setMessage("Good morning");
                setIcon(morningIcon);
            } else if (hours < 18) {
                setMessage("Good afternoon");
                setIcon(eveningIcon);
            } else if (hours < 21) {
                setMessage("Good evening");
                setIcon(eveningIcon);
            } else {
                setMessage("Hi");
                setIcon(nightIcon);
            }
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); 

        return () => clearInterval(interval); 
    }, []);

    return { message, icon };
}
