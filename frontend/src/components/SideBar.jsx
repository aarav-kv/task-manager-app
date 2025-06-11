import { useEffect, useState, useContext } from "react";
import "../styles/SideBar.css";
import TaskSearchBar from "./TaskSearchBar";
import TaskCounter from "./TaskCounter";
import { SidebarContext } from "../context/SideBarContext";
import "../styles/toggle.css"
import { useNavigate } from "react-router-dom";
import { CalendarDays, ListTodo, House, Hourglass, ChartLine, LogOut, Moon, Sun } from 'lucide-react'
const SideBar = ({ count, toggle }) => {
    const navigate = useNavigate();
    const { isOpen, toggleUserTheme, userTheme, setActiveTab, activeTab } = useContext(SidebarContext)
    return (
        <>
            <ul className={`side-bar ${isOpen ? "open" : ""} ${userTheme}`}>
                <li className="page-title">Task Manager</li>
                <li><TaskSearchBar /></li>

                <section className={`options ${userTheme}`}>
                    <li
                        className={`option ${activeTab === "calendar" ? "active" : ""} `}
                        onClick={() => navigate("/calendar")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CalendarDays size={18} className="sidemenu-icon" />
                            <span>Calendar</span>
                        </div>
                        <TaskCounter count={0} />
                    </li>

                    <li
                        className={`option ${activeTab === "list" ? "active" : ""} `}
                        onClick={() => navigate("/list")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ListTodo size={18} className="sidemenu-icon" />
                            <span>List</span>
                        </div>
                        <TaskCounter count={0} />
                    </li>

                    <li
                        className={`option ${activeTab === "today" ? "active" : ""}`}
                        onClick={() => navigate("/today")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <House size={18} className="sidemenu-icon" />
                            <span>Today</span>
                        </div>
                        <TaskCounter count={0} />
                    </li>

                    <li className="divider-line"></li>
                    <li
                        className={`option ${activeTab === "clockify" ? "active" : ""}`}
                        onClick={() => navigate("/clockify")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Hourglass size={18} className="sidemenu-icon" />
                            <span>Clockify</span>
                        </div>
                        <TaskCounter count={0} />
                    </li>
                    <li
                        className={`option ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => navigate("/dashboard")}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ChartLine size={18} className="sidemenu-icon" />
                            <span>Dashboard</span>
                        </div>
                        <div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                    </li>

                </section>

                <section className={`settings-options ${userTheme}`}>
                    {/* Theme Toggle */}
                    <div className="theme-toggle-container">
                        <button
                            className={`theme-button ${userTheme === "light" ? "active" : ""}`}
                            onClick={() => toggleUserTheme()}
                        >
                            <Sun size={18} className="sidemenu-icon" /> Light
                        </button>
                        <button
                            className={`theme-button ${userTheme === "dark" ? "active" : ""}`}
                            onClick={() => toggleUserTheme()}
                        >
                            <Moon size={18} className="sidemenu-icon" /> Dark
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="user-info-row">
                        <img src="/assets/profile_icons/pengiun.png" className="user-avatar" alt="User" />
                        <span className="user-name">Jenny Wilson</span>
                        <LogOut size={18} className="logout-icon" />
                    </div>
                </section>


            </ul >
        </>
    );
};

export default SideBar;
