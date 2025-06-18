import { useEffect, useState, useContext, useRef } from "react";
import { SidebarContext } from "../context/SideBarContext.jsx";
import TrackerBar from "../components/TrackerBar.jsx";
import "../styles/Clockify.css";
import TimeEntryCard from "../components/TimeEntryCard.jsx";

const Clockify = () => {
    const { setActiveTab, userTheme, setNav } = useContext(SidebarContext)

    useEffect(() => {
        setActiveTab("clockify")
        setNav({ title: "clockify" })
    }, []);

    const data = ['tas1', 'tas2', 'task3'];

    return (
        <>
            {
                data.map((e) => {
                    return <TimeEntryCard />;
                })
            }
            <TrackerBar />
        </>
    );
};

export default Clockify;
