import { useState, useEffect, useContext } from "react";
import TaskView from "../components/TaskView";
import { useLocation } from "react-router-dom";
import Task from "../services/TaskService";
import TaskDetail from "../components/TaskDetail";
import { SidebarContext } from "../context/SideBarContext";

const List = () => {
    const tab_name = "list"
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

export default List;
