
import { useEffect, useState, useContext } from "react";
import TaskView from "../components/TaskView";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Task from "../services/TaskService";
import { useMessage } from '../hooks/useMessage'
import { SidebarContext } from "../context/SideBarContext";

const Today = () => {
    const tab_name = "today"
    const { setActiveTab, setNav, setPageName } = useContext(SidebarContext)
    useEffect(() => {
        setPageName(tab_name)
        setActiveTab(tab_name)
        setNav({ title: tab_name });
    }, [])
    return (
        <>
            <TaskView
                activeTab={tab_name}
            />
        </>
    );
};

export default Today;
